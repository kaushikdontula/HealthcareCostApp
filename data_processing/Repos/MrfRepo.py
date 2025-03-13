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
    def __init__(self, db_name:str = None):
        """
        Base repo that manages connections to DB
        :param db_name: name of the .db file to use
        """
        if db_name == None:
            db_name = "healthcare_pricing.db"

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
    def get_service_by_cpt(self, cpt: int) -> Service:
        with self.Session.begin() as session:
            service = session.query(Service).filter_by(cpt_code=cpt).first()
            session.expunge_all()
            return service
        
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


