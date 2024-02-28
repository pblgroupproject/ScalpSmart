from flask import Blueprint, render_template
admin_bp = Blueprint('admin',__name__)

@admin_bp.route('/home')
def home():
    return render_template('Admin/admin_home.html')