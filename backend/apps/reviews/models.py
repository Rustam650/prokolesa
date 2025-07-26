from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.accounts.models import User


class Review(models.Model):
    """Модель отзыва"""
    
    STATUS_CHOICES = [
        ('pending', 'На модерации'),
        ('approved', 'Одобрен'),
        ('rejected', 'Отклонен'),
    ]
    
    # Основная информация - используем GenericForeignKey для связи с любым типом продукта
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    # Рейтинг и текст
    rating = models.PositiveIntegerField(
        _('rating'), 
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(_('title'), max_length=200)
    text = models.TextField(_('text'))
    
    # Плюсы и минусы
    pros = models.TextField(_('pros'), blank=True)
    cons = models.TextField(_('cons'), blank=True)
    
    # Статус и модерация
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    moderator_comment = models.TextField(_('moderator comment'), blank=True)
    
    # Полезность отзыва
    helpful_count = models.PositiveIntegerField(_('helpful count'), default=0)
    not_helpful_count = models.PositiveIntegerField(_('not helpful count'), default=0)
    
    # Временные метки
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['-created_at']
        unique_together = ['content_type', 'object_id', 'user']  # Один отзыв от пользователя на товар
    
    def __str__(self):
        return f"Отзыв от {self.user.username} на {self.product}"
    
    @property
    def helpful_ratio(self):
        """Соотношение полезности отзыва"""
        total = self.helpful_count + self.not_helpful_count
        if total == 0:
            return 0
        return (self.helpful_count / total) * 100
