from contextlib import contextmanager
from typing import List, Optional
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker, joinedload
from pathlib import Path
from datetime import datetime
import os

from data_processing.Models.MrfDbModels import Provider, Pricing, Service, ProviderDetails, Company, Plan, ProviderService

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


class PricingRepo(BaseRepo):

    def add_pricing(self, pricing:Pricing) -> int:
        """
        Add a pricing id and return new PK
        :param pricing:
        :return: int
        """
        with self.Session.begin() as session:
            session.add(pricing)
            session.flush()
            session.refresh(pricing)
            session.expunge_all()
            return pricing

    def add_pricing_ids(self, pricing_ids:List[Pricing]):
        with self.Session.begin() as session:
            session.add_all(pricing_ids)
            session.flush()
            for pricing in pricing_ids:
                session.refresh(pricing)
            session.expunge_all()
            return pricing_ids

    def remove_pricing_by_id(self, pricing_id:int):
        with self.Session.begin() as session:
            pricing_to_remove = session.query(Pricing).filter_by(pricing_id=pricing_id).first()

            if pricing_to_remove:
                session.delete(pricing_to_remove)
                return True
            else:
                return False

    def get_all(self) -> List[Pricing]:
        with self.Session.begin() as session:
            query = session.query(Pricing).all()
            session.expunge_all()
            data = list(query)
            return data

    def get_pricing_by_id(self, pricing_id:int) -> Pricing:
        with self.Session.begin() as session:
            pricing = session.query(Pricing).filter_by(pricing_id=pricing_id).first()
            session.expunge_all()
            return pricing

    def update_pricing(self, pricing:Pricing) -> Pricing:
        with self.Session.begin() as session:
            existing_pricing = session.query(Pricing).filter_by(pricing_id=pricing.pricing_id).first()
            if existing_pricing:
                existing_pricing.negotiated_rate = pricing.negotiated_rate
                existing_pricing.negotiated_type = pricing.negotiated_type
                existing_pricing.billing_class = pricing.billing_class
                existing_pricing.price = pricing.price
                existing_pricing.expiration_date = pricing.expiration_date
                session.flush()
                session.refresh(existing_pricing)
                session.expunge_all()
                return existing_pricing

class ServiceRepo(BaseRepo):

    def add_service(self, service: Service) -> int:
        with self.Session.begin() as session:
            session.add(service)
            session.flush()
            session.refresh(service)
            session.expunge_all()
            return service

    def add_services(self, services: List[Service]) -> List[Service]:
        with self.Session.begin() as session:
            session.add_all(services)
            session.flush()
            for service in services:
                session.refresh(service)
            session.expunge_all()
            return services

    def remove_service_by_id(self, service_id: int) -> bool:
        with self.Session.begin() as session:
            service_to_remove = session.query(Service).filter_by(service_id=service_id).first()

            if service_to_remove:
                session.delete(service_to_remove)
                return True
            else:
                return False

    def get_all(self) -> List[Service]:
        with self.Session.begin() as session:
            query = session.query(Service).all()
            session.expunge_all()
            data = list(query)
            return data

    def get_service_by_id(self, service_id: int) -> Service:
        with self.Session.begin() as session:
            service = session.query(Service).filter_by(service_id=service_id).first()
            session.expunge_all()
            return service

    def update_service(self, service: Service) -> Service:
        with self.Session.begin() as session:
            existing_service = session.query(Service).filter_by(service_id=service.service_id).first()
            if existing_service:
                existing_service.name = service.name
                existing_service.description = service.description
                existing_service.category = service.category
                session.flush()
                session.refresh(existing_service)
                session.expunge_all()
                return existing_service

class CompanyRepo(BaseRepo):

    def add_company(self, company: Company) -> int:
        with self.Session.begin() as session:
            session.add(company)
            session.flush()
            session.refresh(company)
            session.expunge_all()
            return company

    def add_companies(self, companies: List[Company]) -> List[Company]:
        with self.Session.begin() as session:
            session.add_all(companies)
            session.flush()
            for company in companies:
                session.refresh(company)
            session.expunge_all()
            return companies

    def remove_company_by_id(self, company_id: int) -> bool:
        with self.Session.begin() as session:
            company_to_remove = session.query(Company).filter_by(company_id=company_id).first()

            if company_to_remove:
                session.delete(company_to_remove)
                return True
            else:
                return False

    def get_all(self) -> List[Company]:
        with self.Session.begin() as session:
            query = session.query(Company).all()
            session.expunge_all()
            return query

    def get_company_by_id(self, company_id: int) -> Company:
        with self.Session.begin() as session:
            company = session.query(Company).filter_by(company_id=company_id).first()
            session.expunge_all()
            return company

    def update_company(self, company: Company) -> Company:
        with self.Session.begin() as session:
            existing_company = session.query(Company).filter_by(company_id=company.company_id).first()
            if existing_company:
                existing_company.name = company.name
                session.flush()
                session.refresh(existing_company)
                session.expunge_all()
                return existing_company


class ProviderDetailsRepo(BaseRepo):

    def add_provider_detail(self, provider_detail: ProviderDetails) -> int:
        with self.Session.begin() as session:
            session.add(provider_detail)
            session.flush()
            session.refresh(provider_detail)
            session.expunge_all()
            return provider_detail

    def add_provider_details(self, provider_details: List[ProviderDetails]) -> List[ProviderDetails]:
        with self.Session.begin() as session:
            session.add_all(provider_details)
            session.flush()
            for provider_detail in provider_details:
                session.refresh(provider_detail)
            session.expunge_all()
            return provider_details

    def remove_provider_detail_by_id(self, provider_details_id: int) -> bool:
        with self.Session.begin() as session:
            provider_detail_to_remove = session.query(ProviderDetails).filter_by(provider_details_id=provider_details_id).first()

            if provider_detail_to_remove:
                session.delete(provider_detail_to_remove)
                return True
            else:
                return False

    def get_all(self) -> List[ProviderDetails]:
        with self.Session.begin() as session:
            query = session.query(ProviderDetails).all()
            session.expunge_all()
            data = list(query)
            return data

    def get_provider_detail_by_id(self, provider_details_id: int) -> ProviderDetails:
        with self.Session.begin() as session:
            provider_detail = session.query(ProviderDetails).filter_by(provider_details_id=provider_details_id).first()
            session.expunge_all()
            return provider_detail

    def update_provider_detail(self, provider_detail: ProviderDetails) -> ProviderDetails:
        with self.Session.begin() as session:
            existing_provider_detail = session.query(ProviderDetails).filter_by(provider_details_id=provider_detail.provider_details_id).first()
            if existing_provider_detail:
                existing_provider_detail.provider_id = provider_detail.provider_id
                session.flush()
                session.refresh(existing_provider_detail)
                session.expunge_all()
                return existing_provider_detail


class PlanRepo(BaseRepo):
    def add_plan(self, plan: Plan) -> Plan:
        """
        Add a plan and return the new instance.
        """
        with self.Session.begin() as session:
            session.add(plan)
            session.flush()
            session.refresh(plan)
            session.expunge_all()
            return plan

    def add_plans(self, plans: list[Plan]) -> list[Plan]:
        """
        Add multiple plans and return the list of added instances.
        """
        with self.Session.begin() as session:
            session.add_all(plans)
            session.flush()
            for plan in plans:
                session.refresh(plan)
            session.expunge_all()
            return plans

    def remove_plan_by_id(self, plan_id: int) -> bool:
        """
        Remove a plan by its ID.
        """
        with self.Session.begin() as session:
            plan_to_remove = session.query(Plan).filter_by(plan_id=plan_id).first()
            if plan_to_remove:
                session.delete(plan_to_remove)
                return True
            return False

    def get_all(self) -> list[Plan]:
        """
        Retrieve all plans.
        """
        with self.Session.begin() as session:
            plans = session.query(Plan).all()
            session.expunge_all()
            return plans

    def get_plan_by_id(self, plan_id: int) -> Plan:
        """
        Retrieve a single plan by its ID.
        """
        with self.Session.begin() as session:
            plan = session.query(Plan).filter_by(plan_id=plan_id).first()
            session.expunge_all()
            return plan

    def update_plan(self, plan: Plan) -> Plan:
        """
        Update an existing plan.
        """
        with self.Session.begin() as session:
            existing_plan = session.query(Plan).filter_by(plan_id=plan.plan_id).first()
            if existing_plan:
                existing_plan.name = plan.name
                existing_plan.company_id = plan.company_id
                session.flush()
                session.refresh(existing_plan)
                session.expunge_all()
                return existing_plan




class ProviderServiceRepo(BaseRepo):

    def add_provider_service(self, provider_service: ProviderService) -> ProviderService:
        """
        Add a single ProviderService and return the new instance.
        """
        with self.Session.begin() as session:
            session.add(provider_service)
            session.flush()
            session.refresh(provider_service)
            session.expunge_all()
            return provider_service

    def add_provider_services(self, provider_services: list[ProviderService]) -> list[ProviderService]:
        """
        Add a list of ProviderServices and return the instances.
        """
        with self.Session.begin() as session:
            session.add_all(provider_services)
            session.flush()
            for ps in provider_services:
                session.refresh(ps)
            session.expunge_all()
            return provider_services

    def remove_provider_service_by_id(self, provider_service_id: int) -> bool:
        """
        Remove a ProviderService by its ID and return whether the operation was successful.
        """
        with self.Session.begin() as session:
            provider_service_to_remove = session.query(ProviderService).filter_by(
                provider_service_id=provider_service_id).first()
            if provider_service_to_remove:
                session.delete(provider_service_to_remove)
                return True
            return False

    def get_all(self) -> list[ProviderService]:
        """
        Get all ProviderServices.
        """
        with self.Session.begin() as session:
            query = session.query(ProviderService).all()
            session.expunge_all()
            return list(query)

    def get_provider_service_by_id(self, provider_service_id: int) -> ProviderService:
        """
        Get a single ProviderService by its ID.
        """
        with self.Session.begin() as session:
            provider_service = session.query(ProviderService).filter_by(
                provider_service_id=provider_service_id).first()
            session.expunge_all()
            return provider_service

    def update_provider_service(self, provider_service: ProviderService) -> ProviderService:
        """
        Update a ProviderService and return the updated instance.
        """
        with self.Session.begin() as session:
            existing_provider_service = session.query(ProviderService).filter_by(
                provider_service_id=provider_service.provider_service_id).first()
            if existing_provider_service:
                existing_provider_service.service_id = provider_service.service_id
                existing_provider_service.provider_id = provider_service.provider_id
                existing_provider_service.pricing_id = provider_service.pricing_id
                existing_provider_service.plan_id = provider_service.plan_id
                session.flush()
                session.refresh(existing_provider_service)
                session.expunge_all()
                return existing_provider_service


def test_provider():
    
    print("\nTesting Provider")
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

def convert_str_to_datetime(string: str) -> datetime.date:
    return datetime.strptime(string, '%Y-%m-%d').date()


def test_pricing():

    print("\nTesting Pricing")
    repo = PricingRepo()

    # create test data
    new_pricing_entry = Pricing(negotiated_rate = 10, negotiated_type = 'type4', billing_class = 'private', price = 100, expiration_date = convert_str_to_datetime('2024-06-20'))
    pricing_entries = [
        Pricing(negotiated_rate = 20, negotiated_type = 'type1', billing_class = 'private', price = 100, expiration_date = convert_str_to_datetime('2024-06-19')),
        Pricing(negotiated_rate = 30, negotiated_type = 'type2', billing_class = 'private', price = 200, expiration_date = convert_str_to_datetime('2024-06-18')),
        Pricing(negotiated_rate = 40, negotiated_type = 'type3', billing_class = 'private', price = 300, expiration_date = convert_str_to_datetime('2024-06-17'))
    ]

    # Add list
    pricing_entries = repo.add_pricing_ids(pricing_entries)
    for p in pricing_entries:
        print((p.pricing_id))

    # Add Single
    new_pricing_entry = repo.add_pricing(new_pricing_entry)
    print(new_pricing_entry.pricing_id)

    # delete
    is_deleted = repo.remove_pricing_by_id(new_pricing_entry.pricing_id)
    print(is_deleted)

    # Update
    update_pricing_entry = pricing_entries[0]
    update_pricing_entry.price = 10
    update_pricing_entry = repo.update_pricing(update_pricing_entry)
    print(update_pricing_entry.price)

    # get single
    recent_pricing_entry = repo.get_pricing_by_id(update_pricing_entry.pricing_id)
    print(recent_pricing_entry.pricing_id)

    # get all
    data = repo.get_all()
    for i in range(4):
        pricing = data[i]
        print(f"ID: {pricing.pricing_id}, Negotiated Rate: {pricing.negotiated_rate}, "
              f"Negotiated Type: {pricing.negotiated_type}, Billing Class: {pricing.billing_class}, "
              f"Price: {pricing.price}, Expiration Date: {pricing.expiration_date}")        
        

def test_service():
    print("\nTesting Service")
    repo = ServiceRepo()

    # Create test data
    new_service = Service(name="Service Four", description="Description of Service Four", category="Category Four")
    services = [
        Service(name="Service One", description="Description of Service One", category="Category One"),
        Service(name="Service Two", description="Description of Service Two", category="Category Two"),
        Service(name="Service Three", description="Description of Service Three", category="Category Three")
    ]

    # Add list of services
    services = repo.add_services(services)
    for s in services:
        print(s.service_id)

    # Add single service
    new_service = repo.add_service(new_service)
    print(new_service.service_id)

    # Remove a service by ID
    is_deleted = repo.remove_service_by_id(new_service.service_id)
    print(is_deleted)

    # Update service
    update_service = services[0]
    update_service.name = "Service One New"
    update_service = repo.update_service(update_service)
    print(update_service.name)

    # Get single service by ID
    recent_service = repo.get_service_by_id(update_service.service_id)
    print(recent_service.name)

    # Get all services
    data = repo.get_all()
    for i in range(4):
        service = data[i]
        print(f"ID: {service.service_id}, Name: {service.name}, Description: {service.description}, Category: {service.category}")

def test_company():
    print("\nTesting Company")
    repo = CompanyRepo()

    new_company = Company(name="Company Four")
    companies = [
        Company(name="Company One"),
        Company(name="Company Two"),
        Company(name="Company Three")
    ]

    companies = repo.add_companies(companies)
    for c in companies:
        print(c.company_id)

    new_company = repo.add_company(new_company)
    print(new_company.company_id)

    is_deleted = repo.remove_company_by_id(new_company.company_id)
    print(is_deleted)

    update_company = companies[0]
    update_company.name = "Updated Company One"
    update_company = repo.update_company(update_company)
    print(update_company.name)

    recent_company = repo.get_company_by_id(update_company.company_id)
    print(recent_company.name)

    data = repo.get_all()
    for c in data[:4]:
        print(f"ID: {c.company_id}, Name: {c.name}")


def test_provider_details():
    print("\nTesting Provider Details")
    repo = ProviderDetailsRepo()

    new_provider_detail = ProviderDetails(provider_id=1)
    provider_details = [
        ProviderDetails(provider_id=1),
        ProviderDetails(provider_id=2),
        ProviderDetails(provider_id=3)
    ]

    # Add list
    provider_details = repo.add_provider_details(provider_details)
    for pd in provider_details:
        print(pd.provider_details_id)

    # add single
    new_provider_detail = repo.add_provider_detail(new_provider_detail)
    print(new_provider_detail.provider_id)

    # delete
    is_deleted = repo.remove_provider_detail_by_id(new_provider_detail.provider_details_id)
    print(is_deleted)

    # Update
    update_provider_detail = provider_details[0]
    update_provider_detail.provider_id = 10
    update_provider_detail = repo.update_provider_detail(update_provider_detail)
    print(update_provider_detail.provider_id)

    # get single
    recent_provider_detail = repo.get_provider_detail_by_id(update_provider_detail.provider_details_id)
    print(recent_provider_detail.provider_id)

    # get all
    data = repo.get_all()
    for i in range(4):
        pd = data[i]
        print(f"ID: {pd.provider_details_id}, Provider ID: {pd.provider_id}")


def test_plan():
    print("\nTesting Plan")
    repo = PlanRepo()

    # Create test data
    new_plan = Plan(company_id=1, name="Plan D")
    plans = [
        Plan(company_id=1, name="Plan A"),
        Plan(company_id=2, name="Plan B"),
        Plan(company_id=3, name="Plan C"),
    ]

    # Add multiple plans
    plans = repo.add_plans(plans)
    for p in plans:
        print(p.plan_id)

    # Add a single plan
    new_plan = repo.add_plan(new_plan)
    print(new_plan.plan_id)

    # Delete a plan
    is_deleted = repo.remove_plan_by_id(new_plan.plan_id)
    print(is_deleted)

    # Update a plan
    update_plan = plans[0]
    update_plan.name = "Updated Plan A"
    update_plan = repo.update_plan(update_plan)
    print(update_plan.name)

    # Get a single plan
    recent_plan = repo.get_plan_by_id(update_plan.plan_id)
    print(recent_plan.name)

    # Get all plans
    data = repo.get_all()
    for plan in data[:4]:
        print(f"ID: {plan.plan_id}, Company ID: {plan.company_id}, Name: {plan.name}")


def test_provider_service():
    print("\nTesting ProviderService")
    repo = ProviderServiceRepo()

    # Create test data
    new_provider_service = ProviderService(
        service_id=1, provider_id=1, pricing_id=1, plan_id=1
    )
    provider_services = [
        ProviderService(service_id=2, provider_id=2, pricing_id=2, plan_id=2),
        ProviderService(service_id=3, provider_id=3, pricing_id=3, plan_id=3),
        ProviderService(service_id=4, provider_id=4, pricing_id=4, plan_id=4)
    ]

    # Add list
    provider_services = repo.add_provider_services(provider_services)
    for ps in provider_services:
        print(ps.provider_service_id)

    # Add single
    new_provider_service = repo.add_provider_service(new_provider_service)
    print(new_provider_service.provider_service_id)

    # Delete
    is_deleted = repo.remove_provider_service_by_id(new_provider_service.provider_service_id)
    print(is_deleted)

    # Update
    update_ps = provider_services[0]
    update_ps.service_id = 10
    update_ps = repo.update_provider_service(update_ps)
    print(update_ps.service_id)

    # Get single
    recent_ps = repo.get_provider_service_by_id(update_ps.provider_service_id)
    print(recent_ps.service_id)

    # Get all
    data = repo.get_all()
    for ps in data[:4]:
        print(f"ID: {ps.provider_service_id}, Service ID: {ps.service_id}, "
              f"Provider ID: {ps.provider_id}, Pricing ID: {ps.pricing_id}, Plan ID: {ps.plan_id}")


if __name__ == "__main__":
    test_provider()
    test_pricing()
    test_service()
    test_company()
    test_provider_details()
    test_plan()
    test_provider_service()
