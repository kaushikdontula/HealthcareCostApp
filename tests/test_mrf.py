import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))
file_path = "./mrf_files/2024-10-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"

from data_processing import mrf_processor

from  models.MrfData import Service
from  models.MrfData import Provider

def test_get_array_from_key_returns_array():
    res = mrf_processor.get_array_from_key(file_path, "provider_references", 2)
    assert(res is not None)
    assert isinstance(res, list)
    assert (len(res) == 2)
    res = mrf_processor.get_array_from_key(file_path, "in_network", 10)
    assert(res is not None)
    assert isinstance(res, list)
    assert (len(res) == 10)

def test_provider_data_objects_returns_class_instances():
    data = mrf_processor.get_array_from_key(file_path, "provider_references", 2)
    res = mrf_processor.provider_data_objects(data)
    assert(res is not None)
    for obj in res:
        assert isinstance(obj, Provider)

def test_service_data_objects_returns_class_instances():
    data = mrf_processor.get_array_from_key(file_path, "in_network", 10)
    res = mrf_processor.service_data_to_objects(data)
    assert(res is not None)
    for obj in res:
        assert isinstance(obj, Service)