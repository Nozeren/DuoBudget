import os
import pandas as pd
from dataclasses import dataclass

from etl import factory 
from etl.banks import UPLOAD_FOLDER
@dataclass
class Alpha:
    name: str
    upload_folder: str = UPLOAD_FOLDER
    dataframe: pd.DataFrame = None

    def extract(self) -> None:
        files_path = [file for file in os.listdir(self.upload_folder) if file.endswith(".csv")]
        # In case it has files
        if files_path:
            self._dataframes = []
            for file in files_path:
                dataframe = pd.read_csv( self.upload_folder + "/" + file, sep=";",header=4,index_col=None,decimal=",")
                self._dataframes.append(dataframe)
                os.remove(self.upload_folder + "/" + file)
            if len(self._dataframes) > 1:
                self.dataframe = pd.concat(self._dataframes)
            else:
                self.dataframe = self._dataframes[0]

    def clean(self):
        dataframe = self.dataframe
        dataframe["Ημ/νία"] = dataframe["Ημ/νία"].astype(str)
        dataframe["Αιτιολογία"] = dataframe["Αιτιολογία"].str.upper()
        dataframe = dataframe[["Ημ/νία", "Αιτιολογία", "Ποσό"]]
        dataframe = dataframe.rename(
            columns={
                "Ημ/νία": "posted_date",
                "Αιτιολογία": "description",
                "Ποσό": "amount",
            }
        )
        self.dataframe = dataframe
def initialize() -> None:
    factory.register_bank("Alpha GR", Alpha)