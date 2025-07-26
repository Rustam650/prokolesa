import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Card,
  CardMedia,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Divider,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  NavigateNext,
  CheckCircle,
  LocalShipping,
  Security,
  WbSunny,
  AcUnit,
  Cloud,
  Close,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';

import { ProductPageData } from '../types/product';
import EULabel from './EULabel';

interface UniversalProductPageProps {
  product: ProductPageData;
  onAddToCart?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onNavigate?: (path: string) => void;
  isFavorite?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const UniversalProductPage: React.FC<UniversalProductPageProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onNavigate,
  isFavorite = false,
}) => {

  
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getSeasonIcon = (season?: string, size: number = 16) => {
    switch (season) {
      case 'summer':
        return <WbSunny sx={{ fontSize: size, color: '#FF9800' }} />;
      case 'winter':
        return <AcUnit sx={{ fontSize: size, color: '#2196F3' }} />;
      case 'all_season':
        return <Cloud sx={{ fontSize: size, color: '#4CAF50' }} />;
      default:
        return null;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const getImageSrc = (index: number) => {
    if (imageErrors[index]) {
      return '/placeholder-product.svg';
    }
    return product.images[index] || product.image || '/placeholder-product.svg';
  };

  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalPrevious = () => {
    setModalImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleModalNext = () => {
    setModalImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleModalKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleModalClose();
    } else if (event.key === 'ArrowLeft') {
      handleModalPrevious();
    } else if (event.key === 'ArrowRight') {
      handleModalNext();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleModalNext();
    }
  };

  const extractTireSize = (name: string) => {
    const sizeMatch = name.match(/(\d{3}\/\d{2}\s*R\d{2})/);
    return sizeMatch ? sizeMatch[1] : product.size;
  };

  const extractLoadSpeedIndex = (name: string) => {
    const indexMatch = name.match(/(\d{2,3}[A-Z]+(?:\s*XL)?)/);
    return indexMatch ? indexMatch[1] : '';
  };

  const tireSize = extractTireSize(product.name);
  const loadSpeedIndex = extractLoadSpeedIndex(product.name);
  
  // Debug EU Label
  console.log('UniversalProductPage - product.euLabel:', product.euLabel);

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1400, mx: 'auto', py: { xs: 2, md: 3 } }}>
      {/* Хлебные крошки */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 2, fontSize: '0.875rem' }}
      >
        <Link 
          color="inherit" 
          onClick={() => onNavigate?.('/')}
          sx={{ textDecoration: 'none', color: '#6B7280', '&:hover': { color: '#F59E0B' } }}
        >
          Главная
        </Link>
        <Link 
          color="inherit" 
          onClick={() => onNavigate?.('/catalog')}
          sx={{ textDecoration: 'none', color: '#6B7280', '&:hover': { color: '#F59E0B' } }}
        >
          Каталог
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
          {product.brand} {tireSize}
        </Typography>
      </Breadcrumbs>

      {/* Заголовок товара */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1, lineHeight: 1.2 }}>
          {product.brand} {product.name.replace(product.brand, '').trim()}
        </Typography>
        
        {/* Бейджи */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          
          {product.season && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getSeasonIcon(product.season)}
              <Chip 
                label={product.season === 'summer' ? 'Летние' :
                       product.season === 'winter' ? 'Зимние' : 'Всесезонные'} 
                size="small"
                sx={{ backgroundColor: '#F59E0B', color: 'white', fontWeight: 600 }}
              />
            </Box>
          )}

          {product.isNew && (
            <Chip label="ХИТ" size="small" sx={{ backgroundColor: '#EF4444', color: 'white', fontWeight: 700 }} />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Левая колонка - Изображения */}
        <Box sx={{ width: { xs: '100%', lg: '420px' }, flexShrink: 0, order: { xs: 1, lg: 1 } }}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Основное изображение */}
            <Card sx={{
              mb: 2,
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
                '& .image-hover-hint': {
                  opacity: 1,
                },
              },
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleImageClick(selectedImage)}
            >
              {/* Подсказка при наведении */}
              <Box
                className="image-hover-hint"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              >
                🔍 Нажмите для увеличения
              </Box>
              <CardMedia
                component="img"
                image={getImageSrc(selectedImage)}
                alt={product.name}
                onError={() => handleImageError(selectedImage)}
                sx={{
                  width: '100%',
                  height: { xs: 300, lg: 450 },
                  objectFit: 'contain',
                  objectPosition: 'center',
                  p: 3
                }}
              />

              {/* EU Label */}
              {product.productType === 'tire' && product.euLabel && (
                <Box sx={{ position: 'absolute', bottom: 12, left: 12, zIndex: 2 }}>
                  <EULabel
                    fuelEfficiency={product.euLabel.fuelEfficiency}
                    wetGrip={product.euLabel.wetGrip}
                    noiseLevel={product.euLabel.noiseLevel}
                    size="medium"
                    variant="horizontal"
                  />
                </Box>
              )}

              {product.discount && (
                <Chip
                  label={`-${product.discount}%`}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: '#EF4444',
                    color: 'white',
                    fontWeight: 700,
                  }}
                />
              )}
            </Card>

            {/* Миниатюры */}
            {product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    sx={{
                      minWidth: 60,
                      width: 60,
                      height: 60,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #F59E0B' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                      '&:hover': { 
                        borderColor: '#F59E0B',
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                      handleImageClick(index);
                    }}
                  >
                    <CardMedia
                      component="img"
                      width="100%"
                      height="100%"
                      image={getImageSrc(index)}
                      alt={`${product.name} ${index + 1}`}
                      onError={() => handleImageError(index)}
                      sx={{ objectFit: 'contain', p: 0.5 }}
                    />
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Правая колонка - Покупка (на мобильных вторая) */}
        <Box sx={{ width: { xs: '100%', lg: '320px' }, flexShrink: 0, order: { xs: 2, lg: 3 } }}>
          <Box sx={{ position: { xs: 'static', lg: 'sticky' }, top: 20 }}>
            <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              {/* Цена */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{
                  color: '#111827',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  mb: 0.5
                }}>
                  {formatPrice(product.price)} ₽
                </Typography>
                
                {product.oldPrice && (
                  <Typography variant="body1" sx={{
                    textDecoration: 'line-through',
                    color: '#9CA3AF',
                    mb: 0.5
                  }}>
                    {formatPrice(product.oldPrice)}₽
                  </Typography>
                )}


              </Box>

              {/* Наличие */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CheckCircle sx={{
                  color: product.inStock ? '#10B981' : '#EF4444',
                  mr: 1,
                  fontSize: 20
                }} />
                <Typography variant="body1" sx={{
                  color: product.inStock ? '#10B981' : '#EF4444',
                  fontWeight: 600
                }}>
                  {product.inStock ? 'В наличии' : 'Под заказ'}
                </Typography>
              </Box>

              {/* Кнопка добавления в корзину */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!product.inStock}
                onClick={() => {
                  console.log(`[UniversalProductPage] Клик по кнопке "Добавить в корзину" для товара ID=${product.id}, name=${product.name}`);
                  if (onAddToCart && typeof onAddToCart === 'function') {
                    console.log(`[UniversalProductPage] Вызываем onAddToCart(${product.id})`);
                    onAddToCart(product.id);
                  } else {
                    console.error(`[UniversalProductPage] ❌ onAddToCart не является функцией:`, typeof onAddToCart);
                  }
                }}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  mb: 2,
                  backgroundColor: '#F59E0B',
                  '&:hover': { backgroundColor: '#D97706' },
                  '&:disabled': { backgroundColor: '#E5E7EB', color: '#9CA3AF' }
                }}
              >
                Добавить в корзину
              </Button>

              {/* Кнопки действий */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <IconButton
                  onClick={() => {
                    if (onToggleFavorite && typeof onToggleFavorite === 'function') {
                      onToggleFavorite(product.id);
                    }
                  }}
                  sx={{
                    flex: 1,
                    border: '2px solid #F3F4F6',
                    backgroundColor: isFavorite ? '#F59E0B' : 'white',
                    color: isFavorite ? 'white' : '#6B7280',
                    borderRadius: '8px',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: isFavorite ? '#D97706' : '#F9FAFB',
                      borderColor: '#F59E0B'
                    },
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>


              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Доставка */}
              <Box>
                <Typography variant="h6" sx={{
                  mb: 2,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#111827'
                }}>
                  <LocalShipping sx={{ color: '#F59E0B' }} />
                  Доставка в Республику Дагестан
                </Typography>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Махачкала</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>325 руб. (от 6 до 7 дней)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Каспийск</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>650 руб. (от 6 до 8 дней)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Кизляр</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>650 руб. (от 6 до 8 дней)</Typography>
                  </Box>
                </Stack>

                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mt: 2 }}>
                  Приблизительная стоимость доставки указана за одну шину (1 шт.) при покупке комплекта.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Центральная колонка - Характеристики (на мобильных третья) */}
        <Box sx={{ width: { xs: '100%', lg: '580px' }, flexShrink: 0, order: { xs: 3, lg: 2 } }}>
          {/* Индексы нагрузки/скорости */}
          {loadSpeedIndex && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: '#6B7280', mb: 1, fontWeight: 600 }}>
                Индекс нагрузки/скорости:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {loadSpeedIndex.split(' ').map((index, i) => (
                  <Chip
                    key={i}
                    label={index}
                    sx={{
                      backgroundColor: i === 0 ? '#F59E0B' : '#F3F4F6',
                      color: i === 0 ? 'white' : '#374151',
                      fontWeight: 600,
                      border: i === 0 ? '2px solid #F59E0B' : '1px solid #E5E7EB'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Таблица характеристик */}
          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Артикул
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    {product.article || '1276565'}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Производитель
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    <Link sx={{ color: '#2563EB', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      {product.brand} (Китай)
                    </Link>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Группа
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    {product.brand}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Модель
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    <Link sx={{ color: '#2563EB', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      {product.name.replace(product.brand, '').replace(tireSize || '', '').replace(loadSpeedIndex, '').trim()}
                    </Link>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Размер
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    <Link sx={{ color: '#2563EB', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      {tireSize}
                    </Link>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Тип автомобиля
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Легковые автомобили
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Сезонность
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSeasonIcon(product.season)}
                      <Typography sx={{ fontWeight: 600 }}>
                        {product.season === 'summer' ? 'Летние' :
                         product.season === 'winter' ? 'Зимние' :
                         product.season === 'all_season' ? 'Всесезонные' : 'Летние'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Индекс нагрузки
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    91 (до 615 кг)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    Индекс скорости
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                    V (до 240 км/ч)
                  </TableCell>
                </TableRow>

                {product.euLabel && (
                  <TableRow>
                    <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                      Евроэтикетка
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '1px solid #F3F4F6', py: 1.5 }}>
                      <EULabel
                        fuelEfficiency={product.euLabel.fuelEfficiency}
                        wetGrip={product.euLabel.wetGrip}
                        noiseLevel={product.euLabel.noiseLevel}
                        size="small"
                        variant="horizontal"
                      />
                    </TableCell>
                  </TableRow>
                )}

                {product.specifications.slice(0, 5).map((spec, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#6B7280', fontWeight: 500, borderBottom: index === 4 ? 'none' : '1px solid #F3F4F6', py: 1.5 }}>
                      {spec.label}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: index === 4 ? 'none' : '1px solid #F3F4F6', py: 1.5 }}>
                      {spec.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Табы с дополнительной информацией */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              backgroundColor: '#F8F9FA',
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 180,
                py: 2,
                color: '#6B7280',
                '&.Mui-selected': {
                  color: '#F59E0B',
                  backgroundColor: '#FFFFFF'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F59E0B',
                height: 3
              }
            }}
          >
            <Tab label="Описание товара" />
            <Tab label="Доставка и оплата" />
          </Tabs>

          <Box sx={{ backgroundColor: '#FFFFFF' }}>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#111827' }}>
                  Описание {product.brand} {product.name.replace(product.brand, '').trim()}
                </Typography>
                
                {product.description && (
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#374151', mb: 3, fontSize: '1.1rem' }}>
                    {product.description}
                  </Typography>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: '#111827' }}>
                  Доставка и оплата
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                  {/* Доставка */}
                  <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '12px', 
                        backgroundColor: '#F59E0B', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <LocalShipping sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                        Способы доставки
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                          По Махачкале
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Курьерская доставка - 325 руб.<br/>
                          Срок: 1-2 рабочих дня
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                          По Дагестану
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Транспортная компания - от 650 руб.<br/>
                          Срок: 3-7 рабочих дней
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                          Самовывоз
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Бесплатно из нашего магазина<br/>
                          Готов к выдаче в день заказа
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Оплата */}
                  <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: '12px', 
                        backgroundColor: '#10B981', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <Security sx={{ fontSize: 24, color: 'white' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                        Способы оплаты
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                          Наличными
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          При получении товара<br/>
                          Курьеру или в магазине
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                          Банковской картой
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Visa, MasterCard, МИР<br/>
                          Безопасная онлайн-оплата
                        </Typography>
                      </Box>
                      

                    </Stack>
                  </Paper>
                </Box>

                <Box sx={{ mt: 4, p: 3, backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FCD34D' }}>
                  <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 600 }}>
                    💡 Совет: При заказе комплекта из 4 шин доставка по Махачкале становится бесплатной!
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          </Box>
        </Card>
      </Box>

      {/* Modal для просмотра изображений */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
        }}
      >
        <Fade in={modalOpen}>
                     <Box
             sx={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               width: { xs: '95vw', md: '90vw', lg: '85vw' },
               height: { xs: '85vh', md: '90vh' },
               maxWidth: '1200px',
               maxHeight: '800px',
               bgcolor: 'background.paper',
               borderRadius: '16px',
               boxShadow: 24,
               p: 0,
               outline: 'none',
               display: 'flex',
               flexDirection: 'column',
               overflow: 'hidden',
             }}
            onKeyDown={handleModalKeyPress}
            tabIndex={-1}
          >
            {/* Заголовок модального окна */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid #E5E7EB',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.name}
              </Typography>
              <IconButton onClick={handleModalClose} size="small">
                <Close />
              </IconButton>
            </Box>

                         {/* Основное изображение в модальном окне */}
             <Box sx={{
               flex: 1,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               position: 'relative',
               p: { xs: 1, md: 2 },
               overflow: 'hidden',
               minHeight: 0, // Важно для правильной работы flex
               maxHeight: '100%',
               maxWidth: '100%',
             }}>
               <Box
                 component="img"
                 src={getImageSrc(modalImageIndex)}
                 alt={`${product.name} ${modalImageIndex + 1}`}
                 onError={() => handleImageError(modalImageIndex)}
                 sx={{
                   // Ограничения размеров для правильного отображения
                   maxWidth: { xs: 'calc(100vw - 32px)', md: 'calc(90vw - 64px)', lg: 'calc(85vw - 64px)' },
                   maxHeight: { xs: 'calc(85vh - 160px)', md: 'calc(90vh - 160px)' },
                   width: 'auto',
                   height: 'auto',
                   objectFit: 'contain',
                   borderRadius: '8px',
                   display: 'block',
                   margin: 'auto',
                 }}
               />

              {/* Кнопки навигации */}
              {product.images.length > 1 && (
                <>
                  <IconButton
                    onClick={handleModalPrevious}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <ArrowBackIos />
                  </IconButton>
                  <IconButton
                    onClick={handleModalNext}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Миниатюры в модальном окне */}
            {product.images.length > 1 && (
              <Box sx={{
                p: 2,
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                justifyContent: 'center',
              }}>
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    sx={{
                      minWidth: 60,
                      width: 60,
                      height: 60,
                      cursor: 'pointer',
                      border: modalImageIndex === index ? '2px solid #F59E0B' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                      '&:hover': { borderColor: '#F59E0B' },
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setModalImageIndex(index)}
                  >
                    <CardMedia
                      component="img"
                      width="100%"
                      height="100%"
                      image={getImageSrc(index)}
                      alt={`${product.name} ${index + 1}`}
                      onError={() => handleImageError(index)}
                      sx={{ objectFit: 'contain', p: 0.5 }}
                    />
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default UniversalProductPage; 