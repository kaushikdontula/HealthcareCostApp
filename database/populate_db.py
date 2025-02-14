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

# file_path = "mrf_files/2025-02-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
file_path = "mrf_files/2025-02-01_KPIC_MA-COMMERCIAL_in-network-rates.json"


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

def main():
    setup_logging("database/populate_log.txt")
    logging.info("Starting to populate the database...this will take a while!")

    provider_service_arr = []
    start_time = time.time()
    provider_repo = ProviderRepo("healthcare_pricing.db") 
    provder_arr = mrf_processor.get_array_from_key(file_path, "provider_references", limit=None)
    logging.info("Provider Array extracted, turning into objects....")
    provider_objs = mrf_processor.provider_data_objects(provder_arr, "Kaiser Mid Atlantic")
    logging.info("Objects done, adding to DB")

    provider_repo.add_providers(provider_objs)
    logging.info("Providers done. Starting Provider Details.")

    provider_details_repo = ProviderDetailsRepo("healthcare_pricing.db")
    provider_details_objs = []
    for prov in provider_objs:
        provider_details_objs.append(ProviderDetails(provider_id=prov.provider_id))
    
    provider_details_repo.add_provider_details(provider_details_objs)
    logging.info("Done with Provider Details, starting services/pricing/provider_services")
    
    service_arr = mrf_processor.get_array_from_key(file_path, "in_network", limit=None)
    logging.info("Service array done, turning into objects, inserting.")
    (service_objs, pricing_objs) = mrf_processor.service_data_to_objects(service_arr, provider_service_arr)

    logging.info("Done inserting services, prices, about to start provider services.")
    # print(f"provider_service_arr: {provider_service_arr}")
    provider_repo = ProviderServiceRepo("healthcare_pricing.db") 
    prov_serv_obj_arr = []
    for prov_serv in provider_service_arr:
        prov_serv_obj_arr.append(ProviderService(service_id=prov_serv["service_id"],
                                                 provider_id=prov_serv["provider"],
                                                 pricing_id=prov_serv["pricing_id"]))
        
    provider_repo.add_provider_services(prov_serv_obj_arr)

    logging.info("Done adding provider services. About to add companies.")
    
    

    company_repo = CompanyRepo("healthcare_pricing.db") 
    company =  Company(name="Kaiser Mid Atlantic")
    company_repo.add_company(company)

    logging.info("Done adding companies")
    
    


    logging.info(f"All done! That took {time.time() - start_time} seconds.")


main()
