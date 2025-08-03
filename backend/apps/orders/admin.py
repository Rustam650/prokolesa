from django.contrib import admin
from apps.core.admin_base import ModelAdmin, register
from .models import Order, OrderItem

@register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_phone', 'status', 'payment_status', 'delivery_method', 'total_amount', 'created_at']
    list_filter = ['status', 'payment_status', 'delivery_method', 'payment_method', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_phone', 'customer_email']
    ordering = ['-created_at']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('order_number', 'status', 'payment_status')
        }),
        ('Данные клиента', {
            'fields': ('customer_name', 'customer_phone', 'customer_email', 'needs_call')
        }),
        ('Доставка и оплата', {
            'fields': ('delivery_method', 'payment_method', 'delivery_address')
        }),
        ('Суммы', {
            'fields': ('subtotal', 'shipping_cost', 'tax_amount', 'total_amount')
        }),
        ('Дополнительно', {
            'fields': ('notes', 'shipping_address', 'created_at', 'updated_at')
        }),
    )

@register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['order__order_number', 'product_name']
    ordering = ['-order__created_at']
