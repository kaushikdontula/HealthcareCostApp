from sqlalchemy import Column, Integer, ForeignKey, Text, String, Float, DateTime, Boolean, Date
from sqlalchemy.orm import relationship

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Service(Base):
    __tablename__ = 'Services'

    service_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    cpt_code = mapped_column(Integer, nullable=False)
    description = mapped_column(Text)
    name = mapped_column(Text, nullable=False)

    # Relationships
    provider_services = relationship("ProviderService", back_populates="service")


class Provider(Base):
    __tablename__ = 'Providers'

    provider_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    provider_group_id = mapped_column(Integer, nullable=False)
    name = mapped_column(Text)
    npi = mapped_column(Text)
    tin = mapped_column(Text)

    # Relationships
    provider_services = relationship("ProviderService", back_populates="provider")
    provider_details = relationship("ProviderDetails", back_populates="provider", uselist=False)


class ProviderDetails(Base):
    __tablename__ = 'ProviderDetails'

    provider_details_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    provider_id = mapped_column(Integer, ForeignKey('Providers.provider_id'), nullable=False)

    # Relationships
    provider = relationship("Provider", back_populates="provider_details")


class Pricing(Base):
    __tablename__ = 'Pricing'

    pricing_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    negotiated_rate = mapped_column(Float, nullable=False)
    negotiated_type = mapped_column(Text, nullable=False)
    billing_class = mapped_column(Text)
    expiration_date = mapped_column(Date)

    # Relationships
    provider_services = relationship("ProviderService", back_populates="pricing")


class Company(Base):
    __tablename__ = 'Companies'

    company_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    name = mapped_column(Text, nullable=False)

    # Relationships
    plans = relationship("Plan", back_populates="company")


class Plan(Base):
    __tablename__ = 'Plans'

    plan_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_id = mapped_column(Integer, ForeignKey('Companies.company_id'), nullable=False)
    name = mapped_column(Text, nullable=False)

    # Relationships
    company = relationship("Company", back_populates="plans")
    provider_services = relationship("ProviderService", back_populates="plan")

class ProviderService(Base):
    __tablename__ = 'ProviderService'

    provider_service_id = mapped_column(Integer, primary_key=True, autoincrement=True)
    service_id = mapped_column(Integer, ForeignKey('Services.service_id'), nullable=False)
    provider_id = mapped_column(Integer, ForeignKey('Providers.provider_group_id'), nullable=False)
    pricing_id = mapped_column(Integer, ForeignKey('Pricing.pricing_id'), nullable=False)
    plan_id = mapped_column(Integer, ForeignKey('Plans.plan_id'), nullable=True)

    # Relationships
    service = relationship("Service", back_populates="provider_services")
    provider = relationship("Provider", back_populates="provider_services")
    pricing = relationship("Pricing", back_populates="provider_services")
    plan = relationship("Plan", back_populates="provider_services")