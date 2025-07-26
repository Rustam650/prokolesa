import axios from 'axios';

// Базовый URL для API
const API_BASE_URL = 'http://localhost:8000';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Типы данных
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  rating: string;
  country: string;
  is_featured: boolean;
  popularity_score: number;
  products_count: number;
  website: string;
  product_types: 'tire' | 'wheel' | 'both' | 'accessory';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string;
  is_active: boolean;
  parent: number | null;
  sort_order: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  title: string;
  is_main: boolean;
  sort_order: number;
}

export interface TireDetails {
  width: number;
  profile: number;
  diameter: number;
  load_index: string;
  speed_index: string;
  tread_pattern: string;
  run_flat: boolean;
  reinforced: boolean;
  studded: boolean;
  fuel_efficiency: string;
  wet_grip: string;
  noise_level: number | null;
}

export interface WheelDetails {
  diameter: number;
  width: number;
  bolt_pattern: string;
  center_bore: number;
  offset: number;
  wheel_type: string;
  material: string;
  color: string;
  finish: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price_modifier: number;
  stock_quantity: number;
  attributes: Record<string, any>;
  is_active: boolean;
  final_price: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  brand: Brand;
  category: Category;
  product_type: 'tire' | 'wheel' | 'accessory' | 'service';
  season: 'summer' | 'winter' | 'all_season' | '';
  short_description: string;
  description: string;
  specifications: Record<string, any>;
  price: string;
  old_price: string | null;
  final_price: number;
  discount_percent: number;
  stock_quantity: number;
  is_in_stock: boolean;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  rating: string;
  reviews_count: number;
  main_image: ProductImage | null;
  images: ProductImage[];
  variants: ProductVariant[];
  tire_details?: TireDetails;
  wheel_details?: WheelDetails;
  views_count: number;
  sales_count: number;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  euLabel?: {
    fuelEfficiency: string;
    wetGrip: string;
    noiseLevel: number;
  };
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface SearchSuggestion {
  type: 'product' | 'brand' | 'category';
  id: number;
  title: string;
  url: string;
  price?: string;
}

export interface ProductFilters {
  brands: Array<{ id: number; name: string; slug: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  price_range: { min_price: number; max_price: number };
  seasons: Array<{ value: string; label: string }>;
  product_types: Array<{ value: string; label: string }>;
}

// Типы для автомобилей
export interface CarMake {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  country: string;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface CarModel {
  id: number;
  name: string;
  slug: string;
  make: CarMake;
  body_type: string;
  year_start: number | null;
  year_end: number | null;
  is_popular: boolean;
  is_active: boolean;
}

export interface CarGeneration {
  id: number;
  name: string;
  model: CarModel;
  year_start: number;
  year_end: number | null;
  years_range: number[];
  default_tire_sizes: string[];
  default_wheel_sizes: string[];
  is_active: boolean;
}

// Типы для пользователей
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  city: string;
  loyalty_points: number;
  total_spent: number;
  is_verified: boolean;
  avatar: string | null;
}

export interface Address {
  id: number;
  type: 'home' | 'work' | 'other';
  title: string;
  country: string;
  region: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  postal_code: string;
  is_default: boolean;
}

// Типы для корзины
export interface CartItem {
  id: number;
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

// Типы для заказов
export interface OrderItem {
  id: number;
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  needs_call: boolean;
  delivery_method: 'pickup' | 'delivery';
  payment_method: 'cash' | 'card' | 'transfer';
  delivery_address: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  needs_call: boolean;
  delivery_method: 'pickup' | 'delivery';
  payment_method: 'cash' | 'card' | 'transfer';
  delivery_address?: string;
  comment?: string;
  items: {
    product_id: number;
    product_type: 'tire' | 'wheel';
    quantity: number;
  }[];
}

// API для заказов
export const orderAPI = {
  // Создание заказа
  createOrder: async (orderData: CreateOrderData): Promise<{ success: boolean; message: string; order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/api/orders/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при создании заказа');
    }

    return response.json();
  },

  // Получение заказа по номеру
  getOrder: async (orderNumber: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderNumber}/`);
    
    if (!response.ok) {
      throw new Error('Заказ не найден');
    }

    return response.json();
  },
};

// API методы
export const productAPI = {
  // Получить список товаров
  getProducts: async (params?: {
    search?: string;
    product_type?: string;
    season?: string;
    brand?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_new?: boolean;
    is_on_sale?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<ProductListResponse> => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  // Получить товар по slug
  getProduct: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/${slug}/`);
    return response.data;
  },

  // Получить товар по ID
  getProductById: async (id: number, productType?: 'tire' | 'wheel'): Promise<Product> => {
    const params = productType ? { product_type: productType } : {};
    const response = await api.get(`/products/by-id/${id}/`, { params });
    return response.data;
  },

  // Получить рекомендуемые товары
  getFeaturedProducts: async (): Promise<ProductListResponse> => {
    const response = await api.get('/products/featured/');
    return response.data;
  },

  // Получить хиты продаж
  getBestsellerProducts: async (): Promise<ProductListResponse> => {
    const response = await api.get('/products/bestsellers/');
    return response.data;
  },

  // Получить новые товары
  getNewProducts: async (): Promise<ProductListResponse> => {
    const response = await api.get('/products/new/');
    return response.data;
  },

  // Получить товары со скидкой
  getSaleProducts: async (): Promise<ProductListResponse> => {
    const response = await api.get('/products/sale/');
    return response.data;
  },

  // Получить предложения для поиска
  getSearchSuggestions: async (query: string): Promise<{ suggestions: SearchSuggestion[] }> => {
    const response = await api.get('/search/suggestions/', { params: { q: query } });
    return response.data;
  },

  // Получить доступные фильтры
  getFilters: async (): Promise<ProductFilters> => {
    const response = await api.get('/filters/');
    return response.data;
  },

  // Умный поиск товаров
  smartSearch: async (params: {
    search_type: 'car' | 'params';
    product_type: 'tire' | 'wheel';
    make?: number;
    model?: number;
    generation?: number;
    width?: string;
    profile?: string;
    diameter?: string;
    season?: string;
    bolt_pattern?: string;
    offset?: string;
  }): Promise<{
    count: number;
    results: Product[];
    search_params: any;
    message: string;
  }> => {
    const response = await api.post('/search/smart/', params);
    return response.data;
  },
};

export const categoryAPI = {
  // Получить список категорий
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories/');
    return response.data;
  },
};

export const brandAPI = {
  // Получить список брендов
  getBrands: async (params?: { product_type?: string }): Promise<Brand[]> => {
    const response = await api.get('/brands/', { params });
    return response.data;
  },
};

export const carAPI = {
  // Получить марки автомобилей
  getMakes: async (): Promise<CarMake[]> => {
    const response = await api.get('/cars/makes/');
    return response.data;
  },

  // Получить модели автомобилей
  getModels: async (makeId?: number): Promise<CarModel[]> => {
    const params = makeId ? { make: makeId } : {};
    const response = await api.get('/cars/models/', { params });
    return response.data;
  },

  // Получить поколения автомобилей
  getGenerations: async (modelId?: number): Promise<CarGeneration[]> => {
    const params = modelId ? { model: modelId } : {};
    const response = await api.get('/cars/generations/', { params });
    return response.data;
  },

  // Получить годы выпуска
  getYears: async (): Promise<number[]> => {
    const response = await api.get('/cars/years/');
    return response.data;
  },

  // Получить детали поколения
  getGenerationDetail: async (generationId: number): Promise<CarGeneration> => {
    const response = await api.get(`/cars/generations/${generationId}/`);
    return response.data;
  },
};

// Экспорт экземпляра API для прямого использования
export default api; 