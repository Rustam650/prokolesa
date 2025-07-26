#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import django
import random
from decimal import Decimal
import uuid

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prokolesa_backend.settings')
django.setup()

from apps.products.models import Category, Brand, WheelProduct

def parse_wheel_size(size_string):
    """Парсинг размера диска из строки типа '7x16 5x112'"""
    try:
        parts = size_string.split(' ')
        width_diameter = parts[0].split('x')
        width = float(width_diameter[0])
        diameter = float(width_diameter[1])
        bolt_pattern = parts[1] if len(parts) > 1 else '5x112'
        return width, diameter, bolt_pattern
    except:
        return 7.0, 16.0, '5x112'  # Значения по умолчанию

def create_wheel_products():
    """Создание дисков"""
    wheel_brands = Brand.objects.filter(product_types__in=['wheel', 'both'])
    wheel_categories = Category.objects.filter(name__icontains='диски')
    
    if not wheel_categories:
        print("❌ Не найдены категории для дисков")
        return
    
    # Популярные размеры дисков
    wheel_sizes = [
        '6x15 4x100', '6.5x15 5x112', '7x16 5x112', '7.5x17 5x112', 
        '8x17 5x120', '8.5x18 5x112', '9x18 5x120', '9.5x19 5x112',
        '10x19 5x120', '10.5x20 5x112'
    ]
    
    # Модели дисков
    wheel_models = {
        'BBS': ['CH-R', 'LM', 'RS-GT', 'FI-R'],
        'OZ Racing': ['Ultraleggera', 'Formula HLT', 'Superturismo GT'],
        'Enkei': ['RPF1', 'NT03+M', 'RS05RR'],
        'Borbet': ['BY', 'BLX', 'CW4'],
        'Replay': ['A25', 'B58', 'M57'],
    }
    
    wheel_types = ['alloy', 'steel', 'forged']
    colors = ['#C0C0C0', '#000000', '#FFFFFF', '#708090']  # silver, black, white, gunmetal
    
    created_count = 0
    for brand in wheel_brands[:5]:  # Берем первые 5 брендов дисков
        models = wheel_models.get(brand.name, ['Classic', 'Sport', 'Racing'])
        
        for model in models:  # Все модели
            for size in random.sample(wheel_sizes, 3):  # По 3 размера на модель
                for color in random.sample(colors, 2):  # По 2 цвета на размер
                    wheel_type = random.choice(wheel_types)
                    width, diameter, bolt_pattern = parse_wheel_size(size)
                    
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
                    
                    color_name = {
                        '#C0C0C0': 'silver',
                        '#000000': 'black', 
                        '#FFFFFF': 'white',
                        '#708090': 'gunmetal'
                    }.get(color, 'silver')
                    
                    # Уникальный SKU
                    sku = f"WHEEL-{brand.name[:3].upper()}-{str(uuid.uuid4())[:8]}"
                    
                    wheel_data = {
                        'name': f"{model} {size} {color_name}",
                        'slug': f"{brand.slug}-{model.lower().replace(' ', '-')}-{size.replace(' ', '-').replace('x', 'x')}-{color_name}-{str(uuid.uuid4())[:8]}",
                        'sku': sku,
                        'brand': brand,
                        'category': category,
                        'width': Decimal(str(width)),
                        'diameter': Decimal(str(diameter)),
                        'bolt_pattern': bolt_pattern,
                        'wheel_type': wheel_type,
                        'color': color,
                        'price': Decimal(str(price)),
                        'old_price': Decimal(str(int(price * 1.15))),
                        'stock_quantity': random.randint(4, 40),
                        'description': f"Стильный диск {brand.name} {model} размера {size} в цвете {color_name}",
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
    """Основная функция"""
    print("🚀 Создание дисков...")
    create_wheel_products()
    
    print("\n✅ Создание дисков завершено!")
    print(f"📊 Общая статистика:")
    print(f"   Дисков: {WheelProduct.objects.count()}")

if __name__ == '__main__':
    main()
