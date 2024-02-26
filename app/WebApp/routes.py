from flask import Blueprint, session, redirect, render_template, request, url_for

web_bp = Blueprint('web', __name__)

@web_bp.before_request
def check_user_id():
    print(request.endpoint)
    if "user_id" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))

@web_bp.route('/login')
def login():
    user_id = "1234"
    session["user_id"] = user_id
    return 'Logged in Successfully'

@web_bp.route('/')
def home():
    return f"Welcome User_if {session['user_id']}"

@web_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    return "Logged out Successfully"