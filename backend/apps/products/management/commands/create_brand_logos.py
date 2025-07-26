from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps.products.models import Brand
import random


class Command(BaseCommand):
    help = 'Create logos for existing brands'

    def handle(self, *args, **options):
        self.stdout.write('Создание логотипов для брендов...')
        
        brands = Brand.objects.all()
        
        if not brands.exists():
            self.stdout.write('Нет брендов для создания логотипов')
            return
        
        # Цветовые схемы для разных брендов
        brand_colors = {
            'Michelin': {'primary': '#FFD700', 'secondary': '#1E3A8A', 'text': '#FFFFFF'},
            'Bridgestone': {'primary': '#DC2626', 'secondary': '#000000', 'text': '#FFFFFF'},
            'Continental': {'primary': '#F97316', 'secondary': '#1F2937', 'text': '#FFFFFF'},
            'Pirelli': {'primary': '#FDE047', 'secondary': '#000000', 'text': '#000000'},
            'Goodyear': {'primary': '#3B82F6', 'secondary': '#FDE047', 'text': '#FFFFFF'},
            'Nokian': {'primary': '#10B981', 'secondary': '#1F2937', 'text': '#FFFFFF'},
            'Yokohama': {'primary': '#DC2626', 'secondary': '#FFFFFF', 'text': '#FFFFFF'},
            'Hankook': {'primary': '#1F2937', 'secondary': '#F97316', 'text': '#FFFFFF'},
            'BBS': {'primary': '#6366F1', 'secondary': '#F3F4F6', 'text': '#FFFFFF'},
            'OZ Racing': {'primary': '#DC2626', 'secondary': '#000000', 'text': '#FFFFFF'},
            'Enkei': {'primary': '#1F2937', 'secondary': '#3B82F6', 'text': '#FFFFFF'},
            'Borbet': {'primary': '#059669', 'secondary': '#F3F4F6', 'text': '#FFFFFF'},
        }
        
        for brand in brands:
            try:
                # Получаем цвета для бренда или используем случайные
                colors = brand_colors.get(brand.name, {
                    'primary': random.choice(['#DC2626', '#3B82F6', '#059669', '#7C3AED', '#F97316']),
                    'secondary': '#1F2937',
                    'text': '#FFFFFF'
                })
                
                # Создаем SVG логотип
                svg_content = self.create_brand_logo(brand.name, colors)
                filename = f"logo-{brand.slug}.svg"
                
                logo_content = ContentFile(svg_content.encode('utf-8'))
                
                # Сохраняем логотип
                brand.logo.save(filename, logo_content, save=True)
                
                self.stdout.write(f'Создан логотип для {brand.name}')
                    
            except Exception as e:
                self.stdout.write(f'Ошибка создания логотипа для {brand.name}: {e}')
                continue
        
        self.stdout.write(f'Логотипы созданы для {brands.count()} брендов')
        self.stdout.write(self.style.SUCCESS('Логотипы успешно созданы!'))

    def create_brand_logo(self, brand_name, colors):
        """Создает SVG логотип бренда"""
        # Сокращаем название для логотипа
        logo_text = brand_name[:8] if len(brand_name) <= 8 else brand_name[:6] + '..'
        
        # Определяем размер шрифта в зависимости от длины текста
        font_size = 32 if len(logo_text) <= 4 else 28 if len(logo_text) <= 6 else 24
        
        return f'''<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Фон -->
  <rect width="120" height="120" rx="12" fill="{colors['primary']}"/>
  
  <!-- Декоративные элементы -->
  <circle cx="20" cy="20" r="8" fill="{colors['secondary']}" opacity="0.3"/>
  <circle cx="100" cy="100" r="6" fill="{colors['secondary']}" opacity="0.2"/>
  
  <!-- Основной текст -->
  <text x="60" y="70" text-anchor="middle" fill="{colors['text']}" 
        font-family="Arial, sans-serif" font-size="{font_size}" font-weight="bold">
    {logo_text}
  </text>
  
  <!-- Подчеркивание -->
  <line x1="20" y1="85" x2="100" y2="85" stroke="{colors['text']}" stroke-width="2" opacity="0.8"/>
  
  <!-- Дополнительные декоративные элементы -->
  <rect x="15" y="15" width="4" height="4" fill="{colors['text']}" opacity="0.6"/>
  <rect x="101" y="15" width="4" height="4" fill="{colors['text']}" opacity="0.6"/>
</svg>''' 