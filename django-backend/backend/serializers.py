from rest_framework import serializers
from .models import PricingRecord  # Import the model to serialize

class PricingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRecord
        fields = '__all__' 
