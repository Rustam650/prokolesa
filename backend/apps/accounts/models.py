from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Кастомная модель пользователя"""
    
    GENDER_CHOICES = [
        ('M', _('Male')),
        ('F', _('Female')),
        ('O', _('Other')),
    ]
    
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(_('phone number'), max_length=20, blank=True, null=True)
    birth_date = models.DateField(_('birth date'), blank=True, null=True)
    gender = models.CharField(_('gender'), max_length=1, choices=GENDER_CHOICES, blank=True)
    avatar = models.ImageField(_('avatar'), upload_to='avatars/', blank=True, null=True)
    
    # Адресная информация
    city = models.CharField(_('city'), max_length=100, blank=True)
    address = models.TextField(_('address'), blank=True)
    postal_code = models.CharField(_('postal code'), max_length=20, blank=True)
    
    # Настройки уведомлений
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    sms_notifications = models.BooleanField(_('SMS notifications'), default=False)
    push_notifications = models.BooleanField(_('push notifications'), default=True)
    
    # Система лояльности
    loyalty_points = models.PositiveIntegerField(_('loyalty points'), default=0)
    total_spent = models.DecimalField(_('total spent'), max_digits=10, decimal_places=2, default=0)
    
    # Метаданные
    is_verified = models.BooleanField(_('is verified'), default=False)
    verification_token = models.CharField(_('verification token'), max_length=100, blank=True)
    last_activity = models.DateTimeField(_('last activity'), auto_now=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def add_loyalty_points(self, points):
        """Добавить баллы лояльности"""
        self.loyalty_points += points
        self.save(update_fields=['loyalty_points'])
    
    def spend_loyalty_points(self, points):
        """Потратить баллы лояльности"""
        if self.loyalty_points >= points:
            self.loyalty_points -= points
            self.save(update_fields=['loyalty_points'])
            return True
        return False


class UserProfile(models.Model):
    """Расширенный профиль пользователя"""
    
    THEME_CHOICES = [
        ('light', _('Light')),
        ('dark', _('Dark')),
        ('auto', _('Auto')),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Автомобильная информация
    car_make = models.CharField(_('car make'), max_length=50, blank=True)
    car_model = models.CharField(_('car model'), max_length=50, blank=True)
    car_year = models.PositiveIntegerField(_('car year'), blank=True, null=True)
    tire_size = models.CharField(_('tire size'), max_length=20, blank=True)
    wheel_size = models.CharField(_('wheel size'), max_length=20, blank=True)
    
    # Предпочтения
    preferred_brands = models.JSONField(_('preferred brands'), default=list, blank=True)
    price_range_min = models.DecimalField(_('min price range'), max_digits=8, decimal_places=2, blank=True, null=True)
    price_range_max = models.DecimalField(_('max price range'), max_digits=8, decimal_places=2, blank=True, null=True)
    
    # Социальные сети
    telegram_id = models.CharField(_('Telegram ID'), max_length=50, blank=True)
    vk_id = models.CharField(_('VK ID'), max_length=50, blank=True)
    
    # Настройки
    theme_preference = models.CharField(_('theme preference'), max_length=10, 
                                      choices=THEME_CHOICES, 
                                      default='auto')
    language = models.CharField(_('language'), max_length=10, default='ru')
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
    
    def __str__(self):
        return f"Profile of {self.user.username}"


class Address(models.Model):
    """Модель адресов пользователя"""
    
    ADDRESS_TYPES = [
        ('home', _('Home')),
        ('work', _('Work')),
        ('other', _('Other')),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    type = models.CharField(_('address type'), max_length=10, choices=ADDRESS_TYPES, default='home')
    title = models.CharField(_('title'), max_length=100)
    
    # Адресные поля
    country = models.CharField(_('country'), max_length=100, default='Россия')
    region = models.CharField(_('region'), max_length=100)
    city = models.CharField(_('city'), max_length=100)
    street = models.CharField(_('street'), max_length=200)
    house = models.CharField(_('house'), max_length=20)
    apartment = models.CharField(_('apartment'), max_length=20, blank=True)
    postal_code = models.CharField(_('postal code'), max_length=20)
    
    # Координаты для геолокации
    latitude = models.DecimalField(_('latitude'), max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(_('longitude'), max_digits=9, decimal_places=6, blank=True, null=True)
    
    is_default = models.BooleanField(_('is default'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Address')
        verbose_name_plural = _('Addresses')
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.city}, {self.street} {self.house}"
    
    def save(self, *args, **kwargs):
        # Если адрес устанавливается как основной, убираем флаг у других
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs) 