from flask import Blueprint, session, redirect, render_template, request, url_for, jsonify

web_bp = Blueprint('web', __name__)

from .Doctor.routes import doc_bp
web_bp.register_blueprint(doc_bp, url_prefix='/doctor')

from .User.routes import user_bp
web_bp.register_blueprint(user_bp, url_prefix='/user')


@web_bp.before_app_request
def check_access():
    if request.endpoint == 'main.web.update_session' and request.method == 'POST':
        return

    elif "user_id" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))
    
    elif "user_type" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))

    user_type = session.get('user_type')

    if user_type == 'user' and request.path.startswith('/doctor'):
        return redirect(url_for('main.web.access_denied'))

    elif user_type == 'doctor' and request.path.startswith('/user'):
        return redirect(url_for('main.web.access_denied'))

@web_bp.route('/login')
def login():
    if "user_id" not in session or "user_type" not in session:
        return render_template('authentication.html')
        # user_id = "1234"
        # user_type = "doctor"
        # session["user_id"] = user_id
        # session["user_type"] = user_type
        # return redirect(url_for('main.web.home'))
    else: return redirect(url_for('main.web.home'))
    


@web_bp.route('/update_session', method=['POST'])
def update_session():
    try:
        data = request.json
        user_id = data.get('user_id')
        user_type = data.get('user_type')
        session['user_id'] = user_id
        session['user_type'] = user_type
        return jsonify({"message":"User session updated successfully"}),200
    except Exception as e:
        return jsonify({'error', str(e)}), 400
    
@web_bp.route('/')
def home():
    return f"Welcome User_if {session['user_id']} & {session['user_type']}"

@web_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user_type', None)
    return "Logged out Successfully"

@web_bp.route('/access_denied')
def access_denied():
    return "Access Denied, you tried to enter invalid url"