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
            'apiKey': os.getenv('FIREBASE_APIKEY'),
            'authDomain': os.getenv('FIREBASE_AUTHDOMAIN'),
            'projectId': os.getenv('FIREBASE_PROJECTID'),
            'storageBucket': os.getenv('FIREBASE_STORAGEBUCKET'),
            'messagingSenderId': os.getenv('FIREBASE_MESSAGINGSENDERID'),
            'appId': os.getenv('FIREBASE_APPID')
        };
        return jsonify(firebaseConfig), 200
    return jsonify({'error': 'Unauthorized User'}), 401
