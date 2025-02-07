import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))

from data_processing import mrf_processor
from  models.MrfData import ServiceObj
from  models.MrfData import ProviderObj
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers, declarative_base
from data_processing.Models.MrfDbModels import (Provider, Pricing, Service, ProviderDetails, Company, Plan, ProviderService, Base)
from data_processing.Repos.MrfRepo import ProviderRepo, PricingRepo, ServiceRepo, CompanyRepo, PlanRepo, ProviderDetailsRepo, ProviderServiceRepo

from datetime import datetime

file_path = "./mrf_files/2025-01-01_NEW_NW-COMMERCIAL-01_in-network-rates.json"

def main():
    # provider_repo = ProviderRepo("healthcare_pricing.db") 
    # provder_arr = mrf_processor.get_array_from_key(file_path, "provider_references", 2)
    # provider_objs = mrf_processor.provider_data_objects(provder_arr)
    # for prov in provider_objs:
    #     provider_repo.add_provider(prov)

    # service_repo = ServiceRepo("healthcare_pricing.db") 
    # service_arr = mrf_processor.get_array_from_key(file_path, "in_network", 2)
    # service_objs = mrf_processor.service_data_to_objects(service_arr)
    # for serv in service_objs:
    #     service_repo.add_service(serv)


    ### Adding Fake Data For Testing Purposes ###

    # Instantiate repository objects
    provider_repo = ProviderRepo("healthcare_pricing.db")
    company_repo = CompanyRepo("healthcare_pricing.db")
    service_repo = ServiceRepo("healthcare_pricing.db")
    pricing_repo = PricingRepo("healthcare_pricing.db")
    plan_repo = PlanRepo("healthcare_pricing.db")
    provider_details_repo = ProviderDetailsRepo("healthcare_pricing.db")
    provider_service_repo = ProviderServiceRepo("healthcare_pricing.db")

    # Add fake providers
    providers = [
        Provider(name="HealthFirst Medical", npi="1234567890", tin="987654321"),
        Provider(name="CarePlus Healthcare", npi="0987654321", tin="123456789"),
        Provider(name="MedCorp Health", npi="1112223333", tin="444555666"),
    ]
    for provider in providers:
        provider_repo.add_provider(provider)

    # Add fake companies
    companies = [
        Company(name="Acme Health Plans"),
        Company(name="Prime Care Insurance"),
    ]
    for company in companies:
        company_repo.add_company(company)

    # Add fake services
    services = [
        Service(service_id=1, name="General Consultation", description="Standard check-up service", category="General"),
        Service(service_id=2,name="Emergency Care", description="Critical care for emergencies", category="Emergency"),
        Service(service_id=3,name="Surgical Services", description="Surgical procedures", category="Specialty"),
    ]
    for service in services:
        service_repo.add_service(service)

    # Add fake pricing
    pricings = [
        Pricing(negotiated_rate=150.00, negotiated_type="Flat", billing_class="Standard", price=200.00, expiration_date=datetime(2025, 1, 1)),
        Pricing(negotiated_rate=10.00, negotiated_type="Percentage", billing_class="Premium", price=250.00, expiration_date=datetime(2025, 6, 1)),
    ]
    for pricing in pricings:
        pricing_repo.add_pricing(pricing)

    # Add fake plans
    plans = [
        Plan(company_id=1, name="Silver Plan"),
        Plan(company_id=2, name="Gold Plan"),
    ]
    for plan in plans:
        plan_repo.add_plan(plan)

    # Add provider details
    provider_details = [
        ProviderDetails(provider_id=1),
        ProviderDetails(provider_id=2),
    ]
    for provider_detail in provider_details:
        provider_details_repo.add_provider_detail(provider_detail)

    # Add provider services (relating providers, services, pricing, and plans)
    provider_services = [
        ProviderService(service_id=1, provider_id=1, pricing_id=1, plan_id=1),  # HealthFirst with General Consultation on Silver Plan
        ProviderService(service_id=2, provider_id=2, pricing_id=2, plan_id=2),  # CarePlus with Emergency Care on Gold Plan
    ]
    for provider_service in provider_services:
        provider_service_repo.add_provider_service(provider_service)

    print("Fake data added successfully!")


main()