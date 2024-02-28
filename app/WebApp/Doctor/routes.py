from flask import Blueprint, render_template
doc_bp = Blueprint('doc',__name__)

@doc_bp.route('/home')
def home():
    return render_template('Doctor/doctor_home.html')