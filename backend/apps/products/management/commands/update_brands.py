from django.core.management.base import BaseCommand
from apps.products.models import Brand


class Command(BaseCommand):
    help = 'Update brand data with ratings and featured status'

    def handle(self, *args, **options):
        self.stdout.write('Обновление данных брендов...')
        
        # Данные для обновления брендов
        brand_updates = {
            'Michelin': {
                'rating': 4.8,
                'popularity_score': 95,
                'is_featured': True,
                'description': 'Французский производитель премиальных шин с более чем 130-летней историей. Известен инновационными технологиями и высоким качеством.'
            },
            'Bridgestone': {
                'rating': 4.7,
                'popularity_score': 90,
                'is_featured': True,
                'description': 'Крупнейший производитель шин в мире. Японская компания, известная надежностью и технологическими инновациями.'
            },
            'Continental': {
                'rating': 4.6,
                'popularity_score': 85,
                'is_featured': True,
                'description': 'Немецкий производитель автомобильных компонентов и шин. Более 150 лет опыта в автомобильной индустрии.'
            },
            'Pirelli': {
                'rating': 4.5,
                'popularity_score': 80,
                'is_featured': True,
                'description': 'Итальянский производитель премиальных шин. Официальный поставщик Формулы-1 и других престижных автоспортивных серий.'
            },
            'Goodyear': {
                'rating': 4.4,
                'popularity_score': 75,
                'is_featured': False,
                'description': 'Американская компания с богатой историей. Известна инновационными решениями и широким ассортиментом шин.'
            },
            'Nokian': {
                'rating': 4.6,
                'popularity_score': 70,
                'is_featured': False,
                'description': 'Финский производитель, специализирующийся на зимних шинах. Лидер в области технологий для суровых климатических условий.'
            },
            'Yokohama': {
                'rating': 4.3,
                'popularity_score': 65,
                'is_featured': False,
                'description': 'Японский производитель шин с фокусом на высокие технологии и экологичность. Активно участвует в автоспорте.'
            },
            'Hankook': {
                'rating': 4.2,
                'popularity_score': 60,
                'is_featured': False,
                'description': 'Южнокорейский производитель шин, быстро растущий на мировом рынке. Сочетает качество и доступную цену.'
            },
            'BBS': {
                'rating': 4.9,
                'popularity_score': 85,
                'is_featured': True,
                'description': 'Немецкий производитель премиальных легкосплавных дисков. Эталон качества в мире автоспорта и тюнинга.'
            },
            'OZ Racing': {
                'rating': 4.8,
                'popularity_score': 80,
                'is_featured': True,
                'description': 'Итальянский производитель спортивных дисков. Официальный поставщик многих команд Формулы-1 и WRC.'
            },
            'Enkei': {
                'rating': 4.5,
                'popularity_score': 70,
                'is_featured': False,
                'description': 'Японский производитель легких и прочных дисков. Популярен в автоспорте и среди энтузиастов.'
            },
            'Borbet': {
                'rating': 4.3,
                'popularity_score': 60,
                'is_featured': False,
                'description': 'Немецкий производитель стильных дисков с отличным соотношением цены и качества.'
            }
        }
        
        updated_count = 0
        
        for brand_name, data in brand_updates.items():
            try:
                brand = Brand.objects.get(name=brand_name)
                
                brand.rating = data['rating']
                brand.popularity_score = data['popularity_score']
                brand.is_featured = data['is_featured']
                brand.description = data['description']
                
                brand.save()
                
                self.stdout.write(f'Обновлен бренд: {brand_name}')
                updated_count += 1
                
            except Brand.DoesNotExist:
                self.stdout.write(f'Бренд не найден: {brand_name}')
                continue
        
        self.stdout.write(f'Обновлено {updated_count} брендов')
        self.stdout.write(self.style.SUCCESS('Данные брендов успешно обновлены!')) 