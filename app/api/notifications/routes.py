from flask import Blueprint, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import requests
import json

cred = credentials.Certificate('./scalp-smart-pbl-project-firebase-adminsdk-cvksp-a163c0278c.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
collection_ref = db.collection('Users')
docs = collection_ref.stream()

notify_bp = Blueprint('notification',__name__,)


@notify_bp.route('/send')
def send_notifications():
    try:
        device_tokens = []

        query = collection_ref.where(filter=FieldFilter(field_path='deviceToken', op_string='!=', value="")).stream()

        for doc in query:
            if doc.to_dict()['deviceToken']!=None:
                device_tokens.append(doc.to_dict()['deviceToken'])
                print(f'{doc.to_dict()["name"]}:{doc.to_dict()["role"]}')

        print(device_tokens);
        for token in device_tokens:
            body = {
                "to": token,
                "notification": {
                    "title": "Scan Your Head right away!",
                    "body": "Open Scalp Smart app"
                }
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": "key=AAAA0nmzvoo:APA91bGh-ty8ofrUuI7R675c3swnnXCYM6IT_GvKBDLund2TleTEBL0jLhcamWEIe2TqhUPKYpfh7pxm7W3qEdPJZkFB7Bol64mlB5sn-MQBK7Kz92fkikt1ZTlkISzJ6v4IlMN40IDk"
            }

            response = requests.post(
                "https://fcm.googleapis.com/fcm/send",
                headers=headers,
                json=body
            )

            if response.status_code == 200:
                print("Message sent successfully to:", token)
            else:
                print("Failed to send message to:", token, ". Status code:", response.status_code)

        return jsonify({"tokens": device_tokens})
    except Exception as e:
        print("Error:", e)
        return jsonify({"Error": "Failed to send notifications"})


