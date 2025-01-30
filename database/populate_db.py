import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from data_processing import mrf_processor
from  models.MrfData import ServiceObj
from  models.MrfData import ProviderObj
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers, declarative_base
from data_processing.Models.MrfDbModels import (Provider, Pricing, Service, ProviderDetails, Company, Plan, ProviderService, Base)
from data_processing.Repos.MrfRepo import ProviderRepo, PricingRepo, ServiceRepo, CompanyRepo, PlanRepo, ProviderDetailsRepo, ProviderServiceRepo

file_path = "./mrf_files/2025-01-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"

def main():
    provider_repo = ProviderRepo("healthcare_pricing.db") 
    provder_arr = mrf_processor.get_array_from_key(file_path, "provider_references", 2)
    provider_objs = mrf_processor.provider_data_objects(provder_arr)
    for prov in provider_objs:
        provider_repo.add_provider(prov)

    service_repo = ServiceRepo("healthcare_pricing.db") 
    service_arr = mrf_processor.get_array_from_key(file_path, "in_network", 2)
    service_objs = mrf_processor.service_data_to_objects(service_arr)
    for serv in service_objs:
        service_repo.add_service(serv)


main()