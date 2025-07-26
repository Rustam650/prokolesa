#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import django
import random
from decimal import Decimal
import uuid
import re
from unidecode import unidecode

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prokolesa_backend.settings')
django.setup()

from apps.products.models import Category, Brand, TireProduct, WheelProduct

def generate_slug(text):
    """Автоматическая генерация slug из текста"""
    # Транслитерация кириллицы в латиницу
    slug = unidecode(text)
    # Приведение к нижнему регистру
    slug = slug.lower()
    # Замена пробелов и специальных символов на дефисы
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    # Удаление дефисов в начале и конце
    slug = slug.strip('-')
    return slug

def create_categories():
    """Создание категорий"""
    categories_data = [
        # Шины
        {'name': 'Летние шины', 'description': 'Летние шины для комфортной езды в теплое время года'},
        {'name': 'Зимние шины', 'description': 'Зимние шины для безопасной езды в холодное время года'},
        {'name': 'Всесезонные шины', 'description': 'Универсальные шины для круглогодичного использования'},
        {'name': 'Внедорожные шины', 'description': 'Шины для внедорожников и кроссоверов'},
        {'name': 'Спортивные шины', 'description': 'Высокопроизводительные шины для спортивных автомобилей'},
        
        # Диски
        {'name': 'Литые диски', 'description': 'Легкие и прочные литые диски'},
        {'name': 'Штампованные диски', 'description': 'Надежные стальные штампованные диски'},
        {'name': 'Кованые диски', 'description': 'Премиальные кованые диски'},
    ]
    
    created_categories = []
    for cat_data in categories_data:
        slug = generate_slug(cat_data['name'])
        category, created = Category.objects.get_or_create(
            slug=slug,
            defaults={
                'name': cat_data['name'],
                'description': cat_data['description'],
                'is_active': True,
                'sort_order': len(created_categories) + 1
            }
        )
        created_categories.append(category)
        if created:
            print(f"✅ Создана категория: {category.name} (slug: {category.slug})")
    
    return created_categories

def create_brands():
    """Создание брендов"""
    brands_data = [
        # Премиум бренды шин
        {'name': 'Michelin', 'country': 'Франция', 'rating': 9.5, 'types': 'both', 'description': 'Французский производитель премиальных шин'},
        {'name': 'Bridgestone', 'country': 'Япония', 'rating': 9.3, 'types': 'both', 'description': 'Японский лидер шинной индустрии'},
        {'name': 'Continental', 'country': 'Германия', 'rating': 9.2, 'types': 'tire', 'description': 'Немецкое качество и инновации'},
        {'name': 'Pirelli', 'country': 'Италия', 'rating': 9.0, 'types': 'tire', 'description': 'Итальянские спортивные шины'},
        {'name': 'Goodyear', 'country': 'США', 'rating': 8.8, 'types': 'tire', 'description': 'Американский производитель шин'},
        
        # Средний сегмент шин
        {'name': 'Dunlop', 'country': 'Великобритания', 'rating': 8.5, 'types': 'tire', 'description': 'Британские шины с богатой историей'},
        {'name': 'Yokohama', 'country': 'Япония', 'rating': 8.4, 'types': 'tire', 'description': 'Японские инновационные шины'},
        {'name': 'Hankook', 'country': 'Южная Корея', 'rating': 8.2, 'types': 'tire', 'description': 'Корейские шины отличного качества'},
        {'name': 'Kumho', 'country': 'Южная Корея', 'rating': 8.0, 'types': 'tire', 'description': 'Доступные корейские шины'},
        {'name': 'Toyo', 'country': 'Япония', 'rating': 7.9, 'types': 'tire', 'description': 'Японские шины для различных условий'},
        {'name': 'Falken', 'country': 'Япония', 'rating': 7.8, 'types': 'tire', 'description': 'Спортивные японские шины'},
        {'name': 'Maxxis', 'country': 'Тайвань', 'rating': 7.6, 'types': 'tire', 'description': 'Тайваньские шины для внедорожников'},
        
        # Российские бренды
        {'name': 'Cordiant', 'country': 'Россия', 'rating': 7.0, 'types': 'tire', 'description': 'Российские шины для суровых условий'},
        {'name': 'Viatti', 'country': 'Россия', 'rating': 6.8, 'types': 'tire', 'description': 'Российские доступные шины'},
        
        # Премиум бренды дисков
        {'name': 'BBS', 'country': 'Германия', 'rating': 9.8, 'types': 'wheel', 'description': 'Немецкие премиальные диски'},
        {'name': 'OZ Racing', 'country': 'Италия', 'rating': 9.6, 'types': 'wheel', 'description': 'Итальянские спортивные диски'},
        {'name': 'Enkei', 'country': 'Япония', 'rating': 9.4, 'types': 'wheel', 'description': 'Японские легкие диски'},
        
        # Средний сегмент дисков
        {'name': 'Borbet', 'country': 'Германия', 'rating': 8.5, 'types': 'wheel', 'description': 'Немецкие качественные диски'},
        {'name': 'AEZ', 'country': 'Германия', 'rating': 8.3, 'types': 'wheel', 'description': 'Немецкие стильные диски'},
        
        # Доступные бренды дисков
        {'name': 'Replay', 'country': 'Россия', 'rating': 7.2, 'types': 'wheel', 'description': 'Российские реплики оригинальных дисков'},
        {'name': 'LegeArtis', 'country': 'Россия', 'rating': 7.0, 'types': 'wheel', 'description': 'Российские копии брендовых дисков'},
    ]
    
    created_brands = []
    for brand_data in brands_data:
        slug = generate_slug(brand_data['name'])
        brand, created = Brand.objects.get_or_create(
            name=brand_data['name'],
            defaults={
                'slug': slug,
                'description': brand_data['description'],
                'country': brand_data['country'],
                'rating': Decimal(str(brand_data['rating'])),
                'product_types': brand_data['types'],
                'popularity_score': random.randint(70, 100),
                'is_active': True,
                'is_featured': brand_data['rating'] >= 9.0
            }
        )
        created_brands.append(brand)
        if created:
            print(f"✅ Создан бренд: {brand.name} ({brand.country}) - slug: {brand.slug}")
    
    return created_brands

def parse_tire_size(size_string):
    """Парсинг размера шины из строки типа '205/55R16'"""
    try:
        parts = size_string.split('/')
        width = int(parts[0])
        profile_and_diameter = parts[1].split('R')
        profile = int(profile_and_diameter[0])
        diameter = int(profile_and_diameter[1])
        return width, profile, diameter
    except:
        return 205, 55, 16  # Значения по умолчанию

def create_tire_products(brands, categories):
    """Создание шин"""
    tire_brands = [b for b in brands if b.product_types in ['tire', 'both']]
    tire_categories = [c for c in categories if 'шины' in c.name.lower()]
    
    if not tire_categories:
        print("❌ Не найдены категории для шин")
        return
    
    # Популярные размеры шин
    tire_sizes = [
        '175/70R13', '185/60R14', '185/65R15', '195/65R15', '205/55R16',
        '205/60R16', '215/60R16', '225/50R17', '225/55R17', '235/45R17',
        '235/55R17', '245/40R18', '245/45R18', '255/35R19', '255/40R19',
        '265/35R20', '275/30R20', '285/30R21', '295/25R22'
    ]
    
    # Модели шин для разных брендов
    tire_models = {
        'Michelin': ['Pilot Sport 4', 'Primacy 4', 'CrossClimate 2'],
        'Bridgestone': ['Potenza S001', 'Turanza T005', 'Ecopia EP300'],
        'Continental': ['PremiumContact 6', 'SportContact 6', 'EcoContact 6'],
        'Pirelli': ['P Zero', 'Cinturato P7', 'Scorpion Verde'],
        'Goodyear': ['EfficientGrip Performance', 'Eagle F1 Asymmetric 3', 'UltraGrip Performance'],
    }
    
    seasons = ['summer', 'winter', 'all_season']
    
    created_count = 0
    for brand in tire_brands[:5]:  # Берем первые 5 брендов
        models = tire_models.get(brand.name, ['Classic', 'Sport', 'Comfort'])
        
        for model in models:  # Все модели
            for size in random.sample(tire_sizes, 3):  # По 3 размера на модель
                season = random.choice(seasons)
                width, profile, diameter = parse_tire_size(size)
                
                # Определяем категорию по сезону
                if season == 'summer':
                    category = next((c for c in tire_categories if 'летние' in c.name.lower()), tire_categories[0])
                elif season == 'winter':
                    category = next((c for c in tire_categories if 'зимние' in c.name.lower()), tire_categories[1])
                else:
                    category = next((c for c in tire_categories if 'всесезонные' in c.name.lower()), tire_categories[2])
                
                # Генерируем цены в зависимости от бренда
                base_price = 3000 if brand.rating >= 9.0 else 2000 if brand.rating >= 8.0 else 1500
                price_variation = random.uniform(0.8, 1.5)
                price = int(base_price * price_variation)
                
                # Уникальный SKU
                sku = f"TIRE-{brand.name[:3].upper()}-{str(uuid.uuid4())[:8]}"
                
                product_name = f"{brand.name} {model} {size}"
                product_slug = generate_slug(product_name) + f"-{str(uuid.uuid4())[:8]}"
                
                tire_data = {
                    'name': product_name,
                    'slug': product_slug,
                    'sku': sku,
                    'brand': brand,
                    'category': category,
                    'season': season,
                    'width': width,
                    'profile': profile,
                    'diameter': diameter,
                    'price': Decimal(str(price)),
                    'old_price': Decimal(str(int(price * 1.2))),
                    'stock_quantity': random.randint(10, 100),
                    'description': f"Высококачественная шина {brand.name} {model} размера {size} для {season} сезона",
                    'speed_index': random.choice(['T', 'H', 'V', 'W', 'Y']),
                    'load_index': str(random.randint(80, 120)),
                    'fuel_efficiency': random.choice(['A', 'B', 'C', 'D', 'E']),
                    'wet_grip': random.choice(['A', 'B', 'C', 'D', 'E']),
                    'noise_level': random.randint(68, 75),
                    'is_active': True,
                    'is_featured': random.choice([True, False]) and brand.rating >= 8.5,
                    'rating': round(random.uniform(4.0, 5.0), 1),
                    'reviews_count': random.randint(5, 150),
                    'sales_count': random.randint(10, 500),
                }
                
                try:
                    tire, created = TireProduct.objects.get_or_create(
                        sku=sku,
                        defaults=tire_data
                    )
                    
                    if created:
                        created_count += 1
                        if created_count % 10 == 0:
                            print(f"✅ Создано {created_count} шин...")
                except Exception as e:
                    print(f"❌ Ошибка создания шины {sku}: {e}")
    
    print(f"✅ Всего создано {created_count} шин")

def parse_wheel_size(size_string):
    """Парсинг размера диска из строки типа '7x16 5x112'"""
    try:
        size_part, bolt_part = size_string.split(' ')
        width, diameter = size_part.split('x')
        return float(width), float(diameter), bolt_part
    except:
        return 7.0, 16.0, '5x112'  # Значения по умолчанию

def create_wheel_products(brands, categories):
    """Создание дисков"""
    wheel_brands = [b for b in brands if b.product_types in ['wheel', 'both']]
    wheel_categories = [c for c in categories if 'диски' in c.name.lower()]
    
    if not wheel_categories:
        print("❌ Не найдены категории для дисков")
        return
    
    # Популярные размеры дисков
    wheel_sizes = [
        '5.5x13 4x98', '6x14 4x100', '6x15 4x100', '6.5x15 5x112',
        '7x16 5x112', '7.5x17 5x112', '8x17 5x120', '8.5x18 5x112',
        '9x18 5x120', '9.5x19 5x112', '10x19 5x120', '10.5x20 5x112',
    ]
    
    # Модели дисков
    wheel_models = {
        'BBS': ['CH-R', 'LM', 'RS-GT'],
        'OZ Racing': ['Ultraleggera', 'Formula HLT', 'Superturismo GT'],
        'Enkei': ['RPF1', 'NT03+M', 'RS05RR'],
        'Borbet': ['BY', 'BLX', 'CW4'],
        'Replay': ['A25', 'B58', 'M57'],
    }
    
    wheel_types = ['alloy', 'steel', 'forged']
    colors = ['#C0C0C0', '#000000', '#FFFFFF', '#708090']  # silver, black, white, gunmetal
    color_names = ['серебристый', 'черный', 'белый', 'антрацит']
    
    created_count = 0
    for brand in wheel_brands[:5]:  # Берем первые 5 брендов дисков
        models = wheel_models.get(brand.name, ['Classic', 'Sport', 'Racing'])
        
        for model in models:  # Все модели
            for size in random.sample(wheel_sizes, 3):  # По 3 размера на модель
                for i, color in enumerate(random.sample(colors, 2)):  # По 2 цвета на размер
                    wheel_type = random.choice(wheel_types)
                    width, diameter, bolt_pattern = parse_wheel_size(size)
                    color_name = color_names[colors.index(color)]
                    
                    # Определяем категорию по типу
                    if wheel_type == 'alloy':
                        category = next((c for c in wheel_categories if 'литые' in c.name.lower()), wheel_categories[0])
                    elif wheel_type == 'steel':
                        category = next((c for c in wheel_categories if 'штампованные' in c.name.lower()), wheel_categories[1])
                    else:
                        category = next((c for c in wheel_categories if 'кованые' in c.name.lower()), wheel_categories[2])
                    
                    # Генерируем цены
                    base_price = 15000 if brand.rating >= 9.0 else 8000 if brand.rating >= 8.0 else 5000
                    if wheel_type == 'forged':
                        base_price *= 2
                    elif wheel_type == 'steel':
                        base_price *= 0.4
                    
                    price_variation = random.uniform(0.8, 1.3)
                    price = int(base_price * price_variation)
                    
                    # Уникальный SKU
                    sku = f"WHEEL-{brand.name[:3].upper()}-{str(uuid.uuid4())[:8]}"
                    
                    product_name = f"{brand.name} {model} {width}x{diameter} {color_name}"
                    product_slug = generate_slug(product_name) + f"-{str(uuid.uuid4())[:8]}"
                    
                    wheel_data = {
                        'name': product_name,
                        'slug': product_slug,
                        'sku': sku,
                        'brand': brand,
                        'category': category,
                        'diameter': Decimal(str(diameter)),
                        'width': Decimal(str(width)),
                        'bolt_pattern': bolt_pattern,
                        'wheel_type': wheel_type,
                        'color': color,
                        'price': Decimal(str(price)),
                        'old_price': Decimal(str(int(price * 1.15))),
                        'stock_quantity': random.randint(4, 40),
                        'description': f"Стильный диск {brand.name} {model} размера {width}x{diameter} в цвете {color_name}",
                        'offset': random.randint(35, 55),
                        'center_bore': round(random.uniform(57.1, 72.6), 1),
                        'weight': round(random.uniform(8.5, 15.2), 1),
                        'is_active': True,
                        'is_featured': random.choice([True, False]) and brand.rating >= 8.5,
                        'rating': round(random.uniform(4.0, 5.0), 1),
                        'reviews_count': random.randint(3, 80),
                        'sales_count': random.randint(5, 200),
                    }
                    
                    try:
                        wheel, created = WheelProduct.objects.get_or_create(
                            sku=sku,
                            defaults=wheel_data
                        )
                        
                        if created:
                            created_count += 1
                            if created_count % 10 == 0:
                                print(f"✅ Создано {created_count} дисков...")
                    except Exception as e:
                        print(f"❌ Ошибка создания диска {sku}: {e}")
    
    print(f"✅ Всего создано {created_count} дисков")

def main():
    """Основная функция для наполнения сайта"""
    print("🚀 Начинаем наполнение сайта данными...")
    
    # Создаем категории
    print("\n📁 Создание категорий...")
    categories = create_categories()
    
    # Создаем бренды
    print("\n🏷️ Создание брендов...")
    brands = create_brands()
    
    # Создаем шины
    print("\n🛞 Создание шин...")
    create_tire_products(brands, categories)
    
    # Создаем диски
    print("\n⚙️ Создание дисков...")
    create_wheel_products(brands, categories)
    
    print("\n✅ Наполнение сайта завершено!")
    print(f"📊 Статистика:")
    print(f"   Категорий: {Category.objects.count()}")
    print(f"   Брендов: {Brand.objects.count()}")
    print(f"   Шин: {TireProduct.objects.count()}")
    print(f"   Дисков: {WheelProduct.objects.count()}")

if __name__ == '__main__':
    main()
