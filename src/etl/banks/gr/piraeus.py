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
class Piraeus:
    name: str
    upload_folder: str = UPLOAD_FOLDER
    dataframe: pd.DataFrame = None

    def extract(self) -> None:
        files_path = [file for file in os.listdir(self.upload_folder) if file.endswith(".xlsx")]
        # In case it has files
        if files_path:
            self._dataframes = []
            for file in files_path:
                dataframe = pd.read_excel(
                    f"{self.upload_folder}/{file}", index_col=None, header=3
                )
                self._dataframes.append(dataframe)
                os.remove(self.upload_folder + "/" + file)
            if len(self._dataframes) > 1:
                self.dataframe = pd.concat(self._dataframes)
            else:
                self.dataframe = self._dataframes[0]

    def clean(self):
        dataframe = self.dataframe
        # Remove Nan values in Category
        dataframe = dataframe[~dataframe["Category"].isin(["Withdrawals"])]
        dataframe.drop(dataframe.loc[dataframe["Category"] == "Update Date:"].index, inplace=True)
        dataframe.dropna(subset=["Category"], inplace=True)
        # Format date
        dataframe["Posted date"] = dataframe["Posted date"].astype(str)
        # Remove (CARD PURCHASE) STRING From Transaction Narrative Column
        dataframe["Transaction Narrative"] = dataframe["Transaction Narrative"].str.replace("(CARD PURCHASE)", "")
        # Get needed Columns
        dataframe =dataframe[["Posted date", "Transaction Narrative", "Category", "Amount"]]
        # Transform Category Column type to Int and Add subcategory id if Categorie exists in DB.
        subcategories_list = dataframe["Category"].tolist()
        for subcategory in subcategories_list:
            result = requests.get(f'{API_URL}/subcategories/{subcategory}')
            if result.status_code == 200 and result.json() is not None:
                dataframe.loc[dataframe["Category"] == subcategory, "Category"] = result.json()['id']
            else:
                dataframe.loc[dataframe["Category"] == subcategory, "Category"] = None 
        # Rename Columns
        dataframe = dataframe.rename(columns={
                        "Posted date": "posted_date",
                        "Transaction Narrative": "description",
                        "Category": "subcategory_id",
                        "Amount": "amount"})
        self.dataframe = dataframe       

def initialize() -> None:
    factory.register_bank("Piraeus GR", Piraeus)