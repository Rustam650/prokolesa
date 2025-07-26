from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps.products.models import TireProduct, WheelProduct, ProductImage
import random


class Command(BaseCommand):
    help = 'Create images for existing products'

    def handle(self, *args, **options):
        self.stdout.write('Создание изображений для товаров...')
        
        # Удаляем существующие изображения только если нужно
        # ProductImage.objects.all().delete()
        
        # Обрабатываем шины
        tires = TireProduct.objects.filter(is_active=True)
        self.stdout.write(f'Найдено шин: {tires.count()}')
        
        for tire in tires:
            try:
                # Проверяем, есть ли уже изображения
                existing_images = ProductImage.objects.filter(
                    content_type__model='tireproduct',
                    object_id=tire.id
                ).count()
                
                if existing_images > 0:
                    self.stdout.write(f'У шины {tire.name} уже есть {existing_images} изображений, пропускаем')
                    continue
                
                # Создаем 1-3 изображения для каждой шины
                num_images = random.randint(1, 3)
                
                for i in range(num_images):
                    # Создаем простое SVG изображение
                    svg_content = self.create_tire_svg(tire, i+1)
                    filename = f"tire-{tire.slug}-{i+1}.svg"
                    
                    image_content = ContentFile(svg_content.encode('utf-8'))
                    
                    product_image = ProductImage(
                        content_object=tire,
                        alt_text=f"{tire.name} - изображение {i+1}",
                        title=f"{tire.name}",
                        is_main=(i == 0),  # Первое изображение делаем основным
                        sort_order=i
                    )
                    product_image.image.save(filename, image_content, save=True)
                    
                self.stdout.write(f'Создано {num_images} изображений для шины: {tire.name}')
                    
            except Exception as e:
                self.stdout.write(f'Ошибка создания изображений для {tire.name}: {e}')
                continue
        
        # Обрабатываем диски
        wheels = WheelProduct.objects.filter(is_active=True)
        self.stdout.write(f'Найдено дисков: {wheels.count()}')
        
        for wheel in wheels:
            try:
                # Проверяем, есть ли уже изображения
                existing_images = ProductImage.objects.filter(
                    content_type__model='wheelproduct',
                    object_id=wheel.id
                ).count()
                
                if existing_images > 0:
                    self.stdout.write(f'У диска {wheel.name} уже есть {existing_images} изображений, пропускаем')
                    continue
                
                # Создаем 1-3 изображения для каждого диска
                num_images = random.randint(1, 3)
                
                for i in range(num_images):
                    # Создаем простое SVG изображение
                    svg_content = self.create_wheel_svg(wheel, i+1)
                    filename = f"wheel-{wheel.slug}-{i+1}.svg"
                    
                    image_content = ContentFile(svg_content.encode('utf-8'))
                    
                    product_image = ProductImage(
                        content_object=wheel,
                        alt_text=f"{wheel.name} - изображение {i+1}",
                        title=f"{wheel.name}",
                        is_main=(i == 0),  # Первое изображение делаем основным
                        sort_order=i
                    )
                    product_image.image.save(filename, image_content, save=True)
                    
                self.stdout.write(f'Создано {num_images} изображений для диска: {wheel.name}')
                    
            except Exception as e:
                self.stdout.write(f'Ошибка создания изображений для {wheel.name}: {e}')
                continue
        
        total_images = ProductImage.objects.count()
        self.stdout.write(f'Всего изображений в базе: {total_images}')
        self.stdout.write(self.style.SUCCESS('Изображения успешно созданы!'))

    def create_tire_svg(self, tire, image_num):
        """Создает простое SVG изображение шины"""
        colors = ['#2C3E50', '#34495E', '#1A252F', '#445566']
        color = colors[image_num % len(colors)]
        
        return f'''<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="tireGrad{image_num}" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" style="stop-color:{color};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:{color};stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#tireGrad{image_num})" stroke="#000" stroke-width="4"/>
            <circle cx="200" cy="200" r="120" fill="none" stroke="#333" stroke-width="2"/>
            <circle cx="200" cy="200" r="80" fill="none" stroke="#555" stroke-width="2"/>
            <text x="200" y="180" text-anchor="middle" fill="white" font-size="16" font-weight="bold">{tire.brand.name}</text>
            <text x="200" y="200" text-anchor="middle" fill="white" font-size="14">{tire.width}/{tire.profile}R{tire.diameter}</text>
            <text x="200" y="220" text-anchor="middle" fill="white" font-size="12">{tire.season.replace('_', ' ').title()}</text>
            <text x="200" y="240" text-anchor="middle" fill="white" font-size="10">#{image_num}</text>
        </svg>'''

    def create_wheel_svg(self, wheel, image_num):
        """Создает простое SVG изображение диска"""
        colors = ['#E74C3C', '#C0392B', '#A93226', '#922B21']
        color = colors[image_num % len(colors)]
        
        return f'''<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="wheelGrad{image_num}" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" style="stop-color:silver;stop-opacity:0.9" />
                    <stop offset="70%" style="stop-color:{color};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#333;stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#wheelGrad{image_num})" stroke="#000" stroke-width="4"/>
            <circle cx="200" cy="200" r="40" fill="#333" stroke="#000" stroke-width="2"/>
            
            <!-- Спицы диска -->
            <g stroke="#222" stroke-width="3" fill="none">
                <line x1="200" y1="60" x2="200" y2="140" />
                <line x1="200" y1="260" x2="200" y2="340" />
                <line x1="60" y1="200" x2="140" y2="200" />
                <line x1="260" y1="200" x2="340" y2="200" />
                <line x1="127" y1="127" x2="173" y2="173" />
                <line x1="227" y1="227" x2="273" y2="273" />
                <line x1="273" y1="127" x2="227" y2="173" />
                <line x1="173" y1="227" x2="127" y2="273" />
            </g>
            
            <text x="200" y="180" text-anchor="middle" fill="white" font-size="16" font-weight="bold">{wheel.brand.name}</text>
            <text x="200" y="200" text-anchor="middle" fill="white" font-size="14">{wheel.diameter}x{wheel.width}</text>
            <text x="200" y="220" text-anchor="middle" fill="white" font-size="12">{wheel.wheel_type.title()}</text>
            <text x="200" y="240" text-anchor="middle" fill="white" font-size="10">#{image_num}</text>
        </svg>''' 