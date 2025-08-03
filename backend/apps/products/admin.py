from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.admin import GenericTabularInline
from apps.core.admin_base import ModelAdmin, register
from .models import Category, Brand, TireProduct, WheelProduct, ProductImage


class ProductImageInline(GenericTabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_main', 'sort_order']
    readonly_fields = []


@register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ['name', 'parent', 'is_active', 'sort_order']
    list_filter = ['is_active', 'parent']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_active', 'sort_order']
    ordering = ['sort_order', 'name']


@register(Brand)
class BrandAdmin(ModelAdmin):
    list_display = ['name', 'product_types', 'country', 'rating', 'popularity_score', 'is_active', 'is_featured']
    list_filter = ['is_active', 'is_featured', 'product_types', 'country']
    search_fields = ['name', 'description', 'country']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['is_featured', 'is_active', 'rating', 'popularity_score']
    ordering = ['-popularity_score', 'name']


@register(TireProduct)
class TireProductAdmin(ModelAdmin):
    list_display = ['name', 'brand', 'tire_size_display', 'season', 'price', 'stock_quantity', 'is_active']
    list_filter = ['season', 'is_active', 'is_featured', 'brand', 'category']
    search_fields = ['name', 'sku', 'brand__name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'is_active']
    ordering = ['-created_at']
    inlines = [ProductImageInline]
    
    def tire_size_display(self, obj):
        return f"{obj.width}/{obj.profile}R{obj.diameter}"
    tire_size_display.short_description = _('Size')
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'slug', 'sku', 'brand', 'category', 'season')
        }),
        (_('Description'), {
            'fields': ('short_description', 'description'),
            'classes': ('collapse',)
        }),
        (_('Dimensions'), {
            'fields': ('width', 'profile', 'diameter', 'load_index', 'speed_index')
        }),
        (_('Characteristics'), {
            'fields': ('tread_pattern', 'sidewall_type', 'run_flat', 'reinforced', 'studded')
        }),
        (_('EU Label'), {
            'fields': ('fuel_efficiency', 'wet_grip', 'noise_level'),
            'classes': ('collapse',)
        }),
        (_('Prices and Stock'), {
            'fields': ('price', 'old_price', 'discount_percent', 'stock_quantity')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_featured', 'is_bestseller', 'is_new', 'is_on_sale')
        }),
        (_('SEO'), {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )


@register(WheelProduct)
class WheelProductAdmin(ModelAdmin):
    list_display = ['name', 'brand', 'wheel_size_display', 'wheel_type', 'price', 'stock_quantity', 'is_active']
    list_filter = ['wheel_type', 'is_active', 'is_featured', 'brand', 'category']
    search_fields = ['name', 'sku', 'brand__name']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'is_active']
    ordering = ['-created_at']
    inlines = [ProductImageInline]
    
    def wheel_size_display(self, obj):
        return f"{obj.diameter}x{obj.width}"
    wheel_size_display.short_description = _('Size')
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'slug', 'sku', 'brand', 'category')
        }),
        (_('Description'), {
            'fields': ('short_description', 'description'),
            'classes': ('collapse',)
        }),
        (_('Dimensions and Parameters'), {
            'fields': ('diameter', 'width', 'bolt_pattern', 'center_bore', 'offset')
        }),
        (_('Type and Material'), {
            'fields': ('wheel_type', 'material', 'color', 'finish')
        }),
        (_('Prices and Stock'), {
            'fields': ('price', 'old_price', 'discount_percent', 'stock_quantity')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_featured', 'is_bestseller', 'is_new', 'is_on_sale')
        }),
        (_('SEO'), {
            'fields': ('meta_title', 'meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
    )


@register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = ['content_object', 'image_preview', 'is_main', 'sort_order']
    list_filter = ['is_main', 'content_type']
    ordering = ['content_type', 'object_id', 'sort_order']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.image.url)
        return "Нет изображения"
    image_preview.short_description = _('Preview')
