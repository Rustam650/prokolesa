from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from apps.core.admin_base import ModelAdmin, register
from .models import User, UserProfile, Address


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    extra = 0
    fieldsets = (
        (_('Car Information'), {
            'fields': ('car_make', 'car_model', 'car_year', 'tire_size', 'wheel_size')
        }),
        (_('Preferences'), {
            'fields': ('preferred_brands', 'price_range_min', 'price_range_max')
        }),
        (_('Social Networks'), {
            'fields': ('telegram_id', 'vk_id'),
            'classes': ('collapse',)
        }),
        (_('Settings'), {
            'fields': ('theme_preference', 'language')
        })
    )


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0
    readonly_fields = ['created_at']


@register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = [
        'email', 'username', 'full_name', 'phone', 'city', 
        'loyalty_points', 'total_spent', 'is_verified', 'is_active', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser', 'is_verified', 
        'email_notifications', 'gender', 'city', 'date_joined'
    ]
    search_fields = ['email', 'username', 'first_name', 'last_name', 'phone']
    ordering = ['-date_joined']
    list_editable = ['is_active', 'is_verified']
    date_hierarchy = 'date_joined'
    
    fieldsets = (
        (_('Authentication'), {
            'fields': ('email', 'username', 'password')
        }),
        (_('Personal Info'), {
            'fields': ('first_name', 'last_name', 'phone', 'birth_date', 'gender', 'avatar')
        }),
        (_('Address'), {
            'fields': ('city', 'address', 'postal_code')
        }),
        (_('Notifications'), {
            'fields': ('email_notifications', 'sms_notifications', 'push_notifications')
        }),
        (_('Loyalty System'), {
            'fields': ('loyalty_points', 'total_spent'),
            'classes': ('collapse',)
        }),
        (_('Verification'), {
            'fields': ('is_verified', 'verification_token'),
            'classes': ('collapse',)
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined', 'last_activity'),
            'classes': ('collapse',)
        })
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    
    inlines = [UserProfileInline, AddressInline]
    
    def full_name(self, obj):
        return obj.full_name or '-'
    full_name.short_description = _('Full Name')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile')


@register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = [
        'user', 'car_make', 'car_model', 'car_year', 
        'theme_preference', 'language', 'created_at'
    ]
    list_filter = [
        'car_make', 'theme_preference', 'language', 'created_at'
    ]
    search_fields = [
        'user__email', 'user__username', 'car_make', 'car_model'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        (_('User'), {
            'fields': ('user',)
        }),
        (_('Car Information'), {
            'fields': ('car_make', 'car_model', 'car_year', 'tire_size', 'wheel_size')
        }),
        (_('Preferences'), {
            'fields': ('preferred_brands', 'price_range_min', 'price_range_max')
        }),
        (_('Social Networks'), {
            'fields': ('telegram_id', 'vk_id'),
            'classes': ('collapse',)
        }),
        (_('Settings'), {
            'fields': ('theme_preference', 'language')
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@register(Address)
class AddressAdmin(ModelAdmin):
    list_display = ['user', 'type', 'city', 'address', 'postal_code', 'is_default', 'created_at']
    list_filter = ['type', 'city', 'is_default', 'created_at']
    search_fields = ['user__email', 'user__username', 'city', 'address']
    ordering = ['-created_at']
    
    fieldsets = (
        (_('User'), {
            'fields': ('user',)
        }),
        (_('Address Information'), {
            'fields': ('type', 'city', 'address', 'postal_code', 'apartment', 'entrance', 'floor', 'intercom')
        }),
        (_('Additional'), {
            'fields': ('is_default', 'notes')
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user') 