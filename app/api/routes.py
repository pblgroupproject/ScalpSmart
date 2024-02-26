from flask import Blueprint

api_bp = Blueprint('api',__name__)

@api_bp.route('/')
def apiEndpoint():
    return 'API Endpoints'