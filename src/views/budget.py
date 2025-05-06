from flask import render_template, jsonify, request
from views import app
import requests
import dotenv
import os
import json

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')


@app.route('/budget', methods=['GET', 'POST'])
async def get_budget():
    data = request.get_json()
    data = {key:int(value) for key, value in data.items()}
    results = requests.post(f'{API_URL}/budget/', json=data)
    return jsonify(results.json(), results.status_code)

@app.route('/budget-dates', methods=['GET'])
async def get_budget_dates():
    results = requests.get(f'{API_URL}/budget/getfirstlastdate')
    return jsonify(results.json(), results.status_code)

