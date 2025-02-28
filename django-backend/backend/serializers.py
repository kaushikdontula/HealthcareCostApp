from rest_framework import serializers
from .models import Services
from .models import Pricing
from .models import Plans

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['service_id', 'cpt_code', 'description', 'name']

class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricing
        fields = ['pricing_id', 'negotiated_rate', 'negotiated_type', 'billing_class', 'expiration_date']

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plans
        fields = ['plan_id','company_id','name' ]