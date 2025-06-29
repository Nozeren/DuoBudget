from flask import render_template, request, jsonify
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')


@app.route('/')
async def home():
    return render_template('home/index.html')

@app.route('/changeSubcategory', methods=['PUT'])
async def change_subcategory():
    data = request.get_json()
    result = requests.put(f'{API_URL}/subcategories/name', json=data)
    return jsonify({'result': 'Sucess'}, result.status_code)

@app.route('/deleteSubcategory', methods=['DELETE'])
async def delete_subcategory():
    data = request.get_json()
    id = data['id']
    results = requests.delete(f'{API_URL}/subcategories/{id}')
    return jsonify(results.json(), results.status_code)

@app.route('/addsubcategory', methods=['POST'])
async def add_subcategory():
    data = request.get_json()
    result = requests.post(
            f'{API_URL}/subcategories/', json={'name': data['subcategory_name'], 'category_id': data['category_id'], 'user_id': data['user_id']})
    return jsonify({'result': 'Sucess'}, result.status_code)

@app.route('/total-assigned/<user_id>', methods=['GET'])
async def get_total_assigned(user_id):
    results = requests.get(f'{API_URL}/budget/totalassigned/{user_id}')
    return jsonify(results.json(), results.status_code)



