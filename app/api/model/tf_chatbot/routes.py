from flask import Blueprint,jsonify,request
from .sentiment import sentiment_api

tf_bp = Blueprint('tf_chatbot',__name__)

@tf_bp.route('/prompt',methods=['POST','GET'])
def tfChatbot():
    if(request.method == 'GET'):
        return "GET API Endpoint Working"
    
    body = request.json
    sentence = body['sentence']

    senti_score = sentiment_api(sentence);

    return jsonify({'score':senti_score})