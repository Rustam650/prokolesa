import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Divider,
  Pagination,
  CircularProgress,
  SelectChangeEvent,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery,
  useTheme,
  Fab
} from '@mui/material';
import {
  TireRepair as Tire,
  Album as Wheel,
  WbSunny as Summer,
  AcUnit as Winter,
  Cloud as AllSeason,
  Close,
  Tune
} from '@mui/icons-material';

import { productAPI, brandAPI, Product, Brand } from './api';
import UniversalProductCard from './components/UniversalProductCard';
import { mapProductsToCards } from './utils/productMapper';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';

import SelectedFilters from './components/SelectedFilters';
import AccessibleDrawer from './components/AccessibleDrawer';
import SimplePriceInput from './components/SimplePriceInput';
import SimpleNumberInput from './components/SimpleNumberInput';

const CatalogPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  

  
  // Состояния для данных
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  


  // Тип товара из URL (пересчитывается при изменении URL)
  const productType = useMemo(() => {
    const typeParam = searchParams.get('product_type') || searchParams.get('type');
    return typeParam === 'wheel' ? 'wheel' : 'tire';
  }, [searchParams]);

  // Параметры поиска из URL (пересчитываются при изменении URL)
  const searchFilters = useMemo(() => {
    const filters: any = {};
    
    // Читаем параметры поиска из URL
    const searchType = searchParams.get('search_type');
    if (searchType === 'params') {
      // Параметры для шин
      const width = searchParams.get('width');
      const profile = searchParams.get('profile');
      const diameter = searchParams.get('diameter');
      const season = searchParams.get('season');
      
      if (width) filters.width = width;
      if (profile) filters.profile = profile;
      if (diameter) filters.diameter = diameter;
      if (season) filters.season = season;
      
      // Параметры для дисков
      const wheelWidth = searchParams.get('wheel_width');
      const wheelDiameter = searchParams.get('wheel_diameter');
      
      if (wheelWidth) filters.wheel_width = wheelWidth;
      if (wheelDiameter) filters.wheel_diameter = wheelDiameter;
    }
    
    return filters;
  }, [searchParams]);

  // Применённые фильтры (используются для API запросов)
  const [appliedFilters, setAppliedFilters] = useState({
    brands: [] as string[],
    season: '',
    priceRange: [0, 100000] as number[],
    inStockOnly: false,
    tireWidth: '',
    tireProfile: '',
    tireDiameter: '',
    wheelWidth: '',
    wheelDiameter: '',
    wheelPcd: '',
    wheelType: '',
    etFrom: '',
    etTo: ''
  });

  // Временные состояния для фильтров (изменяются до нажатия "Применить")
  const [tempFilters, setTempFilters] = useState({
    brands: [] as string[],
    season: '',
    minPrice: '0',
    maxPrice: '100000',
    inStockOnly: false,
    tireWidth: '',
    tireProfile: '',
    tireDiameter: '',
    wheelWidth: '',
    wheelDiameter: '',
    wheelPcd: '',
    wheelType: '',
    etFrom: '',
    etTo: ''
  });

  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Сортировка зависит от типа товара
  const [sortBy, setSortBy] = useState<string>('-sales_count');

  // Получение опций сортировки в зависимости от типа товара
  const getSortOptions = useCallback(() => {
    if (productType === 'tire') {
      return [
        { value: '-sales_count', label: 'По популярности' },
        { value: 'price', label: 'По цене (возрастание)' },
        { value: '-price', label: 'По цене (убывание)' },
        { value: 'brand__name', label: 'По бренду (А-Я)' },
        { value: '-brand__name', label: 'По бренду (Я-А)' },
        { value: 'tire_width', label: 'По ширине (возрастание)' },
        { value: '-tire_width', label: 'По ширине (убывание)' },
        { value: 'tire_diameter', label: 'По диаметру (возрастание)' },
        { value: '-tire_diameter', label: 'По диаметру (убывание)' },
        { value: '-created_at', label: 'По новизне' }
      ];
    } else {
      return [
        { value: '-sales_count', label: 'По популярности' },
        { value: 'price', label: 'По цене (возрастание)' },
        { value: '-price', label: 'По цене (убывание)' },
        { value: 'brand__name', label: 'По бренду (А-Я)' },
        { value: '-brand__name', label: 'По бренду (Я-А)' },
        { value: 'wheel_width', label: 'По ширине (возрастание)' },
        { value: '-wheel_width', label: 'По ширине (убывание)' },
        { value: 'wheel_diameter', label: 'По диаметру (возрастание)' },
        { value: '-wheel_diameter', label: 'По диаметру (убывание)' },
        { value: 'et', label: 'По вылету (возрастание)' },
        { value: '-et', label: 'По вылету (убывание)' },
        { value: '-created_at', label: 'По новизне' }
      ];
    }
  }, [productType]);

  // Единая функция загрузки товаров
  const loadProducts = useCallback(async (resetPage = false) => {
    try {
      setFiltersLoading(true);
      
      const currentPage = resetPage ? 1 : page;
      if (resetPage) {
        setPage(1);
      }

      const params: any = {
        product_type: productType,
        page: currentPage,
        ordering: sortBy,
      };

      console.log('🔍 Параметры поиска из URL:', searchFilters);
      console.log('📋 Все URL параметры:', Object.fromEntries(searchParams.entries()));

      // Используем appliedFilters для API запросов
      if (appliedFilters.brands.length > 0) {
        params.brand = appliedFilters.brands.join(',');
      }
      
      if (appliedFilters.season) {
        params.season = appliedFilters.season;
      }
      
      if (appliedFilters.priceRange[0] > 0) {
        params.min_price = appliedFilters.priceRange[0];
      }
      
      if (appliedFilters.priceRange[1] < 100000) {
        params.max_price = appliedFilters.priceRange[1];
      }
      
      if (appliedFilters.inStockOnly) {
        params.in_stock = true;
      }

      // Добавляем параметры поиска из URL для шин
      if (productType === 'tire') {
        // Параметры из блока поиска (приоритет)
        if (searchFilters.width) params.tire_width = searchFilters.width;
        if (searchFilters.profile) params.tire_profile = searchFilters.profile;
        if (searchFilters.diameter) params.tire_diameter = searchFilters.diameter;
        if (searchFilters.season) params.season = searchFilters.season;
        
        // Параметры из фильтров (если нет из поиска)
        if (!searchFilters.width && appliedFilters.tireWidth) params.tire_width = appliedFilters.tireWidth;
        if (!searchFilters.profile && appliedFilters.tireProfile) params.tire_profile = appliedFilters.tireProfile;
        if (!searchFilters.diameter && appliedFilters.tireDiameter) params.tire_diameter = appliedFilters.tireDiameter;
      }

      // Добавляем фильтры дисков
      if (productType === 'wheel') {
        // Параметры из блока поиска (приоритет)
        if (searchFilters.wheel_width) params.wheel_width = searchFilters.wheel_width;
        if (searchFilters.wheel_diameter) params.wheel_diameter = searchFilters.wheel_diameter;
        
        // Параметры из фильтров (если нет из поиска)
        if (!searchFilters.wheel_width && appliedFilters.wheelWidth) params.wheel_width = appliedFilters.wheelWidth;
        if (!searchFilters.wheel_diameter && appliedFilters.wheelDiameter) params.wheel_diameter = appliedFilters.wheelDiameter;
        if (appliedFilters.wheelPcd) params.pcd = appliedFilters.wheelPcd;
        if (appliedFilters.wheelType) params.wheel_type = appliedFilters.wheelType;
        if (appliedFilters.etFrom) params.et_from = appliedFilters.etFrom;
        if (appliedFilters.etTo) params.et_to = appliedFilters.etTo;
      }

      const response = await productAPI.getProducts(params);
      setProducts(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setFiltersLoading(false);
    }
  }, [productType, page, sortBy, appliedFilters, searchFilters, searchParams]);



  // Загрузка данных при инициализации
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Инициализируем состояние фильтров из URL
        const brandParam = searchParams.get('brand');
        const seasonParam = searchParams.get('season');
        
        const initialFilters = {
          brands: brandParam ? brandParam.split(',') : [],
          season: seasonParam || '',
          priceRange: [0, 100000] as number[],
          inStockOnly: false,
          tireWidth: '',
          tireProfile: '',
          tireDiameter: '',
          wheelWidth: '',
          wheelDiameter: '',
          wheelPcd: '',
          wheelType: '',
          etFrom: '',
          etTo: ''
        };

        // Устанавливаем как применённые, так и временные фильтры
        setAppliedFilters(initialFilters);
        setTempFilters({
          ...initialFilters,
          minPrice: '0',
          maxPrice: '100000'
        });
        
        // Загружаем бренды с фильтрацией по типу товара
        const brandsData = await brandAPI.getBrands({ product_type: productType });
        setBrands(brandsData);
        await loadProducts(false); // Загружаем с текущей страницей
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType, searchParams]);

  // Загрузка при изменении appliedFilters, сортировки или страницы
  useEffect(() => {
    if (loading) return; // Не загружаем во время инициализации
    loadProducts(false);
  }, [appliedFilters, sortBy, page, loading, loadProducts]);

  // Сброс сортировки при смене типа товара
  useEffect(() => {
    const availableOptions = getSortOptions();
    const isCurrentSortAvailable = availableOptions.some(option => option.value === sortBy);
    
    if (!isCurrentSortAvailable) {
      setSortBy('-sales_count');
    }
  }, [productType, sortBy, getSortOptions]);

  // Функция применения фильтров
  const applyFilters = () => {
    const priceRange = [
      parseInt(tempFilters.minPrice) || 0,
      parseInt(tempFilters.maxPrice) || 100000
    ];

    const newAppliedFilters = {
      brands: tempFilters.brands,
      season: tempFilters.season,
      priceRange,
      inStockOnly: tempFilters.inStockOnly,
      tireWidth: tempFilters.tireWidth,
      tireProfile: tempFilters.tireProfile,
      tireDiameter: tempFilters.tireDiameter,
      wheelWidth: tempFilters.wheelWidth,
      wheelDiameter: tempFilters.wheelDiameter,
      wheelPcd: tempFilters.wheelPcd,
      wheelType: tempFilters.wheelType,
      etFrom: tempFilters.etFrom,
      etTo: tempFilters.etTo
    };

    setAppliedFilters(newAppliedFilters);
    setPage(1); // Сбрасываем на первую страницу

    // Обновляем URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('product_type', productType);
    
    if (newAppliedFilters.brands.length > 0) {
      newSearchParams.set('brand', newAppliedFilters.brands.join(','));
    } else {
      newSearchParams.delete('brand');
    }
    
    if (newAppliedFilters.season) {
      newSearchParams.set('season', newAppliedFilters.season);
    } else {
      newSearchParams.delete('season');
    }
    
    navigate(`/catalog?${newSearchParams.toString()}`, { replace: true });
    
    // Закрываем мобильные фильтры
    setMobileFiltersOpen(false);
  };

  // Обработчики событий для временных фильтров
  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    let newBrands: string[];
    if (checked) {
      newBrands = [...tempFilters.brands, brandSlug];
    } else {
      newBrands = tempFilters.brands.filter(b => b !== brandSlug);
    }
    
    setTempFilters(prev => ({
      ...prev,
      brands: newBrands
    }));
  };

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setTempFilters(prev => ({
      ...prev,
      season: event.target.value
    }));
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  // Обработчики цены - простые
  const handleMinPriceChange = useCallback((value: string) => {
    setTempFilters(prev => ({
      ...prev,
      minPrice: value
    }));
  }, []);

  const handleMaxPriceChange = useCallback((value: string) => {
    setTempFilters(prev => ({
      ...prev,
      maxPrice: value
    }));
  }, []);

  // Обработчики размеров шин
  const handleTireWidthChange = (event: SelectChangeEvent<string>) => {
    setTempFilters(prev => ({
      ...prev,
      tireWidth: event.target.value
    }));
  };

  const handleTireProfileChange = (event: SelectChangeEvent<string>) => {
    setTempFilters(prev => ({
      ...prev,
      tireProfile: event.target.value
    }));
  };

  const handleTireDiameterChange = (event: SelectChangeEvent<string>) => {
    setTempFilters(prev => ({
      ...prev,
      tireDiameter: event.target.value
    }));
  };

  // Обработчики для полей вылета (ET) - простые
  const handleEtFromChange = useCallback((value: string) => {
    setTempFilters(prev => ({
      ...prev,
      etFrom: value
    }));
  }, []);

  const handleEtToChange = useCallback((value: string) => {
    setTempFilters(prev => ({
      ...prev,
      etTo: value
    }));
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const clearFilters = () => {
    const clearedFilters = {
      brands: [] as string[],
      season: '',
      priceRange: [0, 100000] as number[],
      inStockOnly: false,
      tireWidth: '',
      tireProfile: '',
      tireDiameter: '',
      wheelWidth: '',
      wheelDiameter: '',
      wheelPcd: '',
      wheelType: '',
      etFrom: '',
      etTo: ''
    };

    const clearedTempFilters = {
      ...clearedFilters,
      minPrice: '0',
      maxPrice: '100000'
    };

    setAppliedFilters(clearedFilters);
    setTempFilters(clearedTempFilters);
    setPage(1);
    setSortBy('-sales_count'); // Сбрасываем сортировку на популярность
    
    // Переходим на каталог без параметров поиска, сохраняя только тип товара
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('product_type', productType);
    navigate(`/catalog?${newSearchParams.toString()}`, { replace: true });
  };

  const removeFilter = (filterKey: string, filterValue?: string) => {
    switch (filterKey) {
      case 'brand':
        let newBrands: string[];
        if (filterValue) {
          newBrands = appliedFilters.brands.filter(brand => brand !== filterValue);
        } else {
          newBrands = [];
        }
        
        const newAppliedFilters = { ...appliedFilters, brands: newBrands };
        setAppliedFilters(newAppliedFilters);
        setTempFilters(prev => ({ ...prev, brands: newBrands }));
        
        // Обновляем URL
        const newSearchParams = new URLSearchParams(searchParams);
        if (newBrands.length > 0) {
          newSearchParams.set('brand', newBrands.join(','));
        } else {
          newSearchParams.delete('brand');
        }
        navigate(`/catalog?${newSearchParams.toString()}`, { replace: true });
        break;
      case 'season':
        setAppliedFilters(prev => ({ ...prev, season: '' }));
        setTempFilters(prev => ({ ...prev, season: '' }));
        break;
      case 'tire_width':
        setAppliedFilters(prev => ({ ...prev, tireWidth: '' }));
        setTempFilters(prev => ({ ...prev, tireWidth: '' }));
        break;
      case 'tire_profile':
        setAppliedFilters(prev => ({ ...prev, tireProfile: '' }));
        setTempFilters(prev => ({ ...prev, tireProfile: '' }));
        break;
      case 'tire_diameter':
        setAppliedFilters(prev => ({ ...prev, tireDiameter: '' }));
        setTempFilters(prev => ({ ...prev, tireDiameter: '' }));
        break;
      case 'wheel_width':
        setAppliedFilters(prev => ({ ...prev, wheelWidth: '' }));
        setTempFilters(prev => ({ ...prev, wheelWidth: '' }));
        break;
      case 'wheel_diameter':
        setAppliedFilters(prev => ({ ...prev, wheelDiameter: '' }));
        setTempFilters(prev => ({ ...prev, wheelDiameter: '' }));
        break;
      case 'bolt_pattern':
        setAppliedFilters(prev => ({ ...prev, wheelPcd: '' }));
        setTempFilters(prev => ({ ...prev, wheelPcd: '' }));
        break;
      case 'offset':
        setAppliedFilters(prev => ({ ...prev, etFrom: '', etTo: '' }));
        setTempFilters(prev => ({ ...prev, etFrom: '', etTo: '' }));
        break;
      case 'min_price':
        setAppliedFilters(prev => ({ ...prev, priceRange: [0, prev.priceRange[1]] }));
        setTempFilters(prev => ({ ...prev, minPrice: '0' }));
        break;
      case 'max_price':
        setAppliedFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], 100000] }));
        setTempFilters(prev => ({ ...prev, maxPrice: '100000' }));
        break;
      case 'in_stock':
        setAppliedFilters(prev => ({ ...prev, inStockOnly: false }));
        setTempFilters(prev => ({ ...prev, inStockOnly: false }));
        break;
    }
    setPage(1);
  };

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('ru-RU').format(price);
  // };

  // Компонент фильтров
  const FiltersContent = () => (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      {/* Заголовок фильтров */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Фильтры
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Тип товара */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Тип товара
        </Typography>
        <Tabs
          value={productType}
          onChange={(_, value) => {
            // Очищаем фильтры при смене типа товара
            const clearedFilters = {
              brands: [] as string[],
              season: '',
              priceRange: [0, 100000] as number[],
              inStockOnly: false,
              tireWidth: '',
              tireProfile: '',
              tireDiameter: '',
              wheelWidth: '',
              wheelDiameter: '',
              wheelPcd: '',
              wheelType: '',
              etFrom: '',
              etTo: ''
            };

            const clearedTempFilters = {
              ...clearedFilters,
              minPrice: '0',
              maxPrice: '100000'
            };

            setAppliedFilters(clearedFilters);
            setTempFilters(clearedTempFilters);
            setPage(1);
            
            // Обновляем URL с новым типом товара и очищенными фильтрами
            const newSearchParams = new URLSearchParams();
            newSearchParams.set('product_type', value);
            navigate(`/catalog?${newSearchParams.toString()}`, { replace: true });
          }}
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': { 
              minHeight: 48,
              fontSize: '0.875rem',
              fontWeight: 600
            }
          }}
        >
          <Tab 
            value="tire" 
            label="Шины" 
            icon={<Tire />} 
            iconPosition="start"
          />
          <Tab 
            value="wheel" 
            label="Диски" 
            icon={<Wheel />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Бренды */}
      <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Бренды ({tempFilters.brands.length} выбрано)
            </Typography>
        <FormGroup sx={{ maxHeight: 200, overflowY: 'auto' }}>
          {brands
            .filter(brand => {
              // Фильтруем бренды по типу товара используя поле product_types
              if (productType === 'tire') {
                return brand.product_types === 'tire' || brand.product_types === 'both';
              } else if (productType === 'wheel') {
                return brand.product_types === 'wheel' || brand.product_types === 'both';
              }
              return true; // Показываем все бренды для других типов
            })
            .map((brand) => (
              <FormControlLabel
                key={brand.id}
                control={
                  <Checkbox
                    checked={tempFilters.brands.includes(brand.slug)}
                    onChange={(e) => handleBrandChange(brand.slug, e.target.checked)}
                    size="small"
                  />
                }
                label={brand.name}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Фильтры для шин */}
      {productType === 'tire' && (
        <>
          {/* Сезон */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Сезон
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={tempFilters.season}
                onChange={handleSeasonChange}
                displayEmpty
              >
                <MenuItem value="">Любой сезон</MenuItem>
                <MenuItem value="summer">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Summer fontSize="small" sx={{ color: '#FF9800' }} />
                    Летние
                  </Box>
                </MenuItem>
                <MenuItem value="winter">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Winter fontSize="small" sx={{ color: '#2196F3' }} />
                    Зимние
                  </Box>
                </MenuItem>
                <MenuItem value="all_season">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AllSeason fontSize="small" sx={{ color: '#4CAF50' }} />
                    Всесезонные
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Размер шин */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Размер шин
            </Typography>
            <Grid container spacing={1}>
              <Grid size={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={tempFilters.tireWidth}
                    onChange={handleTireWidthChange}
                    displayEmpty
                    sx={{ 
                      '& .MuiSelect-select': { 
                        color: tempFilters.tireWidth ? 'inherit' : '#999',
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ color: '#999' }}>Ширина</MenuItem>
                    <MenuItem value="175">175</MenuItem>
                    <MenuItem value="185">185</MenuItem>
                    <MenuItem value="195">195</MenuItem>
                    <MenuItem value="205">205</MenuItem>
                    <MenuItem value="215">215</MenuItem>
                    <MenuItem value="225">225</MenuItem>
                    <MenuItem value="235">235</MenuItem>
                    <MenuItem value="245">245</MenuItem>
                    <MenuItem value="255">255</MenuItem>
                    <MenuItem value="265">265</MenuItem>
                    <MenuItem value="275">275</MenuItem>
                    <MenuItem value="285">285</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={tempFilters.tireProfile}
                    onChange={handleTireProfileChange}
                    displayEmpty
                    sx={{ 
                      '& .MuiSelect-select': { 
                        color: tempFilters.tireProfile ? 'inherit' : '#999',
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ color: '#999' }}>Профиль</MenuItem>
                    <MenuItem value="35">35</MenuItem>
                    <MenuItem value="40">40</MenuItem>
                    <MenuItem value="45">45</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="55">55</MenuItem>
                    <MenuItem value="60">60</MenuItem>
                    <MenuItem value="65">65</MenuItem>
                    <MenuItem value="70">70</MenuItem>
                    <MenuItem value="75">75</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={tempFilters.tireDiameter}
                    onChange={handleTireDiameterChange}
                    displayEmpty
                    sx={{ 
                      '& .MuiSelect-select': { 
                        color: tempFilters.tireDiameter ? 'inherit' : '#999',
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ color: '#999' }}>Диаметр</MenuItem>
                    <MenuItem value="13">R13</MenuItem>
                    <MenuItem value="14">R14</MenuItem>
                    <MenuItem value="15">R15</MenuItem>
                    <MenuItem value="16">R16</MenuItem>
                    <MenuItem value="17">R17</MenuItem>
                    <MenuItem value="18">R18</MenuItem>
                    <MenuItem value="19">R19</MenuItem>
                    <MenuItem value="20">R20</MenuItem>
                    <MenuItem value="21">R21</MenuItem>
                    <MenuItem value="22">R22</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Фильтры для дисков */}
      {productType === 'wheel' && (
        <>
          {/* Размер дисков */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Размер дисков
            </Typography>
            <Grid container spacing={1}>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <Select
                    value={tempFilters.wheelWidth}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, wheelWidth: e.target.value }))}
                    displayEmpty
                    sx={{ 
                      '& .MuiSelect-select': { 
                        color: tempFilters.wheelWidth ? 'inherit' : '#999',
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ color: '#999' }}>Ширина</MenuItem>
                    <MenuItem value="5.5">5.5J</MenuItem>
                    <MenuItem value="6">6J</MenuItem>
                    <MenuItem value="6.5">6.5J</MenuItem>
                    <MenuItem value="7">7J</MenuItem>
                    <MenuItem value="7.5">7.5J</MenuItem>
                    <MenuItem value="8">8J</MenuItem>
                    <MenuItem value="8.5">8.5J</MenuItem>
                    <MenuItem value="9">9J</MenuItem>
                    <MenuItem value="9.5">9.5J</MenuItem>
                    <MenuItem value="10">10J</MenuItem>
                    <MenuItem value="10.5">10.5J</MenuItem>
                    <MenuItem value="11">11J</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <Select
                    value={tempFilters.wheelDiameter}
                    onChange={(e) => setTempFilters(prev => ({ ...prev, wheelDiameter: e.target.value }))}
                    displayEmpty
                    sx={{ 
                      '& .MuiSelect-select': { 
                        color: tempFilters.wheelDiameter ? 'inherit' : '#999',
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ color: '#999' }}>Диаметр</MenuItem>
                    <MenuItem value="13">13"</MenuItem>
                    <MenuItem value="14">14"</MenuItem>
                    <MenuItem value="15">15"</MenuItem>
                    <MenuItem value="16">16"</MenuItem>
                    <MenuItem value="17">17"</MenuItem>
                    <MenuItem value="18">18"</MenuItem>
                    <MenuItem value="19">19"</MenuItem>
                    <MenuItem value="20">20"</MenuItem>
                    <MenuItem value="21">21"</MenuItem>
                    <MenuItem value="22">22"</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* PCD (Разболтовка) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              PCD (Разболтовка)
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={tempFilters.wheelPcd}
                onChange={(e) => setTempFilters(prev => ({ ...prev, wheelPcd: e.target.value }))}
                displayEmpty
                sx={{ 
                  '& .MuiSelect-select': { 
                    color: tempFilters.wheelPcd ? 'inherit' : '#999',
                    fontSize: '0.875rem'
                  }
                }}
              >
                <MenuItem value="" sx={{ color: '#999' }}>PCD (Разболтовка)</MenuItem>
                <MenuItem value="4x98">4x98</MenuItem>
                <MenuItem value="4x100">4x100</MenuItem>
                <MenuItem value="4x108">4x108</MenuItem>
                <MenuItem value="4x114.3">4x114.3</MenuItem>
                <MenuItem value="5x100">5x100</MenuItem>
                <MenuItem value="5x108">5x108</MenuItem>
                <MenuItem value="5x112">5x112</MenuItem>
                <MenuItem value="5x114.3">5x114.3</MenuItem>
                <MenuItem value="5x120">5x120</MenuItem>
                <MenuItem value="6x139.7">6x139.7</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Вылет (ET) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Вылет (ET)
            </Typography>
            <Grid container spacing={1}>
              <Grid size={6}>
                <SimpleNumberInput
                  label="От"
                  value={tempFilters.etFrom}
                  onChange={handleEtFromChange}
                  placeholder="-50"
                  allowNegative={true}
                />
              </Grid>
              <Grid size={6}>
                <SimpleNumberInput
                  label="До"
                  value={tempFilters.etTo}
                  onChange={handleEtToChange}
                  placeholder="50"
                  allowNegative={true}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Тип диска */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Тип диска
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={tempFilters.wheelType}
                onChange={(e) => setTempFilters(prev => ({ ...prev, wheelType: e.target.value }))}
                displayEmpty
                sx={{ 
                  '& .MuiSelect-select': { 
                    color: tempFilters.wheelType ? 'inherit' : '#999',
                    fontSize: '0.875rem'
                  }
                }}
              >
                <MenuItem value="" sx={{ color: '#999' }}>Тип диска</MenuItem>
                <MenuItem value="alloy">Литые</MenuItem>
                <MenuItem value="steel">Штампованные</MenuItem>
                <MenuItem value="forged">Кованые</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Цена */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Цена, ₽
        </Typography>
        
        {/* Поля ввода цены */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <SimplePriceInput
            label="От"
            value={tempFilters.minPrice}
            onChange={handleMinPriceChange}
            placeholder="0"
          />
          <SimplePriceInput
            label="До"
            value={tempFilters.maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="100000"
          />
        </Box>


      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Наличие */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={tempFilters.inStockOnly}
              onChange={(e) => {
                setTempFilters(prev => ({
                  ...prev,
                  inStockOnly: e.target.checked
                }));
              }}
            />
          }
          label="Только в наличии"
        />
      </Box>

      {/* Кнопки управления фильтрами */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={applyFilters}
          sx={{ 
            bgcolor: '#F72525',
            '&:hover': { bgcolor: '#E01E1E' }
          }}
        >
          Применить фильтры
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={clearFilters}
        >
          Очистить фильтры
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, md: 4 },
        // Предотвращаем автоскролл при изменении состояния
        scrollBehavior: 'auto',
        '& *': {
          scrollBehavior: 'auto !important'
        }
      }}
    >
      {/* Заголовок и кнопка фильтров на мобильных */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, md: 4 } 
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2.125rem' }
        }}>
          Каталог товаров
        </Typography>
        
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<Tune />}
            onClick={() => setMobileFiltersOpen(true)}
            sx={{ minWidth: 'auto' }}
          >
            Фильтры
          </Button>
        )}
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Фильтры для десктопа */}
        {!isMobile && (
          <Grid size={{ md: 3 }}>
            <Paper sx={{ 
              p: 3, 
              position: 'sticky', 
              top: 20,
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto'
            }}>
              <FiltersContent />
            </Paper>
          </Grid>
        )}

        {/* Мобильный drawer для фильтров */}
        <AccessibleDrawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          title="Фильтры товаров"
          sx={{
            '& .MuiDrawer-paper': {
              width: '85%',
              maxWidth: 350,
            },
          }}
        >
          <FiltersContent />
        </AccessibleDrawer>

        {/* Список товаров */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Выбранные фильтры */}
          <SelectedFilters 
            searchParams={{
              type: productType,
              product_type: productType,
              brand: appliedFilters.brands.length > 0 ? appliedFilters.brands.join(',') : undefined,
              season: appliedFilters.season || undefined,
              min_price: appliedFilters.priceRange[0] > 0 ? appliedFilters.priceRange[0] : undefined,
              max_price: appliedFilters.priceRange[1] < 100000 ? appliedFilters.priceRange[1] : undefined,
              in_stock: appliedFilters.inStockOnly || undefined,
              // Размеры шин
              tire_width: appliedFilters.tireWidth || undefined,
              tire_profile: appliedFilters.tireProfile || undefined,
              tire_diameter: appliedFilters.tireDiameter || undefined,
              // Размеры дисков
              wheel_width: appliedFilters.wheelWidth || undefined,
              wheel_diameter: appliedFilters.wheelDiameter || undefined,
              // Добавляем параметры поиска из URL
              ...searchFilters,
              // Добавляем все параметры из URL
              ...Object.fromEntries(searchParams.entries())
            }}
            onClear={clearFilters}
            onRemoveFilter={removeFilter}
          />

          {/* Сортировка и вид */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="body1" color="text.secondary">
              Найдено товаров: {totalCount}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                <InputLabel>Сортировка</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Сортировка"
                >
                  {getSortOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


            </Box>
          </Box>

          {/* Товары */}
          <Box sx={{ position: 'relative', minHeight: 400 }}>
            {filtersLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 1
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Применяем фильтры...
                  </Typography>
                </Box>
              </Box>
            )}
            
            {products.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Товары не найдены
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Попробуйте изменить параметры фильтрации
                </Typography>
              </Paper>
            ) : (
              <>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {mapProductsToCards(products).map((productCard) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={productCard.id}>
                      <UniversalProductCard
                        product={productCard}
                        variant="default"
                        onClick={() => navigate(`/product/${productCard.slug}`)}
                        onAddToCart={(id) => {
                          // Находим товар чтобы получить его тип
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
          </Box>
        </Grid>
      </Grid>

      {/* Плавающая кнопка фильтров на мобильных */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filters"
          onClick={() => setMobileFiltersOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Tune />
        </Fab>
      )}
    </Container>
  );
};

export default CatalogPage; 