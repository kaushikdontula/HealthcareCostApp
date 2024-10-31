import ijson

# Open the large JSON file
from decimal import Decimal
 
file_path = "2024-10-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"

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