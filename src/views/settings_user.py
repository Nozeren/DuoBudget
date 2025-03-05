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

@app.route('/deleteuser', methods=['DELETE'])
async def delete_user():
    data = request.get_json()
    userid = data['id']
    results = requests.delete(f'{API_URL}/users/{userid}')
    return jsonify(results.json(), results.status_code)

@app.route('/adduser', methods=['POST'])
async def add_user():
    data = request.get_json()
    result = requests.post(f'{API_URL}/users/', json={'name':data['name'], "color": data['color']})
    return jsonify({'result': 'Sucess'}, result.status_code)

@app.route('/settings/user', methods=['GET'])
async def settings_user():
    return render_template('settings/user.html')
