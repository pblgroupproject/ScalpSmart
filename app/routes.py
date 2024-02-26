from flask import Flask, Blueprint, send_from_directory

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return 'Hello World'

@main_bp.route('/keep-alive')
def keep_alive():
    return 'Server is Alive'

@main_bp.route('/flutter-app')
def downloadApp():
    return send_from_directory('./flutterApp','scalp_smart.apk')