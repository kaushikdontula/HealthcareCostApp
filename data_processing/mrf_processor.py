import ijson
import sys
import os
import sqlite3
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from  models.MrfData import MrfData_In
# Open the large JSON file
from decimal import Decimal
 
file_path = "./mrf_files/2024-10-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
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
            Mrf_arr.append(Mrf_obj)
        
    

    insert_into_database(Mrf_arr)


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




# service_name - string - OF NOTE - I think this is maybe optionional but could help us during development
# service_code - int
# provider_references - array
# negotiated_type - string
# negotiated_rate - float
# expiration_date - date
# billing class - string

def insert_into_database(mrf_obj_arr):
    with sqlite3.connect('database/healthcare_pricing.db') as conn:
        for mrf_obj in mrf_obj_arr:
            service_id = add_service(conn, mrf_obj)
            pricing_id = add_pricing(conn, mrf_obj)
            # provider_service_id = add_provider_services(conn, mrf_obj)

    print(f"inserted into db with id val {pricing_id}")

# def add_provider_services(conn, service):
#      sql = '''INSERT INTO ProviderService(negotiated_rate,negotiated_type,billing_class,expiration_date)
#              VALUES(?,?,?,?) '''
    
#     cur = conn.cursor()

#     # have to convert negotiaed rate to float or it bricks
#     cur.execute(sql, [float(service.negotiated_rate), service.negotiated_type, service.billing_class,service.expiration_date])

#     conn.commit()

#     return cur.lastrowid


def add_pricing(conn, service):
    # insert table statement
    sql = '''INSERT INTO Pricing(negotiated_rate,negotiated_type,billing_class,expiration_date)
             VALUES(?,?,?,?) '''
    
    cur = conn.cursor()

    # have to convert negotiaed rate to float or it bricks
    cur.execute(sql, [float(service.negotiated_rate), service.negotiated_type, service.billing_class,service.expiration_date])

    conn.commit()

    return cur.lastrowid

def add_service(conn, service):
    sql = '''INSERT INTO Services(billing_code,name,category)
             VALUES(?,?,?) '''
    
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM Services WHERE billing_code = ?", (service.billing_code,))
    exists = cur.fetchone() 

    if(exists):
        return -1

    cur.execute(sql, [service.billing_code, service.service_name, None])

    conn.commit()

    return cur.lastrowid


main()