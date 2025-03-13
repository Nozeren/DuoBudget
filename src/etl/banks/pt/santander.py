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
class Santader:
    name: str
    country: str
    color: str
    upload_folder: str = UPLOAD_FOLDER
    dataframe: pd.DataFrame = None

    def extract(self):
        files_path = [file for file in os.listdir(
            self.upload_folder) if file.endswith(".xls")]
        # In case it has files
        if files_path:
            self._dataframes = []
            for file in files_path:
                dataframe = pd.read_excel(
                    self.upload_folder + "/" + file, index_col=None, header=6)
                self._dataframes.append(dataframe)
                os.remove(self.upload_folder + "/" + file)
            if len(self._dataframes) > 1:
                self.dataframe = pd.concat(self._dataframes)
            else:
                self.dataframe = self._dataframes[0]

    def clean(self):
        dataframe = self.dataframe
        dataframe["Data Operação"] = pd.to_datetime(
            dataframe["Data Operação"], format="%d-%m-%Y")
        dataframe["Data Operação"] = dataframe["Data Operação"].dt.strftime(
            '%d/%m/%Y')
        dataframe["Data Operação"] = dataframe["Data Operação"].astype(str)
        dataframe = dataframe[["Data Operação",
                               "Descrição", "Montante( EUR )"]]
        dataframe = dataframe.rename(
            columns={
                "Data Operação": "posted_date",
                "Descrição": "description",
                "Montante( EUR )": "amount",
            }
        )
        self.dataframe = dataframe


def initialize() -> None:
    factory.register_bank("Santander", Santader)
