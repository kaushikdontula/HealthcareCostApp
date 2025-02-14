from django.db import models

class Services(models.Model):
    # these attributes match the name and types from the Service table in the DB
    service_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=255, null=True, blank=True)

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
    price = models.FloatField()
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
