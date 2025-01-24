import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))
file_path = "./mrf_files/2025-01-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"

from data_processing import mrf_processor

from  models.MrfData import Service
from  models.MrfData import Provider

# change into class, set up own info
# magicmock

# from unittest.mock import MagicMock
 
# from FeeScheduleAutomation.src.db_access import DbAccess
 
 
# class TestDbAccess(unittest.TestCase):
#     def setUp(self):
#         connection_string = "test_connection_string"
#         self.db_access = DbAccess(connection_string)
#         self.mock_engine = MagicMock()
#         self.db_access.engine = self.mock_engine

    # def test_sql_query_with_empty_query(self):
    #         # Empty SQL query
    #         sql_query = ""
    #         test_params = ("test", "params")
    
    #         # Assertions
    #         with self.assertRaises(ValueError):
    #             self.db_access.sql_query_to_df(sql_query)
    #         with self.assertRaises(ValueError):
    #             self.db_access.execute_sql_query(sql_query)
    #         with self.assertRaises(ValueError):
    #             self.db_access.sql_query_to_df_with_params(sql_query, params=test_params)
    #         with self.assertRaises(ValueError):
    #             self.db_access.execute_sql_query_with_params(sql_query, params=test_params)


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

def test_can_process_large_amounts_of_mrf_file():
    service_data = mrf_processor.get_array_from_key(file_path, "in_network", 10000)
    assert(service_data is not None)
    assert isinstance(service_data, list)
    service_arr = mrf_processor.service_data_to_objects(service_data)
    assert(service_arr is not None)
    for obj in service_arr:
        assert isinstance(obj, Service)

    provider_data = mrf_processor.get_array_from_key(file_path, "provider_references", 10000)
    assert(provider_data is not None)
    assert isinstance(provider_data, list)
    assert (len(provider_data) == 10000)

    provider_arr = mrf_processor.provider_data_objects(provider_data)
    assert(provider_data is not None)
    for obj in provider_arr:
        assert isinstance(obj, Provider)