from app import create_app
from dotenv import load_dotenv
import os

load_dotenv('.env')

# To load environment variables, use os.getenv('KEY')

app = create_app()

# waitress-serve --listen=127.0.0.1:5000 wsgi:app 

if __name__ == '__main__':    
    app.run()