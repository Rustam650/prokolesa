import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  TireRepair,
  Album,
  WbSunny,
  AcUnit,
  Cloud,
} from '@mui/icons-material';

interface ProductSearchSelectorProps {
  onSearch?: (params: any) => void;
}

const ProductSearchSelector: React.FC<ProductSearchSelectorProps> = ({ onSearch }) => {
  
  // Состояния
  const [productType, setProductType] = useState<'tire' | 'wheel'>('tire');
  
  // Параметры шин
  const [tireWidth, setTireWidth] = useState<string>('');
  const [tireProfile, setTireProfile] = useState<string>('');
  const [tireDiameter, setTireDiameter] = useState<string>('');
  const [tireSeason, setTireSeason] = useState<string>('');
  
  // Параметры дисков
  const [wheelWidth, setWheelWidth] = useState<string>('');
  const [wheelDiameter, setWheelDiameter] = useState<string>('');

  // Данные для выбора
  const tireWidths = ['175', '185', '195', '205', '215', '225', '235', '245', '255', '265', '275', '285', '295', '305'];
  const tireProfiles = ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80'];
  const tireDiameters = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
  const wheelWidths = ['5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0'];
  const wheelDiameters = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
  
  const seasons = [
    { value: '', label: 'Все сезоны', icon: null },
    { value: 'summer', label: 'Летние', icon: <WbSunny /> },
    { value: 'winter', label: 'Зимние', icon: <AcUnit /> },
    { value: 'all_season', label: 'Всесезонные', icon: <Cloud /> }
  ];

  const handleSearch = () => {
    const searchParams: any = {
      product_type: productType,
      search_type: 'params'
    };

    if (productType === 'tire') {
      if (tireWidth) searchParams.width = tireWidth;
      if (tireProfile) searchParams.profile = tireProfile;
      if (tireDiameter) searchParams.diameter = tireDiameter;
      if (tireSeason) searchParams.season = tireSeason;
    } else {
      if (wheelWidth) searchParams.wheel_width = wheelWidth;
      if (wheelDiameter) searchParams.wheel_diameter = wheelDiameter;
    }

    // Сохраняем параметры в localStorage
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Переход в каталог с параметрами
      const urlParams = new URLSearchParams();
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key]) {
          urlParams.set(key, searchParams[key]);
        }
      });
      window.location.href = `/catalog?${urlParams.toString()}`;
    }
  };

  const handleClear = () => {
    setTireWidth('');
    setTireProfile('');
    setTireDiameter('');
    setTireSeason('');
    setWheelWidth('');
    setWheelDiameter('');
  };

  return (
    <Box>
          {/* Переключатель типа товара */}
          <Box sx={{ 
            display: 'flex', 
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #E0E0E0'
          }}>
            <Button
              onClick={() => setProductType('tire')}
              sx={{
                flex: 1,
                py: 1.5,
                backgroundColor: productType === 'tire' ? '#FF9800' : 'white',
                color: productType === 'tire' ? 'white' : '#666',
                borderRadius: 0,
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': {
                  backgroundColor: productType === 'tire' ? '#F57C00' : '#F5F5F5',
                }
              }}
            >
              <TireRepair sx={{ mr: 1, fontSize: '1.2rem' }} />
              Шины
            </Button>
            <Button
              onClick={() => setProductType('wheel')}
              sx={{
                flex: 1,
                py: 1.5,
                backgroundColor: productType === 'wheel' ? '#FF9800' : 'white',
                color: productType === 'wheel' ? 'white' : '#666',
                borderRadius: 0,
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': {
                  backgroundColor: productType === 'wheel' ? '#F57C00' : '#F5F5F5',
                }
              }}
            >
              <Album sx={{ mr: 1, fontSize: '1.2rem' }} />
              Диски
            </Button>
          </Box>

          {productType === 'tire' ? (
            // Параметры шин
            <Box>
              {/* Размер шин */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 3, 
                alignItems: 'center',
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                <FormControl sx={{ flex: 1, minWidth: 100 }}>
                  <Select
                    value={tireWidth}
                    onChange={(e) => setTireWidth(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    <MenuItem value="">Ширина</MenuItem>
                    {tireWidths.map((width) => (
                      <MenuItem key={width} value={width}>{width}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#666' }}>/</Typography>
                
                <FormControl sx={{ flex: 1, minWidth: 100 }}>
                  <Select
                    value={tireProfile}
                    onChange={(e) => setTireProfile(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    <MenuItem value="">Профиль</MenuItem>
                    {tireProfiles.map((profile) => (
                      <MenuItem key={profile} value={profile}>{profile}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#666' }}>R</Typography>
                
                <FormControl sx={{ flex: 1, minWidth: 100 }}>
                  <Select
                    value={tireDiameter}
                    onChange={(e) => setTireDiameter(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    <MenuItem value="">Диаметр</MenuItem>
                    {tireDiameters.map((diameter) => (
                      <MenuItem key={diameter} value={diameter}>{diameter}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Сезон */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 3,
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                {seasons.map((season) => (
                  <Button
                    key={season.value}
                    onClick={() => setTireSeason(season.value)}
                    sx={{
                      flex: 1,
                      py: 1,
                      px: 2,
                      backgroundColor: tireSeason === season.value ? '#FF9800' : 'white',
                      color: tireSeason === season.value ? 'white' : '#666',
                      border: '1px solid #E0E0E0',
                      borderRadius: 1,
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      fontWeight: 600,
                      minWidth: { xs: '100%', sm: 'auto' },
                      mb: { xs: 1, sm: 0 },
                      '&:hover': {
                        backgroundColor: tireSeason === season.value ? '#F57C00' : '#F5F5F5',
                      }
                    }}
                  >
                    {season.icon && <Box sx={{ mr: 0.5 }}>{season.icon}</Box>}
                    {season.label}
                  </Button>
                ))}
              </Box>
            </Box>
          ) : (
            // Параметры дисков
            <Box>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <FormControl sx={{ flex: 1 }}>
                  <Select
                    value={wheelWidth}
                    onChange={(e) => setWheelWidth(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    <MenuItem value="">Ширина диска</MenuItem>
                    {wheelWidths.map((width) => (
                      <MenuItem key={width} value={width}>{width}J</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ flex: 1 }}>
                  <Select
                    value={wheelDiameter}
                    onChange={(e) => setWheelDiameter(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 1,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    <MenuItem value="">Диаметр диска</MenuItem>
                    {wheelDiameters.map((diameter) => (
                      <MenuItem key={diameter} value={diameter}>{diameter}"</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}

          {/* Кнопки */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              onClick={handleSearch}
              variant="contained"
              size="large"
              sx={{
                flex: 1,
                py: 1.5,
                backgroundColor: '#F72525',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#E01E1E',
                }
              }}
            >
              {productType === 'tire' ? 'Подобрать шины' : 'Подобрать диски'}
            </Button>
            
            <Button
              onClick={handleClear}
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                px: 3,
                borderColor: '#E0E0E0',
                color: '#666',
                fontSize: { xs: '0.9rem', md: '1rem' },
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#BDBDBD',
                  backgroundColor: '#F5F5F5',
                }
              }}
            >
              Очистить
            </Button>
          </Box>
    </Box>
  );
};

export default ProductSearchSelector; 