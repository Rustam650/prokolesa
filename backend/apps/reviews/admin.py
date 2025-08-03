from django.contrib import admin
from apps.core.admin_base import ModelAdmin, register
from .models import Review

@register(Review)
class ReviewAdmin(ModelAdmin):
    list_display = ['user', 'product', 'rating', 'status', 'created_at']
    list_filter = ['status', 'rating', 'created_at']
    search_fields = ['title', 'text', 'user__username']
    ordering = ['-created_at']
