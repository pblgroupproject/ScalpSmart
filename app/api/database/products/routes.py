from flask import Blueprint, jsonify, request
import sqlite3
import os

db_bp = Blueprint('db', __name__)
DB_PATH = './app/database/database.db'

@db_bp.route('/product/<int:product_id>', methods=['GET','PATCH','DELETE'])
def get_product(product_id):

    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500  
    if request.method == 'GET':
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
    
        cursor.execute('SELECT * FROM products WHERE ID = ?', (product_id,))
        product = cursor.fetchone()
    
        conn.close()
    
        if product:
            keys = ['ID', 'NAME', 'PRICE', 'IMAGE', 'DESCRIPTION', 'BRAND', 'BENEFITS', 'URL', 'CATEGORY', 'BEST_SELLER']
            return jsonify(dict(zip(keys, product)))
        else:
            return jsonify({'error': 'Product not found'}), 404
    elif request.method == 'DELETE':
        # Check if the product exists
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products WHERE ID = ?', (product_id,))
        existing_product = cursor.fetchone()
        if existing_product is None:
            conn.close()
            return jsonify({'error': 'Product not found'}), 404

        # Delete the product from the database
        cursor.execute('DELETE FROM products WHERE ID = ?', (product_id,))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Product deleted successfully'}), 200
    
    elif request.method == 'PATCH':
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Check if the product exists
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products WHERE ID = ?', (product_id,))
        existing_product = cursor.fetchone()
        conn.close()
        if existing_product is None:
            return jsonify({'error': 'Product not found'}), 404

        # Update the product fields if they are present in the request
        fields_to_update = ['NAME', 'PRICE', 'IMAGE', 'DESCRIPTION', 'BRAND', 'BENEFITS', 'URL', 'CATEGORY', 'BEST_SELLER']
        for field in fields_to_update:
            if field in data:
                conn = sqlite3.connect(DB_PATH)
                cursor = conn.cursor()
                cursor.execute(f'UPDATE products SET {field} = ? WHERE ID = ?', (data[field], product_id))
                conn.commit()
                conn.close()

        return jsonify({'message': 'Product updated successfully'}), 200
    else:
        return jsonify({'error': 'Method not allowed'}), 405
    


@db_bp.route('/products/', methods=['GET','POST'])
def get_all_products():
    if not os.path.exists(DB_PATH):
        return jsonify({'error': 'Database not found'}), 500  
    if request.method == 'GET':
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products')
        products = cursor.fetchall()
        conn.close()
        if products:
            keys = ['ID', 'NAME', 'PRICE', 'IMAGE', 'DESCRIPTION', 'BRAND', 'BENEFITS', 'URL', 'CATEGORY', 'BEST_SELLER']
            return jsonify([dict(zip(keys, product)) for product in products])
        else:
            return jsonify([])
            
    elif request.method == 'POST':
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Check if all required fields are present
        required_fields = ['NAME', 'PRICE', 'IMAGE', 'DESCRIPTION', 'BRAND', 'BENEFITS', 'URL', 'CATEGORY', 'BEST_SELLER']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Extract data from request and insert into the database
        name = data.get('NAME')
        price = data.get('PRICE')
        image = data.get('IMAGE')
        description = data.get('DESCRIPTION')
        brand = data.get('BRAND')
        benefits = data.get('BENEFITS')
        url = data.get('URL')
        category = data.get('CATEGORY')
        best_seller = data.get('BEST_SELLER')

        # Insert the data into the database (this part is just a placeholder, you need to modify it based on your database setup)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO products (NAME, PRICE, IMAGE, DESCRIPTION, BRAND, BENEFITS, URL, CATEGORY, BEST_SELLER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                       (name, price, image, description, brand, benefits, url, category, best_seller))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Product added successfully'}), 201
    else:
        return jsonify({'error': 'Method not allowed'}), 405
