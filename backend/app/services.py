# app/services.py
from .models import Participant, Match
from . import db

def generate_round_robin_fixtures(participant_ids, num_turns=1):
    """
    Gera confrontos para um torneio 'todos contra todos' (round-robin).
    """
    participants = list(participant_ids)
    
    if len(participants) % 2 != 0:
        participants.append(None) # None representa o "BYE" (descanso)

    num_participants = len(participants)
    num_rounds = num_participants - 1
    
    all_rounds_fixtures = []

    for turn in range(num_turns):
        rotated_participants = list(participants)

        for round_num in range(num_rounds):
            round_fixtures = []
            
            mid = num_participants // 2
            list1 = rotated_participants[:mid]
            list2 = rotated_participants[mid:]
            list2.reverse()

            for i in range(mid):
                p1 = list1[i]
                p2 = list2[i]

                if p1 is not None and p2 is not None:
                    match = (p1, p2) if round_num % 2 == 1 else (p2, p1)
                    round_fixtures.append(match)
            
            all_rounds_fixtures.append({
                'turn': turn + 1,
                'round': (turn * num_rounds) + round_num + 1,
                'matches': round_fixtures
            })

            # Rotaciona a lista para a próxima rodada (o primeiro elemento é fixo)
            rotated_participants = [rotated_participants[0]] + [rotated_participants[-1]] + rotated_participants[1:-1]

    # ***** LINHA FALTANTE ADICIONADA AQUI *****
    return all_rounds_fixtures

def update_stats_from_match(match):
    """Atualiza as estatísticas dos participantes com base no resultado de uma partida."""
    p1 = match.participant1
    p2 = match.participant2
    s1 = match.score1
    s2 = match.score2

    p1.games_played += 1
    p2.games_played += 1
    p1.goals_for += s1
    p1.goals_against += s2
    p2.goals_for += s2
    p2.goals_against += s1

    if s1 > s2: # Vitória do P1
        p1.wins += 1
        p2.losses += 1
    elif s2 > s1: # Vitória do P2
        p2.wins += 1
        p1.losses += 1
    else: # Empate
        p1.draws += 1
        p2.draws += 1
    
    db.session.commit()

def get_sorted_ranking():
    """Busca todos os participantes e os ordena pelos critérios de desempate."""
    participants = Participant.query.all()
    
    # A ordenação é feita em múltiplos níveis, seguindo a regra de negócio.
    # 1. Mais Pontos (desc)
    # 2. Mais Vitórias (desc)
    # 3. Maior Saldo de Gols (desc)
    # 4. Menos Derrotas (asc)
    # 5. Mais Pontos Bônus (PTC) (desc)
    
    sorted_participants = sorted(
        participants,
        key=lambda p: (
            p.total_points,
            p.wins,
            p.goal_difference,
            -p.losses,  # Invertido para ordenar do menor para o maior
            p.ptc_bonus_count
        ),
        reverse=True
    )
    
    # Adiciona a posição (ranking) ao dicionário de cada participante
    ranked_list = []
    for i, p in enumerate(sorted_participants):
        p_dict = p.to_dict()
        p_dict['position'] = i + 1
        ranked_list.append(p_dict)
        
    return ranked_list