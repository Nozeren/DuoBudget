from flask import  render_template, jsonify, request
from views import app
import requests
import dotenv
import os
import json

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')

@app.route('/transactions', methods=['GET'])
async def transactions():
    return render_template('transactions/index.html')

@app.route('/subcategories', methods=['GET'])
async def get_subcategories():
    results = requests.get(f'{API_URL}/subcategories/')
    return jsonify(results.json(), results.status_code)

@app.route('/alltransactions', methods=['GET'])
async def get_transactions():
    results = requests.get(f'{API_URL}/transactions/')
    return jsonify(results.json(), results.status_code)

@app.route('/updatetransaction', methods=['PUT'])
async def update_transaction():
    data = request.get_json()
    result = requests.put(f'{API_URL}/transactions/', json=data)
    return jsonify({'result': 'Sucess'}, result.status_code)

@app.route('/addtransaction', methods=['POST', 'GET'])
async def add_transaction():
    data = request.get_json()
    result = requests.post(f'{API_URL}/transactions/', json={'posted_date':data['posted_date'],
                                'description':data['description'],
                                'user_id':data['user_id'],
                                'bank_id':data['bank_id'],
                                'subcategory_id':data['subcategory_id'],
                                'shared_amount':data['shared_amount'], 
                                'amount':data['amount']})
    return jsonify(result.json())