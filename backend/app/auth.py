# app/auth.py
from flask import Blueprint, request, jsonify
from .models import Admin
from . import db
from flask_jwt_extended import create_access_token # Removi a importação de 'jwt' que não era usada

# Blueprint para agrupar rotas de autenticação
auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Rota de login para o Admin."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Nome de usuário e senha são obrigatórios"}), 400

    admin = Admin.query.filter_by(username=username).first()

    if admin and admin.check_password(password):
        # Se as credenciais estiverem corretas, cria e retorna um token JWT
        # AQUI ESTÁ A CORREÇÃO: convertendo o id para string
        access_token = create_access_token(identity=str(admin.id))
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Credenciais inválidas"}), 401