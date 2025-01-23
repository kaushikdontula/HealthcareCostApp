import pytest
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(SCRIPT_DIR))


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers, declarative_base
from data_processing.Models.MrfDbModels import (Provider, Pricing, Service, ProviderDetails, Company, Plan, ProviderService, Base)
from data_processing.Repos.MrfRepo import ProviderRepo, PricingRepo, ServiceRepo, CompanyRepo, PlanRepo, ProviderDetailsRepo, ProviderServiceRepo


engine = create_engine('sqlite:///database/mrf_database.db')  

Base.metadata.create_all(engine)

print("Database created successfully with all tables defined in mrfdbmodels.py.")

#Base = declarative_base()

@pytest.fixture
def provider_repo():
    return ProviderRepo(db_name="mrf_database.db")

@pytest.fixture
def pricing_repo():
    return PricingRepo(db_name="mrf_database.db")

@pytest.fixture
def service_repo():
    return ServiceRepo(db_name="mrf_database.db")

@pytest.fixture
def company_repo():
    return CompanyRepo(db_name="mrf_database.db")

@pytest.fixture
def plan_repo():
    return PlanRepo(db_name="mrf_database.db")

@pytest.fixture
def provider_details_repo():
    return ProviderDetailsRepo(db_name="mrf_database.db")

@pytest.fixture
def provider_service_repo():
    return ProviderServiceRepo(db_name="mrf_database.db")


# Tests
def test_add_provider(provider_repo):
    provider = Provider(name="Test Provider", npi="1234567890", tin="987654321")
    added_provider = provider_repo.add_provider(provider)
    assert added_provider.provider_id is not None

#test for multiple providers

def test_get_provider_by_id(provider_repo):
    provider = Provider(name="Test Provider", npi="1234567890", tin="987654321")
    added_provider = provider_repo.add_provider(provider)
    fetched_provider = provider_repo.get_provider_by_id(added_provider.provider_id)
    assert fetched_provider.name == "Test Provider"

def test_update_provider(provider_repo):
    provider = Provider(name="Test Provider", npi="1234567890", tin="987654321")
    added_provider = provider_repo.add_provider(provider)
    added_provider.name = "Updated Provider"
    updated_provider = provider_repo.update_provider(added_provider)
    assert updated_provider.name == "Updated Provider"

def test_remove_provider(provider_repo):
    provider = Provider(name="Test Provider", npi="1234567890", tin="987654321")
    added_provider = provider_repo.add_provider(provider)
    result = provider_repo.remove_provider_by_id(added_provider.provider_id)
    assert result is True

def test_add_pricing(pricing_repo):
    pricing = Pricing(negotiated_rate=100.0, negotiated_type="Flat", billing_class="Standard", price=120.0, expiration_date=None)
    added_pricing = pricing_repo.add_pricing(pricing)
    assert added_pricing.pricing_id is not None

def test_get_pricing_by_id(pricing_repo):
    pricing = Pricing(negotiated_rate=100.0, negotiated_type="Flat", billing_class="Standard", price=120.0, expiration_date=None)
    added_pricing = pricing_repo.add_pricing(pricing)
    fetched_pricing = pricing_repo.get_pricing_by_id(added_pricing.pricing_id)
    assert fetched_pricing.price == 120.0

def test_update_pricing(pricing_repo):
    pricing = Pricing(negotiated_rate=100.0, negotiated_type="Flat", billing_class="Standard", price=120.0, expiration_date=None)
    added_pricing = pricing_repo.add_pricing(pricing)
    added_pricing.price = 150.0
    updated_pricing = pricing_repo.update_pricing(added_pricing)
    assert updated_pricing.price == 150.0

def test_remove_pricing(pricing_repo):
    pricing = Pricing(negotiated_rate=100.0, negotiated_type="Flat", billing_class="Standard", price=120.0, expiration_date=None)
    added_pricing = pricing_repo.add_pricing(pricing)
    result = pricing_repo.remove_pricing_by_id(added_pricing.pricing_id)
    assert result is True

def test_add_service(service_repo):
    service = Service(name="Test Service", description="A test service", category="General")
    added_service = service_repo.add_service(service)
    assert added_service.service_id is not None

def test_get_service_by_id(service_repo):
    service = Service(name="Test Service", description="A test service", category="General")
    added_service = service_repo.add_service(service)
    fetched_service = service_repo.get_service_by_id(added_service.service_id)
    assert fetched_service.name == "Test Service"

def test_update_service(service_repo):
    service = Service(name="Test Service", description="A test service", category="General")
    added_service = service_repo.add_service(service)
    added_service.name = "Updated Service"
    updated_service = service_repo.update_service(added_service)
    assert updated_service.name == "Updated Service"

def test_remove_service(service_repo):
    service = Service(name="Test Service", description="A test service", category="General")
    added_service = service_repo.add_service(service)
    result = service_repo.remove_service_by_id(added_service.service_id)
    assert result is True

def test_add_company(company_repo):
    company = Company(name="Test Company")
    added_company = company_repo.add_company(company)
    assert added_company.company_id is not None

def test_get_company_by_id(company_repo):
    company = Company(name="Test Company")
    added_company = company_repo.add_company(company)
    fetched_company = company_repo.get_company_by_id(added_company.company_id)
    assert fetched_company.name == "Test Company"

def test_update_company(company_repo):
    company = Company(name="Test Company")
    added_company = company_repo.add_company(company)
    added_company.name = "Updated Company"
    updated_company = company_repo.update_company(added_company)
    assert updated_company.name == "Updated Company"

def test_remove_company(company_repo):
    company = Company(name="Test Company")
    added_company = company_repo.add_company(company)
    result = company_repo.remove_company_by_id(added_company.company_id)
    assert result is True
