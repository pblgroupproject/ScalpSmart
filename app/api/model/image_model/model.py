from flask import Blueprint, jsonify, request, send_from_directory
import os
from ultralytics import YOLO
from PIL import Image
import base64
from io import BytesIO
from datetime import datetime
import sqlite3
import pytz


IMAGE_DB_PATH = './app/database/user_images.db'

model_bp = Blueprint('model', __name__)

allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists('./uploads'):
    os.makedirs('./uploads')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

@model_bp.route('/upload', methods=['POST'])
def upload_file():
    user_id = request.args.get('user_id', default=None)

    if not user_id:
        return jsonify({'error': 'User id not provided'})
    
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        saved_filename =  f"{user_id}.png"
        file.save(os.path.join('./app/uploads', saved_filename))
        return jsonify({"message": "File uploaded successfully", "filename": saved_filename}), 200
    else:
        return jsonify({"error": "File type not permitted"}), 400

@model_bp.route('/image')
def get_file():
    return send_from_directory('./uploads','uploaded_image.png')

@model_bp.route('/predict')
def predict():
    user_id = request.args.get('user_id', default=None)
    if not user_id:
        return jsonify({'error':'user id not provided'})
    
    filename = f"{user_id}.png"

    file_path = os.path.join("./app/uploads", filename)
    if not os.path.exists(file_path):
        return jsonify({"error": f"File not found: {filename}"}), 404

    try:
        model_path = os.path.join("./app/api/model/image_model", 'version3_nanoyolo_best.pt')
        model = YOLO(model_path)

        #to change the image size to 640x640
        
        image = Image.open(file_path)
        resized_image = image.resize((640, 640))
        file_path = os.path.join("./app/uploads", f"resized{user_id}.png")
        resized_image.save(file_path)

        #end
        
        results = model(file_path)
        result = results[0]
        box = result.boxes[0]
        class_id = int(box.cls[0].item())
        
        stage = "normal"
        if class_id == 0:
            stage = "bald"
        elif class_id == 1:
            stage = "normal"
        elif class_id == 2:
            stage = "stage 1"
        elif class_id == 3:
            stage = "stage 2"
        elif class_id == 4:
            stage = "stage 3"

        im_array = result.plot()
        result_image = Image.fromarray(im_array[..., ::-1])
        image_buffer = BytesIO()
        result_image.save(image_buffer, format="PNG")
        image_data = base64.b64encode(image_buffer.getvalue()).decode("utf-8")    
        
        add_user_image(user_id, image_data, stage)    

        return jsonify({"stage": f"{stage}", "file": image_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def add_user_image(user_id, image_data, stage):
    try:
        IST = pytz.timezone('Asia/Kolkata')
        upload_time = datetime.now(IST)
        conn = sqlite3.connect(IMAGE_DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO user_images (user_id, image_data, upload_time, stage)
            VALUES (?, ?, ?, ?)
        """, (user_id, image_data, upload_time, stage))

        conn.commit()

        conn.close()

        return True, None 

    except Exception as e:
        return False, str(e)
