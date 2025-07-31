# /campeonato-api/app/routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from . import db
from .models import Participant, Match, ChampionshipSetting
from .services import get_sorted_ranking, generate_round_robin_fixtures, update_stats_from_match
import csv
import io

api_bp = Blueprint('api_bp', __name__)

# --- ROTAS DE CONFIGURAÇÕES ---
@api_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    """Retorna todas as configurações do campeonato."""
    settings = ChampionshipSetting.query.all()
    settings_dict = {
        'num_turns': '1',
        'wo_score_winner': '3',
        'wo_score_loser': '0',
        'championship_status': 'SETUP',
        'num_rounds': '0' # Adiciona o novo campo com padrão '0' (ilimitado)
    }
    for setting in settings:
        settings_dict[setting.key] = setting.value
    return jsonify(settings_dict)

@api_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Atualiza as configurações do campeonato."""
    data = request.get_json()
    for key, value in data.items():
        setting = ChampionshipSetting.query.filter_by(key=key).first()
        if setting:
            setting.value = str(value)
        else:
            new_setting = ChampionshipSetting(key=key, value=str(value))
            db.session.add(new_setting)
    db.session.commit()
    return jsonify({"msg": "Configurações salvas com sucesso!"})

@api_bp.route('/championship/end', methods=['POST'])
@jwt_required()
def end_championship():
    """Define o status do campeonato como finalizado."""
    status_setting = ChampionshipSetting.query.filter_by(key='championship_status').first()
    if not status_setting:
        status_setting = ChampionshipSetting(key='championship_status', value='FINISHED')
        db.session.add(status_setting)
    else:
        status_setting.value = 'FINISHED'
    db.session.commit()
    return jsonify({"msg": "Campeonato encerrado com sucesso!"})

@api_bp.route('/championship/reset', methods=['POST'])
@jwt_required()
def reset_championship():
    """
    Reinicia o campeonato, deletando todas as partidas e configurações.
    Os participantes são mantidos.
    """
    try:
        Match.query.delete()
        ChampionshipSetting.query.delete()
        db.session.commit()
        return jsonify({"msg": "Campeonato reiniciado com sucesso! Todos os jogos e configurações foram apagados."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Erro ao reiniciar o campeonato: {e}"}), 500


# --- ROTAS PÚBLICAS ---
@api_bp.route('/ranking', methods=['GET'])
def get_ranking_public():
    ranking = get_sorted_ranking()
    return jsonify(ranking), 200

@api_bp.route('/rounds', methods=['GET'])
def get_rounds_public():
    matches = Match.query.order_by(Match.round_number, Match.id).all()
    rounds = {}
    for match in matches:
        if match.round_number not in rounds:
            rounds[match.round_number] = []
        rounds[match.round_number].append(match.to_dict())
    return jsonify(rounds), 200


# --- ROTAS DE ADMINISTRAÇÃO ---
@api_bp.route('/participants', methods=['GET'])
@jwt_required()
def get_participants():
    participants = Participant.query.order_by(Participant.name).all()
    return jsonify([p.to_dict() for p in participants])

@api_bp.route('/participants', methods=['POST'])
@jwt_required()
def add_participant():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({"msg": "O nome do participante é obrigatório"}), 400
    if Participant.query.filter_by(name=name).first():
        return jsonify({"msg": f"Participante '{name}' já existe"}), 409
    new_participant = Participant(name=name)
    db.session.add(new_participant)
    db.session.commit()
    return jsonify(new_participant.to_dict()), 201

@api_bp.route('/participants/<int:participant_id>', methods=['DELETE'])
@jwt_required()
def delete_participant(participant_id):
    participant = Participant.query.get_or_404(participant_id)
    db.session.delete(participant)
    db.session.commit()
    return jsonify({"msg": f"Participante '{participant.name}' deletado com sucesso."}), 200

@api_bp.route('/participants/import', methods=['POST'])
@jwt_required()
def import_participants():
    if 'file' not in request.files: return jsonify({"msg": "Nenhum arquivo enviado."}), 400
    file = request.files['file']
    if file.filename == '': return jsonify({"msg": "Nenhum arquivo selecionado."}), 400
    if not file.filename.lower().endswith('.csv'): return jsonify({"msg": "Formato de arquivo inválido. Use .csv"}), 400
    try:
        stream = io.StringIO(file.stream.read().decode("UTF-8"), newline=None)
        csv_reader = csv.reader(stream)
        new_participants_count = 0
        added_names = []
        existing_names = {p.name.lower() for p in Participant.query.all()}
        for row in csv_reader:
            if row:
                name = row[0].strip()
                if name and name.lower() not in existing_names:
                    new_participant = Participant(name=name)
                    db.session.add(new_participant)
                    existing_names.add(name.lower())
                    added_names.append(name)
                    new_participants_count += 1
        db.session.commit()
        return jsonify({"msg": f"{new_participants_count} novos participantes importados com sucesso!", "added_names": added_names}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Ocorreu um erro ao processar o arquivo: {e}"}), 500

@api_bp.route('/championship/start', methods=['POST'])
@jwt_required()
def start_championship():
    if Match.query.count() > 0: return jsonify({"msg": "O campeonato já foi iniciado."}), 400
    participants = Participant.query.all()
    if len(participants) < 2: return jsonify({"msg": "É necessário ter pelo menos 2 participantes para iniciar."}), 400
    
    # Busca as configurações de turnos e rodadas
    num_turns_setting = ChampionshipSetting.query.filter_by(key='num_turns').first()
    num_rounds_setting = ChampionshipSetting.query.filter_by(key='num_rounds').first()

    num_turns = int(num_turns_setting.value) if num_turns_setting else 1
    max_rounds = int(num_rounds_setting.value) if num_rounds_setting and int(num_rounds_setting.value) > 0 else None

    participant_ids = [p.id for p in participants]
    
    # Gera a tabela completa de jogos
    full_fixtures = generate_round_robin_fixtures(participant_ids, num_turns=num_turns)
    
    # Filtra as rodadas se um limite foi especificado
    fixtures_to_save = []
    if max_rounds:
        for round_data in full_fixtures:
            if round_data['round'] <= max_rounds:
                fixtures_to_save.append(round_data)
    else:
        fixtures_to_save = full_fixtures

    for round_data in fixtures_to_save:
        round_number = round_data['round']
        for match_tuple in round_data['matches']:
            p1_id, p2_id = match_tuple
            new_match = Match(round_number=round_number, participant1_id=p1_id, participant2_id=p2_id, status='PENDING')
            db.session.add(new_match)
            
    db.session.commit()
    return jsonify({"msg": f"Campeonato iniciado! {Match.query.count()} partidas geradas."}), 201

@api_bp.route('/matches/<int:match_id>', methods=['PUT'])
@jwt_required()
def update_match_result(match_id):
    match = Match.query.get_or_404(match_id)
    if match.status == 'FINISHED': return jsonify({"msg": "Esta partida já foi finalizada."}), 400
    data = request.get_json()
    score1 = data.get('score1')
    score2 = data.get('score2')
    if score1 is None or score2 is None: return jsonify({"msg": "Ambos os placares são obrigatórios."}), 400
    match.score1 = int(score1)
    match.score2 = int(score2)
    match.status = 'FINISHED'
    update_stats_from_match(match)
    db.session.commit()
    return jsonify(match.to_dict())

@api_bp.route('/matches/<int:match_id>/wo', methods=['POST'])
@jwt_required()
def assign_walkover(match_id):
    match = Match.query.get_or_404(match_id)
    if match.status == 'FINISHED': return jsonify({"msg": "Esta partida já foi finalizada."}), 400
    data = request.get_json()
    absent_participant_id = data.get('absent_participant_id')
    if not absent_participant_id: return jsonify({"msg": "É necessário informar o tipo de W.O."}), 400
    if absent_participant_id == 'double':
        match.score1 = 0
        match.score2 = 0
        match.status = 'FINISHED'
        if match.participant1 and match.participant2:
            match.participant1.games_played += 1
            match.participant1.losses += 1
            match.participant2.games_played += 1
            match.participant2.losses += 1
    else:
        wo_winner_setting = ChampionshipSetting.query.filter_by(key='wo_score_winner').first()
        wo_loser_setting = ChampionshipSetting.query.filter_by(key='wo_score_loser').first()
        WO_SCORE_WINNER = int(wo_winner_setting.value) if wo_winner_setting else 3
        WO_SCORE_LOSER = int(wo_loser_setting.value) if wo_loser_setting else 0
        try:
            absent_id = int(absent_participant_id)
            if absent_id == match.participant1_id:
                match.score1 = WO_SCORE_LOSER
                match.score2 = WO_SCORE_WINNER
            elif absent_id == match.participant2_id:
                match.score1 = WO_SCORE_WINNER
                match.score2 = WO_SCORE_LOSER
            else:
                return jsonify({"msg": "Participante ausente inválido para esta partida."}), 400
            update_stats_from_match(match)
        except (ValueError, TypeError):
            return jsonify({"msg": "ID de participante inválido."}), 400
    db.session.commit()
    return jsonify(match.to_dict())

@api_bp.route('/participants/<int:participant_id>/ptc', methods=['POST'])
@jwt_required()
def add_ptc_bonus(participant_id):
    participant = Participant.query.get_or_404(participant_id)
    participant.ptc_bonus_count += 1
    db.session.commit()
    return jsonify({"msg": f"Ponto PTC adicionado a {participant.name}", "participant": participant.to_dict()}), 200