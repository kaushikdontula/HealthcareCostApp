from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Services
from .serializers import ServicesSerializer
from rest_framework.views import APIView

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Django is running"})

# Endpoint for fetching Services
class ServicesList(APIView):  # Inherit from APIView
    def get(self, request):  # Make sure to pass 'request' as the argument
        services = Services.objects.all()  # Query all services from the database
        serializer = ServicesSerializer(services, many=True)  # Serialize the data
        return Response(serializer.data)  # Return the data in the response
