import json

def load_cost_data(filename='samples_hawaii.json'):
    with open(filename, 'r') as file:
        return json.load(file)
