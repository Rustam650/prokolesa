import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert
} from '@mui/material';
import {
  Favorite,
  ArrowBack,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useFavorites } from './hooks/useFavorites';
import { useCart } from './hooks/useCart';

import { productAPI, Product } from './api';
import UniversalProductCard from './components/UniversalProductCard';
import { mapProductsToCards } from './utils/productMapper';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: favoriteItems, clearFavorites, toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем данные о товарах из избранного
  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (favoriteItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Загружаем товары по ID из избранного
        const productPromises = favoriteItems.map(item => 
          productAPI.getProductById(item.id).catch(() => null)
        );
        
        const loadedProducts = await Promise.all(productPromises);
        const validProducts = loadedProducts.filter(Boolean) as Product[];
        
        setProducts(validProducts);
      } catch (error) {
        console.error('Ошибка загрузки избранных товаров:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProducts();
  }, [favoriteItems]);

  const handleClearFavorites = () => {
    if (window.confirm('Очистить избранное?')) {
      clearFavorites();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Загрузка избранного...</Typography>
      </Container>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Избранное пусто
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Добавляйте товары в избранное, чтобы не потерять их
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
      </Container>
    );
  }

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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Избранное ({favoriteItems.length} {favoriteItems.length === 1 ? 'товар' : favoriteItems.length < 5 ? 'товара' : 'товаров'})
          </Typography>
          
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFavorites}
            startIcon={<DeleteIcon />}
          >
            Очистить избранное
          </Button>
        </Box>
        
        {products.length !== favoriteItems.length && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Некоторые товары из избранного больше не доступны
          </Alert>
        )}
      </Box>

      {/* Список товаров */}
      {products.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: { xs: 2, md: 3 } 
        }}>
          {mapProductsToCards(products).map((productCard) => (
            <Box key={productCard.id}>
              <UniversalProductCard
                product={productCard}
                onClick={() => navigate(`/product/${productCard.slug}`)}
                onAddToCart={(id) => {
                  const product = products.find(p => p.id === id);
                  addToCart(id, 1, product?.product_type as 'tire' | 'wheel');
                }}
                onToggleFavorite={(id) => toggleFavorite(id)}

                isFavorite={isFavorite(productCard.id)}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Товары из избранного не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Возможно, они больше не доступны
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/catalog')}
            sx={{ mt: 2 }}
          >
            Перейти в каталог
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default FavoritesPage; 