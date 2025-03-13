import os
import requests
import pandas as pd
import dotenv 
from etl.banks import UPLOAD_FOLDER
from dataclasses import dataclass
from etl import factory 

dotenv.load_dotenv()
API_URL = os.getenv('API_URL')

@dataclass
class Eurobank:
    name: str
    country: str
    upload_folder: str = UPLOAD_FOLDER
    dataframe: pd.DataFrame = None

    def extract(self):
        files_path = [file for file in os.listdir(self.upload_folder) if file.endswith(".csv")]
        # In case it has files
        if files_path:
            self._dataframes = []
            for file in files_path:
                dataframe = pd.read_csv(self.upload_folder + "/" + file, sep=";", index_col=None, decimal=",", thousands='.')
                self._dataframes.append(dataframe)
                os.remove(self.upload_folder + "/" + file)
            if len(self._dataframes) > 1:
                self.dataframe = pd.concat(self._dataframes)
            else:
                self.dataframe = self._dataframes[0]
        
    def clean(self):
        dataframe = self.dataframe
        dataframe.dropna(subset=["ΠΟΣΟ"], inplace=True)
        dataframe["ΗΜ/ΝΙΑ ΚΙΝΗΣΗΣ"] = dataframe["ΗΜ/ΝΙΑ ΚΙΝΗΣΗΣ"].astype(str)
        dataframe["ΠΕΡΙΓΡΑΦΗ"] = dataframe["ΠΕΡΙΓΡΑΦΗ"].str.upper()
        dataframe = dataframe[["ΗΜ/ΝΙΑ ΚΙΝΗΣΗΣ", "ΠΕΡΙΓΡΑΦΗ", "ΠΟΣΟ"]]
        dataframe = dataframe.rename(columns={"ΗΜ/ΝΙΑ ΚΙΝΗΣΗΣ": "posted_date",
                                              "ΠΕΡΙΓΡΑΦΗ": "description",
                                              "ΠΟΣΟ": "amount"})
        self.dataframe = dataframe

def initialize() -> None:
    factory.register_bank("Eurobank", Eurobank)