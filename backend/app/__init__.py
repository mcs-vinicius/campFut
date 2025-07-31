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

    # A linha "CORS(app)" foi REMOVIDA daqui

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    with app.app_context():
        from . import models
        from .auth import auth_bp
        from .routes import api_bp
        
        # APLICAMOS O CORS DIRETAMENTE NOS BLUEPRINTS
        # Isso garante que ele lide com OPTIONS antes do @jwt_required
        CORS(auth_bp)
        CORS(api_bp)
        
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(api_bp, url_prefix='/api')

        @app.cli.command("create-admin")
        def create_admin():
            # ... (código do comando create-admin)
            pass

    return app