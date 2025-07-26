from django.core.management.base import BaseCommand
from apps.products.models import Brand

class Command(BaseCommand):
    help = 'Добавляет дополнительные бренды шин и дисков'

    def handle(self, *args, **options):
        # Дополнительные бренды шин
        tire_brands = [
            # Премиум бренды
            {'name': 'Dunlop', 'slug': 'dunlop', 'description': 'Британский производитель премиальных шин'},
            {'name': 'Falken', 'slug': 'falken', 'description': 'Японский бренд высокопроизводительных шин'},
            {'name': 'Toyo', 'slug': 'toyo', 'description': 'Японский производитель качественных шин'},
            {'name': 'Kumho', 'slug': 'kumho', 'description': 'Корейский бренд надежных шин'},
            {'name': 'Maxxis', 'slug': 'maxxis', 'description': 'Тайваньский производитель шин для различных условий'},
            {'name': 'Cooper', 'slug': 'cooper', 'description': 'Американский бренд прочных шин'},
            {'name': 'General Tire', 'slug': 'general-tire', 'description': 'Американский производитель универсальных шин'},
            {'name': 'Uniroyal', 'slug': 'uniroyal', 'description': 'Немецкий бренд шин для дождливых условий'},
            
            # Средний сегмент
            {'name': 'Nexen', 'slug': 'nexen', 'description': 'Корейский производитель доступных качественных шин'},
            {'name': 'Nitto', 'slug': 'nitto', 'description': 'Японский бренд спортивных шин'},
            {'name': 'Federal', 'slug': 'federal', 'description': 'Тайваньский производитель шин'},
            {'name': 'Achilles', 'slug': 'achilles', 'description': 'Индонезийский бренд бюджетных шин'},
            {'name': 'Accelera', 'slug': 'accelera', 'description': 'Индонезийский производитель спортивных шин'},
            {'name': 'Atturo', 'slug': 'atturo', 'description': 'Американский бренд внедорожных шин'},
            
            # Российские и СНГ бренды
            {'name': 'Cordiant', 'slug': 'cordiant', 'description': 'Российский производитель шин'},
            {'name': 'Viatti', 'slug': 'viatti', 'description': 'Российский бренд современных шин'},
            {'name': 'Kama', 'slug': 'kama', 'description': 'Российский производитель шин KAMA TYRES'},
            {'name': 'Amtel', 'slug': 'amtel', 'description': 'Российский бренд шин'},
            {'name': 'Matador', 'slug': 'matador', 'description': 'Словацкий производитель шин'},
            {'name': 'Barum', 'slug': 'barum', 'description': 'Чешский бренд доступных шин'},
            
            # Китайские бренды
            {'name': 'Triangle', 'slug': 'triangle', 'description': 'Китайский производитель шин'},
            {'name': 'Linglong', 'slug': 'linglong', 'description': 'Китайский бренд качественных шин'},
            {'name': 'Roadstone', 'slug': 'roadstone', 'description': 'Корейский бренд универсальных шин'},
            {'name': 'Sailun', 'slug': 'sailun', 'description': 'Китайский производитель шин'},
        ]

        # Дополнительные бренды дисков
        wheel_brands = [
            # Премиум бренды
            {'name': 'HRE', 'slug': 'hre', 'description': 'Американский производитель кованых дисков премиум-класса'},
            {'name': 'Vossen', 'slug': 'vossen', 'description': 'Американский бренд стильных дисков'},
            {'name': 'Rotiform', 'slug': 'rotiform', 'description': 'Американский производитель дизайнерских дисков'},
            {'name': 'Fifteen52', 'slug': 'fifteen52', 'description': 'Американский бренд раллийных дисков'},
            {'name': 'Method Race Wheels', 'slug': 'method', 'description': 'Американский производитель внедорожных дисков'},
            {'name': 'Konig', 'slug': 'konig', 'description': 'Американский бренд легких дисков'},
            {'name': 'Sparco', 'slug': 'sparco', 'description': 'Итальянский производитель спортивных дисков'},
            {'name': 'Speedline', 'slug': 'speedline', 'description': 'Итальянский бренд гоночных дисков'},
            
            # Европейские бренды
            {'name': 'AEZ', 'slug': 'aez', 'description': 'Немецкий производитель качественных дисков'},
            {'name': 'Dezent', 'slug': 'dezent', 'description': 'Немецкий бренд стильных дисков'},
            {'name': 'Dotz', 'slug': 'dotz', 'description': 'Немецкий производитель дисков'},
            {'name': 'Enzo', 'slug': 'enzo', 'description': 'Итальянский бренд дизайнерских дисков'},
            {'name': 'Fondmetal', 'slug': 'fondmetal', 'description': 'Итальянский производитель спортивных дисков'},
            {'name': 'Momo', 'slug': 'momo', 'description': 'Итальянский бренд автоспортивных дисков'},
            {'name': 'Ronal', 'slug': 'ronal', 'description': 'Швейцарский производитель премиальных дисков'},
            {'name': 'Schmidt', 'slug': 'schmidt', 'description': 'Немецкий бренд кованых дисков'},
            
            # Японские бренды
            {'name': 'Work', 'slug': 'work', 'description': 'Японский производитель кованых дисков'},
            {'name': 'Rays', 'slug': 'rays', 'description': 'Японский бренд высокотехнологичных дисков'},
            {'name': 'SSR', 'slug': 'ssr', 'description': 'Японский производитель спортивных дисков'},
            {'name': 'Advan', 'slug': 'advan', 'description': 'Японский бренд гоночных дисков'},
            {'name': 'Mugen', 'slug': 'mugen', 'description': 'Японский производитель тюнинговых дисков'},
            
            # Доступные бренды
            {'name': 'Replay', 'slug': 'replay', 'description': 'Российский производитель реплик оригинальных дисков'},
            {'name': 'LegeArtis', 'slug': 'legeartis', 'description': 'Российский бренд качественных реплик'},
            {'name': 'LS Wheels', 'slug': 'ls-wheels', 'description': 'Корейский производитель доступных дисков'},
            {'name': 'Tech Line', 'slug': 'tech-line', 'description': 'Российский бренд бюджетных дисков'},
            {'name': 'Skad', 'slug': 'skad', 'description': 'Российский производитель штампованных дисков'},
        ]

        # Добавляем бренды шин
        tire_count = 0
        for brand_data in tire_brands:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults={
                    'name': brand_data['name'],
                    'description': brand_data['description'],
                    'product_types': 'tire',
                    'is_active': True
                }
            )
            if created:
                tire_count += 1
                self.stdout.write(f"✅ Добавлен бренд шин: {brand.name}")
            else:
                self.stdout.write(f"⚠️  Бренд шин уже существует: {brand.name}")

        # Добавляем бренды дисков
        wheel_count = 0
        for brand_data in wheel_brands:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults={
                    'name': brand_data['name'],
                    'description': brand_data['description'],
                    'product_types': 'wheel',
                    'is_active': True
                }
            )
            if created:
                wheel_count += 1
                self.stdout.write(f"✅ Добавлен бренд дисков: {brand.name}")
            else:
                self.stdout.write(f"⚠️  Бренд дисков уже существует: {brand.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 Успешно добавлено:\n'
                f'   • Брендов шин: {tire_count}\n'
                f'   • Брендов дисков: {wheel_count}\n'
                f'   • Всего новых брендов: {tire_count + wheel_count}'
            )
        ) 