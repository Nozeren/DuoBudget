from flask import render_template, jsonify, request
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')


@app.route('/budget', methods=['GET'])
async def get_budget():
    results = requests.get(f'{API_URL}/budget/')
    return jsonify(results.json(), results.status_code)
@app.route('/budget-dates', methods=['GET'])
async def get_budget_dates():
    results = requests.get(f'{API_URL}/budget/getfirstlastdate')
    return jsonify(results.json(), results.status_code)

