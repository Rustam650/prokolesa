from django.contrib import admin
from apps.core.admin_base import ModelAdmin, register
from .models import Cart, CartItem

@register(Cart)
class CartAdmin(ModelAdmin):
    list_display = ['user', 'session_key', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    ordering = ['-created_at']

@register(CartItem)
class CartItemAdmin(ModelAdmin):
    list_display = ['cart', 'product_name', 'quantity', 'added_at']
    list_filter = ['added_at']
    search_fields = ['cart__user__username', 'product_name']
    ordering = ['-added_at']
