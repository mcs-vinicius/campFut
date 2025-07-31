# /campeonato-api/app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import DevelopmentConfig

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configuração do CORS movida para ser mais explícita
    # Isso permite os cabeçalhos necessários para a autenticação
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    CORS(app, resources={r"/auth/*": {"origins": "*"}}, supports_credentials=True)


    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    with app.app_context():
        from . import models
        from .auth import auth_bp
        from .routes import api_bp
        
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(api_bp, url_prefix='/api')

        @app.cli.command("create-admin")
        def create_admin():
            from .models import Admin
            from getpass import getpass
            
            username = input("Digite o nome de usuário do admin: ")
            password = getpass("Digite a senha do admin: ")
            
            if Admin.query.filter_by(username=username).first():
                print(f"Usuário '{username}' já existe.")
                return

            admin = Admin(username=username)
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            print(f"Admin '{username}' criado com sucesso!")

    return app