from app import create_app
from dotenv import main
from flask import session
import os

main.load_dotenv()

# To load environment variables, use os.getenv('KEY')

app = create_app()

# waitress-serve --listen=127.0.0.1:5000 wsgi:app 

# Set ENVIRONMENT = False in Production mode and ENVIRONMENT = True in Development Mode

if __name__ == '__main__':    
    isDevelopment = os.getenv('ENVIRONMENT')
    print(isDevelopment)
    app.run(debug=isDevelopment)