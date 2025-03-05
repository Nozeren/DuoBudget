from typing import Protocol
import pandas as pd

class Bank(Protocol):
    name: str
    upload_folder: str 
    dataframe: pd.DataFrame
    def extract():
        ...
    def clean():
        ...