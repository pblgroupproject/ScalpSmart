from flask import Blueprint, render_template
user_bp = Blueprint('user',__name__)

@user_bp.route('/home')
def home():
    return render_template('User/user_home.html')