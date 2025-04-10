import csv
import sys
import os
import io
from io import StringIO
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))
from data_processing.Models.MrfDbModels import Provider, Location, LocationProvider
from data_processing.Repos.MrfRepo import LocationRepo, ProviderRepo, LocationProviderRepo


# file_path = "NPPES_Data_Dissemination_030325_030925_Weekly/endpoint_pfile_20250303-20250309_fileheader.csv"
file_path = "NPPES_Data_Dissemination_030325_030925_Weekly/endpoint_pfile_20250303-20250309.csv"



npi_info_map = {}


def main():

    # location_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    # npi = mapped_column(Integer, nullable=False)
    # postcode = mapped_column(Integer, nullable=False)
    # address = mapped_column(Text, nullable=False)
    # city = mapped_column(Text)
    # state = mapped_column(Text)

    location_repo = LocationRepo("healthcare_pricing.db") 
    provider_repo = ProviderRepo("healthcare_pricing.db")
    location_provider_repo = LocationProviderRepo("healthcare_pricing.db")

    with open(file_path, mode="r", encoding="utf-8", newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if not row["NPI"] or not row["Affiliation Address Postal Code"]:
                continue
            location = Location(npi=int(row["NPI"]), 
                                postcode=int(row["Affiliation Address Postal Code"]), 
                                address=row["Affiliation Address Line One"],
                                city=row["Affiliation Address City"],
                                state=row["Affiliation Address State"])
            
            location_id = location_repo.add_location(location)
            provider = provider_repo.get_provider_by_npi(int(row["NPI"]))
            if provider:
                location_provider_repo.add_location_provider(LocationProvider(provider_id=provider, location_id=location))
            

if __name__ == "__main__":
    main()