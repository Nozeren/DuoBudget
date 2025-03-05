from flask import jsonify, request, render_template
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')

@app.route('/allbanks', methods=['GET'])
async def get_banks():
    results = requests.get(f'{API_URL}/banks/')
    return jsonify(results.json(), 200)

