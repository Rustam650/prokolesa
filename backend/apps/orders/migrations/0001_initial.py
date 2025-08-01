# Generated by Django 5.2.2 on 2025-06-22 13:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.CharField(max_length=50, unique=True, verbose_name='order number')),
                ('status', models.CharField(choices=[('pending', 'Ожидает обработки'), ('confirmed', 'Подтвержден'), ('processing', 'В обработке'), ('shipped', 'Отправлен'), ('delivered', 'Доставлен'), ('cancelled', 'Отменен'), ('refunded', 'Возвращен')], default='pending', max_length=20, verbose_name='status')),
                ('payment_status', models.CharField(choices=[('pending', 'Ожидает оплаты'), ('paid', 'Оплачен'), ('failed', 'Ошибка оплаты'), ('refunded', 'Возвращен')], default='pending', max_length=20, verbose_name='payment status')),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='subtotal')),
                ('shipping_cost', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='shipping cost')),
                ('tax_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='tax amount')),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='total amount')),
                ('shipping_address', models.JSONField(default=dict, verbose_name='shipping address')),
                ('notes', models.TextField(blank=True, verbose_name='notes')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('product_name', models.CharField(max_length=200, verbose_name='product name')),
                ('product_sku', models.CharField(max_length=50, verbose_name='product sku')),
                ('quantity', models.PositiveIntegerField(verbose_name='quantity')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='unit price')),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='total price')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orders.order')),
            ],
            options={
                'verbose_name': 'Order Item',
                'verbose_name_plural': 'Order Items',
            },
        ),
    ]
