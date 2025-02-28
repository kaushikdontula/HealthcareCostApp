from rest_framework import serializers
from . import models

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Services
        fields = ['service_id', 'cpt_code', 'description', 'name']

class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pricing
        fields = ['pricing_id', 'negotiated_rate', 'negotiated_type', 'billing_class', 'expiration_date']

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Plans
        fields = ['plan_id','company_id','name' ]

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Providers
        fields = ['provider_id','provider_group_id','name','npi','tin']