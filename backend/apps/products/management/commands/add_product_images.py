from django.core.management.base import BaseCommand
from apps.products.models import Product, ProductImage
import requests
from django.core.files.base import ContentFile
import random

class Command(BaseCommand):
    help = 'Add sample images to products'

    def handle(self, *args, **options):
        self.stdout.write('Добавление изображений товаров...')
        
        # Получаем все товары без изображений
        products_without_images = Product.objects.filter(images__isnull=True)
        
        # Список URL-ов для placeholder изображений
        tire_images = [
            'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=TIRE+1',
            'https://via.placeholder.com/400x400/34495E/FFFFFF?text=TIRE+2',
            'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=TIRE+3',
            'https://via.placeholder.com/400x400/34495E/FFFFFF?text=TIRE+4',
            'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=TIRE+5',
        ]
        
        wheel_images = [
            'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=WHEEL+1',
            'https://via.placeholder.com/400x400/C0392B/FFFFFF?text=WHEEL+2',
            'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=WHEEL+3',
            'https://via.placeholder.com/400x400/C0392B/FFFFFF?text=WHEEL+4',
            'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=WHEEL+5',
        ]
        
        for product in products_without_images:
            try:
                # Выбираем изображение в зависимости от типа товара
                if product.product_type == 'tire':
                    image_url = random.choice(tire_images)
                else:
                    image_url = random.choice(wheel_images)
                
                # Скачиваем изображение
                response = requests.get(image_url)
                if response.status_code == 200:
                    # Создаем изображение товара
                    image_name = f"{product.slug}.png"
                    image_file = ContentFile(response.content, name=image_name)
                    
                    ProductImage.objects.create(
                        product=product,
                        image=image_file,
                        alt_text=product.name,
                        title=product.name,
                        is_main=True
                    )
                    
                    self.stdout.write(f'Добавлено изображение для: {product.name}')
                
            except Exception as e:
                self.stdout.write(f'Ошибка при добавлении изображения для {product.name}: {e}')
        
        self.stdout.write(self.style.SUCCESS('Изображения успешно добавлены!')) 