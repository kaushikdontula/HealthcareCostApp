import os
import sys
import time
import logging

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from data_processing import mrf_processor
from  models.MrfData import ServiceObj
from  models.MrfData import ProviderObj
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers, declarative_base
from data_processing.Models.MrfDbModels import (Provider, Pricing, Service, ProviderDetails, Company, Plan, ProviderService, Base)
from data_processing.Repos.MrfRepo import ProviderRepo, PricingRepo, ServiceRepo, CompanyRepo, PlanRepo, ProviderDetailsRepo, ProviderServiceRepo


def main():
    setup_logging("database/populate_log.txt")
    start_time = time.time()

    file_paths = ["mrf_files/2025-02-01_KFHP_GA-COMMERCIAL_in-network-rates.json",
                "mrf_files/2025-02-01_KPIC_MA-COMMERCIAL_in-network-rates.json",
                  "mrf_files/2025-02-01_moda_0174_in-network-rates.json",]
    for file_path in file_paths:
        process_file(file_path)
    logging.info(f"All done! That took {time.time() - start_time} seconds.")

        

def setup_logging(log_file: str) -> None:
    """
    Delete old log file and create new log file
    Log messages will also be written to standard out (Tidal output screen)
    :param log_file: file path of the log file that will be created
    :return: None
    """
    if os.path.exists(log_file):
        os.remove(log_file)
    targets = logging.StreamHandler(sys.stdout), logging.FileHandler(log_file)
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(levelname)s: %(message)s",
        handlers=targets,
    )

def get_company_name(file_path) -> str:
    if (file_path == "mrf_files/2025-02-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
        or file_path == "mrf_files/2025-02-01_KPIC_MA-COMMERCIAL_in-network-rates.json"
        or file_path == "mrf_files/2025-02-01_KFHP_GA-COMMERCIAL_in-network-rates.json"):
        return "Kaiser Permanente"
    return "Moda"


def process_file(file_path):
    logging.info(f"Starting to populate the database for {file_path}!")

    company_repo = CompanyRepo("healthcare_pricing.db") 
    company =  Company(name=get_company_name(file_path))
    company_in_db = company_repo.add_company(company)

    plan_name = mrf_processor.read_partial_json(file_path, 10)

    plan_repo = PlanRepo("healthcare_pricing.db")
    plan = Plan(company_id = company_in_db.company_id, name=plan_name)
    plan_repo.add_plan(plan)
    plan_id = plan.plan_id
    provder_arr = mrf_processor.get_array_from_key(file_path, "provider_references", limit=None)
    logging.info("Provider Array extracted, turning into objects.")
    mrf_processor.provider_data_objects(provder_arr, "Kaiser Mid Atlantic")
    logging.info("Objects done, adding to DB")


    logging.info("Providers done. Starting Services.")
    
    service_arr = mrf_processor.get_array_from_key(file_path, "in_network", limit=None)
    logging.info("Service array done, turning into objects, inserting.")
    mrf_processor.service_data_to_objects(service_arr, plan_id)   
    


# pycharm


    


if __name__ == "__main__":
    main()
