import os
import sys
import json
import datetime

from dataclasses import dataclass



# in network

class Service:

    # try accept for different data and use static typing for data types
    # pydantic?
    
    # service_name - string - OF NOTE - I think this is maybe optionional but could help us during development

    service_name: str
    billing_code: int
    provider_references: list
    negotiated_type: str
    negotiated_rate: float
    expiration_date: datetime.datetime
    billing_class: str

    def __init__(self, service_name: str, billing_code: int, provider_references: list, negotiated_type: str, negotiated_rate: float, expiration_date: datetime.datetime, billing_class: str) -> None:
        self.service_name = service_name
        self.billing_code = billing_code
        self.provider_references = provider_references
        self.negotiated_type = negotiated_type
        self.negotiated_rate = float(negotiated_rate)
        self.expiration_date = expiration_date
        self.billing_class = billing_class

    def print_mrf(self):
        print(f"Service name: {self.service_name}")
        print(f"Billing Code: {self.billing_code}")
        print(f"Provider References: {self.provider_references}")
        print(f"Negotiated Type: {self.negotiated_type}")
        print(f"Negotiated Rate: {self.negotiated_rate}")
        print(f"Expiration Date: {self.expiration_date}")
        print(f"Billing Class: {self.billing_class}")


class Provider:
    
    provider_group_id: int
    npi: int
    tin: int


    def __init__(self, provider_group_id: int,npi: int, tin: int):
        self.npi = npi
        self.tin = int(tin)
        self.provider_group_id = provider_group_id
    
    def print_provider(self):
        print(f"Provider Group ID: {self.provider_group_id}")
        print(f"TIN: {self.tin}")
        print(f"NPI: {self.npi}")

