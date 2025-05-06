from flask import Flask

app = Flask(__name__)

from views import home
from views import settings 
from views import banks
from views import transactions 
from views import import_file 
from views import budget 