from flask import  render_template
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')

@app.route('/transactions', methods=['GET'])
async def transactions():
    return render_template('transactions/index.html')

