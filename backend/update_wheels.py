#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal
import random

# Настройка Django
sys.path.append('/Users/rustamradzhabov/Desktop/prokolesa/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prokolesa_backend.settings')
django.setup()

from apps.products.models import WheelProduct, Brand, Category
from django.utils.text import slugify

def update_wheels():
    """Удаляет все диски и создает новые 5 штук разных фирм"""
    
    print("🔄 Удаление всех дисков...")
    deleted_count = WheelProduct.objects.all().count()
    WheelProduct.objects.all().delete()
    print(f"✅ Удалено дисков: {deleted_count}")
    
    # Получаем категорию для дисков
    try:
        wheel_category = Category.objects.filter(name__icontains='диск').first()
        if not wheel_category:
            wheel_category = Category.objects.create(
                name='Диски',
                slug='diski',
                description='Автомобильные диски'
            )
    except Exception as e:
        print(f"❌ Ошибка с категорией: {e}")
        return
    
    # Данные для новых дисков
    wheels_data = [
        {
            'brand_name': 'BBS',
            'name': 'CH-R II',
            'diameter': 18.0,
            'width': 8.0,
            'bolt_pattern': '5x112',
            'center_bore': 66.5,
            'offset': 35,
            'wheel_type': 'forged',
            'color': '#C0C0C0',
            'finish': 'Satin Silver',
            'price': 85000,
            'description': 'Кованые диски BBS CH-R II - воплощение немецкого качества и стиля'
        },
        {
            'brand_name': 'OZ Racing',
            'name': 'Ultraleggera HLT',
            'diameter': 19.0,
            'width': 8.5,
            'bolt_pattern': '5x120',
            'center_bore': 72.6,
            'offset': 32,
            'wheel_type': 'alloy',
            'color': '#FF4500',
            'finish': 'Orange Anodized',
            'price': 72000,
            'description': 'Легендарные спортивные диски OZ Racing для максимальной производительности'
        },
        {
            'brand_name': 'Enkei',
            'name': 'RPF1',
            'diameter': 17.0,
            'width': 7.5,
            'bolt_pattern': '5x114.3',
            'center_bore': 64.1,
            'offset': 38,
            'wheel_type': 'alloy',
            'color': '#C0C0C0',
            'finish': 'Silver',
            'price': 45000,
            'description': 'Классические спортивные диски Enkei RPF1 - выбор профессионалов'
        },
        {
            'brand_name': 'Borbet',
            'name': 'BY',
            'diameter': 16.0,
            'width': 7.0,
            'bolt_pattern': '5x112',
            'center_bore': 57.1,
            'offset': 45,
            'wheel_type': 'alloy',
            'color': '#000000',
            'finish': 'Matt Black',
            'price': 38000,
            'description': 'Стильные диски Borbet BY в матовом черном цвете'
        },
        {
            'brand_name': 'Replay',
            'name': 'A25',
            'diameter': 20.0,
            'width': 9.0,
            'bolt_pattern': '5x130',
            'center_bore': 71.6,
            'offset': 48,
            'wheel_type': 'alloy',
            'color': '#708090',
            'finish': 'Gunmetal',
            'price': 55000,
            'description': 'Replica диски Replay A25 в стиле премиум автомобилей'
        }
    ]
    
    created_count = 0
    
    for wheel_data in wheels_data:
        try:
            # Получаем или создаем бренд
            brand, created = Brand.objects.get_or_create(
                name=wheel_data['brand_name'],
                defaults={
                    'slug': slugify(wheel_data['brand_name']),
                    'description': f'Бренд {wheel_data["brand_name"]}',
                    'country': 'Germany' if wheel_data['brand_name'] in ['BBS', 'Borbet'] else 'Japan' if wheel_data['brand_name'] == 'Enkei' else 'Italy' if wheel_data['brand_name'] == 'OZ Racing' else 'Russia',
                    'product_types': ['wheel']
                }
            )
            
            # Создаем диск
            wheel = WheelProduct.objects.create(
                name=wheel_data['name'],
                slug=slugify(f"{wheel_data['brand_name']}-{wheel_data['name']}-{wheel_data['diameter']}x{wheel_data['width']}"),
                sku=f"WHL-{wheel_data['brand_name'][:3].upper()}-{random.randint(1000, 9999)}",
                category=wheel_category,
                brand=brand,
                short_description=f"{wheel_data['brand_name']} {wheel_data['name']} {wheel_data['diameter']}x{wheel_data['width']}",
                description=wheel_data['description'],
                diameter=Decimal(str(wheel_data['diameter'])),
                width=Decimal(str(wheel_data['width'])),
                bolt_pattern=wheel_data['bolt_pattern'],
                center_bore=Decimal(str(wheel_data['center_bore'])),
                offset=wheel_data['offset'],
                wheel_type=wheel_data['wheel_type'],
                color=wheel_data['color'],
                finish=wheel_data['finish'],
                price=Decimal(str(wheel_data['price'])),
                stock_quantity=random.randint(5, 25),
                is_active=True,
                is_featured=random.choice([True, False]),
                rating=Decimal(str(round(random.uniform(4.0, 5.0), 1))),
                reviews_count=random.randint(5, 50),
                compatible_cars=['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen'] if wheel_data['bolt_pattern'] in ['5x112', '5x120'] else ['Honda', 'Toyota', 'Nissan'],
                specifications={
                    'material': 'Aluminum Alloy' if wheel_data['wheel_type'] == 'alloy' else 'Forged Aluminum',
                    'weight': f"{random.randint(8, 15)} kg",
                    'load_rating': f"{random.randint(600, 800)} kg",
                    'manufacturing': wheel_data['brand_name']
                }
            )
            
            created_count += 1
            print(f"✅ Создан диск: {wheel.brand.name} {wheel.name} {wheel.diameter}x{wheel.width}")
            
        except Exception as e:
            print(f"❌ Ошибка при создании диска {wheel_data['name']}: {e}")
    
    print(f"\n🎉 Создано новых дисков: {created_count}")
    print("✅ Обновление дисков завершено!")

if __name__ == '__main__':
    update_wheels() 