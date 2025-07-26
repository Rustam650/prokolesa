from rest_framework import generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q, Min, Max, F
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.middleware.csrf import get_token
import os
from .models import Category, Brand, TireProduct, WheelProduct
from .serializers import (
    CategorySerializer, BrandSerializer, 
    TireProductSerializer, WheelProductSerializer
)


class CategoryListView(generics.ListAPIView):
    """API для получения списка категорий"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        parent_id = self.request.query_params.get('parent')
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        elif parent_id == '0':
            queryset = queryset.filter(parent__isnull=True)
        return queryset.order_by('sort_order', 'name')


class BrandListView(generics.ListAPIView):
    """API для получения списка брендов"""
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по типу товаров
        product_type = self.request.query_params.get('product_type')
        if product_type:
            if product_type in ['tire', 'wheel']:
                queryset = queryset.filter(
                    Q(product_types=product_type) | Q(product_types='both')
                )
        
        # Фильтр по популярности
        featured_only = self.request.query_params.get('featured_only')
        if featured_only == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset.order_by('-popularity_score', 'name')


class TireProductListView(generics.ListAPIView):
    """API для получения списка шин"""
    queryset = TireProduct.objects.filter(is_active=True).select_related('brand', 'category')
    serializer_class = TireProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по бренду
        brand_id = self.request.query_params.get('brand')
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        
        # Фильтр по категории
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Фильтр по сезону
        season = self.request.query_params.get('season')
        if season:
            queryset = queryset.filter(season=season)
        
        # Фильтр по размерам
        width = self.request.query_params.get('width')
        if width:
            queryset = queryset.filter(width=width)
            
        profile = self.request.query_params.get('profile')
        if profile:
            queryset = queryset.filter(profile=profile)
            
        diameter = self.request.query_params.get('diameter')
        if diameter:
            queryset = queryset.filter(diameter=diameter)
        
        return queryset.order_by('-created_at')


class WheelProductListView(generics.ListAPIView):
    """API для получения списка дисков"""
    queryset = WheelProduct.objects.filter(is_active=True).select_related('brand', 'category')
    serializer_class = WheelProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Фильтр по бренду
        brand_id = self.request.query_params.get('brand')
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        
        # Фильтр по категории
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Фильтр по типу диска
        wheel_type = self.request.query_params.get('wheel_type')
        if wheel_type:
            queryset = queryset.filter(wheel_type=wheel_type)
        
        # Фильтр по размерам
        diameter = self.request.query_params.get('diameter')
        if diameter:
            queryset = queryset.filter(diameter=diameter)
            
        width = self.request.query_params.get('width')
        if width:
            queryset = queryset.filter(width=width)
        
        return queryset.order_by('-created_at')


@api_view(['GET'])
def search_products(request):
    """Поиск по товарам"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})
    
    # Поиск в шинах
    tire_results = TireProduct.objects.filter(
        Q(name__icontains=query) | 
        Q(brand__name__icontains=query) |
        Q(description__icontains=query),
        is_active=True
    ).select_related('brand', 'category')[:10]
    
    # Поиск в дисках
    wheel_results = WheelProduct.objects.filter(
        Q(name__icontains=query) | 
        Q(brand__name__icontains=query) |
        Q(description__icontains=query),
        is_active=True
    ).select_related('brand', 'category')[:10]
    
    # Сериализация результатов
    tire_data = TireProductSerializer(tire_results, many=True).data
    wheel_data = WheelProductSerializer(wheel_results, many=True).data
    
    return Response({
        'results': {
            'tires': tire_data,
            'wheels': wheel_data
        }
    })


def test_api_view(request):
    """Простое представление для тестирования API"""
    html_file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'test_api.html')
    try:
        with open(html_file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
        return HttpResponse(html_content, content_type='text/html')
    except FileNotFoundError:
        return HttpResponse("<h1>Test API file not found</h1>", content_type='text/html')


