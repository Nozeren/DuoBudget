from flask import jsonify, request, render_template, flash, redirect, session
from views import app
import requests
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')

@app.route('/transactions', methods=['POST','GET'])
async def transactions():
    return render_template('transactions/index.html')

