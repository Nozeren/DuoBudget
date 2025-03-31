import os
import json
import dotenv
import requests
from werkzeug.utils import secure_filename

from views import app
from flask import request, render_template, flash, redirect, url_for, jsonify

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')
ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx'}


async def allowed_file(file_name):
    return '.' in file_name and file_name.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/verify', methods=['POST', 'GET'])
async def verify():
    return render_template('import/verify.html')


@app.route('/import', methods=['POST', 'GET'])
async def import_file():
    if request.method == "POST":
        file = request.files['file']
        filename = secure_filename(file.filename)
        if not await allowed_file(file_name=file.filename):
            flash(
                f'Incorrect file format. Required file format: {list(ALLOWED_EXTENSIONS)}', 'error')
            return redirect(url_for('transactions'))
        user_id = request.form.get('user')
        bank_id = request.form.get('bank')
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        bank = requests.get(f'{API_URL}/banks/{bank_id}').json()
        for plugin in app.banks_plugins:
            if plugin.name == bank['name']:
                try:
                    # Extract
                    extracted = plugin.extract()
                    # Transform
                    plugin.clean()
                except:
                    flash(
                        f"Incorrect file. File doesn't match with selected bank", "error")
                    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    return redirect(url_for('transactions'))
                # Insert IDs
                dataframe = plugin.dataframe
                dataframe.insert(3, "user_id", user_id)
                dataframe.insert(4, "bank_id", bank_id)
                data = [tuple(row) for row in dataframe.values]
                data = json.dumps(data)
                requests.post(f'{API_URL}/temporary-transactions/', json={
                              'data': data, 'columns': json.dumps(list(dataframe.columns))})
                return redirect('/verify')
    return render_template('import/file.html')


@app.route('/temporary-transactions', methods=['GET'])
async def get_temporary_transactions():
    results = requests.get(f'{API_URL}/temporary-transactions/')
    return jsonify(results.json(), results.status_code)


@app.route('/update-temporary-transaction', methods=['PUT'])
async def update_temporary_transaction():
    data = request.get_json()
    result = requests.put(f'{API_URL}/temporary-transactions/', json=data)
    return jsonify({'result': 'Sucess'}, result.status_code)


@app.route('/deletetemporarytransaction', methods=['DELETE'])
async def delete_temporary_transaction():
    data = request.get_json()
    result = requests.delete(f'{API_URL}/temporary-transactions/{data["id"]}')
    return jsonify(result.json(), result.status_code)
