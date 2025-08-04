import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Alert,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart,
  ArrowBack,
  Receipt
} from '@mui/icons-material';
import { useCart } from './hooks/useCart';
import { productAPI } from './api';
import { mapProductToCard } from './utils/productMapper';
import { ProductCardData } from './types/product';
import { orderStorage, StoredOrder, formatOrderDate, getStatusText, getStatusColor } from './utils/orderStorage';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [products, setProducts] = useState<{ [key: number]: ProductCardData }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<StoredOrder[]>([]);

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
        console.error('Ошибка загрузки товаров корзины:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartProducts();
  }, [items]);

  // Загружаем заказы из localStorage
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = orderStorage.getOrders();
      setOrders(storedOrders);
    };

    loadOrders();
    
    // Обновляем заказы при изменении activeTab (если пользователь переключился на вкладку заказов)
    if (activeTab === 1) {
      loadOrders();
    }
  }, [activeTab]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Очистить корзину?')) {
      clearCart();
    }
  };

  // Получаем данные о товаре из загруженных данных
  const getProductData = (productId: number): ProductCardData => {
    return products[productId] || {
      id: productId,
      slug: '',
      name: `Товар ${productId}`,
      brand: 'Загрузка...',
      image: '/placeholder-product.svg',
      price: 0,
      rating: 0,
      reviewsCount: 0,
      inStock: true,
      size: 'Загрузка...',
      article: ''
    };
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const product = getProductData(item.id);
      return total + (product.price * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Компонент для отображения заказов
  const OrdersContent = () => {
    if (orders.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            У вас пока нет заказов
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Оформите первый заказ, чтобы увидеть его здесь
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/catalog')}
            sx={{ borderRadius: '12px' }}
          >
            Перейти в каталог
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {orders.map((order) => (
          <Card key={order.id} sx={{ borderRadius: '12px' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Заголовок заказа */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Заказ №{order.orderNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatOrderDate(order.date)}
                  </Typography>
                </Box>
                <Chip
                  label={getStatusText(order.status)}
                  sx={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Box>

              {/* Информация о заказе */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2, 
                mb: 2 
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Покупатель: {order.customerInfo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Телефон: {order.customerInfo.phone}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Доставка: {order.customerInfo.deliveryMethod}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Оплата: {order.customerInfo.paymentMethod}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Товары в заказе */}
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Товары ({order.items.length}):
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {order.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: '8px', 
                        objectFit: 'contain',
                        backgroundColor: '#F8F9FA'
                      }}
                      image={item.image}
                      alt={item.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.brand} {item.name}
                      </Typography>
                      {item.size && (
                        <Typography variant="caption" color="text.secondary">
                          {item.size}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} шт. × {formatPrice(item.price)} ₽
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatPrice(item.price * item.quantity)} ₽
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Итого */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Итого:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F72525' }}>
                  {formatPrice(order.total)} ₽
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Загрузка корзины...</Typography>
      </Container>
    );
  }

  // Компонент для пустой корзины
  const EmptyCartContent = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
        Корзина пуста
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Добавьте товары в корзину, чтобы оформить заказ
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/catalog')}
        sx={{ borderRadius: '12px' }}
      >
        Перейти в каталог
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Назад
        </Button>
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Корзина и заказы
        </Typography>

        {/* Вкладки */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              icon={<ShoppingCart />} 
              label={`Корзина (${totalItems})`} 
              iconPosition="start"
            />
            <Tab 
              icon={<Receipt />} 
              label={`Мои заказы (${orders.length})`} 
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Box>

      {/* Содержимое вкладок */}
      {activeTab === 0 && (
        <>
          {items.length === 0 ? (
            <EmptyCartContent />
          ) : (
            <>
              {/* Кнопка очистки корзины */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart}
                  startIcon={<DeleteIcon />}
                >
                  Очистить корзину
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Список товаров */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {items.map((item) => {
              const product = getProductData(item.id);
              const isProductLoaded = products[item.id] !== undefined;
              
              return (
                                 <Card key={item.id} sx={{ 
                   borderRadius: '16px', 
                   opacity: isProductLoaded ? 1 : 0.7,
                   border: '1px solid #E9ECEF',
                   boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                   maxWidth: { xs: '100%', sm: 600 },
                   margin: '0 auto',
                   '&:hover': {
                     boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                     transform: 'translateY(-1px)',
                     transition: 'all 0.2s ease'
                   }
                 }}>
                   <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                     <Box sx={{ 
                       display: 'flex', 
                       gap: { xs: 2, sm: 2.5 }, 
                       alignItems: 'flex-start',
                       flexDirection: 'row'
                     }}>
                       {/* Изображение */}
                       <CardMedia
                         component="img"
                         sx={{ 
                           width: { xs: 90, sm: 110 }, 
                           height: { xs: 90, sm: 110 }, 
                           borderRadius: '12px', 
                           objectFit: 'contain',
                           backgroundColor: '#F8F9FA',
                           flexShrink: 0,
                           border: '1px solid #F0F0F0'
                         }}
                         image={product.image}
                         alt={product.name}
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = '/placeholder-product.svg';
                         }}
                       />
                      
                                             {/* Информация о товаре */}
                       <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                         <Box>
                           <Typography 
                             variant="h6" 
                             sx={{ 
                               fontWeight: 600, 
                               mb: 1,
                               fontSize: { xs: '0.95rem', sm: '1.05rem' },
                               cursor: isProductLoaded ? 'pointer' : 'default',
                               '&:hover': isProductLoaded ? { color: '#F72525' } : {},
                               lineHeight: 1.3,
                               display: '-webkit-box',
                               WebkitLineClamp: 2,
                               WebkitBoxOrient: 'vertical',
                               overflow: 'hidden'
                             }}
                             onClick={() => {
                               if (isProductLoaded && product.slug) {
                                 navigate(`/product/${product.slug}`);
                               }
                             }}
                           >
                             {product.brand} {product.name}
                           </Typography>
                           
                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                             {product.size && (
                               <Chip 
                                 label={product.size} 
                                 size="small" 
                                 variant="outlined"
                                 sx={{ 
                                   fontSize: '0.7rem', 
                                   height: 24,
                                   borderColor: '#E0E0E0',
                                   color: '#666'
                                 }}
                               />
                             )}
                             {product.article && (
                               <Chip 
                                 label={`Арт: ${product.article}`} 
                                 size="small" 
                                 variant="outlined"
                                 sx={{ 
                                   fontSize: '0.7rem', 
                                   height: 24,
                                   borderColor: '#E0E0E0',
                                   color: '#666'
                                 }}
                               />
                             )}
                           </Box>
                         </Box>
                         
                         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                             <Typography variant="h6" sx={{ color: '#F72525', fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
                               {formatPrice(product.price)} ₽
                             </Typography>
                             {product.oldPrice && (
                               <Typography 
                                 variant="body2" 
                                 sx={{ 
                                   textDecoration: 'line-through', 
                                   color: '#999',
                                   fontSize: '0.85rem'
                                 }}
                               >
                                 {formatPrice(product.oldPrice)} ₽
                               </Typography>
                             )}
                           </Box>
                           
                           <Typography variant="body2" sx={{ 
                             color: '#F72525', 
                             fontWeight: 600,
                             fontSize: { xs: '0.9rem', sm: '1rem' }
                           }}>
                             Итого: {formatPrice(product.price * item.quantity)} ₽
                           </Typography>
                         </Box>
                         
                         {!isProductLoaded && (
                           <Alert severity="warning" sx={{ mt: 1, fontSize: '0.8rem' }}>
                             Информация о товаре загружается...
                           </Alert>
                         )}
                       </Box>

                                             {/* Управление количеством */}
                       <Box sx={{ 
                         display: 'flex', 
                         flexDirection: 'column', 
                         alignItems: 'flex-end', 
                         gap: 1.5,
                         flexShrink: 0,
                         minWidth: 120
                       }}>
                         <Box sx={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: 0.3,
                           backgroundColor: '#F8F9FA',
                           borderRadius: '10px',
                           p: 0.3,
                           border: '1px solid #E0E0E0'
                         }}>
                           <IconButton
                             size="small"
                             onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                             sx={{ 
                               width: 28, 
                               height: 28,
                               backgroundColor: 'white',
                               borderRadius: '6px',
                               '&:hover': { backgroundColor: '#F72525', color: 'white' },
                               '&:disabled': { backgroundColor: '#F0F0F0', color: '#CCC' }
                             }}
                             disabled={item.quantity <= 1}
                           >
                             <RemoveIcon sx={{ fontSize: 16 }} />
                           </IconButton>
                           
                           <TextField
                             value={item.quantity}
                             onChange={(e) => {
                               const value = parseInt(e.target.value) || 1;
                               handleQuantityChange(item.id, value);
                             }}
                             size="small"
                             sx={{ 
                               width: 45,
                               '& .MuiOutlinedInput-root': {
                                 backgroundColor: 'white',
                                 borderRadius: '6px',
                                 height: 28,
                                 fontSize: '0.8rem',
                                 '& fieldset': {
                                   border: 'none'
                                 }
                               }
                             }}
                             inputProps={{ 
                               style: { textAlign: 'center', fontSize: '0.8rem', padding: '4px' },
                               min: 1
                             }}
                           />
                           
                           <IconButton
                             size="small"
                             onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                             sx={{ 
                               width: 28, 
                               height: 28,
                               backgroundColor: 'white',
                               borderRadius: '6px',
                               '&:hover': { backgroundColor: '#F72525', color: 'white' }
                             }}
                           >
                             <AddIcon sx={{ fontSize: 16 }} />
                           </IconButton>
                         </Box>
                         
                         <IconButton
                           color="error"
                           size="small"
                           onClick={() => removeFromCart(item.id)}
                           sx={{ 
                             backgroundColor: '#FFF5F5',
                             borderRadius: '8px',
                             width: 32,
                             height: 32,
                             '&:hover': { backgroundColor: '#FFEBEE', transform: 'scale(1.05)' }
                           }}
                         >
                           <DeleteIcon sx={{ fontSize: 18 }} />
                         </IconButton>
                       </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
        
        {/* Итоги заказа */}
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <Paper sx={{ p: 3, borderRadius: '12px', position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Итоги заказа
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Товаров:</Typography>
              <Typography>{totalItems}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Сумма:</Typography>
              <Typography>{formatPrice(calculateTotal())} ₽</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                К оплате:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F72525' }}>
                {formatPrice(calculateTotal())} ₽
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ borderRadius: '12px', py: 1.5, mb: 2 }}
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
            >
              Оформить заказ
            </Button>
            
            <Alert severity="info" sx={{ borderRadius: '8px' }}>
              Доставка по Кизляру от 500 ₽
            </Alert>
          </Paper>
        </Box>
      </Box>
            </>
          )}
        </>
      )}
      
      {/* Вкладка заказов */}
      {activeTab === 1 && <OrdersContent />}
    </Container>
  );
};

export default CartPage; 