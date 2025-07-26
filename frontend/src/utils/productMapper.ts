import { Product } from '../api';
import { ProductCardData, ProductPageData } from '../types/product';

// Базовый URL для API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Функция для создания полного URL изображения
const getFullImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '';
  
  // Если уже полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Добавляем базовый URL к относительному пути
  return `${API_BASE_URL}${imagePath}`;
};

// Функция для преобразования Product в ProductCardData
export const mapProductToCard = (product: any): ProductCardData => {
  // Определяем сезон для шин
  let season: 'summer' | 'winter' | 'all_season' | undefined;
  if (product.season) {
    season = product.season;
  }

  // Формируем размер для шин
  let size = '';
  if (product.width && product.profile && product.diameter) {
    size = `${product.width}/${product.profile} R${product.diameter}`;
  }
  // Для дисков
  else if (product.diameter && product.width) {
    size = `${product.diameter}x${product.width}`;
    if (product.offset) {
      size += ` ET${product.offset}`;
    }
  }

  // Вычисляем скидку
  const discount = product.old_price && product.final_price 
    ? Math.round(((parseFloat(product.old_price) - product.final_price) / parseFloat(product.old_price)) * 100)
    : undefined;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand?.name || 'Неизвестный бренд',
    image: getFullImageUrl(product.main_image?.image) || getPlaceholderImage(product),
    price: product.final_price || parseFloat(product.price) || 0,
    oldPrice: product.old_price ? parseFloat(product.old_price) : undefined,
    discount,
    rating: parseFloat(product.rating) || 0,
    reviewsCount: product.reviews_count || 0,
    inStock: product.is_in_stock !== undefined ? product.is_in_stock : (product.stock_quantity > 0),
    isNew: product.is_new || false,
    isBestseller: product.is_bestseller || false,
    season,
    size,
    article: product.sku,
    euLabel: product.fuel_efficiency ? {
      fuelEfficiency: product.fuel_efficiency,
      wetGrip: product.wet_grip,
      noiseLevel: product.noise_level
    } : undefined,
  };
};

// Функция для преобразования Product в ProductPageData
export const mapProductToPage = (product: Product): ProductPageData => {
  const cardData = mapProductToCard(product);

  // Формируем характеристики
  const specifications = [];
  
  if (product.tire_details) {
    const tire = product.tire_details;
    specifications.push(
      { label: 'Ширина', value: `${tire.width} мм` },
      { label: 'Профиль', value: `${tire.profile}%` },
      { label: 'Диаметр', value: `R${tire.diameter}` },
      { label: 'Индекс нагрузки', value: tire.load_index },
      { label: 'Индекс скорости', value: tire.speed_index },
      { label: 'Сезон', value: product.season === 'summer' ? 'Летние' : product.season === 'winter' ? 'Зимние' : 'Всесезонные' },
      { label: 'Тип протектора', value: tire.tread_pattern },
      { label: 'Шипы', value: tire.studded ? 'Да' : 'Нет' },
      { label: 'Run Flat', value: tire.run_flat ? 'Да' : 'Нет' },
    );
  }

  if (product.wheel_details) {
    const wheel = product.wheel_details;
    specifications.push(
      { label: 'Ширина', value: `${wheel.width}"` },
      { label: 'Диаметр', value: `${wheel.diameter}"` },
      { label: 'Вылет (ET)', value: `${wheel.offset} мм` },
      { label: 'Разболтовка', value: wheel.bolt_pattern },
      { label: 'Центральное отверстие', value: `${wheel.center_bore} мм` },
      { label: 'Материал', value: wheel.material },
      { label: 'Цвет', value: wheel.color },
    );
  }

  // Формируем особенности
  const features = [];
  
  if (product.tire_details) {
    if (product.tire_details.studded) {
      features.push({ icon: '❄️', label: 'Шипованные', description: 'Отличное сцепление на льду' });
    }
    if (product.tire_details.run_flat) {
      features.push({ icon: '🛡️', label: 'Run Flat', description: 'Возможность движения с проколом' });
    }
    if (product.season === 'all_season') {
      features.push({ icon: '🌤️', label: 'Всесезонные', description: 'Подходят для любого времени года' });
    }
  }

  if (product.wheel_details) {
    if (product.wheel_details.material === 'alloy') {
      features.push({ icon: '⚡', label: 'Легкосплавные', description: 'Легкий вес и прочность' });
    }
    features.push({ icon: '✨', label: 'Стильный дизайн', description: 'Современный внешний вид' });
  }

  // Формируем изображения
  const images = [];
  
  // Добавляем дополнительные изображения
  if (product.images && product.images.length > 0) {
    images.push(...product.images.map((img: any) => getFullImageUrl(img.image)));
  }
  
  // Если нет дополнительных изображений, добавляем основное
  if (images.length === 0 && product.main_image?.image) {
    images.push(getFullImageUrl(product.main_image.image));
  }
  
  // Если совсем нет изображений, добавляем placeholder
  if (images.length === 0) {
    images.push(getPlaceholderImage(product));
  }

  // Информация о доставке
  const deliveryInfo = {
    cities: [
      { name: 'Махачкала', price: 0, days: '1-2 дня' },
      { name: 'Каспийск', price: 300, days: '1-2 дня' },
      { name: 'Дербент', price: 500, days: '2-3 дня' },
      { name: 'Хасавюрт', price: 600, days: '2-3 дня' },
      { name: 'Буйнакск', price: 400, days: '1-2 дня' },
    ],
    note: 'Бесплатная доставка при заказе от 10 000 руб.'
  };

  return {
    ...cardData,
    description: product.description || 'Качественные шины и диски от ведущих производителей. Гарантия качества и надежности.',
    shortDescription: product.short_description || '',
    specifications,
    images,
    category: product.category.name,
    productType: product.product_type,
    brandCountry: product.brand.country || undefined,
    deliveryInfo,
    features,
    euLabel: product.euLabel ? {
      fuelEfficiency: product.euLabel.fuelEfficiency,
      wetGrip: product.euLabel.wetGrip,
      noiseLevel: product.euLabel.noiseLevel
    } : undefined,
  };
};

// Функция для массового преобразования продуктов в карточки
export const mapProductsToCards = (products: Product[]): ProductCardData[] => {
  return products.map(mapProductToCard);
};

// Функция для получения placeholder изображения в зависимости от типа товара
export const getPlaceholderImage = (product: any): string => {
  // Проверяем наличие полей шин
  if (product.width && product.profile && product.diameter) {
    return '/placeholder-tire.svg';
  }
  // Проверяем наличие полей дисков
  else if (product.bolt_pattern || product.wheel_type) {
    return '/placeholder-wheel.svg';
  }
  return '/placeholder-product.svg';
}; 