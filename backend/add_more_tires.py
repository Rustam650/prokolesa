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

from apps.products.models import Category, Brand, TireProduct

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
        return 205, 55, 16

def create_more_tires():
    """Создание дополнительных шин"""
    tire_brands = Brand.objects.filter(product_types__in=['tire', 'both'])
    tire_categories = Category.objects.filter(name__icontains='шины')
    
    if not tire_categories:
        print("❌ Не найдены категории для шин")
        return
    
    # Расширенный список размеров шин
    tire_sizes = [
        '155/70R13', '165/70R13', '175/70R13', '185/70R13',
        '155/65R14', '165/65R14', '175/65R14', '185/65R14', '195/65R14',
        '175/60R15', '185/60R15', '195/60R15', '205/60R15', '215/60R15',
        '185/55R15', '195/55R15', '205/55R15', '215/55R15', '225/55R15',
        '195/50R15', '205/50R15', '215/50R15', '225/50R15',
        '185/55R16', '195/55R16', '205/55R16', '215/55R16', '225/55R16',
        '195/50R16', '205/50R16', '215/50R16', '225/50R16', '235/50R16',
        '195/45R16', '205/45R16', '215/45R16', '225/45R16', '235/45R16',
        '205/50R17', '215/50R17', '225/50R17', '235/50R17', '245/50R17',
        '205/45R17', '215/45R17', '225/45R17', '235/45R17', '245/45R17',
        '205/40R17', '215/40R17', '225/40R17', '235/40R17', '245/40R17',
        '215/45R18', '225/45R18', '235/45R18', '245/45R18', '255/45R18',
        '215/40R18', '225/40R18', '235/40R18', '245/40R18', '255/40R18',
        '225/35R18', '235/35R18', '245/35R18', '255/35R18', '265/35R18',
        '225/40R19', '235/40R19', '245/40R19', '255/40R19', '265/40R19',
        '225/35R19', '235/35R19', '245/35R19', '255/35R19', '265/35R19',
        '235/35R20', '245/35R20', '255/35R20', '265/35R20', '275/35R20',
        '245/30R20', '255/30R20', '265/30R20', '275/30R20', '285/30R20'
    ]
    
    # Расширенные модели шин
    tire_models = {
        'Michelin': ['Pilot Sport 4', 'Primacy 4', 'CrossClimate 2', 'Latitude Sport 3', 'X-Ice North 4', 'Energy Saver+', 'Alpin 6'],
        'Bridgestone': ['Potenza S001', 'Turanza T005', 'Ecopia EP300', 'Blizzak VRX2', 'Dueler H/P Sport', 'Weather Control A005', 'Potenza RE050A'],
        'Continental': ['PremiumContact 6', 'SportContact 6', 'EcoContact 6', 'WinterContact TS 860', 'CrossContact LX2', 'ContiSportContact 5', 'AllSeasonContact'],
        'Pirelli': ['P Zero', 'Cinturato P7', 'Scorpion Verde', 'Winter Sottozero 3', 'P Zero Nero GT', 'Cinturato All Season SF2', 'Scorpion Winter'],
        'Goodyear': ['EfficientGrip Performance', 'Eagle F1 Asymmetric 3', 'UltraGrip Performance', 'Wrangler HP All Weather', 'Vector 4Seasons Gen-3', 'Excellence'],
        'Dunlop': ['Sport Maxx RT2', 'SP Sport FM800', 'Winter Sport 5', 'Grandtrek PT3', 'SP Sport 01', 'Enasave EC300+'],
        'Yokohama': ['Advan Sport V105', 'BluEarth-GT AE51', 'Geolandar SUV G055', 'iceGUARD iG60', 'C.drive AC02', 'Advan Neova AD08R'],
        'Hankook': ['Ventus S1 evo3', 'Kinergy 4S2', 'Winter i*cept RS2', 'Dynapro HP2', 'Optimo K425', 'Ventus Prime3 K125'],
        'Kumho': ['Ecsta PS71', 'Solus TA71', 'WinterCraft WP51', 'Crugen HP91', 'Ecowing ES01 KH27', 'Ecsta HS51'],
        'Toyo': ['Proxes Sport', 'Proxes CF2', 'Observe GSi-6', 'Open Country U/T', 'NanoEnergy 3', 'Proxes T1 Sport'],
        'Falken': ['Azenis FK510', 'Ziex ZE310 Ecorun', 'Eurowinter HS01', 'Wildpeak A/T3W', 'Sincera SN832 Ecorun'],
        'Maxxis': ['Victra Sport VS-01', 'Premitra HP5', 'Premitra Ice SP3', 'Bravo HP-M3', 'Mecotra 3'],
        'Cordiant': ['Sport 3', 'Comfort 2', 'Snow Cross', 'Off Road', 'Road Runner', 'Polar SL'],
        'Viatti': ['Strada Asimmetrico V-130', 'Bosco S/T V-526', 'Brina V-521', 'Strada Asimmetrico V-130'],
    }
    
    seasons = ['summer', 'winter', 'all_season']
    
    created_count = 0
    for brand in tire_brands:  # Все бренды шин
        models = tire_models.get(brand.name, ['Classic', 'Sport', 'Comfort', 'Eco', 'Winter'])
        
        for model in models[:4]:  # По 4 модели на бренд
            for size in random.sample(tire_sizes, 8):  # По 8 размеров на модель
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
                base_price = 3500 if brand.rating >= 9.0 else 2500 if brand.rating >= 8.0 else 1800 if brand.rating >= 7.0 else 1200
                price_variation = random.uniform(0.7, 1.6)
                price = int(base_price * price_variation)
                
                # Уникальный SKU
                sku = f"TIRE-{brand.name[:3].upper()}-{str(uuid.uuid4())[:8]}"
                
                tire_data = {
                    'name': f"{model} {size}",
                    'slug': f"{brand.slug}-{model.lower().replace(' ', '-')}-{size.replace('/', '-').replace('R', 'r')}-{str(uuid.uuid4())[:8]}",
                    'sku': sku,
                    'brand': brand,
                    'category': category,
                    'season': season,
                    'width': width,
                    'profile': profile,
                    'diameter': diameter,
                    'price': Decimal(str(price)),
                    'old_price': Decimal(str(int(price * random.uniform(1.1, 1.3)))),
                    'stock_quantity': random.randint(5, 150),
                    'description': f"Высококачественная шина {brand.name} {model} размера {size} для {season} сезона. Отличные характеристики сцепления и износостойкости.",
                    'speed_index': random.choice(['T', 'H', 'V', 'W', 'Y', 'Z']),
                    'load_index': str(random.randint(75, 125)),
                    'fuel_efficiency': random.choice(['A', 'B', 'C', 'D', 'E']),
                    'wet_grip': random.choice(['A', 'B', 'C', 'D', 'E']),
                    'noise_level': random.randint(67, 76),
                    'is_active': True,
                    'is_featured': random.choice([True, False]) and brand.rating >= 8.0,
                    'rating': round(random.uniform(3.8, 5.0), 1),
                    'reviews_count': random.randint(2, 200),
                    'sales_count': random.randint(5, 800),
                    'run_flat': random.choice([True, False]) if brand.rating >= 8.5 else False,
                    'reinforced': random.choice([True, False]),
                    'studded': season == 'winter' and random.choice([True, False]),
                }
                
                try:
                    tire, created = TireProduct.objects.get_or_create(
                        sku=sku,
                        defaults=tire_data
                    )
                    
                    if created:
                        created_count += 1
                        if created_count % 50 == 0:
                            print(f"✅ Создано {created_count} шин...")
                except Exception as e:
                    print(f"❌ Ошибка создания шины {sku}: {e}")
    
    print(f"✅ Всего создано {created_count} дополнительных шин")

def main():
    """Основная функция"""
    print("🚀 Создание дополнительных шин...")
    create_more_tires()
    
    print("\n✅ Создание дополнительных шин завершено!")
    print(f"📊 Общая статистика:")
    print(f"   Шин: {TireProduct.objects.count()}")

if __name__ == '__main__':
    main()
