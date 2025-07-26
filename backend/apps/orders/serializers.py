from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор для элементов заказа"""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'product_sku', 'quantity', 
            'unit_price', 'total_price', 'created_at'
        ]


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор для заказов"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'payment_status', 'payment_status_display',
            'customer_name', 'customer_phone', 'customer_email',
            'needs_call', 'delivery_method', 'payment_method',
            'delivery_address', 'subtotal', 'shipping_cost',
            'tax_amount', 'total_amount', 'shipping_address',
            'notes', 'items', 'created_at', 'updated_at'
        ]


class CreateOrderItemSerializer(serializers.Serializer):
    """Сериализатор для создания элементов заказа"""
    product_id = serializers.IntegerField()
    product_type = serializers.ChoiceField(choices=['tire', 'wheel'])
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    """Сериализатор для создания заказа"""
    customer_name = serializers.CharField(max_length=200)
    customer_phone = serializers.CharField(max_length=20)
    customer_email = serializers.EmailField()
    needs_call = serializers.BooleanField(default=False)
    
    delivery_method = serializers.ChoiceField(choices=['pickup', 'delivery'])
    payment_method = serializers.ChoiceField(choices=['cash', 'card', 'transfer'])
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    
    comment = serializers.CharField(required=False, allow_blank=True)
    
    items = CreateOrderItemSerializer(many=True)
    
    def validate_items(self, value):
        """Валидация элементов заказа"""
        if not value:
            raise serializers.ValidationError("Заказ должен содержать хотя бы один товар")
        return value
    
    def validate(self, data):
        """Общая валидация"""
        # Если выбрана доставка, адрес обязателен
        if data['delivery_method'] == 'delivery' and not data.get('delivery_address'):
            raise serializers.ValidationError({
                'delivery_address': 'Адрес доставки обязателен при выборе доставки'
            })
        
        return data 