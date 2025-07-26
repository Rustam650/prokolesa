import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,

  Star,
  WbSunny,
  AcUnit,
  Cloud,
} from '@mui/icons-material';

import { ProductCardProps } from '../types/product';
import EULabel from './EULabel';

const UniversalProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  variant = 'default'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [imageError, setImageError] = React.useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getSeasonIcon = (season?: string) => {
    switch (season) {
      case 'summer':
        return <WbSunny sx={{ fontSize: 16, color: '#FF9800' }} />;
      case 'winter':
        return <AcUnit sx={{ fontSize: 16, color: '#2196F3' }} />;
      case 'all_season':
        return <Cloud sx={{ fontSize: 16, color: '#4CAF50' }} />;
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && typeof onAddToCart === 'function') {
      onAddToCart(product.id);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite && typeof onToggleFavorite === 'function') {
      onToggleFavorite(product.id);
    }
  };



  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return '/placeholder-product.svg';
    }
    return product.image || '/placeholder-product.svg';
  };

  // Компактная версия для мобильных или списка
  if (variant === 'compact' || (variant === 'list' && isMobile)) {
    return (
      <Card
        sx={{
          display: 'flex',
          cursor: 'pointer',
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: { xs: 'none', md: 'translateY(-2px)' },
            boxShadow: { xs: 'none', md: '0 8px 24px rgba(0,0,0,0.1)' }
          }
        }}
        onClick={handleCardClick}
      >
        {/* Изображение */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            sx={{
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              objectFit: 'contain',
              objectPosition: 'center',
              p: 1,
              backgroundColor: '#F8F9FA'
            }}
            image={getImageSrc()}
            alt={product.name}
            onError={handleImageError}
          />
          
          {/* EU Label в левом нижнем углу */}
          {product.euLabel && (
            <Box sx={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              zIndex: 2
            }}>
              <EULabel
                fuelEfficiency={product.euLabel.fuelEfficiency}
                wetGrip={product.euLabel.wetGrip}
                noiseLevel={product.euLabel.noiseLevel}
                size="small"
                variant="horizontal"
              />
            </Box>
          )}
        </Box>

        {/* Контент */}
        <CardContent sx={{ flex: 1, p: { xs: 1.5, md: 2 } }}>
          {/* Бренд и сезон */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {product.brand}
            </Typography>
            {product.season && getSeasonIcon(product.season)}
          </Box>

          {/* Название */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              fontSize: { xs: '0.875rem', md: '1rem' },
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </Typography>



          {/* Цена */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#F72525',
                  fontWeight: 700,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                {formatPrice(product.price)} ₽
              </Typography>
              {product.oldPrice && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {formatPrice(product.oldPrice)} ₽
                </Typography>
              )}
            </Box>
            {product.discount && (
              <Chip
                label={`-${product.discount}%`}
                size="small"
                sx={{
                  backgroundColor: '#F72525',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  borderRadius: 0,
                  height: 20
                }}
              />
            )}
          </Box>

          {/* Кнопка добавления в корзину */}
          <Button
            variant="contained"
            size="small"
            fullWidth
            disabled={!product.inStock}
            onClick={handleAddToCart}
            sx={{
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {product.inStock ? 'В корзину' : 'Нет в наличии'}
          </Button>
        </CardContent>

        {/* Бейджи */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {product.isNew && (
            <Chip label="NEW" size="small" sx={{ backgroundColor: '#4CAF50', color: 'white', fontSize: '0.6rem' }} />
          )}
          {product.isBestseller && (
            <Chip label="ХИТ" size="small" sx={{ backgroundColor: '#FF9800', color: 'white', fontSize: '0.6rem' }} />
          )}
        </Box>
      </Card>
    );
  }

  // Стандартная версия карточки
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '16px',
        border: '1px solid #E9ECEF',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: { xs: 'none', md: 'translateY(-4px)' },
          boxShadow: { xs: 'none', md: '0 12px 40px rgba(0,0,0,0.1)' }
        }
      }}
      onClick={handleCardClick}
    >
      {/* Бейджи */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1 }}>
        {product.isNew && (
          <Chip
            label="НОВИНКА"
            size="small"
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        )}
        {product.isBestseller && (
          <Chip
            label="ХИТ"
            size="small"
            icon={<Star sx={{ fontSize: 14 }} />}
            sx={{
              backgroundColor: '#FF9800',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        )}
      </Box>



      {/* Кнопки действий */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1 }}>
        <IconButton
          size="small"
          onClick={handleToggleFavorite}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
        >
          {isFavorite ? <Favorite sx={{ color: '#F72525', fontSize: 18 }} /> : <FavoriteBorder sx={{ fontSize: 18 }} />}
        </IconButton>
        

      </Box>

      {/* Изображение */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={isMobile ? 180 : 220}
          image={getImageSrc()}
          alt={product.name}
          onError={handleImageError}
          sx={{
            width: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            backgroundColor: '#F8F9FA',
            p: 2
          }}
        />
        
        {/* EU Label в левом нижнем углу */}
        {product.euLabel && (
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            zIndex: 2
          }}>
            <EULabel
              fuelEfficiency={product.euLabel.fuelEfficiency}
              wetGrip={product.euLabel.wetGrip}
              noiseLevel={product.euLabel.noiseLevel}
              size="small"
              variant="horizontal"
            />
          </Box>
        )}
      </Box>

      {/* Контент */}
      <CardContent sx={{ p: { xs: 2, md: 3 }, pt: 2 }}>
        {/* Бренд и сезон */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {product.brand}
          </Typography>
          {product.season && getSeasonIcon(product.season)}
        </Box>

        {/* Название */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: { xs: '2.6rem', md: '2.6rem' }
          }}
        >
          {product.name}
        </Typography>

        {/* Размер */}
        {product.size && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
            {product.size}
          </Typography>
        )}



        {/* Цена */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#F72525',
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              {formatPrice(product.price)} ₽
            </Typography>
            {product.oldPrice && (
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', md: '0.875rem' }
                }}
              >
                {formatPrice(product.oldPrice)} ₽
              </Typography>
            )}
          </Box>
          {product.discount && (
            <Chip
              label={`-${product.discount}%`}
              sx={{
                backgroundColor: '#F72525',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: 0,
                height: 24
              }}
            />
          )}
        </Box>

        {/* Наличие */}
        <Typography
          variant="body2"
          sx={{
            color: product.inStock ? '#4CAF50' : '#F44336',
            fontWeight: 600,
            mb: 2,
            fontSize: '0.875rem'
          }}
        >
          {product.inStock ? '✓ В наличии' : '✗ Под заказ'}
        </Typography>



        {/* Кнопка добавления в корзину */}
        <Button
          variant="contained"
          fullWidth
          disabled={!product.inStock}
          endIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          sx={{
            py: 1.2,
            fontSize: { xs: '0.875rem', md: '1rem' },
            fontWeight: 600,
            borderRadius: '12px'
          }}
        >
          {product.inStock ? 'В корзину' : 'Нет в наличии'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UniversalProductCard; 