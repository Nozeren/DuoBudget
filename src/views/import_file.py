from flask import request, render_template 
from views import app
import dotenv
import os

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')

@app.route('/import', methods=['POST','GET'])
async def import_file():
    if request.method == "POST":
        user = request.form.get('user')
        bank = request.form.get('bank')
        # Redirect to categorize
        return None
    return render_template('import/file.html')


