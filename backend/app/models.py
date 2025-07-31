# /campeonato-api/app/models.py
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class Admin(db.Model):
    # ... (código da classe Admin continua o mesmo)
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Participant(db.Model):
    # ... (código da classe Participant continua o mesmo)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    games_played = db.Column(db.Integer, default=0, nullable=False)
    wins = db.Column(db.Integer, default=0, nullable=False)
    draws = db.Column(db.Integer, default=0, nullable=False)
    losses = db.Column(db.Integer, default=0, nullable=False)
    goals_for = db.Column(db.Integer, default=0, nullable=False)
    goals_against = db.Column(db.Integer, default=0, nullable=False)
    ptc_bonus_count = db.Column(db.Integer, default=0, nullable=False)

    @property
    def goal_difference(self):
        return self.goals_for - self.goals_against

    @property
    def total_points(self):
        return (self.wins * 3) + (self.draws * 1) + (self.ptc_bonus_count * 2)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'games_played': self.games_played,
            'wins': self.wins, 'draws': self.draws, 'losses': self.losses,
            'goals_for': self.goals_for, 'goals_against': self.goals_against,
            'goal_difference': self.goal_difference, 'ptc_bonus_count': self.ptc_bonus_count,
            'total_points': self.total_points,
        }

class Match(db.Model):
    # ***** LINHA ADICIONADA AQUI PARA RENOMEAR A TABELA *****
    __tablename__ = 'matches'

    id = db.Column(db.Integer, primary_key=True)
    round_number = db.Column(db.Integer, nullable=False)
    participant1_id = db.Column(db.Integer, db.ForeignKey('participant.id'), nullable=True)
    participant2_id = db.Column(db.Integer, db.ForeignKey('participant.id'), nullable=True)
    score1 = db.Column(db.Integer, nullable=True)
    score2 = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(20), default='PENDING', nullable=False)

    participant1 = db.relationship('Participant', foreign_keys=[participant1_id])
    participant2 = db.relationship('Participant', foreign_keys=[participant2_id])
    
    def to_dict(self):
        return {
            'id': self.id, 'round_number': self.round_number,
            'participant1': self.participant1.to_dict() if self.participant1 else None,
            'participant2': self.participant2.to_dict() if self.participant2 else None,
            'score1': self.score1, 'score2': self.score2, 'status': self.status
        }

class ChampionshipSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # A chave da configuração, ex: 'num_turns'
    key = db.Column(db.String(50), unique=True, nullable=False)
    # O valor da configuração, ex: '1' ou '2'
    value = db.Column(db.String(255), nullable=False)