from flask import Blueprint, request, jsonify
import os
from urllib.parse import urlparse

api_bp = Blueprint('api',__name__)


from .model.chatbot.chatbot import chatbot_bp
api_bp.register_blueprint(chatbot_bp, url_prefix="/chatbot")

from .model.image_model.model import model_bp
api_bp.register_blueprint(model_bp,url_prefix="/model")

from .database.products.routes import db_bp
api_bp.register_blueprint(db_bp, url_prefix="/database")

from .database.images.routes import image_db_bp
api_bp.register_blueprint(image_db_bp, url_prefix="/images")


from .environment.routes import env_bp
api_bp.register_blueprint(env_bp, url_prefix="/env")

@api_bp.route('/')
def apiEndpoint():
    return 'API Endpoints'

@api_bp.before_request
def before_api_request():
    api_key = request.args.get('api_key')
    if not api_key:
        return jsonify({'error': 'API key is missing'}), 401
    if api_key == os.getenv('MOBILE_API_KEY'):
        return None
    if api_key == os.getenv('WEB_API_KEY'):
        if urlparse(request.host_url).hostname.startswith(os.getenv('HOSTNAME')):
            return None
        else:
            return jsonify({'error': 'Unauthorized access: Hostname mismatch'}), 401
    else:
        return jsonify({'error': 'Unauthorized access'}), 401


