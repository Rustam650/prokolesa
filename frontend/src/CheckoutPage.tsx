import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  FormControl,
  RadioGroup,
  Radio
} from '@mui/material';
import { ArrowBack, ShoppingCart } from '@mui/icons-material';
import { useCart } from './hooks/useCart';
import { productAPI, orderAPI, CreateOrderData } from './api';
import { mapProductToCard, getPlaceholderImage } from './utils/productMapper';
import { ProductCardData } from './types/product';
import { orderStorage, StoredOrder } from './utils/orderStorage';

interface OrderData {
  customerName: string;
  phone: string;
  needsCall: boolean;
  email: string;
  comment: string;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'cash' | 'card' | 'transfer';
  deliveryAddress?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, clearCart } = useCart();
  const [products, setProducts] = useState<{ [key: number]: ProductCardData }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [orderData, setOrderData] = useState<OrderData>({
    customerName: '',
    phone: '',
    needsCall: false,
    email: '',
    comment: '',
    deliveryMethod: 'pickup',
    paymentMethod: 'cash'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Загружаем данные о товарах в корзине
  useEffect(() => {
    const loadCartProducts = async () => {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productPromises = items.map(item => 
          productAPI.getProductById(item.id, item.productType).catch(() => null)
        );
        
        const loadedProducts = await Promise.all(productPromises);
        const productsMap: { [key: number]: ProductCardData } = {};
        
        loadedProducts.forEach((product, index) => {
          if (product) {
            const mappedProduct = mapProductToCard(product);
            productsMap[items[index].id] = mappedProduct;
          }
        });
        
        setProducts(productsMap);
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartProducts();
  }, [items]);

  // Перенаправляем на корзину если она пуста
  useEffect(() => {
    if (!loading && items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, loading, navigate]);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = products[item.id];
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!orderData.customerName.trim()) {
      newErrors.customerName = 'Обязательное поле';
    }

    if (!orderData.phone.trim()) {
      newErrors.phone = 'Обязательное поле';
    } else if (!/^\+?[0-9\s\-()]{10,}$/.test(orderData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (!orderData.email.trim()) {
      newErrors.email = 'Обязательное поле';
    } else if (!/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (orderData.deliveryMethod === 'delivery' && !orderData.deliveryAddress?.trim()) {
      newErrors.deliveryAddress = 'Укажите адрес доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
      return;
    }

    setSubmitting(true);
    
    try {
      // Формируем данные для отправки
      const createOrderData: CreateOrderData = {
        customer_name: orderData.customerName,
        customer_phone: orderData.phone,
        customer_email: orderData.email,
        needs_call: orderData.needsCall,
        delivery_method: orderData.deliveryMethod,
        payment_method: orderData.paymentMethod,
        delivery_address: orderData.deliveryAddress || '',
        comment: orderData.comment,
        items: items.map(item => {
          // Определяем тип товара из загруженных данных продукта
          const product = products[item.id];
          let productType: 'tire' | 'wheel' = 'tire'; // значение по умолчанию
          
          if (item.productType) {
            productType = item.productType;
          } else if (product) {
            // Пытаемся определить тип по структуре данных товара
            // Если есть поля характерные для шин - это шина, иначе диск
            const productData = product as any;
            if (productData.width && productData.profile && productData.diameter) {
              productType = 'tire';
            } else if (productData.bolt_pattern || productData.offset) {
              productType = 'wheel';
            }
          }
          
          console.log(`Товар ${item.id}: тип = ${productType}, исходный тип = ${item.productType}`);
          
          return {
            product_id: item.id,
            product_type: productType,
            quantity: item.quantity
          };
        })
      };

      console.log('Отправка заказа:', createOrderData);
      console.log('Товары в корзине:', items);

      // Отправляем заказ на сервер
      const response = await orderAPI.createOrder(createOrderData);
      
      // Сохраняем заказ в localStorage
      const storedOrder: StoredOrder = {
        id: response.order.id.toString(),
        orderNumber: response.order.order_number,
        date: new Date().toISOString(),
        status: 'pending',
        total: calculateTotal(),
        items: items.map(item => {
          const product = products[item.id] || {
            name: `Товар ${item.id}`,
            brand: 'Неизвестно',
            price: 0,
            image: '/placeholder-product.svg',
            size: ''
          };
          return {
            id: item.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            quantity: item.quantity,
            image: product.image,
            size: product.size
          };
        }),
        customerInfo: {
          name: orderData.customerName,
          phone: orderData.phone,
          email: orderData.email,
          address: orderData.deliveryAddress,
          deliveryMethod: orderData.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка',
          paymentMethod: orderData.paymentMethod === 'cash' ? 'Наличные' : 
                        orderData.paymentMethod === 'card' ? 'Картой' : 'Безналичный расчёт'
        }
      };
      
      orderStorage.saveOrder(storedOrder);
      
      // Очищаем корзину и показываем успешное сообщение
      clearCart();
      alert(`Заказ успешно оформлен! Номер заказа: ${response.order.order_number}. Мы свяжемся с вами в ближайшее время.`);
      navigate('/');
      
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при оформлении заказа';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof OrderData, value: string | boolean) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/cart')}
          sx={{ mr: 2 }}
        >
          Назад в корзину
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#191A1B' }}>
          Оформление заказа
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
        gap: 4 
      }}>
        {/* Форма заказа */}
        <Box>
          <Paper sx={{ p: 4, borderRadius: '12px' }}>
            <form onSubmit={handleSubmit}>
              {/* Данные получателя */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Данные получателя
              </Typography>

              <TextField
                fullWidth
                label="Фамилия Имя Отчество"
                value={orderData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                error={!!errors.customerName}
                helperText={errors.customerName || 'Например: Иванов Пётр Сергеевич'}
                sx={{ mb: 3 }}
                required
              />

              <Alert severity="warning" sx={{ mb: 3 }}>
                Обязательно заполните ФИО для оплаты банковским переводом или пластиковой картой.
              </Alert>

              <TextField
                fullWidth
                label="Телефон"
                value={orderData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone || 'Например: +7 961 234-56-78'}
                sx={{ mb: 2 }}
                required
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderData.needsCall}
                    onChange={(e) => handleInputChange('needsCall', e.target.checked)}
                  />
                }
                label="Требуется звонок"
                sx={{ mb: 3 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                СМС-уведомления о статусе заказа будут приходить на данный номер.
              </Typography>

              <TextField
                fullWidth
                label="Электронная почта"
                type="email"
                value={orderData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email || 'Почту необходимо указать для получения банковского счёта на оплату.'}
                sx={{ mb: 4 }}
                required
              />

              {/* Способ получения */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Способ получения
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={orderData.deliveryMethod}
                  onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                >
                  <FormControlLabel 
                    value="pickup" 
                    control={<Radio />} 
                    label="Самовывоз (бесплатно)" 
                  />
                  <FormControlLabel 
                    value="delivery" 
                    control={<Radio />} 
                    label="Доставка курьером" 
                  />
                </RadioGroup>
              </FormControl>

              {orderData.deliveryMethod === 'delivery' && (
                <TextField
                  fullWidth
                  label="Адрес доставки"
                  value={orderData.deliveryAddress || ''}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  error={!!errors.deliveryAddress}
                  helperText={errors.deliveryAddress}
                  sx={{ mb: 3 }}
                  required
                />
              )}

              {/* Способ оплаты */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Способ оплаты
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 4 }}>
                <RadioGroup
                  value={orderData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                >
                  <FormControlLabel 
                    value="cash" 
                    control={<Radio />} 
                    label="Наличными при получении" 
                  />
                  <FormControlLabel 
                    value="card" 
                    control={<Radio />} 
                    label="Банковской картой" 
                  />
                  <FormControlLabel 
                    value="transfer" 
                    control={<Radio />} 
                    label="Банковским переводом" 
                  />
                </RadioGroup>
              </FormControl>

              {/* Комментарий к заказу */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Комментарий к заказу
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                value={orderData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Если у вас есть пожелания к заказу, например, необходимость в заглушках или крепежах — укажите это здесь."
                sx={{ mb: 4 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting}
                sx={{ 
                  borderRadius: '12px', 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {submitting ? 'Оформление заказа...' : 'Оформить заказ'}
              </Button>
            </form>
          </Paper>
        </Box>

        {/* Сводка заказа */}
        <Box>
          <Paper sx={{ p: 3, borderRadius: '12px', position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Ваш заказ
            </Typography>

            {/* Товары в заказе */}
            <Box sx={{ mb: 3 }}>
              {items.map((item) => {
                const product = products[item.id];
                if (!product) return null;

                return (
                  <Box key={`${item.id}-${item.productType}`} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid #E9ECEF'
                  }}>
                                         <Box sx={{ 
                       width: 70, 
                       height: 70, 
                       bgcolor: '#F8F9FA', 
                       borderRadius: 2,
                       mr: 2,
                       overflow: 'hidden',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       border: '1px solid #E9ECEF'
                     }}>
                       {product.image ? (
                         <img 
                           src={product.image} 
                           alt={product.name}
                           style={{
                             width: '100%',
                             height: '100%',
                             objectFit: 'cover'
                           }}
                                                        onError={(e) => {
                               // Пробуем загрузить правильный placeholder в зависимости от типа товара
                               const target = e.target as HTMLImageElement;
                               if (!target.src.includes('placeholder')) {
                                 const placeholderUrl = getPlaceholderImage(product);
                                 target.src = placeholderUrl;
                               } else {
                                 // Если и placeholder не загрузился, показываем иконку
                                 target.style.display = 'none';
                                 const parent = target.parentElement;
                                 if (parent) {
                                   parent.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/></svg>';
                                 }
                               }
                             }}
                         />
                       ) : (
                         <ShoppingCart color="action" />
                       )}
                     </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} шт. × {formatPrice(product.price)} ₽
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(product.price * item.quantity)} ₽
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Итоги */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Товаров:</Typography>
              <Typography>{totalItems} шт.</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Сумма товаров:</Typography>
              <Typography>{formatPrice(calculateTotal())} ₽</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Доставка:</Typography>
              <Typography>
                {orderData.deliveryMethod === 'pickup' ? 'Бесплатно' : '500 ₽'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Итого:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F72525' }}>
                {formatPrice(calculateTotal() + (orderData.deliveryMethod === 'delivery' ? 500 : 0))} ₽
              </Typography>
            </Box>

            <Alert severity="info" sx={{ borderRadius: '8px' }}>
              После оформления заказа с вами свяжется менеджер для подтверждения.
            </Alert>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPage; 