# from django.db import models

# class Services(models.Model):
#     # these attributes match the name and types from the Service table in the DB
#     service_id = models.AutoField(primary_key=True)
#     cpt_code = models.CharField(max_length=255)
#     description = models.TextField()
#     name = models.CharField(max_length=255, null=True, blank=True)

#     # query the Services table
#     class Meta:
#         db_table = 'Services'

#     def __str__(self):
#         return self.name

# class Pricing(models.Model):
#     pricing_id = models.AutoField(primary_key=True)
#     negotiated_rate = models.FloatField()
#     negotiated_type = models.CharField(max_length=255)
#     billing_class = models.CharField(max_length=255, null=True, blank=True)
#     # price = models.FloatField()
#     expiration_date = models.DateField(null=True, blank=True)

#     class Meta:
#         db_table = 'Pricing'

#     def __str__(self):
#         return f"Pricing ID: {self.pricing_id} - Price: {self.price}"
    
# class Plans(models.Model):
#     plan_id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=255)
#     company_id = models.IntegerField()

#     class Meta:
#         db_table = 'Plans'

#     def __str__(self):
#         return f"Plan Id: {self.plan_id} - Name: {self.name}"

# class Providers(models.Model):
#     provider_id = models.AutoField(primary_key=True)       # maps to provider_id
#     provider_group_id = models.IntegerField(unique=True)              # references: ProviderService.provider_id 
#     name = models.CharField(max_length=255, null=True, blank=True)
#     npi = models.CharField(max_length=255, null=True, blank=True)
#     tin = models.CharField(max_length=255, null=True, blank=True)
    
#     class Meta:
#         db_table = 'Providers'

#     def __str__(self):
#         return f"{self.name or 'Unnamed Provider'} (group {self.provider_group_id})"

# class ProviderService(models.Model):
#     provider_service_id = models.AutoField(primary_key=True)

#     # Link to Services via service_id
#     service = models.ForeignKey(
#         Services,
#         on_delete=models.CASCADE,
#         db_column='service_id'
#     )
    
#     # Link to Pricing
#     pricing = models.ForeignKey(
#         Pricing,
#         on_delete=models.CASCADE,
#         db_column='pricing_id'
#     )
    
#     class Meta:
#         db_table = 'ProviderService'
#         # If you have an existing table you don't want Django to manage:
#         # managed = False

#     def __str__(self):
#         return f"ProviderService {self.provider_service_id}"
from django.db import models

class Services(models.Model):
    service_id = models.AutoField(primary_key=True)
    cpt_code = models.CharField(max_length=255)
    description = models.TextField()
    name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'Services'

    def __str__(self):
        return self.name or f"Service {self.service_id}"

class Pricing(models.Model):
    pricing_id = models.AutoField(primary_key=True)
    negotiated_rate = models.FloatField()
    negotiated_type = models.CharField(max_length=255)
    billing_class = models.CharField(max_length=255, null=True, blank=True)
    expiration_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'Pricing'

    def __str__(self):
        return f"Pricing ID: {self.pricing_id} - Rate: {self.negotiated_rate}"
    
class Companies(models.Model):
    company_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    
    class Meta:
        db_table = 'Companies'
        
    def __str__(self):
        return self.name
    
class Plans(models.Model):
    plan_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    company_id = models.IntegerField()

    class Meta:
        db_table = 'Plans'

    def __str__(self):
        return f"Plan Id: {self.plan_id} - Name: {self.name}"

class Providers(models.Model):
    provider_id = models.AutoField(primary_key=True)       
    provider_group_id = models.IntegerField(unique=True)  # Added unique=True to fix foreign key issue
    name = models.CharField(max_length=255, null=True, blank=True)
    npi = models.CharField(max_length=255, null=True, blank=True)
    tin = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        db_table = 'Providers'

    def __str__(self):
        return f"{self.name or 'Unnamed Provider'} (ID: {self.provider_id})"

class ProviderDetails(models.Model):
    provider_details_id = models.AutoField(primary_key=True)
    provider_id = models.IntegerField()
    
    class Meta:
        db_table = 'ProviderDetails'
        
    def __str__(self):
        return f"Details for Provider {self.provider_id}"

# Simplified ProviderService model without ForeignKey relationships
class ProviderService(models.Model):
    provider_service_id = models.AutoField(primary_key=True)
    service_id = models.IntegerField()
    provider_id = models.IntegerField()
    pricing_id = models.IntegerField()
    plan_id = models.IntegerField(null=True)
    
    class Meta:
        db_table = 'ProviderService'

    def __str__(self):
        return f"ProviderService {self.provider_service_id}"