from django.urls import path
from .views import PricingRecordListView

urlpatterns = [
    path('pricing-records/', PricingRecordListView.as_view(), name='pricing-record-list'),
]
