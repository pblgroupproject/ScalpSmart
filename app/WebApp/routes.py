from flask import Blueprint, session, redirect, render_template, request, url_for, jsonify, flash
import os

web_bp = Blueprint('web', __name__)

from .Doctor.routes import doc_bp
web_bp.register_blueprint(doc_bp, url_prefix='/doctor')

from .User.routes import user_bp
web_bp.register_blueprint(user_bp, url_prefix='/user')

from .Admin.routes import admin_bp
web_bp.register_blueprint(admin_bp, url_prefix='/admin')



@web_bp.before_app_request
def check_access():    
    if request.method == 'POST':
        return

    if request.path.startswith('/static') or request.path.startswith('/keep-alive') or request.path.startswith('/flutter-app') or request.path.startswith('/update_session') or request.path.startswith('/delete_session'):
        return
    
    if request.path.startswith('/api'):
        return

    if "user_id" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))
    
    if "user_type" not in session and request.endpoint != 'main.web.login':
        return redirect(url_for('main.web.login'))

    user_type = session.get('user_type')

    if user_type == 'user' and (request.path.startswith('/doctor') or request.path.startswith('/admin')):
        return redirect(url_for('main.web.access_denied'))

    elif user_type == 'doctor' and (request.path.startswith('/user') or request.path.startswith('/admin')):
        return redirect(url_for('main.web.access_denied'))
    
    elif user_type == 'admin' and (request.path.startswith('/user') or request.path.startswith('/doctor')):
        return redirect(url_for('main.web.access_denied'))

@web_bp.route('/login')
def login():
    if "user_id" not in session or "user_type" not in session:
        return render_template('Authentication/authentication.html')
    else: return redirect(url_for('main.web.home'))
    
@web_bp.route('/update_session', methods=['POST', 'GET'])
def update_session():
    if(request.method == 'GET'):
        return 'Only POST Method Allowed'
    
    data = request.json
    print('Data')
    print(data)
    user_id = data.get('user_id')
    user_type = data.get('user_type')
    session['user_id'] = user_id
    session['user_type'] = user_type
    return jsonify({"message":"User session updated successfully", "data": data}), 200


@web_bp.route('/delete_session', methods=['GET'])
def delete_session():
    try:
        session.pop('user_id', None)
        session.pop('user_type', None)
        return jsonify({"message":"User session deleted successfully"}), 200
    except:
        return jsonify({"error": "Something went wrong"}), 500

@web_bp.route('/')
def home():
    if os.getenv('TEST') == 'True':
        user_id = session['user_id']
        user_type = session['user_type']
        return render_template('home.html', user_id=user_id, user_type=user_type)
    else:
        if session['user_type']=='user':
            return redirect(url_for('main.web.user.home'))
        elif session['user_type']=='doctor':
            return redirect(url_for('main.web.doc.home'))
        elif session['user_type']=='admin':
            return redirect(url_for('main.web.admin.home'))
        else:
            return render_template('home.html')

@web_bp.route('/logout')
def logout():
    return render_template('Authentication/logout.html')

@web_bp.route('/access_denied')
def access_denied():
    return "Access Denied, you tried to enter invalid url"