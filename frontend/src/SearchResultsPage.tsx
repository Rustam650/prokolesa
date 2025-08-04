import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Pagination,
  useMediaQuery,
  useTheme,
  Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { productAPI, Product } from './api';
import UniversalProductCard from './components/UniversalProductCard';
import { mapProductsToCards } from './utils/productMapper';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';

import SelectedFilters from './components/SelectedFilters';

const SearchResultsPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // Получаем параметры поиска из URL
  const searchType = searchParams.get('search_type') || 'params';
  const productType = searchParams.get('product_type') || 'tire';

  useEffect(() => {
    const loadSearchResults = async () => {
      try {
        setLoading(true);
        
        // Формируем параметры для API
        const params: any = {
          page,
          product_type: productType,
        };

        // Добавляем все параметры из URL
        searchParams.forEach((value, key) => {
          if (key !== 'page' && value) {
            params[key] = value;
          }
        });

        const response = await productAPI.smartSearch(params);
        setProducts(response.results || []);
        setTotalCount(response.count || 0);
      } catch (error) {
        console.error('Ошибка загрузки результатов поиска:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [searchParams, page, productType]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    navigate('/');
  };

  const getSearchTitle = () => {
    if (searchType === 'car') {
      const make = searchParams.get('make');
      const model = searchParams.get('model');
      if (make && model) {
        return `${productType === 'tire' ? 'Шины' : 'Диски'} для ${make} ${model}`;
      } else if (make) {
        return `${productType === 'tire' ? 'Шины' : 'Диски'} для ${make}`;
      }
    } else {
      const width = searchParams.get('width');
      const profile = searchParams.get('profile');
      const diameter = searchParams.get('diameter');
      
      if (productType === 'tire' && (width || profile || diameter)) {
        const size = [width, profile, diameter ? `R${diameter}` : ''].filter(Boolean).join('/');
        return `Шины ${size}`;
      } else if (productType === 'wheel') {
        const wheelWidth = searchParams.get('wheel_width');
        const wheelDiameter = searchParams.get('wheel_diameter');
        if (wheelWidth || wheelDiameter) {
          const size = [
            wheelWidth ? `${wheelWidth}J` : '',
            wheelDiameter ? `${wheelDiameter}"` : ''
          ].filter(Boolean).join(' x ');
          return `Диски ${size}`;
        }
      }
    }
    
    return `${productType === 'tire' ? 'Шины' : 'Диски'} - результаты поиска`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Поиск товаров...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Кнопка назад и заголовок */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Вернуться к поиску
        </Button>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2.125rem' },
          mb: 1
        }}>
          {getSearchTitle()}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Найдено товаров: {totalCount}
        </Typography>
      </Box>

      {/* Выбранные фильтры */}
      <SelectedFilters 
        searchParams={Object.fromEntries(searchParams.entries())}
        onClear={handleClearFilters}
      />

      {/* Результаты поиска */}
      {products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Товары не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Попробуйте изменить параметры поиска
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Новый поиск
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {mapProductsToCards(products).map((productCard) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={productCard.id}>
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
              </Grid>
            ))}
          </Grid>

          {/* Пагинация */}
          {totalCount > 20 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(totalCount / 20)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "medium" : "large"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResultsPage; 