from flask import Flask, render_template, url_for, request, redirect
app = Flask(__name__)
@app.route('/')
async def home():
    return render_template('home/index.html')

@app.route('/settings/user')
async def settings_user():
    return render_template('settings/user.html')

if __name__ == "__main__":
    app.run(debug=True)