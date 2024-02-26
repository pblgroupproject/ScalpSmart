from flask import Blueprint, jsonify, request, send_from_directory
import os


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