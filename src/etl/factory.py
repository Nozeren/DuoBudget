import requests
import os
import dotenv
from typing import Callable, Any
import importlib

from etl.banks.bank import Bank 

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')
banks_files_funcs: dict[str, Callable[..., Bank]]= {}

class Factory:
    @staticmethod
    def initialize():
        """Initialize the Factory"""
def import_module(name:str) -> Bank:
    return importlib.import_module(name)
def load_plugins(plugins: list[str]) -> None:
    for plugin_name in plugins:
        plugin = import_module(plugin_name)
        plugin.initialize()

def register_bank(bank_name:str, bank_func: Callable[..., Bank]):
    """Add a new Bank"""
    banks_files_funcs[bank_name] = bank_func

def unregister_ban(bank_name:str):
    """Remove bank from Factory"""
    banks_files_funcs.pop(bank_name, None)

def create(arguments: dict[str, Any]) -> Bank:
    """Create a Bank Factory and POST a new bank row with a specific name"""
    args_copy = arguments.copy()
    bank_name = args_copy.pop("name")
    country_name = args_copy.pop("country")
    try:
        requests.post(f'{API_URL}/banks/', json={'name':bank_name, 'country':country_name} )
        bank_func = banks_files_funcs[bank_name]    
        return bank_func(**arguments)
    except KeyError:
        raise ValueError(f"Unknown bank type {bank_name!r}")
