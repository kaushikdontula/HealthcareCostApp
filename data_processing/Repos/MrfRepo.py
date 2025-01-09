from contextlib import contextmanager
from typing import List, Optional
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker, joinedload
from pathlib import Path
import os

from data_processing.Models.MrfDbModels import Provider

BASE_DIR = Path(__file__).parent.parent.parent
DB_PATH = Path(__file__).parent.parent.parent / 'database'

class BaseRepo:
    def __init__(self, db_name:str = "healthcare_pricing.db"):
        """
        Base repo that manages connections to DB
        :param db_name: name of the .db file to use
        """
        self.db_file = f"{DB_PATH.absolute()}/{db_name}"
        if not os.path.exists(self.db_file):
            raise FileNotFoundError(f"{self.db_file} Does not exist")
        self.conn_str = f"sqlite:///{self.db_file}"
        self.engine = create_engine(self.conn_str)
        self.Session = sessionmaker(bind=self.engine)

class ProviderRepo(BaseRepo):

    def add_provider(self, provider:Provider) -> int:
        """
        Add a provider and return new PK
        :param provider:
        :return:
        """
        with self.Session.begin() as session:
            session.add(provider)
            session.flush()
            session.refresh(provider)
            session.expunge_all()
            return provider

    def add_providers(self, providers:List[Provider]):
        with self.Session.begin() as session:
            session.add_all(providers)
            session.flush()
            for provider in providers:
                session.refresh(provider)
            session.expunge_all()
            return providers

    def remove_provider_by_id(self, provider_id:int):
        with self.Session.begin() as session:
            provider_to_remove = session.query(Provider).filter_by(provider_id=provider_id).first()

            if provider_to_remove:
                session.delete(provider_to_remove)
                return True
            else:
                return False

    def get_all(self) -> List[Provider]:
        with self.Session.begin() as session:
            query = session.query(Provider).all()
            session.expunge_all()
            data = list(query)
            return data

    def get_provider_by_id(self, provider_id:int) -> Provider:
        with self.Session.begin() as session:
            provider = session.query(Provider).filter_by(provider_id=provider_id).first()
            session.expunge_all()
            return provider

    def update_provider(self, provider:Provider) -> Provider:
        with self.Session.begin() as session:
            existing_provider = session.query(Provider).filter_by(provider_id=provider.provider_id).first()
            if existing_provider:
                existing_provider.name = provider.name
                existing_provider.npi = provider.npi
                existing_provider.tin = provider.tin
                session.flush()
                session.refresh(existing_provider)
                session.expunge_all()
                return existing_provider


if __name__ == "__main__":

    repo = ProviderRepo()

    # create test data
    new_provider = Provider(name="Provider four", npi="4444444444", tin="4444444444")
    providers = [
        Provider(name="Provider One", npi="1111111111", tin="111111111"),
        Provider(name="Provider Two", npi="2222222222", tin="222222222"),
        Provider(name="Provider Three", npi="3333333333", tin="333333333")
    ]

    # Add list
    providers = repo.add_providers(providers)
    for p in providers:
        print((p.provider_id))

    # Add Single
    new_provider = repo.add_provider(new_provider)
    print(new_provider.provider_id)

    # delete
    is_deleted = repo.remove_provider_by_id(new_provider.provider_id)
    print(is_deleted)

    # Update
    update_prov = providers[0]
    update_prov.name = "Kevin Carman"
    update_prov = repo.update_provider(update_prov)
    print(update_prov.name)

    # get single
    recent_prov = repo.get_provider_by_id(update_prov.provider_id)
    print(recent_prov.name)

    # get all
    data = repo.get_all()
    for i in range(4):
        provider = data[i]
        print(f"ID: {provider.provider_id}, Name: {provider.name}, NPI: {provider.npi}")
    print("done")