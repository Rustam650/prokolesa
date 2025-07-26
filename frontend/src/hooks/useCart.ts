import { useState, useEffect, useCallback } from 'react';
import { cartStorage, CartItem, STORAGE_EVENTS } from '../utils/localStorage';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const loadItems = () => {
      try {
        const cartItems = cartStorage.getItems();
        setItems(cartItems);
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();

    // Слушаем события изменения корзины для синхронизации в реальном времени
    const handleCartUpdate = (event: CustomEvent) => {
      setItems(event.detail.items);
    };

    window.addEventListener(STORAGE_EVENTS.CART_UPDATED, handleCartUpdate as EventListener);

    // Слушаем стандартные события storage для синхронизации между вкладками
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'prokolesa_cart') {
        loadItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(STORAGE_EVENTS.CART_UPDATED, handleCartUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Добавление товара в корзину
  const addToCart = useCallback((productId: number, quantity: number = 1, productType?: 'tire' | 'wheel') => {
    console.log(`[useCart] Добавление товара в корзину: ID=${productId}, quantity=${quantity}, type=${productType}`);
    
    try {
      cartStorage.addItem(productId, quantity, productType);
      console.log(`[useCart] ✅ Товар ${productId} успешно добавлен в localStorage`);
      
      // Проверяем что товар действительно добавился
      const isAdded = cartStorage.isInCart(productId);
      console.log(`[useCart] Проверка: товар ${productId} в корзине: ${isAdded}`);
      
    } catch (error) {
      console.error(`[useCart] ❌ Ошибка добавления товара ${productId}:`, error);
    }
  }, []);

  // Удаление товара из корзины
  const removeFromCart = useCallback((productId: number) => {
    cartStorage.removeItem(productId);
    // setItems обновится автоматически через событие
  }, []);

  // Обновление количества товара
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    cartStorage.updateQuantity(productId, quantity);
    // setItems обновится автоматически через событие
  }, []);

  // Очистка корзины
  const clearCart = useCallback(() => {
    cartStorage.clear();
    // setItems обновится автоматически через событие
  }, []);

  // Проверка наличия товара в корзине
  const isInCart = useCallback((productId: number) => {
    return cartStorage.isInCart(productId);
  }, []);

  // Получение количества конкретного товара
  const getItemQuantity = useCallback((productId: number) => {
    const item = items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [items]);

  // Подсчет общего количества товаров
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Подсчет уникальных товаров
  const uniqueItemsCount = items.length;

  return {
    items,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    totalItems,
    uniqueItemsCount
  };
}; 