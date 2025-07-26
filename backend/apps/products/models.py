from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify
import uuid


class Category(models.Model):
    """Модель категорий"""
    
    name = models.CharField(_('name'), max_length=100)
    slug = models.SlugField(_('slug'), max_length=100, unique=True)
    description = models.TextField(_('description'), blank=True)
    image = models.ImageField(_('image'), upload_to='categories/', blank=True, null=True)
    icon = models.CharField(_('icon'), max_length=50, blank=True, help_text='CSS class для иконки')
    
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    
    is_active = models.BooleanField(_('is active'), default=True)
    sort_order = models.PositiveIntegerField(_('sort order'), default=0)
    
    # SEO поля
    meta_title = models.CharField(_('meta title'), max_length=200, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=500, blank=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['sort_order', 'name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Brand(models.Model):
    """Модель брендов"""
    
    PRODUCT_TYPES = [
        ('tire', _('Tires')),
        ('wheel', _('Wheels')),
        ('both', _('Tires and Wheels')),
        ('accessory', _('Accessories')),
    ]
    
    name = models.CharField(_('name'), max_length=100, unique=True)
    slug = models.SlugField(_('slug'), max_length=100, unique=True)
    description = models.TextField(_('description'), blank=True)
    logo = models.ImageField(_('logo'), upload_to='brands/', blank=True, null=True)
    website = models.URLField(_('website'), blank=True)
    
    # Типы товаров, которые производит бренд
    product_types = models.CharField(_('product types'), max_length=20, choices=PRODUCT_TYPES, default='both')
    
    # Рейтинг и популярность
    rating = models.DecimalField(_('rating'), max_digits=3, decimal_places=2, default=0)
    popularity_score = models.PositiveIntegerField(_('popularity score'), default=0)
    
    # Страна производства
    country = models.CharField(_('country'), max_length=100, blank=True)
    
    is_active = models.BooleanField(_('is active'), default=True)
    is_featured = models.BooleanField(_('is featured'), default=False)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Brand')
        verbose_name_plural = _('Brands')
        ordering = ['-popularity_score', 'name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class TireProduct(models.Model):
    """Модель для шин"""
    
    SEASONS = [
        ('summer', _('Summer')),
        ('winter', _('Winter')),
        ('all_season', _('All Season')),
    ]
    
    # Основная информация
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)
    sku = models.CharField(_('SKU'), max_length=50, unique=True)
    barcode = models.CharField(_('barcode'), max_length=50, blank=True)
    
    # Связи
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='tire_products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='tire_products')
    
    # Сезон
    season = models.CharField(_('season'), max_length=20, choices=SEASONS)
    
    # Описание
    short_description = models.TextField(_('short description'), max_length=500, blank=True)
    description = models.TextField(_('description'), blank=True)
    specifications = models.JSONField(_('specifications'), default=dict, blank=True)
    
    # Размеры шины
    width = models.PositiveIntegerField(_('width'), help_text='Ширина в мм')
    profile = models.PositiveIntegerField(_('profile'), help_text='Высота профиля в %')
    diameter = models.PositiveIntegerField(_('diameter'), help_text='Диаметр в дюймах')
    
    # Индексы
    load_index = models.CharField(_('load index'), max_length=10)
    speed_index = models.CharField(_('speed index'), max_length=5)
    
    # Характеристики
    tread_pattern = models.CharField(_('tread pattern'), max_length=100, blank=True)
    sidewall_type = models.CharField(_('sidewall type'), max_length=50, blank=True)
    
    # Технологии
    run_flat = models.BooleanField(_('run flat'), default=False)
    reinforced = models.BooleanField(_('reinforced'), default=False)
    studded = models.BooleanField(_('studded'), default=False)
    
    # Топливная экономичность (EU Label)
    fuel_efficiency = models.CharField(_('fuel efficiency'), max_length=1, blank=True,
                                     choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E'), ('F', 'F'), ('G', 'G')])
    wet_grip = models.CharField(_('wet grip'), max_length=1, blank=True,
                               choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E'), ('F', 'F'), ('G', 'G')])
    noise_level = models.PositiveIntegerField(_('noise level'), blank=True, null=True, help_text='дБ')
    
    # Цены
    price = models.DecimalField(_('price'), max_digits=10, decimal_places=2)
    old_price = models.DecimalField(_('old price'), max_digits=10, decimal_places=2, blank=True, null=True)
    cost_price = models.DecimalField(_('cost price'), max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Скидки
    discount_percent = models.PositiveIntegerField(_('discount percent'), default=0, 
                                                 validators=[MaxValueValidator(100)])
    
    # Склад
    stock_quantity = models.PositiveIntegerField(_('stock quantity'), default=0)
    min_stock_level = models.PositiveIntegerField(_('min stock level'), default=5)
    max_stock_level = models.PositiveIntegerField(_('max stock level'), default=1000)
    
    # Размеры и вес
    weight = models.DecimalField(_('weight'), max_digits=8, decimal_places=3, blank=True, null=True)
    
    # Статусы
    is_active = models.BooleanField(_('is active'), default=True)
    is_featured = models.BooleanField(_('is featured'), default=False)
    is_bestseller = models.BooleanField(_('is bestseller'), default=False)
    is_new = models.BooleanField(_('is new'), default=False)
    is_on_sale = models.BooleanField(_('is on sale'), default=False)
    
    # Рейтинг и отзывы
    rating = models.DecimalField(_('rating'), max_digits=3, decimal_places=2, default=0)
    reviews_count = models.PositiveIntegerField(_('reviews count'), default=0)
    
    # Счетчики
    views_count = models.PositiveIntegerField(_('views count'), default=0)
    sales_count = models.PositiveIntegerField(_('sales count'), default=0)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=200, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=500, blank=True)
    
    # Временные метки
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Tire Product')
        verbose_name_plural = _('Tire Products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active', 'season']),
            models.Index(fields=['brand', 'category']),
            models.Index(fields=['price']),
            models.Index(fields=['-rating']),
            models.Index(fields=['width', 'profile', 'diameter']),
        ]
    
    def __str__(self):
        return f"{self.brand.name} {self.name} {self.width}/{self.profile}R{self.diameter}"
    
    @property
    def size_string(self):
        return f"{self.width}/{self.profile}R{self.diameter}"
    
    @property
    def final_price(self):
        """Финальная цена с учетом скидки"""
        if self.discount_percent > 0:
            return self.price * (100 - self.discount_percent) / 100
        return self.price
    
    @property
    def is_in_stock(self):
        """Проверка наличия на складе"""
        return self.stock_quantity > 0
    
    @property
    def stock_status(self):
        """Статус склада"""
        if self.stock_quantity == 0:
            return 'out_of_stock'
        elif self.stock_quantity <= self.min_stock_level:
            return 'low_stock'
        else:
            return 'in_stock'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.brand.name}-{self.name}-{self.width}-{self.profile}-{self.diameter}")
        if not self.sku:
            self.sku = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)


class WheelProduct(models.Model):
    """Модель для дисков"""
    
    WHEEL_TYPES = [
        ('alloy', _('Alloy')),
        ('steel', _('Steel')),
        ('forged', _('Forged')),
        ('carbon', _('Carbon')),
    ]
    
    # Основная информация
    name = models.CharField(_('name'), max_length=200)
    slug = models.SlugField(_('slug'), max_length=200, unique=True)
    sku = models.CharField(_('SKU'), max_length=50, unique=True)
    barcode = models.CharField(_('barcode'), max_length=50, blank=True)
    
    # Связи
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='wheel_products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='wheel_products')
    
    # Описание
    short_description = models.TextField(_('short description'), max_length=500, blank=True)
    description = models.TextField(_('description'), blank=True)
    specifications = models.JSONField(_('specifications'), default=dict, blank=True)
    
    # Размеры диска
    diameter = models.DecimalField(_('diameter'), max_digits=4, decimal_places=1, help_text='Диаметр в дюймах')
    width = models.DecimalField(_('width'), max_digits=4, decimal_places=1, help_text='Ширина в дюймах')
    
    # Параметры крепления
    bolt_pattern = models.CharField(_('bolt pattern'), max_length=20, help_text='Например: 5x114.3')
    center_bore = models.DecimalField(_('center bore'), max_digits=5, decimal_places=1, help_text='Диаметр центрального отверстия в мм')
    offset = models.IntegerField(_('offset'), help_text='Вылет в мм')
    
    # Тип и материал
    wheel_type = models.CharField(_('wheel type'), max_length=20, choices=WHEEL_TYPES)
    material = models.CharField(_('material'), max_length=100, blank=True)
    
    # Цвет и покрытие
    color = models.CharField(_('color'), max_length=7, default='#FFFFFF')
    finish = models.CharField(_('finish'), max_length=100, blank=True, help_text='Тип покрытия')
    
    # Совместимость
    compatible_cars = models.JSONField(_('compatible cars'), default=list, blank=True)
    
    # Цены
    price = models.DecimalField(_('price'), max_digits=10, decimal_places=2)
    old_price = models.DecimalField(_('old price'), max_digits=10, decimal_places=2, blank=True, null=True)
    cost_price = models.DecimalField(_('cost price'), max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Скидки
    discount_percent = models.PositiveIntegerField(_('discount percent'), default=0, 
                                                 validators=[MaxValueValidator(100)])
    
    # Склад
    stock_quantity = models.PositiveIntegerField(_('stock quantity'), default=0)
    min_stock_level = models.PositiveIntegerField(_('min stock level'), default=5)
    max_stock_level = models.PositiveIntegerField(_('max stock level'), default=1000)
    
    # Размеры и вес
    weight = models.DecimalField(_('weight'), max_digits=8, decimal_places=3, blank=True, null=True)
    
    # Статусы
    is_active = models.BooleanField(_('is active'), default=True)
    is_featured = models.BooleanField(_('is featured'), default=False)
    is_bestseller = models.BooleanField(_('is bestseller'), default=False)
    is_new = models.BooleanField(_('is new'), default=False)
    is_on_sale = models.BooleanField(_('is on sale'), default=False)
    
    # Рейтинг и отзывы
    rating = models.DecimalField(_('rating'), max_digits=3, decimal_places=2, default=0)
    reviews_count = models.PositiveIntegerField(_('reviews count'), default=0)
    
    # Счетчики
    views_count = models.PositiveIntegerField(_('views count'), default=0)
    sales_count = models.PositiveIntegerField(_('sales count'), default=0)
    
    # SEO
    meta_title = models.CharField(_('meta title'), max_length=200, blank=True)
    meta_description = models.TextField(_('meta description'), blank=True)
    meta_keywords = models.CharField(_('meta keywords'), max_length=500, blank=True)
    
    # Временные метки
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Wheel Product')
        verbose_name_plural = _('Wheel Products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active', 'wheel_type']),
            models.Index(fields=['brand', 'category']),
            models.Index(fields=['price']),
            models.Index(fields=['-rating']),
            models.Index(fields=['diameter', 'width']),
        ]
    
    def __str__(self):
        return f"{self.brand.name} {self.name} {self.diameter}x{self.width} {self.bolt_pattern}"
    
    @property
    def final_price(self):
        """Финальная цена с учетом скидки"""
        if self.discount_percent > 0:
            return self.price * (100 - self.discount_percent) / 100
        return self.price
    
    @property
    def is_in_stock(self):
        """Проверка наличия на складе"""
        return self.stock_quantity > 0
    
    @property
    def stock_status(self):
        """Статус склада"""
        if self.stock_quantity == 0:
            return 'out_of_stock'
        elif self.stock_quantity <= self.min_stock_level:
            return 'low_stock'
        else:
            return 'in_stock'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.brand.name}-{self.name}-{self.diameter}x{self.width}")
        if not self.sku:
            self.sku = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    """Изображения товаров"""
    
    # Используем GenericForeignKey для связи с любым типом продукта
    from django.contrib.contenttypes.fields import GenericForeignKey
    from django.contrib.contenttypes.models import ContentType
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    image = models.ImageField(_('image'), upload_to='products/')
    alt_text = models.CharField(_('alt text'), max_length=200, blank=True)
    title = models.CharField(_('title'), max_length=200, blank=True)
    
    is_main = models.BooleanField(_('is main'), default=False)
    sort_order = models.PositiveIntegerField(_('sort order'), default=0)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')
        ordering = ['sort_order', 'created_at']
    
    def __str__(self):
        return f"Image for {self.content_object}"
    
    def save(self, *args, **kwargs):
        # Если изображение устанавливается как основное, убираем флаг у других
        if self.is_main:
            ProductImage.objects.filter(
                content_type=self.content_type, 
                object_id=self.object_id, 
                is_main=True
            ).update(is_main=False)
        super().save(*args, **kwargs)


