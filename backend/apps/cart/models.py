from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.accounts.models import User


class Cart(models.Model):
    """Модель корзины"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')
    
    def __str__(self):
        return f"Корзина {self.user.username}"
    
    @property
    def total_price(self):
        """Общая стоимость корзины"""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def total_items(self):
        """Общее количество товаров"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """Элемент корзины"""
    
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    
    # Используем GenericForeignKey для связи с любым типом продукта
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    
    quantity = models.PositiveIntegerField(_('quantity'), default=1)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Cart Item')
        verbose_name_plural = _('Cart Items')
        unique_together = ['cart', 'content_type', 'object_id']
    
    def __str__(self):
        return f"{self.product} x {self.quantity}"
    
    @property
    def total_price(self):
        """Общая стоимость позиции"""
        return self.product.final_price * self.quantity
