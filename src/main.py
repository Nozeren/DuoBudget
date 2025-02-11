from flask import Flask, render_template, url_for, request, redirect
app = Flask(__name__)
@app.route('/')
async def home():
    return render_template('home/index.html')

@app.route('/settings/user', methods=['POST', 'GET'])
async def settings_user():
    if request.method == 'POST':
        if request.form.get('inputusername') is not None:
            print("Saved new user: " + request.form['inputusername'])
        if request.form.get('useroption') is not None:
            print("Removed new user: " + request.form['useroption'])
    return render_template('settings/user.html')

if __name__ == "__main__":
    app.run(debug=True)