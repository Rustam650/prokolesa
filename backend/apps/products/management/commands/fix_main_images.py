from django.core.management.base import BaseCommand
from apps.products.models import TireProduct, WheelProduct, ProductImage
from django.contrib.contenttypes.models import ContentType


class Command(BaseCommand):
    help = 'Fix main images priority: set real images as main instead of SVG'

    def handle(self, *args, **options):
        self.stdout.write('Исправление приоритета основных изображений...')
        
        fixed_count = 0
        
        # Обрабатываем шины
        tires = TireProduct.objects.filter(is_active=True)
        for tire in tires:
            if self.fix_main_image_for_product(tire):
                fixed_count += 1
        
        # Обрабатываем диски
        wheels = WheelProduct.objects.filter(is_active=True)
        for wheel in wheels:
            if self.fix_main_image_for_product(wheel):
                fixed_count += 1
        
        self.stdout.write(f'Исправлено товаров: {fixed_count}')
        self.stdout.write(self.style.SUCCESS('Готово!'))

    def fix_main_image_for_product(self, product):
        """Исправляет основное изображение для конкретного товара"""
        content_type = ContentType.objects.get_for_model(product)
        
        # Получаем все изображения товара
        images = ProductImage.objects.filter(
            content_type=content_type,
            object_id=product.id
        )
        
        if not images.exists():
            return False
        
        # Ищем реальные изображения (не SVG)
        real_images = images.exclude(image__iendswith='.svg')
        svg_images = images.filter(image__iendswith='.svg')
        
        if not real_images.exists():
            # Если реальных изображений нет, оставляем как есть
            return False
        
        # Проверяем, есть ли уже основное реальное изображение
        main_real_image = real_images.filter(is_main=True).first()
        
        if main_real_image:
            # Уже есть основное реальное изображение, ничего не делаем
            return False
        
        # Убираем флаг is_main у всех изображений
        images.update(is_main=False)
        
        # Устанавливаем первое реальное изображение как основное
        first_real_image = real_images.order_by('sort_order', 'created_at').first()
        first_real_image.is_main = True
        first_real_image.save()
        
        self.stdout.write(f'✅ {product.name}: установлено основное изображение {first_real_image.image.name}')
        return True 