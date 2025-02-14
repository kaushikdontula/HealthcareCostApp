import ijson
import sys
import os
from typing import Tuple, List
from data_processing.Models.MrfDbModels import Service, Provider, Pricing
from ijson import utils, common, compat
from ijson.common import IncompleteJSONError
from datetime import datetime
from data_processing.Repos.MrfRepo import ProviderRepo, PricingRepo, ServiceRepo, CompanyRepo, PlanRepo, ProviderDetailsRepo, ProviderServiceRepo

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

# Open the large JSON file

file_path = "./mrf_files/2025-01-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
# add try accept clause for errors
# try utf8, then latin1, etc (check whatever byte code windows uses)
# could also try to replace line endings with linux ones

top_codes = {"99214", "99213", "99232", "66984", "99223", "99233", "99285", "92014", "99204", "99215", "97110", "99291", "99203", 
             "88305", "99222", "93306", "99212","99308", "99309", "99284", "78452", "90960", "92012", "99205", "77418", "97140", 
             "98941", "27447", "90834", "99239", "99231", "43239", "20610", "84443", "45385", "17000", "45380", "90837", "11721",
             "85025", "92004", "17311", "80053", "78815", "93880", "76942", "80061", "11100", "99238"}

def provider_data_objects(data, name) -> List[Provider]:
    obj_arr = []
    for i in data:
        provider_group_id = i["provider_group_id"]

        provider_group = i["provider_groups"]
        for j in provider_group:
                providers = j
                tin = int(providers["tin"]["value"])
                for val in providers["npi"]:
                    obj_arr.append(Provider(provider_group_id=provider_group_id, name=name, npi=val, tin=tin))

    return obj_arr

def service_data_to_objects(data, provider_service_arr) -> Tuple[List[Service], List[Pricing]]:
    obj_arr = []
    pricing_arr = []
    service_repo = ServiceRepo("healthcare_pricing.db") 
    pricing_repo = PricingRepo("healthcare_pricing.db")
    for i in data:
        rates = i["negotiated_rates"]
        description = i["description"]
        for j in rates:
                providers = j["provider_references"]
                pricing_arr += (pricing_data_to_objects(j["negotiated_prices"]))
               
                Mrf_obj = Service(cpt_code=i["billing_code"], description=description, name=i["name"])
                obj_arr.append(Mrf_obj)
                service_repo.add_service(Mrf_obj)
    
                for price in pricing_arr:
                    pricing_repo.add_pricing(price)
                for price in pricing_arr:
                    for provider in j["provider_references"]:
                        provider_service_arr.append({"service_id": Mrf_obj.service_id, "pricing_id": price.pricing_id, "provider": provider})
    return obj_arr, pricing_arr

def pricing_data_to_objects(data) -> List[Pricing]:
    obj_arr = []
    for d in data:
        obj_arr.append(Pricing(negotiated_rate = d["negotiated_rate"], 
                   negotiated_type = d["negotiated_type"],
                   billing_class=d["billing_class"],
                   expiration_date=datetime.strptime(d["expiration_date"], "%Y-%m-%d")
                   ))
    
    return obj_arr

def read_partial_json(file_path, limit=10):
    with open(file_path, 'rb') as file:
        parser = ijson.parse(file)
        count = 0
        for prefix, event, value in parser:
            print(f"{prefix}:{event}:{value}")
            count += 1
            if count >= limit:
                break
 
def get_array_from_key(file_path, array_key, limit=None) -> List:  
    
    result = []
    with open(file_path, 'rb') as file:
        objects = ijson.items(file, f'{array_key}.item')
        i = 0
        for obj in (objects):
            if array_key == "in_network":
                if obj['billing_code'] not in top_codes:
                    continue
            if limit is not None and i >= limit:
                break
            result.append(obj)
            i+=1
    return result
    