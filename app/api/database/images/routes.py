from flask import Blueprint, jsonify, request, session
import sqlite3
import os

image_db_bp = Blueprint('image_db', __name__)
IMAGE_DB_PATH = './app/database/user_images.db'

@image_db_bp.route('/<string:user_id>/all')
def get_user_images(user_id):
    try:
        conn = sqlite3.connect(IMAGE_DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT image_data, upload_time, stage FROM user_images WHERE user_id = ? ORDER BY upload_time DESC", (user_id,))
        images = cursor.fetchall()


        conn.close()
        image_list = [{"image_data": image[0], "upload_time": image[1], "stage": image[2]} for image in images]

        return jsonify({"images": image_list}), 200
    except Exception as e:
       return jsonify({"error": str(e)}), 500

@image_db_bp.route('/<string:user_id>/recent')
def get_recent_images(user_id):
    try:
        conn = sqlite3.connect(IMAGE_DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT image_data, upload_time, stage FROM user_images WHERE user_id = ? ORDER BY upload_time DESC LIMIT 1", (user_id,))
        images = cursor.fetchall()


        conn.close()
        image_list = [{"image_data": image[0], "upload_time": image[1], "stage": image[2]} for image in images]

        return jsonify({"images": image_list}), 200
    except Exception as e:
       return jsonify({"error": str(e)}), 500
