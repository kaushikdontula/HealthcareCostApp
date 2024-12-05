import ijson
import sys
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from  models.MrfData import MrfData_In
# Open the large JSON file
from decimal import Decimal
 
# file_path = "./mrf_files/2024-10-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
file_path = "regional_mrf_files/2024-11-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
# add try accept clause for errors
# try utf8, then latin1, etc (check whatever byte code windows uses)
# could also try to replace line endings with linux ones

def main():
    # read_partial_json(file_path, limit=50)
    # get_array_from_key(file_path, "negotiated_rates", limit=10)

    Mrf_arr = []

    data = get_array_from_key(file_path, "in_network", 10)
    for i in data:
        print(i["name"])
        print(i["billing_code"])
        rates = i["negotiated_rates"]
        print(f"number of prices {len(rates)}")
        print("***Example Rates***")
        rate_num = 1
        providersArr = []
        for j in rates:
            # print(f"***Rate {rate_num}***")
            providers = j["provider_references"]
            # providersArr.append(providers)
            # print(f"provider_references: {providers}")
            neg_rate_arr = []
            for k in j["negotiated_prices"]: #type -> rate -> date -> class
                for key,val in k.items():
                    # print(f"{key}: {val}")
                    neg_rate_arr.append(val)
            rate_num += 1
            Mrf_obj = MrfData_In(i["name"], i["billing_code"], providers, neg_rate_arr[0], neg_rate_arr[1], neg_rate_arr[2], neg_rate_arr[3])
            print("PRINTING NEW MRF OBJECT")
            Mrf_obj.print_mrf()
        
 
    # class DecimalEncoder(json.JSONEncoder):
    #     def default(self, obj):
    #         if isinstance(obj, Decimal):
    #             return str(obj)
    #         return super(DecimalEncoder, self).default(obj)
    
    # with open('output.json', 'w') as f:
    #     json.dump(data, f, cls=DecimalEncoder, indent=2)

def read_partial_json(file_path, limit=10):
    with open(file_path, 'rb') as file:
        parser = ijson.parse(file)
        count = 0
        for prefix, event, value in parser:
            print(f"{prefix}:{event}:{value}")
            count += 1
            if count >= limit:
                break
 
def read_array_from_key(file_path, array_key, limit=10):
    with open(file_path, 'rb') as file:
        objects = ijson.items(file, f'{array_key}.item')
        for i, obj in enumerate(objects):
            if i >= limit:
                break
            print(obj)
 
def get_array_from_key(file_path, array_key, limit=None):
    result = []
    with open(file_path, 'rb') as file:
        objects = ijson.items(file, f'{array_key}.item')
        for i, obj in enumerate(objects):
            if limit is not None and i >= limit:
                break
            result.append(obj)
    return result




main()