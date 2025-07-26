from django.core.management.base import BaseCommand
from apps.products.models import TireProduct
from apps.products.serializers import ProductDetailSerializer
import requests


class Command(BaseCommand):
    help = 'Проверяет соответствие данных EU Label между Django и API'

    def handle(self, *args, **options):
        self.stdout.write("=== Проверка данных EU Label ===\n")
        
        # Проверяем данные в Django
        self.check_django_data()
        
        # Проверяем данные через API
        self.check_api_data()
        
        # Сравниваем данные
        self.compare_data()

    def check_django_data(self):
        """Проверяем данные EU Label в Django"""
        self.stdout.write("1. Данные в Django:")
        
        tires = TireProduct.objects.filter(
            fuel_efficiency__isnull=False,
            wet_grip__isnull=False,
            noise_level__isnull=False
        )[:3]
        
        if not tires:
            self.stdout.write("   ❌ Нет шин с EU Label данными")
            return
        
        for tire in tires:
            self.stdout.write(f"   Шина: {tire.product.name}")
            self.stdout.write(f"     Топливная экономичность: {tire.fuel_efficiency}")
            self.stdout.write(f"     Сцепление на мокрой дороге: {tire.wet_grip}")
            self.stdout.write(f"     Уровень шума: {tire.noise_level} дБ")
        
        self.stdout.write(f"   ✅ Найдено {tires.count()} шин с EU Label данными\n")

    def check_api_data(self):
        """Проверяем данные EU Label через API"""
        self.stdout.write("2. Данные через API:")
        
        try:
            response = requests.get('http://localhost:8000/api/products/?product_type=tire&limit=3')
            
            if response.status_code == 200:
                data = response.json()
                products_with_eu_label = 0
                
                for product in data.get('results', []):
                    eu_label = product.get('euLabel')
                    
                    if eu_label:
                        products_with_eu_label += 1
                        self.stdout.write(f"   Товар: {product['name']}")
                        self.stdout.write(f"     Топливная экономичность: {eu_label['fuelEfficiency']}")
                        self.stdout.write(f"     Сцепление на мокрой дороге: {eu_label['wetGrip']}")
                        self.stdout.write(f"     Уровень шума: {eu_label['noiseLevel']} дБ")
                
                if products_with_eu_label > 0:
                    self.stdout.write(f"   ✅ Найдено {products_with_eu_label} товаров с EU Label через API")
                else:
                    self.stdout.write("   ❌ Нет товаров с EU Label через API")
            else:
                self.stdout.write(f"   ❌ Ошибка API: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            self.stdout.write("   ❌ Django сервер не запущен на localhost:8000")
        
        self.stdout.write("")

    def compare_data(self):
        """Сравниваем данные Django и API"""
        self.stdout.write("3. Сравнение данных:")
        
        # Получаем данные из Django
        tire = TireProduct.objects.filter(
            fuel_efficiency__isnull=False,
            wet_grip__isnull=False,
            noise_level__isnull=False
        ).first()
        
        if not tire:
            self.stdout.write("   ❌ Нет шин с EU Label данными в Django")
            return
        
        self.stdout.write(f"   Тестируем: {tire.product.name}")
        
        # Данные из Django
        django_data = {
            'fuelEfficiency': tire.fuel_efficiency,
            'wetGrip': tire.wet_grip,
            'noiseLevel': tire.noise_level
        }
        
        self.stdout.write(f"   Django: {django_data}")
        
        # Получаем данные через API
        try:
            response = requests.get(f'http://localhost:8000/api/products/{tire.product.slug}/')
            
            if response.status_code == 200:
                api_data = response.json()
                eu_label = api_data.get('euLabel')
                
                if eu_label:
                    self.stdout.write(f"   API: {eu_label}")
                    
                    if eu_label == django_data:
                        self.stdout.write("   ✅ Данные полностью совпадают!")
                    else:
                        self.stdout.write("   ❌ Данные НЕ совпадают!")
                        for key in django_data:
                            if eu_label.get(key) != django_data[key]:
                                self.stdout.write(f"     {key}: Django={django_data[key]}, API={eu_label.get(key)}")
                else:
                    self.stdout.write("   ❌ EU Label отсутствует в API")
            else:
                self.stdout.write(f"   ❌ Ошибка API: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            self.stdout.write("   ❌ Django сервер не запущен на localhost:8000") 