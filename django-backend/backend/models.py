from django.db import models

class Services(models.Model):
    # these attributes match the name and types from the Service table in the DB
    service_id = models.AutoField(primary_key=True)
    cpt_code = models.CharField(max_length=255)
    description = models.TextField()
    name = models.CharField(max_length=255, null=True, blank=True)

    # query the Services table
    class Meta:
        db_table = 'Services'

    def __str__(self):
        return self.name

class Pricing(models.Model):
    pricing_id = models.AutoField(primary_key=True)
    negotiated_rate = models.FloatField()
    negotiated_type = models.CharField(max_length=255)
    billing_class = models.CharField(max_length=255, null=True, blank=True)
    # price = models.FloatField()
    expiration_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'Pricing'

    def __str__(self):
        return f"Pricing ID: {self.pricing_id} - Price: {self.price}"
    
class Plans(models.Model):
    plan_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    company_id = models.IntegerField()

    class Meta:
        db_table = 'Plans'

    def __str__(self):
        return f"Plan Id: {self.plan_id} - Name: {self.name}"

class Providers(models.Model):
    provider_id = models.AutoField(primary_key=True)       # maps to provider_id
    provider_group_id = models.IntegerField(unique=True)              # references: ProviderService.provider_id 
    name = models.CharField(max_length=255, null=True, blank=True)
    npi = models.CharField(max_length=255, null=True, blank=True)
    tin = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        db_table = 'Providers'

    def __str__(self):
        return f"{self.name or 'Unnamed Provider'} (group {self.provider_group_id})"

class ProviderService(models.Model):
    provider_service_id = models.AutoField(primary_key=True)

    # Link to Services via service_id
    service = models.ForeignKey(
        Services,
        on_delete=models.CASCADE,
        db_column='service_id'
    )
    
    # Link to Pricing
    pricing = models.ForeignKey(
        Pricing,
        on_delete=models.CASCADE,
        db_column='pricing_id'
    )
    
    class Meta:
        db_table = 'ProviderService'
        # If you have an existing table you don't want Django to manage:
        # managed = False

    def __str__(self):
        return f"ProviderService {self.provider_service_id}"
