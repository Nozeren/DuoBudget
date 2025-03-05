import os
import json
import dotenv
import requests
from werkzeug.utils import secure_filename

from views import app
from flask import request, render_template, flash, redirect, url_for

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')
ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx' }


async def allowed_file(file_name):
    return '.' in file_name and file_name.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/import', methods=['POST','GET'])
async def import_file():
    if request.method == "POST":
        file = request.files['file']
        if not await allowed_file(file_name=file.filename):
            flash(f'Incorrect file format. Required file format: {list(ALLOWED_EXTENSIONS)}', 'error')
            return redirect(url_for('transactions'))
        user_id = request.form.get('user')
        bank_id= request.form.get('bank')
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'] , filename))
        bank = requests.get(f'{API_URL}/banks/{bank_id}').json()
        for plugin in app.banks_plugins:
            if plugin.name == bank['name']:
                # Extract
                plugin.extract()
                # Transform
                plugin.clean()
                # Insert IDs
                dataframe = plugin.dataframe
                dataframe.insert(3, "user_id", user_id)
                dataframe.insert(4, "bank_id", bank_id)
                data = [tuple(row) for row in dataframe.values]
                data = json.dumps(data)
                requests.post(f'{API_URL}/temporary-transactions/', json={'data':data, 'columns':json.dumps(list(dataframe.columns))})
    return render_template('import/file.html')

