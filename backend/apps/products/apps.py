from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    verbose_name = 'Товары'
    
    def ready(self):
        try:
            import apps.products.admin
        except ImportError:
            pass 