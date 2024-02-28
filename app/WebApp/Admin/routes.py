from flask import Blueprint
admin_bp = Blueprint('admin',__name__)

@admin_bp.route('/home')
def home():
    return "You are an Admin!"