from rest_framework import serializers
from .models import Category, Brand, TireProduct, WheelProduct, ProductImage
from django.contrib.contenttypes.models import ContentType


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор для категорий"""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'icon', 'parent']


class BrandSerializer(serializers.ModelSerializer):
    """Сериализатор для брендов"""
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'website', 'product_types', 
                 'rating', 'popularity_score', 'country', 'is_active', 'is_featured']


class ProductImageSerializer(serializers.ModelSerializer):
    """Сериализатор для изображений товаров"""
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'title', 'is_main', 'sort_order']
    
    def get_image(self, obj):
        """Возвращает полный URL изображения"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Если контекста нет, возвращаем полный URL с хостом по умолчанию
            from django.conf import settings
            if hasattr(settings, 'SITE_URL'):
                return f"{settings.SITE_URL}{obj.image.url}"
            return f"https://prokolesa.pro{obj.image.url}"
        return None


class TireProductSerializer(serializers.ModelSerializer):
    """Сериализатор для шин"""
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    is_in_stock = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()
    images = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    euLabel = serializers.SerializerMethodField()
    
    class Meta:
        model = TireProduct
        fields = '__all__'
    
    def get_images(self, obj):
        """Получение всех изображений товара с приоритетом реальных изображений"""
        content_type = ContentType.objects.get_for_model(obj)
        images = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id
        ).order_by('sort_order', 'created_at')
        
        # Сортируем: сначала реальные изображения (не SVG), потом SVG
        real_images = []
        svg_images = []
        
        for image in images:
            if image.image.name.endswith('.svg'):
                svg_images.append(image)
            else:
                real_images.append(image)
        
        # Объединяем: сначала реальные, потом SVG
        sorted_images = real_images + svg_images
        
        return ProductImageSerializer(sorted_images, many=True).data
    
    def get_main_image(self, obj):
        """Получение основного изображения с приоритетом реальных изображений"""
        content_type = ContentType.objects.get_for_model(obj)
        
        # Сначала ищем основное изображение среди реальных (не SVG)
        main_real_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            is_main=True
        ).exclude(image__iendswith='.svg').first()
        
        if main_real_image:
            return ProductImageSerializer(main_real_image).data
        
        # Если основного реального нет, ищем любое реальное изображение
        any_real_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id
        ).exclude(image__iendswith='.svg').order_by('sort_order', 'created_at').first()
        
        if any_real_image:
            return ProductImageSerializer(any_real_image).data
        
        # Если реальных нет, берем основное SVG
        main_svg_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            is_main=True
        ).filter(image__iendswith='.svg').first()
        
        if main_svg_image:
            return ProductImageSerializer(main_svg_image).data
        
        # Если и основного SVG нет, берем первое SVG по порядку
        first_svg_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id
        ).filter(image__iendswith='.svg').order_by('sort_order', 'created_at').first()
        
        if first_svg_image:
            return ProductImageSerializer(first_svg_image).data
        
        return None
    
    def get_euLabel(self, obj):
        """Получение данных EU-этикетки"""
        if obj.fuel_efficiency and obj.wet_grip and obj.noise_level:
            return {
                'fuelEfficiency': obj.fuel_efficiency,
                'wetGrip': obj.wet_grip,
                'noiseLevel': obj.noise_level
            }
        return None


class WheelProductSerializer(serializers.ModelSerializer):
    """Сериализатор для дисков"""
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    is_in_stock = serializers.ReadOnlyField()
    final_price = serializers.ReadOnlyField()
    images = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    
    class Meta:
        model = WheelProduct
        fields = '__all__'
    
    def get_images(self, obj):
        """Получение всех изображений товара с приоритетом реальных изображений"""
        content_type = ContentType.objects.get_for_model(obj)
        images = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id
        ).order_by('sort_order', 'created_at')
        
        # Сортируем: сначала реальные изображения (не SVG), потом SVG
        real_images = []
        svg_images = []
        
        for image in images:
            if image.image.name.endswith('.svg'):
                svg_images.append(image)
            else:
                real_images.append(image)
        
        # Объединяем: сначала реальные, потом SVG
        sorted_images = real_images + svg_images
        
        return ProductImageSerializer(sorted_images, many=True).data
    
    def get_main_image(self, obj):
        """Получение основного изображения с приоритетом реальных изображений"""
        content_type = ContentType.objects.get_for_model(obj)
        
        # Сначала ищем основное изображение среди реальных (не SVG)
        main_real_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            is_main=True
        ).exclude(image__iendswith='.svg').first()
        
        if main_real_image:
            return ProductImageSerializer(main_real_image).data
        
        # Если основного реального нет, ищем любое реальное изображение
        any_real_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id
        ).exclude(image__iendswith='.svg').order_by('sort_order', 'created_at').first()
        
        if any_real_image:
            return ProductImageSerializer(any_real_image).data
        
        # Если реальных нет, берем основное SVG
        main_svg_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id,
            is_main=True
        ).filter(image__iendswith='.svg').first()
        
        if main_svg_image:
            return ProductImageSerializer(main_svg_image).data
        
        # Если и основного SVG нет, берем первое SVG по порядку
        first_svg_image = ProductImage.objects.filter(
            content_type=content_type,
            object_id=obj.id
        ).filter(image__iendswith='.svg').order_by('sort_order', 'created_at').first()
        
        if first_svg_image:
            return ProductImageSerializer(first_svg_image).data
        
        return None
