import sys
import os
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))


from data_processing.Models.MrfDbModels import (Provider, Pricing, Service, ProviderDetails, Company, Plan, ProviderService, Base)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers, declarative_base


engine = create_engine('sqlite:///mrf_database_test.db')  

Base.metadata.create_all(engine)


