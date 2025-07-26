import { useState, useEffect, useCallback } from 'react';
import { favoritesStorage, FavoriteItem, STORAGE_EVENTS } from '../utils/localStorage';

export const useFavorites = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const loadItems = () => {
      try {
        const favoriteItems = favoritesStorage.getItems();
        setItems(favoriteItems);
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();

    // Слушаем события изменения избранного для синхронизации в реальном времени
    const handleFavoritesUpdate = (event: CustomEvent) => {
      setItems(event.detail.items);
    };

    window.addEventListener(STORAGE_EVENTS.FAVORITES_UPDATED, handleFavoritesUpdate as EventListener);

    // Слушаем стандартные события storage для синхронизации между вкладками
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'prokolesa_favorites') {
        loadItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(STORAGE_EVENTS.FAVORITES_UPDATED, handleFavoritesUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Добавление товара в избранное
  const addToFavorites = useCallback((productId: number) => {
    favoritesStorage.addItem(productId);
    // setItems обновится автоматически через событие
  }, []);

  // Удаление товара из избранного
  const removeFromFavorites = useCallback((productId: number) => {
    favoritesStorage.removeItem(productId);
    // setItems обновится автоматически через событие
  }, []);

  // Переключение товара в избранном
  const toggleFavorite = useCallback((productId: number) => {
    const newState = favoritesStorage.toggleItem(productId);
    // setItems обновится автоматически через событие
    
    // Показываем уведомление (можно добавить позже)
    if (newState) {
      console.log(`Товар ${productId} добавлен в избранное`);
    } else {
      console.log(`Товар ${productId} удален из избранного`);
    }
    
    return newState;
  }, []);

  // Очистка избранного
  const clearFavorites = useCallback(() => {
    favoritesStorage.clear();
    // setItems обновится автоматически через событие
  }, []);

  // Проверка наличия товара в избранном
  const isFavorite = useCallback((productId: number) => {
    return favoritesStorage.isInFavorites(productId);
  }, []);

  // Подсчет количества товаров в избранном
  const totalItems = items.length;

  return {
    items,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    totalItems
  };
}; 