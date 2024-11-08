import os
import sys
import json


# in network

class MrfData_In:

    # try accept for different data and use static typing for data types
    # pydantic?
    
    # service_name - string - OF NOTE - I think this is maybe optionional but could help us during development
    # service_code - int
    # provider_references - array
    # negotiated_type - string
    # negotiated_rate - float
    # expiration_date - date
    # billing class - string

    def __init__(self, service_name, billing_code, provider_references, negotiated_type, negotiated_rate, expiration_date, billing_class):
        self.service_name = service_name
        self.billing_code = billing_code
        self.provider_references = provider_references
        self.negotiated_type = negotiated_type
        self.negotiated_rate = negotiated_rate
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

