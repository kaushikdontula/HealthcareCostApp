import ijson
import sys
import os
import sqlite3
from datetime import datetime
from sqlalchemy import BigInteger
from sqlalchemy.sql import insert
from datetime import date

import io

import codecs
# import collections

from ijson import utils, common, compat

from sqlalchemy.ext.compiler import compiles

from ijson.common import IncompleteJSONError


from sqlalchemy import create_engine, Column, Integer, Float, String, Date, Table, MetaData
from sqlalchemy.orm import declarative_base, sessionmaker


class SLBigInteger(BigInteger):
    pass

@compiles(SLBigInteger, 'sqlite')
def bi_c(element, compiler, **kw):
    return "INTEGER"

@compiles(SLBigInteger)
def bi_c(element, compiler, **kw):
    return compiler.visit_BIGINT(element, **kw)

# Define the database and table structure
Base = declarative_base()

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from  models.MrfData import Service
from  models.MrfData import Provider

# Open the large JSON file
from decimal import Decimal
 
# file_path = "./mrf_files/2024-10-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
file_path = "./mrf_files/2025-01-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"
# add try accept clause for errors
# try utf8, then latin1, etc (check whatever byte code windows uses)
# could also try to replace line endings with linux ones

# def main():
    # proccess MRF file
    # service_data = get_array_from_key(file_path, "in_network", 10)
    # # transform MRF data into 'Service' class objects
    # service_arr = service_data_to_objects(service_data)
    # insert Service class objects into DB in Service and Pricing table

    # provider_data = get_array_from_key(file_path, "provider_references", 2)
    # service_data = get_array_from_key(file_path, "in_network", 10000)

    # objects = provider_data_objects(provider_data)
    # insert_into_database(service_arr)



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
                    obj_arr.append(Provider(provider_group_id, val, tin))
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
                Mrf_obj = Service(i["name"], i["billing_code"], providers, neg_rate_arr[0], neg_rate_arr[1], neg_rate_arr[2], neg_rate_arr[3])
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
 
def read_array_from_key(file_path, array_key, limit=10):
    encodings = ['utf-8', 'latin1', 'utf-16', 'utf-8-sig', 'ascii']    
    for enc in encodings:
        try:
            with open(file_path, 'rb', encoding=enc) as file:
                
                objects = ijson.items(file, f'{array_key}.item')
        except (IncompleteJSONError, UnicodeDecodeError):
            # objects = ijson.items(file, f'{array_key}.item')
            continue

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
    

# main()