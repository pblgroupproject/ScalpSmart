from flask import Blueprint

api_bp = Blueprint('api',__name__)

from .model.chatbot.chatbot import chatbot_bp
api_bp.register_blueprint(chatbot_bp, url_prefix="/chatbot")

from .model.image_model.model import model_bp
api_bp.register_blueprint(model_bp,url_prefix="/model")

from .database.products.routes import db_bp
api_bp.register_blueprint(db_bp, url_prefix="/database")

@api_bp.route('/')
def apiEndpoint():
    return 'API Endpoints'