import os

from views import app
from etl import factory 

full_path = os.path.realpath(__file__)
UPLOAD_FOLDER = os.path.dirname(full_path) + '\\resources'
app.secret_key = "Secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

BANKS = ['etl.banks.gr.alpha', 'etl.banks.gr.piraeus', 'etl.banks.gr.eurobank', 'etl.banks.pt.santander']
BANKS_PLUGINS =[{'name':'Alpha GR'}, {'name':'Piraeus GR'}, {'name': 'Eurobank GR'}, {'name': 'Santander PT'}]

if __name__ == "__main__":
    factory.load_plugins(BANKS)
    app.banks_plugins= [factory.create(item) for item in BANKS_PLUGINS]
    app.run(debug=True)