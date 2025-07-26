// Утилиты для работы с локальным хранилищем

export interface CartItem {
  id: number;
  quantity: number;
  addedAt: string;
  productType?: 'tire' | 'wheel'; // Добавляем тип товара
}

export interface FavoriteItem {
  id: number;
  addedAt: string;
}

// События для синхронизации между компонентами
export const STORAGE_EVENTS = {
  CART_UPDATED: 'cart_updated',
  FAVORITES_UPDATED: 'favorites_updated'
} as const;

// Функция для отправки кастомных событий
const dispatchStorageEvent = (eventType: string, data?: any) => {
  window.dispatchEvent(new CustomEvent(eventType, { detail: data }));
};

// Корзина
export const cartStorage = {
  getItems: (): CartItem[] => {
    try {
      const items = localStorage.getItem('prokolesa_cart');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      return [];
    }
  },

  setItems: (items: CartItem[]): void => {
    try {
      localStorage.setItem('prokolesa_cart', JSON.stringify(items));
      dispatchStorageEvent(STORAGE_EVENTS.CART_UPDATED, { items, count: items.reduce((total, item) => total + item.quantity, 0) });
    } catch (error) {
      console.error('Ошибка при сохранении корзины:', error);
    }
  },

  addItem: (productId: number, quantity: number = 1, productType?: 'tire' | 'wheel'): void => {
    const items = cartStorage.getItems();
    const existingItem = items.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      // Обновляем тип товара если он не был установлен ранее
      if (productType && !existingItem.productType) {
        existingItem.productType = productType;
      }
    } else {
      items.push({
        id: productId,
        quantity,
        addedAt: new Date().toISOString(),
        productType
      });
    }
    
    cartStorage.setItems(items);
  },

  removeItem: (productId: number): void => {
    const items = cartStorage.getItems();
    const filteredItems = items.filter(item => item.id !== productId);
    cartStorage.setItems(filteredItems);
  },

  updateQuantity: (productId: number, quantity: number): void => {
    const items = cartStorage.getItems();
    const item = items.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        cartStorage.removeItem(productId);
      } else {
        item.quantity = quantity;
        cartStorage.setItems(items);
      }
    }
  },

  clear: (): void => {
    localStorage.removeItem('prokolesa_cart');
    dispatchStorageEvent(STORAGE_EVENTS.CART_UPDATED, { items: [], count: 0 });
  },

  getItemCount: (): number => {
    const items = cartStorage.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  isInCart: (productId: number): boolean => {
    const items = cartStorage.getItems();
    return items.some(item => item.id === productId);
  }
};

// Избранное
export const favoritesStorage = {
  getItems: (): FavoriteItem[] => {
    try {
      const items = localStorage.getItem('prokolesa_favorites');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error);
      return [];
    }
  },

  setItems: (items: FavoriteItem[]): void => {
    try {
      localStorage.setItem('prokolesa_favorites', JSON.stringify(items));
      dispatchStorageEvent(STORAGE_EVENTS.FAVORITES_UPDATED, { items, count: items.length });
    } catch (error) {
      console.error('Ошибка при сохранении избранного:', error);
    }
  },

  addItem: (productId: number): void => {
    const items = favoritesStorage.getItems();
    const exists = items.some(item => item.id === productId);
    
    if (!exists) {
      items.push({
        id: productId,
        addedAt: new Date().toISOString()
      });
      favoritesStorage.setItems(items);
    }
  },

  removeItem: (productId: number): void => {
    const items = favoritesStorage.getItems();
    const filteredItems = items.filter(item => item.id !== productId);
    favoritesStorage.setItems(filteredItems);
  },

  toggleItem: (productId: number): boolean => {
    const isInFavorites = favoritesStorage.isInFavorites(productId);
    
    if (isInFavorites) {
      favoritesStorage.removeItem(productId);
      return false;
    } else {
      favoritesStorage.addItem(productId);
      return true;
    }
  },

  clear: (): void => {
    localStorage.removeItem('prokolesa_favorites');
    dispatchStorageEvent(STORAGE_EVENTS.FAVORITES_UPDATED, { items: [], count: 0 });
  },

  getItemCount: (): number => {
    const items = favoritesStorage.getItems();
    return items.length;
  },

  isInFavorites: (productId: number): boolean => {
    const items = favoritesStorage.getItems();
    return items.some(item => item.id === productId);
  }
};

// Хуки для React компонентов
export const useLocalStorage = () => {
  return {
    cart: cartStorage,
    favorites: favoritesStorage
  };
}; 