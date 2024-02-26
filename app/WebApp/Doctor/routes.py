from flask import Blueprint
doc_bp = Blueprint('doc',__name__)

@doc_bp.route('/home')
def home():
    return "You are a doctor!"