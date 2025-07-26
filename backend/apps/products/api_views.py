from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, F, Case, When, IntegerField
from django.shortcuts import get_object_or_404
from .models import Category, Brand, TireProduct, WheelProduct
from .serializers import (
    CategorySerializer, BrandSerializer, 
    TireProductSerializer, WheelProductSerializer
)


class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductListAPIView(generics.ListAPIView):
    """Унифицированный API для получения списка товаров"""
    pagination_class = ProductPagination
    
    def list(self, request, *args, **kwargs):
        """Переопределяем list чтобы добавить product_type в каждый товар"""
        response = super().list(request, *args, **kwargs)
        product_type = request.query_params.get('product_type', 'tire')
        
        # Добавляем product_type в каждый товар
        if 'results' in response.data:
            for item in response.data['results']:
                item['product_type'] = product_type
        
        return response
    
    def get_queryset(self):
        product_type = self.request.query_params.get('product_type', 'tire')
        
        if product_type == 'wheel':
            queryset = WheelProduct.objects.filter(is_active=True).select_related('brand', 'category')
        else:
            queryset = TireProduct.objects.filter(is_active=True).select_related('brand', 'category')
        
        # Применяем фильтры
        queryset = self.apply_filters(queryset, product_type)
        
        # Применяем сортировку
        ordering = self.request.query_params.get('ordering', '-sales_count')
        if ordering:
            queryset = queryset.order_by(ordering)
        
        return queryset
    
    def get_serializer_class(self):
        product_type = self.request.query_params.get('product_type', 'tire')
        if product_type == 'wheel':
            return WheelProductSerializer
        return TireProductSerializer
    
    def apply_filters(self, queryset, product_type):
        # Поиск по тексту
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(brand__name__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Фильтр по бренду
        brand = self.request.query_params.get('brand')
        if brand:
            if ',' in brand:
                brand_slugs = brand.split(',')
                queryset = queryset.filter(brand__slug__in=brand_slugs)
            else:
                queryset = queryset.filter(brand__slug=brand)
        
        # Фильтр по цене
        min_price = self.request.query_params.get('min_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        
        max_price = self.request.query_params.get('max_price')
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Фильтр по наличию
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # Специфичные фильтры для шин
        if product_type == 'tire':
            season = self.request.query_params.get('season')
            if season:
                queryset = queryset.filter(season=season)
            
            tire_width = self.request.query_params.get('tire_width')
            if tire_width:
                queryset = queryset.filter(width=tire_width)
            
            tire_profile = self.request.query_params.get('tire_profile')
            if tire_profile:
                queryset = queryset.filter(profile=tire_profile)
            
            tire_diameter = self.request.query_params.get('tire_diameter')
            if tire_diameter:
                queryset = queryset.filter(diameter=tire_diameter)
        
        # Специфичные фильтры для дисков
        elif product_type == 'wheel':
            wheel_width = self.request.query_params.get('wheel_width')
            if wheel_width:
                queryset = queryset.filter(width=wheel_width)
            
            wheel_diameter = self.request.query_params.get('wheel_diameter')
            if wheel_diameter:
                queryset = queryset.filter(diameter=wheel_diameter)
            
            pcd = self.request.query_params.get('pcd')
            if pcd:
                queryset = queryset.filter(bolt_pattern=pcd)
            
            wheel_type = self.request.query_params.get('wheel_type')
            if wheel_type:
                queryset = queryset.filter(wheel_type=wheel_type)
            
            et_from = self.request.query_params.get('et_from')
            if et_from:
                queryset = queryset.filter(offset__gte=et_from)
            
            et_to = self.request.query_params.get('et_to')
            if et_to:
                queryset = queryset.filter(offset__lte=et_to)
        
        return queryset


class ProductDetailAPIView(generics.RetrieveAPIView):
    """API для получения детальной информации о товаре"""
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Пытаемся найти товар в обеих моделях
        return None
    
    def get_object(self):
        slug = self.kwargs.get('slug')
        
        # Сначала ищем в шинах
        try:
            return TireProduct.objects.select_related('brand', 'category').get(slug=slug, is_active=True)
        except TireProduct.DoesNotExist:
            pass
        
        # Затем в дисках
        try:
            return WheelProduct.objects.select_related('brand', 'category').get(slug=slug, is_active=True)
        except WheelProduct.DoesNotExist:
            pass
        
        # Если не найден нигде
        from django.http import Http404
        raise Http404("Product not found")
    
    def get_serializer_class(self):
        obj = self.get_object()
        if isinstance(obj, WheelProduct):
            return WheelProductSerializer
        return TireProductSerializer


class ProductByIdAPIView(generics.RetrieveAPIView):
    """API для получения товара по ID"""
    
    def get_object(self):
        product_id = self.kwargs.get('pk')
        product_type = self.request.query_params.get('product_type')
        
        # Если указан тип товара, ищем только в соответствующей таблице
        if product_type == 'wheel':
            try:
                return WheelProduct.objects.select_related('brand', 'category').get(id=product_id, is_active=True)
            except WheelProduct.DoesNotExist:
                from django.http import Http404
                raise Http404("Wheel not found")
        elif product_type == 'tire':
            try:
                return TireProduct.objects.select_related('brand', 'category').get(id=product_id, is_active=True)
            except TireProduct.DoesNotExist:
                from django.http import Http404
                raise Http404("Tire not found")
        
        # Если тип не указан, ищем сначала в шинах, потом в дисках (для обратной совместимости)
        try:
            return TireProduct.objects.select_related('brand', 'category').get(id=product_id, is_active=True)
        except TireProduct.DoesNotExist:
            pass
        
        try:
            return WheelProduct.objects.select_related('brand', 'category').get(id=product_id, is_active=True)
        except WheelProduct.DoesNotExist:
            pass
        
        # Если не найден нигде
        from django.http import Http404
        raise Http404("Product not found")
    
    def get_serializer_class(self):
        obj = self.get_object()
        if isinstance(obj, WheelProduct):
            return WheelProductSerializer
        return TireProductSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Переопределяем retrieve чтобы добавить product_type"""
        response = super().retrieve(request, *args, **kwargs)
        obj = self.get_object()
        
        # Определяем тип товара
        if isinstance(obj, WheelProduct):
            response.data['product_type'] = 'wheel'
        else:
            response.data['product_type'] = 'tire'
        
        return response


@api_view(['GET'])
def featured_products(request):
    """API для получения рекомендуемых товаров"""
    tire_products = TireProduct.objects.filter(
        is_active=True, 
        is_featured=True
    ).select_related('brand', 'category')[:10]
    
    wheel_products = WheelProduct.objects.filter(
        is_active=True, 
        is_featured=True
    ).select_related('brand', 'category')[:10]
    
    tire_data = TireProductSerializer(tire_products, many=True).data
    wheel_data = WheelProductSerializer(wheel_products, many=True).data
    
    # Добавляем product_type к каждому товару
    for item in tire_data:
        item['product_type'] = 'tire'
    for item in wheel_data:
        item['product_type'] = 'wheel'
    
    # Объединяем и перемешиваем результаты
    import random
    all_products = tire_data + wheel_data
    random.shuffle(all_products)
    
    return Response({
        'count': len(all_products),
        'results': all_products[:20]
    })


@api_view(['GET'])
def bestseller_products(request):
    """API для получения хитов продаж"""
    tire_products = TireProduct.objects.filter(
        is_active=True
    ).select_related('brand', 'category').order_by('-sales_count')[:10]
    
    wheel_products = WheelProduct.objects.filter(
        is_active=True
    ).select_related('brand', 'category').order_by('-sales_count')[:10]
    
    tire_data = TireProductSerializer(tire_products, many=True).data
    wheel_data = WheelProductSerializer(wheel_products, many=True).data
    
    # Добавляем product_type к каждому товару
    for item in tire_data:
        item['product_type'] = 'tire'
    for item in wheel_data:
        item['product_type'] = 'wheel'
    
    # Объединяем и сортируем по продажам
    all_products = tire_data + wheel_data
    all_products.sort(key=lambda x: x.get('sales_count', 0), reverse=True)
    
    return Response({
        'count': len(all_products),
        'results': all_products[:20]
    })


@api_view(['GET'])
def new_products(request):
    """API для получения новых товаров"""
    tire_products = TireProduct.objects.filter(
        is_active=True,
        is_new=True
    ).select_related('brand', 'category').order_by('-created_at')[:10]
    
    wheel_products = WheelProduct.objects.filter(
        is_active=True,
        is_new=True
    ).select_related('brand', 'category').order_by('-created_at')[:10]
    
    tire_data = TireProductSerializer(tire_products, many=True).data
    wheel_data = WheelProductSerializer(wheel_products, many=True).data
    
    # Добавляем product_type к каждому товару
    for item in tire_data:
        item['product_type'] = 'tire'
    for item in wheel_data:
        item['product_type'] = 'wheel'
    
    # Объединяем и сортируем по дате создания
    all_products = tire_data + wheel_data
    all_products.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    return Response({
        'count': len(all_products),
        'results': all_products[:20]
    })


@api_view(['POST'])
def smart_search(request):
    """Умный поиск товаров"""
    data = request.data
    search_type = data.get('search_type', 'params')
    product_type = data.get('product_type', 'tire')
    
    if product_type == 'wheel':
        queryset = WheelProduct.objects.filter(is_active=True).select_related('brand', 'category')
        serializer_class = WheelProductSerializer
    else:
        queryset = TireProduct.objects.filter(is_active=True).select_related('brand', 'category')
        serializer_class = TireProductSerializer
    
    # Применяем фильтры на основе параметров поиска
    if search_type == 'params':
        if product_type == 'tire':
            width = data.get('width')
            if width:
                queryset = queryset.filter(width=width)
            
            profile = data.get('profile')
            if profile:
                queryset = queryset.filter(profile=profile)
            
            diameter = data.get('diameter')
            if diameter:
                queryset = queryset.filter(diameter=diameter)
            
            season = data.get('season')
            if season:
                queryset = queryset.filter(season=season)
    
    # Ограничиваем количество результатов
    results = queryset[:50]
    serialized_data = serializer_class(results, many=True).data
    
    return Response({
        'count': len(serialized_data),
        'results': serialized_data,
        'search_params': data,
        'message': f'Найдено {len(serialized_data)} товаров'
    }) 