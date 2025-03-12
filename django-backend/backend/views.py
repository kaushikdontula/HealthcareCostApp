from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db.models import Avg, Min, Max, F, Q
from rest_framework.pagination import PageNumberPagination
from . import models
from . import serializers
from rest_framework.views import APIView

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Django is running"})

# Standard pagination class
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

# Existing API endpoints - UNCHANGED
class ServicesList(APIView):
    def get(self, request):
        services = models.Services.objects.all()
        serializer = serializers.ServicesSerializer(services, many=True)
        return Response(serializer.data)

class PricingList(APIView):
    def get(self, request):
        pricing = models.Pricing.objects.all()
        serializer = serializers.PricingSerializer(pricing, many=True)
        return Response(serializer.data)

class PlanList(APIView):
    def get(self, request):
        plans = models.Plans.objects.all()
        serializer = serializers.PlanSerializer(plans, many=True)
        return Response(serializer.data)

class ProviderList(APIView):
    def get(self, request):
        providers = models.Providers.objects.all()
        serializer = serializers.ProviderSerializer(providers, many=True)
        return Response(serializer.data)

class PriceDataView(APIView):
    """
    GET /api/pricedata/<code>:
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

# New healthcare pricing API endpoints - Simple approach
class HealthcarePricingView(APIView):
    """
    Comprehensive view for healthcare pricing data with pagination
    that builds upon your existing models and views.
    """
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        # Start with ProviderService objects
        queryset = models.ProviderService.objects.all()
        
        # Apply filters from query parameters
        cpt_code = request.query_params.get('cpt_code')
        if cpt_code:
            service_ids = models.Services.objects.filter(cpt_code=cpt_code).values_list('service_id', flat=True)
            queryset = queryset.filter(service_id__in=service_ids)
            
        service_name = request.query_params.get('service_name')
        if service_name:
            service_ids = models.Services.objects.filter(name__icontains=service_name).values_list('service_id', flat=True)
            queryset = queryset.filter(service_id__in=service_ids)
            
        provider_name = request.query_params.get('provider_name')
        if provider_name:
            provider_ids = models.Providers.objects.filter(name__icontains=provider_name).values_list('provider_group_id', flat=True)
            queryset = queryset.filter(provider_id__in=provider_ids)
            
        billing_class = request.query_params.get('billing_class')
        if billing_class:
            pricing_ids = models.Pricing.objects.filter(billing_class__icontains=billing_class).values_list('pricing_id', flat=True)
            queryset = queryset.filter(pricing_id__in=pricing_ids)
            
        min_price = request.query_params.get('min_price')
        if min_price:
            pricing_ids = models.Pricing.objects.filter(negotiated_rate__gte=float(min_price)).values_list('pricing_id', flat=True)
            queryset = queryset.filter(pricing_id__in=pricing_ids)
            
        max_price = request.query_params.get('max_price')
        if max_price:
            pricing_ids = models.Pricing.objects.filter(negotiated_rate__lte=float(max_price)).values_list('pricing_id', flat=True)
            queryset = queryset.filter(pricing_id__in=pricing_ids)
        
        # Apply pagination
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        # Process queryset into the format we need
        result = []
        for provider_service in paginated_queryset:
            # Get related objects
            try:
                service = models.Services.objects.get(service_id=provider_service.service_id)
                service_name = service.name
                service_description = service.description
                cpt_code = service.cpt_code
            except models.Services.DoesNotExist:
                service_name = "Unknown Service"
                service_description = ""
                cpt_code = "Unknown"
                
            try:
                pricing = models.Pricing.objects.get(pricing_id=provider_service.pricing_id)
                negotiated_rate = pricing.negotiated_rate
                negotiated_type = pricing.negotiated_type
                billing_class = pricing.billing_class
                expiration_date = pricing.expiration_date
            except models.Pricing.DoesNotExist:
                negotiated_rate = 0.0
                negotiated_type = "Unknown"
                billing_class = "Unknown"
                expiration_date = None
                
            try:
                provider = models.Providers.objects.get(provider_group_id=provider_service.provider_id)
                provider_id = provider.provider_id
                provider_name = provider.name
            except models.Providers.DoesNotExist:
                provider_id = None
                provider_name = "Unknown Provider"
                
            # Get plan information
            plan_info = "No Plan"
            if provider_service.plan_id:
                try:
                    plan = models.Plans.objects.get(plan_id=provider_service.plan_id)
                    plan_info = plan.name
                    
                    # Try to get company name
                    try:
                        company = models.Companies.objects.get(company_id=plan.company_id)
                        plan_info = f"{company.name} - {plan.name}"
                    except models.Companies.DoesNotExist:
                        pass
                except models.Plans.DoesNotExist:
                    pass
            
            # Create the data item
            item = {
                'provider_service_id': provider_service.provider_service_id,
                'service_id': provider_service.service_id,
                'cpt_code': cpt_code,
                'service_name': service_name,
                'service_description': service_description,
                'pricing_id': provider_service.pricing_id,
                'negotiated_rate': negotiated_rate,
                'negotiated_type': negotiated_type,
                'billing_class': billing_class,
                'expiration_date': expiration_date,
                'provider_id': provider_id,
                'provider_name': provider_name,
                'plan_info': plan_info
            }
            
            result.append(item)
        
        # Serialize the data
        serializer = serializers.HealthcarePricingSerializer(result, many=True)
        
        # Return paginated response
        return paginator.get_paginated_response(serializer.data)

class ExportHealthcarePricingView(APIView):
    """
    Export all healthcare pricing data without pagination
    """
    def get(self, request):
        # Same filtering logic as in HealthcarePricingView
        queryset = models.ProviderService.objects.all()
        
        # Apply filters from query parameters
        cpt_code = request.query_params.get('cpt_code')
        if cpt_code:
            service_ids = models.Services.objects.filter(cpt_code=cpt_code).values_list('service_id', flat=True)
            queryset = queryset.filter(service_id__in=service_ids)
            
        service_name = request.query_params.get('service_name')
        if service_name:
            service_ids = models.Services.objects.filter(name__icontains=service_name).values_list('service_id', flat=True)
            queryset = queryset.filter(service_id__in=service_ids)
            
        provider_name = request.query_params.get('provider_name')
        if provider_name:
            provider_ids = models.Providers.objects.filter(name__icontains=provider_name).values_list('provider_group_id', flat=True)
            queryset = queryset.filter(provider_id__in=provider_ids)
            
        billing_class = request.query_params.get('billing_class')
        if billing_class:
            pricing_ids = models.Pricing.objects.filter(billing_class__icontains=billing_class).values_list('pricing_id', flat=True)
            queryset = queryset.filter(pricing_id__in=pricing_ids)
            
        min_price = request.query_params.get('min_price')
        if min_price:
            pricing_ids = models.Pricing.objects.filter(negotiated_rate__gte=float(min_price)).values_list('pricing_id', flat=True)
            queryset = queryset.filter(pricing_id__in=pricing_ids)
            
        max_price = request.query_params.get('max_price')
        if max_price:
            pricing_ids = models.Pricing.objects.filter(negotiated_rate__lte=float(max_price)).values_list('pricing_id', flat=True)
            queryset = queryset.filter(pricing_id__in=pricing_ids)
        
        # Limit to 5000 records for export to prevent excessive data
        queryset = queryset[:5000]
        
        # Process queryset into the format we need
        result = []
        for provider_service in queryset:
            # Get related objects
            try:
                service = models.Services.objects.get(service_id=provider_service.service_id)
                service_name = service.name
                service_description = service.description
                cpt_code = service.cpt_code
            except models.Services.DoesNotExist:
                service_name = "Unknown Service"
                service_description = ""
                cpt_code = "Unknown"
                
            try:
                pricing = models.Pricing.objects.get(pricing_id=provider_service.pricing_id)
                negotiated_rate = pricing.negotiated_rate
                negotiated_type = pricing.negotiated_type
                billing_class = pricing.billing_class
                expiration_date = pricing.expiration_date
            except models.Pricing.DoesNotExist:
                negotiated_rate = 0.0
                negotiated_type = "Unknown"
                billing_class = "Unknown"
                expiration_date = None
                
            try:
                provider = models.Providers.objects.get(provider_group_id=provider_service.provider_id)
                provider_id = provider.provider_id
                provider_name = provider.name
            except models.Providers.DoesNotExist:
                provider_id = None
                provider_name = "Unknown Provider"
                
            # Get plan information
            plan_info = "No Plan"
            if provider_service.plan_id:
                try:
                    plan = models.Plans.objects.get(plan_id=provider_service.plan_id)
                    plan_info = plan.name
                    
                    # Try to get company name
                    try:
                        company = models.Companies.objects.get(company_id=plan.company_id)
                        plan_info = f"{company.name} - {plan.name}"
                    except models.Companies.DoesNotExist:
                        pass
                except models.Plans.DoesNotExist:
                    pass
            
            # Create the data item
            item = {
                'provider_service_id': provider_service.provider_service_id,
                'service_id': provider_service.service_id,
                'cpt_code': cpt_code,
                'service_name': service_name,
                'service_description': service_description,
                'pricing_id': provider_service.pricing_id,
                'negotiated_rate': negotiated_rate,
                'negotiated_type': negotiated_type,
                'billing_class': billing_class,
                'expiration_date': expiration_date,
                'provider_id': provider_id,
                'provider_name': provider_name,
                'plan_info': plan_info
            }
            
            result.append(item)
        
        # Serialize the data
        serializer = serializers.HealthcarePricingSerializer(result, many=True)
        
        return Response(serializer.data)