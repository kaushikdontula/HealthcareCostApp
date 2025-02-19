"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
from chatbot.views import ChatbotView

urlpatterns = [
    path('admin/', admin.site.urls),
    ## Health Check ##
    path('api/healthcheck/', views.health_check, name='health-check'),

    ## Tables ##
    path('api/services/', views.ServicesList.as_view(), name='get_services'),
    path('api/pricing/', views.PricingList.as_view(), name='get_pricing'),
    path('api/plans/', views.PlanList.as_view(), name='get_plan'),
    path('api/providers/', views.ProviderList.as_view(), name='get_plan'),

    ## Pricing data for a single CPT code ##
    path('api/pricedata/<int:code>/', views.PriceDataView.as_view(), name='pricedata'),

    ## Chatbot ##
    path('api/chat/', ChatbotView.as_view(), name='chatbot'),
]
