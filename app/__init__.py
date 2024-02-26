from flask import Flask, Blueprint
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    CORS(app)
    app.config['UPLOAD_FOLDER'] = './uploads'

    from .routes import main_bp
    app.register_blueprint(main_bp)

    from .api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app
    
if __name__ == '__main__':
    app = create_app()
    app.run()