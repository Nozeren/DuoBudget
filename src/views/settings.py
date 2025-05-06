from flask import jsonify, request, render_template
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')


@app.route('/allusers', methods=['GET'])
async def get_users():
    results = requests.get(f'{API_URL}/users/')
    return jsonify(results.json(), results.status_code)


@app.route('/accounts-type', methods=['GET'])
async def get_accounts_type():
    results = requests.get(f'{API_URL}/accounts-type/')
    return jsonify(results.json(), results.status_code)


@app.route('/accounts/<user_id>', methods=['GET'])
async def get_accounts_by_user_id(user_id):
    results = requests.get(f'{API_URL}/accounts/{user_id}')
    return jsonify(results.json(), results.status_code)


@app.route('/deleteuser', methods=['DELETE'])
async def delete_user():
    data = request.get_json()
    userid = data['id']
    results = requests.delete(f'{API_URL}/users/{userid}')
    return jsonify(results.json(), results.status_code)


@app.route('/adduser', methods=['POST'])
async def add_user():
    data = request.get_json()
    result = requests.post(
        f'{API_URL}/users/', json={'name': data['name'], "color": data['color']})
    return jsonify({'result': 'Sucess'}, result.status_code)


@app.route('/updateaccount', methods=['PUT'])
async def update_account():
    data = request.get_json()
    result = requests.put(f'{API_URL}/accounts/', json=data)
    return jsonify({'result': 'Sucess'}, result.status_code)


@app.route('/addaccount', methods=['POST'])
async def add_account():
    data = request.get_json()
    result = requests.post(
        f'{API_URL}/accounts/', json={'name': data['name'], "user_id": data["user_id"], "type_id": data['type_id'], "bank_id": data["bank_id"]})
    return jsonify( result.status_code)


@app.route('/settings', methods=['GET'])
async def settings_user():
    return render_template('settings.html')
