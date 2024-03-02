from flask import Blueprint, jsonify, request, send_from_directory
import os
from ultralytics import YOLO
from PIL import Image
import base64
from io import BytesIO

model_bp = Blueprint('model', __name__)

allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists('./uploads'):
    os.makedirs('./uploads')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

@model_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        saved_filename = "uploaded_image.png"
        file.save(os.path.join('./app/uploads', saved_filename))
        return jsonify({"message": "File uploaded successfully", "filename": saved_filename}), 200
    else:
        return jsonify({"error": "File type not permitted"}), 400

@model_bp.route('/image')
def get_file():
    return send_from_directory('./uploads','uploaded_image.png')

@model_bp.route('/predict')
def predict():
    filename = "uploaded_image.png" 

    file_path = os.path.join("./app/uploads", filename)
    if not os.path.exists(file_path):
        return jsonify({"error": f"File not found: {filename}"}), 404

    try:
        model_path = os.path.join("./app/api/model/image_model", 'version3_smallyolo_best.pt')
        model = YOLO(model_path)
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

        return jsonify({"stage": f"{stage}", "file": image_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
