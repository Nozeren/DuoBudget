from flask import render_template, jsonify, request
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')


@app.route('/transactions', methods=['GET'])
async def transactions():
    return render_template('transactions/index.html')


@app.route('/subcategories/<user_id>', methods=['GET'])
async def get_subcategories(user_id:int):
    results = requests.get(f'{API_URL}/subcategories/all/{user_id}')
    return jsonify(results.json(), results.status_code)

@app.route('/accounts', methods=['GET'])
async def get_accounts():
    results = requests.get(f'{API_URL}/accounts')
    return jsonify(results.json(), results.status_code)


@app.route('/alltransactions', methods=['GET', 'POST'])
async def get_transactions():
    data = request.get_json()
    data = {key:int(value) for key, value in data.items()}
    results = requests.get(f'{API_URL}/transactions/', json=data)
    return jsonify(results.json(), results.status_code)

@app.route('/transactions-dates/<user_id>', methods=['GET'])
async def get_transactions_dates(user_id):
    results = requests.get(f'{API_URL}/transactions/getfirstlastdate/{user_id}')
    return jsonify(results.json(), results.status_code)




@app.route('/updatetransaction', methods=['PUT'])
async def update_transaction():
    data = request.get_json()
    result = requests.put(f'{API_URL}/transactions/', json=data)
    return jsonify({'result': 'Sucess'}, result.status_code)


@app.route('/saveimport', methods=['PUT'])
async def saveImport():
    result = requests.put(f'{API_URL}/transactions/saveImport')
    return jsonify(result.json(), result.status_code)


@app.route('/addtransaction', methods=['POST', 'GET'])
async def add_transaction():
    data = request.get_json()
    result = requests.post(f'{API_URL}/transactions/',
                           json={'posted_date': data['posted_date'],
                                 'description': data['description'],
                                 'user_id': data['user_id'],
                                 'account_id': data['account_id'],
                                 'subcategory_id': data['subcategory_id'],
                                 'shared_amount': data['shared_amount'],
                                 'amount': data['amount']})
    return jsonify(result.json(), result.status_code)


@app.route('/deletetransaction', methods=['DELETE'])
async def delete_transaction():
    data = request.get_json()
    result = requests.delete(f'{API_URL}/transactions/{data["id"]}')
    return jsonify(result.json(), result.status_code)
