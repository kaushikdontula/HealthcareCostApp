from rest_framework import serializers
from . import models

# Existing serializers - UNCHANGED
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
        fields = ['plan_id', 'company_id', 'name']

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Providers
        fields = ['provider_id', 'provider_group_id', 'name', 'npi', 'tin']

# New serializer for the comprehensive healthcare pricing data
class HealthcarePricingSerializer(serializers.Serializer):
    """
    A custom serializer for the comprehensive healthcare pricing data
    that includes information from multiple models.
    """
    provider_service_id = serializers.IntegerField()
    service_id = serializers.IntegerField()
    cpt_code = serializers.CharField()
    service_name = serializers.CharField()
    service_description = serializers.CharField(allow_blank=True)
    pricing_id = serializers.IntegerField()
    negotiated_rate = serializers.FloatField()
    negotiated_type = serializers.CharField()
    billing_class = serializers.CharField(allow_blank=True, allow_null=True)
    expiration_date = serializers.DateField(allow_null=True)
    provider_id = serializers.IntegerField(allow_null=True)
    provider_name = serializers.CharField()
    plan_info = serializers.CharField()