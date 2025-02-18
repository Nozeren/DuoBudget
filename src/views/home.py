from flask import render_template
from views import app

@app.route('/')
async def home():
    return render_template('home/index.html')