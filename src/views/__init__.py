from flask import Flask

app = Flask(__name__)

from views import home
from views import settings_user 
from views import settings_bank
from views import transactions 
from views import import_file 