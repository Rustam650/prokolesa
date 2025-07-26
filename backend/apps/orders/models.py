from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.accounts.models import User


class Order(models.Model):
    """Модель заказа"""
    
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('confirmed', 'Подтвержден'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
        ('refunded', 'Возвращен'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('paid', 'Оплачен'),
        ('failed', 'Ошибка оплаты'),
        ('refunded', 'Возвращен'),
    ]
    
    # Основная информация
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    order_number = models.CharField(_('order number'), max_length=50, unique=True)
    
    # Данные клиента (для заказов без регистрации)
    customer_name = models.CharField(_('customer name'), max_length=200, default='')
    customer_phone = models.CharField(_('customer phone'), max_length=20, default='')
    customer_email = models.EmailField(_('customer email'), default='')
    needs_call = models.BooleanField(_('needs call'), default=False)
    
    # Способы доставки и оплаты
    delivery_method = models.CharField(_('delivery method'), max_length=20, 
                                     choices=[('pickup', 'Самовывоз'), ('delivery', 'Доставка')], 
                                     default='pickup')
    payment_method = models.CharField(_('payment method'), max_length=20,
                                    choices=[('cash', 'Наличные'), ('card', 'Карта'), ('transfer', 'Перевод')],
                                    default='cash')
    delivery_address = models.TextField(_('delivery address'), blank=True)
    
    # Статусы
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(_('payment status'), max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Суммы
    subtotal = models.DecimalField(_('subtotal'), max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(_('shipping cost'), max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(_('tax amount'), max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(_('total amount'), max_digits=10, decimal_places=2)
    
    # Адрес доставки
    shipping_address = models.JSONField(_('shipping address'), default=dict)
    
    # Примечания
    notes = models.TextField(_('notes'), blank=True)
    
    # Временные метки
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Заказ #{self.order_number}"


class OrderItem(models.Model):
    """Элемент заказа"""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # Используем GenericForeignKey для связи с любым типом продукта
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    
    # Сохраняем данные на момент заказа
    product_name = models.CharField(_('product name'), max_length=200)
    product_sku = models.CharField(_('product sku'), max_length=50)
    
    quantity = models.PositiveIntegerField(_('quantity'))
    unit_price = models.DecimalField(_('unit price'), max_digits=10, decimal_places=2)
    total_price = models.DecimalField(_('total price'), max_digits=10, decimal_places=2)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('Order Item')
        verbose_name_plural = _('Order Items')
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
