from django.core.management.base import BaseCommand
from apps.products.models import Brand, Product, TireProduct, WheelProduct, Category
import random

class Command(BaseCommand):
    help = 'Создает образцы товаров для новых брендов'

    def handle(self, *args, **options):
        # Популярные размеры шин
        tire_sizes = [
            {'width': 185, 'profile': 65, 'diameter': 15},
            {'width': 195, 'profile': 65, 'diameter': 15},
            {'width': 205, 'profile': 55, 'diameter': 16},
            {'width': 215, 'profile': 60, 'diameter': 16},
            {'width': 225, 'profile': 45, 'diameter': 17},
            {'width': 235, 'profile': 45, 'diameter': 17},
            {'width': 245, 'profile': 40, 'diameter': 18},
            {'width': 255, 'profile': 35, 'diameter': 19},
        ]

        # Популярные размеры дисков
        wheel_sizes = [
            {'width': 6.5, 'diameter': 16, 'pcd': '5x112', 'et': 45},
            {'width': 7.0, 'diameter': 17, 'pcd': '5x114.3', 'et': 40},
            {'width': 7.5, 'diameter': 17, 'pcd': '5x120', 'et': 35},
            {'width': 8.0, 'diameter': 18, 'pcd': '5x112', 'et': 45},
            {'width': 8.5, 'diameter': 19, 'pcd': '5x114.3', 'et': 35},
            {'width': 9.0, 'diameter': 19, 'pcd': '5x120', 'et': 30},
        ]

        seasons = ['summer', 'winter', 'all_season']
        wheel_types = ['alloy', 'steel', 'forged']
        
        # EU Label данные для шин
        eu_labels = [
            {'fuel_efficiency': 'A', 'wet_grip': 'A', 'noise_level': 68},
            {'fuel_efficiency': 'B', 'wet_grip': 'A', 'noise_level': 69},
            {'fuel_efficiency': 'C', 'wet_grip': 'B', 'noise_level': 70},
            {'fuel_efficiency': 'B', 'wet_grip': 'C', 'noise_level': 71},
            {'fuel_efficiency': 'C', 'wet_grip': 'C', 'noise_level': 72},
            {'fuel_efficiency': 'D', 'wet_grip': 'D', 'noise_level': 73},
        ]

        tire_count = 0
        wheel_count = 0

        # Получаем или создаем категории
        tire_category, _ = Category.objects.get_or_create(
            slug='tires',
            defaults={'name': 'Шины', 'description': 'Автомобильные шины'}
        )
        wheel_category, _ = Category.objects.get_or_create(
            slug='wheels',
            defaults={'name': 'Диски', 'description': 'Автомобильные диски'}
        )

        # Создаем шины для новых брендов
        tire_brands = Brand.objects.filter(product_types='tire').exclude(
            name__in=['Michelin', 'Bridgestone', 'Continental', 'Pirelli', 'Goodyear', 'Nokian', 'Yokohama', 'Hankook']
        )

        for brand in tire_brands[:10]:  # Берем первые 10 новых брендов шин
            for i in range(2):  # По 2 товара на бренд
                size = random.choice(tire_sizes)
                season = random.choice(seasons)
                eu_label = random.choice(eu_labels)
                
                season_name = {
                    'summer': 'Летние',
                    'winter': 'Зимние', 
                    'all_season': 'Всесезонные'
                }[season]
                
                model_names = [
                    'Sport', 'Comfort', 'Eco', 'Performance', 'Premium', 'Ultra',
                    'Max', 'Pro', 'Elite', 'Advanced', 'Superior', 'Excellence'
                ]
                
                model = random.choice(model_names)
                name = f"{model} {size['width']}/{size['profile']} R{size['diameter']}"
                slug = f"{brand.slug}-{model.lower()}-{size['width']}-{size['profile']}-r{size['diameter']}-{i+1}"
                sku = f"TIRE-{brand.slug.upper()}-{size['width']}{size['profile']}R{size['diameter']}-{i+1}"
                
                # Создаем базовый продукт
                product = Product.objects.create(
                    name=name,
                    slug=slug,
                    sku=sku,
                    category=tire_category,
                    brand=brand,
                    product_type='tire',
                    season=season,
                    description=f"{season_name} шины {brand.name} {model} для комфортной и безопасной езды",
                    price=random.randint(3000, 15000),
                    old_price=random.randint(16000, 20000) if random.choice([True, False]) else None,
                    stock_quantity=random.randint(0, 50),
                    is_new=random.choice([True, False]),
                    is_bestseller=random.choice([True, False, False]),  # 33% хитов
                    rating=round(random.uniform(3.5, 5.0), 1),
                    reviews_count=random.randint(5, 150)
                )
                
                # Создаем детали шины
                tire_details = TireProduct.objects.create(
                    product=product,
                    width=size['width'],
                    profile=size['profile'],
                    diameter=size['diameter'],
                    load_index=str(random.randint(80, 100)),
                    speed_index=random.choice(['H', 'V', 'W', 'Y']),
                    fuel_efficiency=eu_label['fuel_efficiency'],
                    wet_grip=eu_label['wet_grip'],
                    noise_level=eu_label['noise_level']
                )
                
                tire_count += 1
                self.stdout.write(f"✅ Создана шина: {brand.name} {product.name}")

        # Создаем диски для новых брендов
        wheel_brands = Brand.objects.filter(product_types='wheel').exclude(
            name__in=['BBS', 'OZ Racing', 'Enkei', 'Borbet']
        )

        for brand in wheel_brands[:10]:  # Берем первые 10 новых брендов дисков
            for i in range(2):  # По 2 товара на бренд
                size = random.choice(wheel_sizes)
                wheel_type = random.choice(wheel_types)
                
                type_name = {
                    'alloy': 'Литые',
                    'steel': 'Штампованные',
                    'forged': 'Кованые'
                }[wheel_type]
                
                model_names = [
                    'Racing', 'Sport', 'Classic', 'Modern', 'Style', 'Design',
                    'Performance', 'Luxury', 'Urban', 'Dynamic', 'Elegant', 'Power'
                ]
                
                model = random.choice(model_names)
                name = f"{model} {size['width']}J x {size['diameter']} {size['pcd']}"
                slug = f"{brand.slug}-{model.lower()}-{int(size['width']*10)}j-{size['diameter']}-{i+1}"
                sku = f"WHEEL-{brand.slug.upper()}-{int(size['width']*10)}J{size['diameter']}-{i+1}"
                
                # Создаем базовый продукт
                product = Product.objects.create(
                    name=name,
                    slug=slug,
                    sku=sku,
                    category=wheel_category,
                    brand=brand,
                    product_type='wheel',
                    description=f"{type_name} диски {brand.name} {model} для стильного внешнего вида автомобиля",
                    price=random.randint(5000, 25000),
                    old_price=random.randint(26000, 35000) if random.choice([True, False]) else None,
                    stock_quantity=random.randint(0, 20),
                    is_new=random.choice([True, False]),
                    is_bestseller=random.choice([True, False, False]),  # 33% хитов
                    rating=round(random.uniform(3.5, 5.0), 1),
                    reviews_count=random.randint(3, 80)
                )
                
                # Создаем детали диска
                wheel_details = WheelProduct.objects.create(
                    product=product,
                    width=size['width'],
                    diameter=size['diameter'],
                    bolt_pattern=size['pcd'],
                    offset=size['et'],
                    wheel_type=wheel_type,
                    color=random.choice(['#C0C0C0', '#000000', '#FFFFFF', '#708090']),  # silver, black, white, gunmetal
                    center_bore=random.choice([57.1, 60.1, 63.4, 66.6, 72.6])  # Популярные размеры
                )
                
                wheel_count += 1
                self.stdout.write(f"✅ Создан диск: {brand.name} {product.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 Успешно создано:\n'
                f'   • Шин: {tire_count}\n'
                f'   • Дисков: {wheel_count}\n'
                f'   • Всего товаров: {tire_count + wheel_count}'
            )
        ) 