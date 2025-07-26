import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';

interface SelectedFiltersProps {
  searchParams?: any;
  onClear?: () => void;
  onRemoveFilter?: (filterKey: string, filterValue?: string) => void;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({ 
  searchParams, 
  onClear, 
  onRemoveFilter 
}) => {
  // console.log('🏷️ SelectedFilters получил параметры:', searchParams);
  // console.log('🏷️ onRemoveFilter тип:', typeof onRemoveFilter, onRemoveFilter);
  
  if (!searchParams) return null;

  const hasFilters = searchParams.make || searchParams.model || 
                    searchParams.tire_width || searchParams.tire_profile || searchParams.tire_diameter ||
                    searchParams.wheel_width || searchParams.wheel_diameter ||
                    searchParams.brand || searchParams.season || 
                    searchParams.min_price || searchParams.max_price;

  if (!hasFilters) return null;

  const handleRemoveFilter = (filterKey: string, filterValue?: string) => {
    // console.log('🗑️ handleRemoveFilter вызван:', { filterKey, filterValue });
    if (onRemoveFilter && typeof onRemoveFilter === 'function') {
      onRemoveFilter(filterKey, filterValue);
    } else {
      console.error('❌ onRemoveFilter не является функцией:', onRemoveFilter);
    }
  };

  const handleChipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Отключаем клик на сам чип
  };

  const handleChipDelete = (filterKey: string, filterValue?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleRemoveFilter(filterKey, filterValue);
  };

  const getChipStyles = (backgroundColor: string) => ({
    backgroundColor,
    color: 'white',
    fontSize: { xs: '0.75rem', md: '0.8125rem' },
    height: { xs: 24, md: 32 },
    cursor: 'default',
    '& .MuiChip-deleteIcon': {
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      '&:hover': {
        color: 'rgba(255,255,255,0.8)'
      }
    }
  });

  const getFilterChips = () => {
    const chips = [];

    // Фильтры по автомобилю
    if (searchParams.make) {
      chips.push(
        <Chip 
          key="make" 
          label={`Марка: ${searchParams.make}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('make')}
          sx={getChipStyles('#F72525')}
        />
      );
    }

    if (searchParams.model) {
      chips.push(
        <Chip 
          key="model" 
          label={`Модель: ${searchParams.model}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('model')}
          sx={getChipStyles('#F72525')}
        />
      );
    }

    // Фильтры размеров шин
    if (searchParams.tire_width) {
      chips.push(
        <Chip 
          key="tire-width" 
          label={`Ширина: ${searchParams.tire_width}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('tire_width')}
          sx={getChipStyles('#FF9800')}
        />
      );
    }
    
    if (searchParams.tire_profile) {
      chips.push(
        <Chip 
          key="tire-profile" 
          label={`Профиль: ${searchParams.tire_profile}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('tire_profile')}
          sx={getChipStyles('#FF9800')}
        />
      );
    }
    
    if (searchParams.tire_diameter) {
      chips.push(
        <Chip 
          key="tire-diameter" 
          label={`Диаметр: R${searchParams.tire_diameter}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('tire_diameter')}
          sx={getChipStyles('#FF9800')}
        />
      );
    }

    if (searchParams.season) {
      const seasonLabels = {
        'summer': 'Летние',
        'winter': 'Зимние', 
        'all_season': 'Всесезонные'
      };
      chips.push(
        <Chip 
          key="season" 
          label={`Сезон: ${seasonLabels[searchParams.season as keyof typeof seasonLabels]}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('season')}
          sx={getChipStyles('#FF9800')}
        />
      );
    }

    // Фильтры дисков
    if (searchParams.wheel_width || searchParams.wheel_diameter) {
      const wheelSize = [
        searchParams.wheel_width ? `${searchParams.wheel_width}J` : '',
        searchParams.wheel_diameter ? `${searchParams.wheel_diameter}"` : ''
      ].filter(Boolean).join(' x ');
      
      if (wheelSize) {
        chips.push(
          <Chip 
            key="wheel-size" 
            label={`Размер дисков: ${wheelSize}`} 
            size="small" 
            onClick={handleChipClick}
            onDelete={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemoveFilter('wheel_width');
              handleRemoveFilter('wheel_diameter');
            }}
            sx={getChipStyles('#FF9800')}
          />
        );
      }
    }

    if (searchParams.bolt_pattern) {
      chips.push(
        <Chip 
          key="bolt-pattern" 
          label={`PCD: ${searchParams.bolt_pattern}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('bolt_pattern')}
          sx={getChipStyles('#FF9800')}
        />
      );
    }

    if (searchParams.offset) {
      chips.push(
        <Chip 
          key="offset" 
          label={`Вылет: ${searchParams.offset}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('offset')}
          sx={getChipStyles('#FF9800')}
        />
      );
    }

    // Фильтры каталога
    if (searchParams.brand) {
      // Обрабатываем случай когда brand может быть строкой с несколькими брендами
      const brands = searchParams.brand.split(',');
      brands.forEach((brand: string) => {
        chips.push(
          <Chip 
            key={`brand-${brand}`} 
            label={`Бренд: ${brand}`} 
            size="small" 
            onClick={handleChipClick}
            onDelete={handleChipDelete('brand', brand)}
            sx={getChipStyles('#2196F3')}
          />
        );
      });
    }

    if (searchParams.min_price || searchParams.max_price) {
      const priceText = searchParams.min_price && searchParams.max_price 
        ? `${searchParams.min_price} - ${searchParams.max_price} ₽`
        : searchParams.min_price 
          ? `от ${searchParams.min_price} ₽`
          : `до ${searchParams.max_price} ₽`;
      
      chips.push(
        <Chip 
          key="price" 
          label={`Цена: ${priceText}`} 
          size="small" 
          onClick={handleChipClick}
          onDelete={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveFilter('min_price');
            handleRemoveFilter('max_price');
          }}
          sx={getChipStyles('#4CAF50')}
        />
      );
    }

    if (searchParams.in_stock) {
      chips.push(
        <Chip 
          key="in-stock" 
          label="Только в наличии" 
          size="small" 
          onClick={handleChipClick}
          onDelete={handleChipDelete('in_stock')}
          sx={getChipStyles('#9C27B0')}
        />
      );
    }

    return chips;
  };

  const chips = getFilterChips();

  const handleClearClick = () => {
    if (onClear && typeof onClear === 'function') {
      onClear();
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 1.5, md: 2 }, 
      backgroundColor: '#F8F9FA', 
      borderRadius: { xs: '6px', md: '8px' }, 
      mb: { xs: 1.5, md: 2 },
      border: '1px solid #E0E0E0'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 0.8, md: 1 } }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600, 
          color: '#333',
          fontSize: { xs: '0.85rem', md: '0.875rem' }
        }}>
          Выбранные параметры:
        </Typography>
        {onClear && (
          <IconButton 
            size="small" 
            onClick={handleClearClick}
            sx={{ 
              color: '#666',
              p: { xs: 0.5, md: 1 },
              '&:hover': { backgroundColor: '#E0E0E0' }
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, flexWrap: 'wrap' }}>
        {chips}
      </Box>
    </Box>
  );
};

export default SelectedFilters; 