import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Star,
  ArrowForward as ArrowRight,
  Category as CategoryIcon,
  LocalShipping as Truck,
  Phone,
  EmojiEvents as Trophy,
  TireRepair,
  Album,
} from '@mui/icons-material';

import { productAPI, brandAPI, Product, Brand } from './api';
import UniversalProductCard from './components/UniversalProductCard';
import { mapProductsToCards } from './utils/productMapper';
import ProductSearchSelector from './components/ProductSearchSelector';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  
  // Состояния для данных из API
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные параллельно
        const [productsResponse, brandsData] = await Promise.all([
          productAPI.getBestsellerProducts(),
          brandAPI.getBrands(),
        ]);
        
        setProducts(productsResponse.results);
        setBrands(brandsData.filter(brand => brand.is_featured));
        
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);



  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Загрузка данных...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      {/* Hero секция с подбором */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #F72525 0%, #E01E1E 100%)',
        borderRadius: { xs: '16px', md: '24px' },
        color: 'white',
        p: { xs: 3, md: 6 },
        mt: { xs: 3, md: 4 }, // Добавляем отступ сверху
        mb: { xs: 3, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(247, 37, 37, 0.3)'
      }}>
        {/* Декоративные элементы */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: { xs: 'none', md: 'block' }
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          display: { xs: 'none', md: 'block' }
        }} />
        
        {/* Анимированные иконки */}
        <Box sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          },
          display: { xs: 'none', md: 'block' }
        }}>
          <TireRepair sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
        </Box>
        
        <Box sx={{
          position: 'absolute',
          top: 60,
          right: 80,
          animation: 'float 3s ease-in-out infinite 1s',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          },
          display: { xs: 'none', md: 'block' }
        }}>
          <Album sx={{ fontSize: 35, color: 'rgba(255,255,255,0.3)' }} />
        </Box>
        
        <Typography variant="h2" sx={{ 
          fontWeight: 800,
          fontSize: { xs: '1.5rem', md: '2.5rem' },
          lineHeight: 1.1,
          mb: 2,
          color: 'white',
          textAlign: { xs: 'left', md: 'center' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'center' },
          gap: { xs: 1, md: 2 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Search sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, color: 'white' }} />
          Подберите идеальные шины и диски
        </Typography>
        
        <Typography variant="h6" sx={{ 
          opacity: 0.9,
          fontSize: { xs: '0.9rem', md: '1.1rem' },
          mb: { xs: 3, md: 4 },
          fontWeight: 400,
          textAlign: { xs: 'left', md: 'center' }
        }}>
          Выберите автомобиль для точного подбора товаров
        </Typography>

        {/* Компонент подбора по автомобилю */}
        <Box sx={{ 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: { xs: '12px', md: '16px' },
          p: { xs: 1.5, md: 2 }
        }}>
          <ProductSearchSelector 
            onSearch={(params) => {
              console.log('Поиск товаров:', params);
              
              // Переход в каталог с параметрами
              const searchParams = new URLSearchParams();
              Object.keys(params).forEach(key => {
                if (params[key]) {
                  searchParams.set(key, params[key]);
                }
              });
              navigate(`/catalog?${searchParams.toString()}`);
            }}
          />
        </Box>
      </Box>

      {/* Статистика */}
      <Box sx={{ mb: { xs: 3, md: 6 } }}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 },
              textAlign: 'center',
              borderRadius: { xs: '12px', md: '16px' },
              border: '1px solid #E9ECEF',
              '&:hover': {
                transform: { xs: 'none', md: 'translateY(-4px)' },
                boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.1)' }
              },
              transition: 'all 0.3s ease'
            }}>
              <Box sx={{ color: '#F72525', mb: 1 }}>
                <CategoryIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                color: '#191A1B',
                mb: 0.5,
                fontSize: { xs: '1.2rem', md: '2rem' }
              }}>
                10,000+
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}>
                Товаров в наличии
              </Typography>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 },
              textAlign: 'center',
              borderRadius: { xs: '12px', md: '16px' },
              border: '1px solid #E9ECEF',
              '&:hover': {
                transform: { xs: 'none', md: 'translateY(-4px)' },
                boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.1)' }
              },
              transition: 'all 0.3s ease'
            }}>
              <Box sx={{ color: '#F72525', mb: 1 }}>
                <Star sx={{ fontSize: { xs: 24, md: 32 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                color: '#191A1B',
                mb: 0.5,
                fontSize: { xs: '1.2rem', md: '2rem' }
              }}>
                50+
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}>
                Брендов
              </Typography>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 },
              textAlign: 'center',
              borderRadius: { xs: '12px', md: '16px' },
              border: '1px solid #E9ECEF',
              '&:hover': {
                transform: { xs: 'none', md: 'translateY(-4px)' },
                boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.1)' }
              },
              transition: 'all 0.3s ease'
            }}>
              <Box sx={{ color: '#F72525', mb: 1 }}>
                <Phone sx={{ fontSize: { xs: 24, md: 32 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                color: '#191A1B',
                mb: 0.5,
                fontSize: { xs: '1.2rem', md: '2rem' }
              }}>
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}>
                Поддержка
              </Typography>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 },
              textAlign: 'center',
              borderRadius: { xs: '12px', md: '16px' },
              border: '1px solid #E9ECEF',
              '&:hover': {
                transform: { xs: 'none', md: 'translateY(-4px)' },
                boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.1)' }
              },
              transition: 'all 0.3s ease'
            }}>
              <Box sx={{ color: '#F72525', mb: 1 }}>
                <Truck sx={{ fontSize: { xs: 24, md: 32 } }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                color: '#191A1B',
                mb: 0.5,
                fontSize: { xs: '1.2rem', md: '2rem' }
              }}>
                1 день
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' }
              }}>
                Доставка по Кизляру
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Популярные товары */}
      <Box sx={{ mb: { xs: 3, md: 6 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 3, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            🔥
            Хиты продаж
          </Typography>
          
          <Button 
            variant="outlined" 
            endIcon={<ArrowRight />}
            onClick={() => navigate('/catalog')}
            sx={{ 
              borderRadius: '12px',
              fontWeight: 600,
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Все товары
          </Button>
        </Box>

        <Grid container spacing={{ xs: 1.5, md: 3 }}>
          {mapProductsToCards(products.slice(0, 4)).map((productCard) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={productCard.id}>
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
        
        <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 }, display: { xs: 'block', sm: 'none' } }}>
          <Button 
            variant="outlined" 
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => navigate('/catalog')}
            sx={{ 
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            Все товары
          </Button>
        </Box>
      </Box>

      {/* Популярные бренды */}
      <Box sx={{ mb: { xs: 3, md: 6 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 3, md: 4 }
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Trophy sx={{ color: '#F72525', fontSize: { xs: '1.5rem', md: '2.5rem' } }} />
            Популярные бренды
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {brands.slice(0, 8).map((brand) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={brand.id}>
              <Paper sx={{ 
                p: { xs: 2, md: 3 },
                textAlign: 'center',
                borderRadius: { xs: '12px', md: '16px' },
                border: '1px solid #E9ECEF',
                cursor: 'pointer',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-4px)' },
                  boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.1)' }
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate(`/catalog?brand=${brand.slug}`)}
              >
                {brand.logo && (
                  <Box sx={{ 
                    mb: 2, 
                    height: { xs: 40, md: 60 }, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <img 
                      src={brand.logo} 
                      alt={brand.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                )}
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 1,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}>
                  {brand.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  fontSize: { xs: '0.75rem', md: '0.875rem' }
                }}>
                  {brand.country}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Преимущества */}
      <Box sx={{ mb: { xs: 3, md: 6 } }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2.5rem' },
          mb: { xs: 3, md: 4 },
          textAlign: 'center'
        }}>
          Почему выбирают нас
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 }, 
                borderRadius: '50%', 
                backgroundColor: '#F72525', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <CategoryIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Огромный выбор
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}>
                Более 10,000 товаров от ведущих мировых производителей шин и дисков
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 }, 
                borderRadius: '50%', 
                backgroundColor: '#F72525', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Truck sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Быстрая доставка
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}>
                Доставка по Кизляру в день заказа, по России от 1-3 дней
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 }, 
                borderRadius: '50%', 
                backgroundColor: '#F72525', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Phone sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Поддержка 24/7
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}>
                Наши специалисты помогут подобрать идеальные шины и диски для вашего автомобиля
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage; 