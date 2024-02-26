# Scalp Smart

Scalp Smart is a platform designed to predict baldness stages using AI and computer vision technologies. It analyzes images uploaded by users and provides predictions ranging from Normal to various stages of baldness (Stage 1, Stage 2, Stage 3, Bald). Additionally, the platform recommends products tailored to individual needs. 

## Features

- AI-powered baldness prediction using computer vision
- Product recommendations
- AI-powered chatbot for assistance with Scalp Smart and hairfall-related queries

Available on both website and app platforms (built with Flutter).

## Server Architecture

### Backend Service
- **Framework:** Flask
---
### File Architecture

`Root folder`
- `requirements.txt`
- `wsgi.py` (WSGI entry point)
- `app`
    - `__init__.py`
    - `routes.py`
    - `static`
        - `css`
        - `js`
        - `img`
    - `templates`
        - (html pages)
    - `uploads` [Contains the images uploaded by users]
    - `database`
        - `database.db` [Contains Product information]
    - `api` [Contains all API endpoints]
        - `model` [Contains AI ML Models]
            - `image_model` [Contains the model used for image scanning]
                - `best.pt` (ML Model)
                - `model.py` [Contains API routes connected to the model]
            - `chatbot` [Contains the model used for the chatbot]
                - `chat_bot_dataset.json`
                - `chatbot.py` [Contains connection to the chatbot and API endpoints]
        - `database` [Contains all API endpoints to fetch and update the database]
            - `products` [Contains all API endpoints to fetch from the 'products' table in database.db]
                - `__init__.py`
                - `routes.py` [API endpoints to products table in database.db]
---
## WSGI Entry Point
The `wsgi.py` file serves as the Web Server Gateway Interface (WSGI) entry point. WSGI is a specification for web servers and application servers to communicate with web applications written in Python. 

- **Initialization:** Initialize the WSGI server with Gunicorn (for Linux) or Waitress-server (for Windows). Gunicorn is a popular choice for deploying Python applications, while Waitress-server is a pure-Python WSGI server with support for Windows environments.

### Start Command

For Waitress-server:
```powershell
waitress-serve --listen=127.0.0.1:5000 wsgi:app
```
For Guincorn server:  
```bash
gunicorn -w 2 -b 127.0.0.1:5000 wsgi:app
```

These commands will start the WSGI server, allowing your Flask application to be accessible at http://127.0.0.1:5000/. Adjust the host and port parameters as needed for your deployment environment.


## Key Components
- **Flask:** Flask is a micro web framework written in Python. It provides tools, libraries, and technologies for building web applications. In this architecture, Flask serves as the backend service framework, handling HTTP requests, routing, and responses.

- **Image Model:** The Image Model is an AI model specifically designed for image scanning. It utilizes machine learning and computer vision techniques to analyze images uploaded by users and make predictions related to baldness stages.

- **Chatbot Model:** The Chatbot Model is an AI model integrated into the platform to provide assistance with Scalp Smart and hairfall-related queries.

- **Database:** The Database component stores products' information and provides API endpoints for database operations. It utilizes a relational database management system (RDBMS) :  SQLite. The database is crucial for storing and retrieving data related to products recommended by the platform.

## How to Run
1. Install dependencies from `requirements.txt`. This file contains a list of all required Python packages and their versions.
#### Build Command
 ```powershell
  pip install -r requirements.txt
 ``` 
2. Initialize the server using Gunicorn or Waitress-server. This involves running the `wsgi.py` file, which serves as the entry point for the WSGI server.
3. Access the platform through the provided URL. Once the server is running, users can interact with the platform via its web interface or API endpoints.

---

## API Endpoints

### Predicting Baldness Stage
To predict baldness stage, follow these steps:

1. **Upload Image:** Upload the image to the server using a POST request to `/api/model/upload`.
   - After successful upload, the response will be `"image uploaded successfully"`.

2. **Get Prediction:** Retrieve the prediction through a GET request to `/api/model/predict`.
   - If the model detection is successful, the response will be a JSON file containing:
     - `"stage"`: Predicted baldness stage.
     - `"file"`: Base64 version of the annotated image received from the AI Model.

### Chatbot Interaction
To interact with the chatbot, send a POST request to the API endpoint at `/api/chatbot/prompt`.
   - The request body should be a JSON object with a `"prompt"` attribute containing the query.

### Database Operations
- **View Entire Database:** Retrieve the entire database by sending a GET request to `/api/database/products`.
   - The response is an array of objects containing details of all the products.

- **Add New Item to Database:** Add a new item to the database by sending a POST request to `/api/database/products`.
   - The request should contain all the parameters included in each product.

- **View Specific Product:** Retrieve details of a particular product by sending a GET request to `/api/database/product/<product-id>`.
   - The response contains all the information related to that product.

- **Update Specific Item:** Update a particular item in the database by sending a PATCH request to `/api/database/product/<product-id>`.
   - The request should only contain the parameter to be updated.

- **Delete Specific Item:** Delete a particular item from the database by sending a DELETE request to `/api/database/product/<product-id>`.
   - It deletes the item if it exists.


Feel free to explore and contribute to the project! Contributions such as code enhancements, bug fixes, or feature additions are always welcome.



