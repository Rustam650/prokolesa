from django.urls import path
from . import api_views

app_name = 'orders'

urlpatterns = [
    path('api/orders/create/', api_views.create_order, name='create_order'),
    path('api/orders/', api_views.OrderListView.as_view(), name='order_list'),
    path('api/orders/<str:order_number>/', api_views.OrderDetailView.as_view(), name='order_detail'),
] 