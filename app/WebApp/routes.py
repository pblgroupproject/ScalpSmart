from flask import Blueprint, session, redirect, render_template, request, url_for

web_bp = Blueprint('web', __name__)

from .Doctor.routes import doc_bp
web_bp.register_blueprint(doc_bp, url_prefix='/doctor')

from .User.routes import user_bp
web_bp.register_blueprint(user_bp, url_prefix='/user')


@web_bp.before_app_request
def check_access():
    if "user_id" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))
    
    if "user_type" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))

    user_type = session.get('user_type')

    if user_type == 'user' and request.path.startswith('/doctor'):
        return redirect(url_for('main.web.access_denied'))

    elif user_type == 'doctor' and request.path.startswith('/user'):
        return redirect(url_for('main.web.access_denied'))

@web_bp.route('/login')
def login():
    user_id = "1234"
    user_type = "doctor"
    session["user_id"] = user_id
    session["user_type"] = user_type
    return redirect(url_for('main.web.home'))

@web_bp.route('/')
def home():
    return f"Welcome User_if {session['user_id']} & {session['user_type']}"

@web_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    return "Logged out Successfully"

@web_bp.route('/access_denied')
def access_denied():
    return "Access Denied, you tried to enter invalid url"