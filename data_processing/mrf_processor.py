import ijson
import sys
import os
from data_processing.Models.MrfDbModels import Service, Provider
from ijson import utils, common, compat
from ijson.common import IncompleteJSONError
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

# Open the large JSON file

file_path = "./mrf_files/2025-01-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
# add try accept clause for errors
# try utf8, then latin1, etc (check whatever byte code windows uses)
# could also try to replace line endings with linux ones

def provider_data_objects(data):
    obj_arr = []
    for i in data:
        provider_group_id = i["provider_group_id"]

        provider_group = i["provider_groups"]
        for j in provider_group:
                providers = j
                npi_arr = []
                tin = int(providers["tin"]["value"])
                for val in providers["npi"]:
                    npi_arr.append(val)
                    obj_arr.append(Provider(name=provider_group_id, npi = val, tin=tin))

    return obj_arr

def service_data_to_objects(data):
    obj_arr = []
    for i in data:
        rates = i["negotiated_rates"]
        rate_num = 1
        for j in rates:
                providers = j["provider_references"]
                neg_rate_arr = []
                for k in j["negotiated_prices"]: #type -> rate -> date -> class
                    for key,val in k.items():
                        neg_rate_arr.append(val)
                rate_num += 1
                Mrf_obj = Service(name=i["name"], description="", category=neg_rate_arr[3])
                obj_arr.append(Mrf_obj)
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
 
def get_array_from_key(file_path, array_key, limit=None):  
    
    result = []
    with open(file_path, 'rb') as file:
        objects = ijson.items(file, f'{array_key}.item')
        for i, obj in enumerate(objects):
            if limit is not None and i >= limit:
                break
            result.append(obj)
    return result
    