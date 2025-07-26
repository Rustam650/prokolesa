import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Star,

  Speed,
  WbSunny,
  AcUnit,
  Cloud,
  DirectionsCar,

} from '@mui/icons-material';
// import { colors } from '../../constants/colors';

interface Product {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: number;
  inStock: boolean;
  season: string;
  loadIndex: string;
  speedIndex: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;

  onToggleFavorite?: (productId: number) => void;
  isFavorite?: boolean;
  onClick?: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,

  onToggleFavorite,
  isFavorite = false,
  onClick,
}) => {
  const getSeasonIcon = (season: string) => {
    switch (season.toLowerCase()) {
      case 'летние':
      case 'summer':
        return <WbSunny sx={{ fontSize: 16, color: '#FF9800' }} />;
      case 'зимние':
      case 'winter':
        return <AcUnit sx={{ fontSize: 16, color: '#2196F3' }} />;
      case 'всесезонные':
      case 'all_season':
        return <Cloud sx={{ fontSize: 16, color: '#4CAF50' }} />;
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    if (onClick && typeof onClick === 'function') {
      onClick(product.id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid #E9ECEF',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
          borderColor: '#F72525'
        }
      }}
      onClick={handleCardClick}
    >
      {/* Изображение и бейджи */}
      <Box sx={{ position: 'relative', p: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ 
            backgroundColor: '#F8F9FA',
            borderRadius: '12px',
            objectFit: 'contain',
            p: 1
          }}
        />
        
        {/* Бейджи */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {product.isNew && (
            <Chip
              label="НОВИНКА"
              size="small"
              sx={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
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
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>

        {/* Скидка */}
        {product.discount && (
          <Chip
            label={`-${product.discount}%`}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              backgroundColor: '#F72525',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Кнопка избранного */}
        <IconButton
          size="small"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (onToggleFavorite && typeof onToggleFavorite === 'function') {
              onToggleFavorite(product.id);
            }
          }}
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#F72525',
              color: 'white'
            }
          }}
        >
          {isFavorite ? <Favorite sx={{ fontSize: 18, color: '#F72525' }} /> : <FavoriteBorder sx={{ fontSize: 18 }} />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, pt: 1 }}>
        {/* Бренд */}
        <Typography variant="body2" sx={{ 
          color: '#6C757D', 
          fontWeight: 500,
          mb: 0.5,
          fontSize: '0.8rem'
        }}>
          {product.brand}
        </Typography>

        {/* Название товара */}
        <Typography variant="h6" sx={{ 
          mb: 1.5, 
          color: '#191A1B', 
          fontWeight: 600,
          fontSize: '0.95rem',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </Typography>

        {/* Размер */}
        <Typography variant="body2" sx={{ 
          color: '#495057', 
          fontWeight: 600,
          mb: 2,
          fontSize: '0.9rem'
        }}>
          {product.size}
        </Typography>

        {/* Характеристики */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getSeasonIcon(product.season)}
            <Typography variant="caption" sx={{ color: '#6C757D', fontSize: '0.75rem' }}>
              {product.season}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Speed sx={{ fontSize: 14, color: '#6C757D' }} />
            <Typography variant="caption" sx={{ color: '#6C757D', fontSize: '0.75rem' }}>
              {product.loadIndex}{product.speedIndex}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DirectionsCar sx={{ fontSize: 14, color: '#6C757D' }} />
            <Typography variant="caption" sx={{ color: '#6C757D', fontSize: '0.75rem' }}>
              Легковые
            </Typography>
          </Box>
        </Box>



        {/* Наличие */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: product.inStock ? '#4CAF50' : '#F44336',
              mr: 1 
            }} 
          />
          <Typography variant="body2" sx={{ 
            fontSize: '0.8rem',
            color: product.inStock ? '#4CAF50' : '#F44336',
            fontWeight: 500
          }}>
            {product.inStock ? 'В наличии' : 'Под заказ'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Цена */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
            <Typography variant="h5" sx={{ 
              color: '#F72525', 
              fontWeight: 800,
              fontSize: '1.4rem'
            }}>
              {product.price.toLocaleString()} ₽
            </Typography>
            {product.oldPrice && (
              <Typography 
                variant="body2" 
                sx={{ 
                  textDecoration: 'line-through',
                  color: '#9CA3AF',
                  fontSize: '0.9rem'
                }}
              >
                {product.oldPrice.toLocaleString()} ₽
              </Typography>
            )}
          </Box>
          
          {product.discount && (
            <Typography variant="body2" sx={{ 
              color: '#F72525', 
              fontWeight: 600,
              fontSize: '0.8rem'
            }}>
              Скидка {product.discount}%
            </Typography>
          )}
        </Box>
        
        {/* Кнопки действий */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onAddToCart(product.id);
            }}
            disabled={!product.inStock}
            startIcon={<ShoppingCart sx={{ fontSize: 18 }} />}
            sx={{
              py: 1.2,
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '8px',
              backgroundColor: '#FF9800',
              '&:hover': {
                backgroundColor: '#F57C00'
              }
            }}
          >
            В корзину
          </Button>
          
        </Box>
      </CardContent>
    </Card>
  );
}; 