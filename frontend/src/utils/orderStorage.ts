export interface StoredOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: Array<{
    id: number;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
  }>;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address?: string;
    deliveryMethod: string;
    paymentMethod: string;
  };
}

const ORDERS_STORAGE_KEY = 'prokolesa_orders';

export const orderStorage = {
  // Получить все заказы
  getOrders: (): StoredOrder[] => {
    try {
      const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
      return [];
    }
  },

  // Сохранить заказ
  saveOrder: (order: StoredOrder): void => {
    try {
      const orders = orderStorage.getOrders();
      orders.unshift(order); // Добавляем в начало (новые заказы сверху)
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Ошибка при сохранении заказа:', error);
    }
  },

  // Получить заказ по ID
  getOrderById: (id: string): StoredOrder | null => {
    const orders = orderStorage.getOrders();
    return orders.find(order => order.id === id) || null;
  },

  // Обновить статус заказа (для будущего использования)
  updateOrderStatus: (id: string, status: StoredOrder['status']): void => {
    try {
      const orders = orderStorage.getOrders();
      const orderIndex = orders.findIndex(order => order.id === id);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
    }
  },

  // Очистить все заказы (для отладки)
  clearOrders: (): void => {
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  }
};

// Утилиты для форматирования
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusText = (status: StoredOrder['status']): string => {
  const statusMap = {
    pending: 'Ожидает обработки',
    processing: 'В обработке',
    completed: 'Выполнен',
    cancelled: 'Отменен'
  };
  return statusMap[status];
};

export const getStatusColor = (status: StoredOrder['status']): string => {
  const colorMap = {
    pending: '#FF9800',
    processing: '#2196F3',
    completed: '#4CAF50',
    cancelled: '#F44336'
  };
  return colorMap[status];
}; 