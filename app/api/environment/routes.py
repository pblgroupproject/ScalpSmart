from flask import Blueprint, jsonify, request
import os
from urllib.parse import urlparse

env_bp = Blueprint('env', __name__)

DATABASE_KEY = os.getenv('WEB_API_KEY')
HOSTNAME = os.getenv('HOSTNAME')

@env_bp.route('/firebaseConfig')
def firebase_config():
    api_key = request.args.get('api_key')
    referrer = request.referrer

    if api_key == DATABASE_KEY:
        firebaseConfig = {
            'apiKey': os.getenv('FB_APIKEY'),
            'authDomain': os.getenv('FB_AUTHDOMAIN'),
            'databaseURL':os.getenv('FB_DATABASE_URL'),
            'projectId': os.getenv('FB_PROJECTID'),
            'storageBucket': os.getenv('FB_STORAGEBUCKET'),
            'messagingSenderId': os.getenv('FB_MESSAGINGSENDERID'),
            'appId': os.getenv('FB_APPID')
        };
        return jsonify(firebaseConfig), 200
    return jsonify({'error': 'Unauthorized User'}), 401
