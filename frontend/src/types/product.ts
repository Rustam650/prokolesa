// EU Label для шин
export interface EULabel {
  fuelEfficiency: string; // A, B, C, D, E, F, G
  wetGrip: string; // A, B, C, D, E, F, G
  noiseLevel: number; // в дБ
}

// Универсальные типы для карточки товара
export interface ProductCardData {
  id: number;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  season?: 'summer' | 'winter' | 'all_season';
  size?: string;
  article?: string;
  euLabel?: EULabel;
}

export interface ProductPageData extends ProductCardData {
  description: string;
  shortDescription: string;
  specifications: ProductSpecification[];
  images: string[];
  category: string;
  productType?: 'tire' | 'wheel' | 'accessory' | 'service';
  brandCountry?: string;
  deliveryInfo: DeliveryInfo;
  features: ProductFeature[];
}

export interface ProductSpecification {
  label: string;
  value: string;
  icon?: string;
}

export interface ProductFeature {
  icon: string;
  label: string;
  description: string;
}

export interface DeliveryInfo {
  cities: DeliveryCity[];
  note: string;
}

export interface DeliveryCity {
  name: string;
  price: number;
  days: string;
}

// Пропсы для компонентов
export interface ProductCardProps {
  product: ProductCardData;
  onClick?: () => void;
  onAddToCart?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'list';
}

// Типы для брендов
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  rating: string;
  country: string;
  is_featured: boolean;
  popularity_score: number;
  products_count: number;
  website?: string;
  product_types: 'tire' | 'wheel' | 'both' | 'accessory';
} 