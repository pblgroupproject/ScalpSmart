from flask import Flask, Blueprint, session
from flask_cors import CORS
import os
from datetime import timedelta
from flask_session.__init__ import Session

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY')
    app.permanent_session_lifetime = timedelta(days=7)
    app.config["SESSION_TYPE"] = "filesystem"
    Session(app)

    CORS(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    from .api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
    
if __name__ == '__main__':
    app = Flask(__name__)
    
    CORS(app)

    from routes import main_bp
    app.register_blueprint(main_bp)

    from api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    app.run()