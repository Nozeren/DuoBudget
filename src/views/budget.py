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
