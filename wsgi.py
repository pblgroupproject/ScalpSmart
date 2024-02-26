from app import create_app

app = create_app()

# waitress-serve --listen=127.0.0.1:5000 wsgi:app 

if __name__ == '__main__':    
    app.run()