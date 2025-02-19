from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Avg, Min, Max
from . import models
from . import serializers
from rest_framework.views import APIView

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Django is running"})

# Endpoint for fetching Services
class ServicesList(APIView):  # Inherit from APIView
    def get(self, request):  # Make sure to pass 'request' as the argument
        services = models.Services.objects.all()  # Query all services from the database
        serializer = serializers.ServicesSerializer(services, many=True)  # Serialize the data
        return Response(serializer.data)  # Return the data in the response

class PricingList(APIView):  
    def get(self, request):  
        pricing = models.Pricing.objects.all()  # Query all pricing data from the database
        serializer = serializers.PricingSerializer(pricing, many=True)  # Serialize the data
        return Response(serializer.data)  # Return the serialized data as a response

class PlanList(APIView):  
    def get(self, request):  
        plans = models.Plans.objects.all()  # Query all pricing data from the database
        serializer = serializers.PlanSerializer(plans, many=True)  # Serialize the data
        return Response(serializer.data)  # Return the serialized data as a response

class ProviderList(APIView):  
    def get(self, request):  
        providers = models.Providers.objects.all()  # Query all pricing data from the database
        serializer = serializers.ProviderSerializer(providers, many=True)  # Serialize the data
        return Response(serializer.data)  # Return the serialized data as a response

class PriceDataView(APIView):
    """
    GET /api/v1/pricedata/<code>:
      - Returns pricing info for a single CPT code, including
        min, max, mean, median, and an array of detailed prices.
      - Ignores provider and plan data entirely.
    """

    def get(self, request, code):
        # Validate code
        if not code:
            return Response({"detail": "Missing code"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Find all Services with this CPT code
        services_qs = models.Services.objects.filter(cpt_code=code)
        if not services_qs.exists():
            return Response({"detail": f"CPT code {code} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        # Gather all ProviderService rows for those service IDs
        service_ids = services_qs.values_list('service_id', flat=True)
        ps_qs = models.ProviderService.objects.filter(service__in=service_ids)
        if not ps_qs.exists():
            return Response({"detail": f"No pricing found for CPT code {code}"},
                            status=status.HTTP_404_NOT_FOUND)

        # From ProviderService, gather Pricing objects
        pricing_ids = ps_qs.values_list('pricing__pricing_id', flat=True)
        pricing_qs = models.Pricing.objects.filter(pricing_id__in=pricing_ids)
        if not pricing_qs.exists():
            return Response({"detail": f"No pricing entries found for CPT code {code}"},
                            status=status.HTTP_404_NOT_FOUND)

        # Compute stats: min, max, mean
        stats = pricing_qs.aggregate(
            min_price=Min('negotiated_rate'),
            max_price=Max('negotiated_rate'),
            avg_price=Avg('negotiated_rate'),
        )

        # Median
        rates = sorted(pricing_qs.values_list('negotiated_rate', flat=True))
        n = len(rates)
        if n == 0:
            median_val = 0
        elif n % 2 == 1:
            median_val = rates[n // 2]
        else:
            median_val = (rates[n // 2 - 1] + rates[n // 2]) / 2

        # Construct final JSON
        response_data = {
            "cpt_code": code,
            "mean_price": round(stats['avg_price'] or 0, 2),
            "median_price": round(median_val, 2),
            "min_price": stats['min_price'] or 0,
            "max_price": stats['max_price'] or 0,
        }

        return Response(response_data, status=status.HTTP_200_OK)
