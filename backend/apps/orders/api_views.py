from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from decimal import Decimal
import uuid
from datetime import datetime

from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from apps.products.models import TireProduct, WheelProduct


@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    """Создание нового заказа"""
    try:
        with transaction.atomic():
            data = request.data
            print(f"Получены данные заказа: {data}")
            
            # Валидация данных
            serializer = CreateOrderSerializer(data=data)
            if not serializer.is_valid():
                print(f"Ошибки валидации: {serializer.errors}")
                return Response(
                    {'error': 'Некорректные данные', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            validated_data = serializer.validated_data
            
            # Генерация номера заказа
            order_number = f"PK-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
            
            # Расчет сумм
            subtotal = Decimal('0')
            items_data = validated_data['items']
            
            # Проверяем товары и считаем сумму
            order_items = []
            for item_data in items_data:
                product_id = item_data['product_id']
                product_type = item_data['product_type']
                quantity = item_data['quantity']
                
                # Получаем товар
                if product_type == 'tire':
                    try:
                        product = TireProduct.objects.get(id=product_id, is_active=True)
                        content_type = ContentType.objects.get_for_model(TireProduct)
                    except TireProduct.DoesNotExist:
                        return Response(
                            {'error': f'Товар с ID {product_id} не найден'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                elif product_type == 'wheel':
                    try:
                        product = WheelProduct.objects.get(id=product_id, is_active=True)
                        content_type = ContentType.objects.get_for_model(WheelProduct)
                    except WheelProduct.DoesNotExist:
                        return Response(
                            {'error': f'Товар с ID {product_id} не найден'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    return Response(
                        {'error': f'Неизвестный тип товара: {product_type}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Проверяем наличие
                if product.stock_quantity < quantity:
                    return Response(
                        {'error': f'Недостаточно товара "{product.name}" на складе'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                unit_price = product.final_price
                total_price = unit_price * quantity
                subtotal += total_price
                
                order_items.append({
                    'content_type': content_type,
                    'product': product,
                    'quantity': quantity,
                    'unit_price': unit_price,
                    'total_price': total_price
                })
            
            # Расчет доставки
            shipping_cost = Decimal('500') if validated_data['delivery_method'] == 'delivery' else Decimal('0')
            total_amount = subtotal + shipping_cost
            
            # Создаем заказ
            order = Order.objects.create(
                order_number=order_number,
                customer_name=validated_data['customer_name'],
                customer_phone=validated_data['customer_phone'],
                customer_email=validated_data['customer_email'],
                needs_call=validated_data.get('needs_call', False),
                delivery_method=validated_data['delivery_method'],
                payment_method=validated_data['payment_method'],
                delivery_address=validated_data.get('delivery_address', ''),
                subtotal=subtotal,
                shipping_cost=shipping_cost,
                total_amount=total_amount,
                notes=validated_data.get('comment', ''),
                shipping_address={
                    'delivery_method': validated_data['delivery_method'],
                    'address': validated_data.get('delivery_address', ''),
                    'customer_name': validated_data['customer_name'],
                    'customer_phone': validated_data['customer_phone'],
                }
            )
            
            # Создаем элементы заказа
            for item_data in order_items:
                OrderItem.objects.create(
                    order=order,
                    content_type=item_data['content_type'],
                    object_id=item_data['product'].id,
                    product_name=f"{item_data['product'].brand.name} {item_data['product'].name}",
                    product_sku=item_data['product'].sku,
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price'],
                    total_price=item_data['total_price']
                )
                
                # Уменьшаем количество на складе
                item_data['product'].stock_quantity -= item_data['quantity']
                item_data['product'].save()
            
            # Возвращаем созданный заказ
            response_serializer = OrderSerializer(order)
            return Response({
                'success': True,
                'message': 'Заказ успешно создан',
                'order': response_serializer.data
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response(
            {'error': f'Ошибка при создании заказа: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class OrderListView(generics.ListAPIView):
    """Список заказов"""
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        return Order.objects.all().order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    """Детали заказа"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_number' 