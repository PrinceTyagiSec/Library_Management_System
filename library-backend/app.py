import os
from flask import Flask
from config import Config
from extensions import db, mail
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth import auth_bp
from routes.userroutes import user_bp
from routes.books import books_bp
from routes.usermanagement import user_bp as user_management_routes
import logging
from routes.books import borrow_bp
from dotenv import load_dotenv 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    register_extensions(app)
    register_blueprints(app)
    configure_logging()
    return app

def register_extensions(app):
    db.init_app(app)
    mail.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    
    load_dotenv()
    
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url and frontend_url.endswith('/'):
        frontend_url = frontend_url[:-1]  
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": frontend_url}}, 
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(books_bp, url_prefix="/api/books")
    app.register_blueprint(user_management_routes, url_prefix="/api/admin/user")
    app.register_blueprint(borrow_bp, url_prefix='/api/borrow')

def configure_logging():
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    logger.debug("App started and logging configured")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
