from rest_framework import serializers
from .models import PricingRecord  # Import the model you want to serialize

class PricingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRecord
        fields = '__all__'  # You can list specific fields if needed
