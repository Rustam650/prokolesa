from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps.products.models import TireProduct, Brand, Category, ProductImage
import requests
from io import BytesIO


class Command(BaseCommand):
    help = 'Создает тестовые шины с изображениями'

    def handle(self, *args, **options):
        # Получаем или создаем категорию
        category, created = Category.objects.get_or_create(
            name='Летние шины',
            defaults={'slug': 'summer-tires', 'description': 'Летние шины для легковых автомобилей'}
        )

        # Получаем или создаем бренды
        brands_data = [
            {'name': 'Michelin', 'country': 'Франция'},
            {'name': 'Continental', 'country': 'Германия'},
            {'name': 'Bridgestone', 'country': 'Япония'},
        ]

        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                name=brand_data['name'],
                defaults={
                    'slug': brand_data['name'].lower(),
                    'country': brand_data['country'],
                    'product_types': 'tire',
                    'is_active': True
                }
            )

            # Создаем тестовую шину
            tire_name = f"{brand.name} Pilot Sport 4"
            tire, created = TireProduct.objects.get_or_create(
                name=tire_name,
                brand=brand,
                defaults={
                    'slug': f"{brand.name.lower()}-pilot-sport-4",
                    'sku': f"PS4-{brand.name[:3].upper()}-225-45-17",
                    'category': category,
                    'season': 'summer',
                    'width': 225,
                    'profile': 45,
                    'diameter': 17,
                    'load_index': '94',
                    'speed_index': 'Y',
                    'price': 12500.00,
                    'stock_quantity': 20,
                    'is_active': True,
                    'short_description': f'Высококачественная летняя шина {brand.name}',
                    'description': f'Шина {tire_name} обеспечивает отличное сцепление с дорогой и комфортную езду.',
                    'fuel_efficiency': 'B',
                    'wet_grip': 'A',
                    'noise_level': 70,
                }
            )

            if created:
                self.stdout.write(f'Создана шина: {tire.name}')
                
                # Создаем тестовое изображение (заглушка)
                # В реальном проекте здесь бы загружались настоящие изображения
                try:
                    # Попытка загрузить изображение-заглушку
                    response = requests.get('https://via.placeholder.com/400x400/000000/FFFFFF?text=Tire', timeout=10)
                    if response.status_code == 200:
                        image_content = ContentFile(response.content, name=f'{tire.slug}-main.jpg')
                        
                        ProductImage.objects.create(
                            content_object=tire,
                            image=image_content,
                            alt_text=f'{tire.name} - основное изображение',
                            title=tire.name,
                            is_main=True,
                            sort_order=1
                        )
                        self.stdout.write(f'Добавлено изображение для: {tire.name}')
                    else:
                        self.stdout.write(self.style.WARNING(f'Не удалось загрузить изображение для {tire.name}'))
                        
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Ошибка при загрузке изображения: {e}'))

        self.stdout.write(self.style.SUCCESS('Тестовые шины созданы успешно!')) 