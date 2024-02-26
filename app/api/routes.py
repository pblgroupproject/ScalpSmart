from flask import Blueprint

api_bp = Blueprint('api',__name__)

from .model.chatbot.chatbot import chatbot_bp
api_bp.register_blueprint(chatbot_bp, url_prefix="/chatbot")

from .model.image_model.model import model_bp
api_bp.register_blueprint(model_bp,url_prefix="/model")

@api_bp.route('/')
def apiEndpoint():
    return 'API Endpoints'