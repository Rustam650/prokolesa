from django.core.management.base import BaseCommand
from django.db.models import Avg, Count
from apps.products.models import Product

class Command(BaseCommand):
    help = 'Update product ratings based on reviews'

    def handle(self, *args, **options):
        self.stdout.write('Обновление рейтингов товаров...')
        
        products = Product.objects.annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        )
        
        updated_count = 0
        for product in products:
            if product.avg_rating is not None:
                product.rating = round(product.avg_rating, 2)
                product.reviews_count = product.review_count
                product.save(update_fields=['rating', 'reviews_count'])
                updated_count += 1
                self.stdout.write(f'Обновлен рейтинг для {product.name}: {product.rating} ({product.reviews_count} отзывов)')
        
        self.stdout.write(self.style.SUCCESS(f'Обновлено рейтингов: {updated_count}')) 