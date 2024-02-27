from flask import Flask, Blueprint, send_from_directory, redirect

main_bp = Blueprint('main', __name__)

from .WebApp.routes import web_bp
main_bp.register_blueprint(web_bp)

@main_bp.route('/keep-alive')
def keep_alive():
    return 'Server is Alive'

@main_bp.route('/flutter-app')
def downloadApp():
    applink = 'https://drive.google.com/file/d/1Ta43SYLyt-AgBSlzTNKv_WMA22AKuDOS/view'
    return redirect(applink)