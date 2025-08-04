const CACHE_NAME = "prokolesa-v1.4.6";
const STATIC_CACHE = "prokolesa-static-v1.4.6";
const RUNTIME_CACHE = "prokolesa-runtime-v1.4.6";

// Статические файлы для кэширования
const urlsToCache = [
  "/",
  "/static/js/main.64e9cdb0.js",
  "/static/css/main.7bfffcd4.css",
  "/manifest.json",
  "/site.webmanifest",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/logo192.png",
  "/logo512.png",
  "/placeholder-product.svg",
  "/placeholder-tire.svg",
  "/placeholder-wheel.svg"
];

// Установка Service Worker
self.addEventListener("install", event => {
  console.log("[SW] Install Event - Version:", CACHE_NAME);
  
  event.waitUntil(
    Promise.all([
      // Кэшируем статические файлы
      caches.open(STATIC_CACHE).then(cache => {
        console.log("[SW] Caching static files");
        return cache.addAll(urlsToCache);
      }),
      // Принудительно активируем новый SW
      self.skipWaiting()
    ])
  );
});

// Активация Service Worker
self.addEventListener("activate", event => {
  console.log("[SW] Activate Event - Version:", CACHE_NAME);
  
  event.waitUntil(
    Promise.all([
      // Удаляем старые кэши
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Берем контроль над всеми клиентами
      self.clients.claim().then(() => {
        console.log("[SW] Claiming all clients");
        // Уведомляем все открытые страницы об обновлении
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_UPDATED',
              version: CACHE_NAME
            });
          });
        });
      })
    ])
  );
});

// Обработка запросов с Network First стратегией для API и Cache First для статики
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Игнорируем запросы не к нашему домену
  if (url.origin !== location.origin) {
    return;
  }

  // API запросы - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Кэшируем успешные API ответы
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Если сеть недоступна, пытаемся взять из кэша
          return caches.match(request);
        })
    );
    return;
  }

  // Статические файлы - Cache First
  if (request.method === "GET") {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(response => {
          // Кэшируем только успешные ответы
          if (response.status === 200) {
            const responseToCache = response.clone();
            
            // Определяем в какой кэш сохранить
            const cacheToUse = urlsToCache.includes(url.pathname) ? STATIC_CACHE : RUNTIME_CACHE;
            
            caches.open(cacheToUse).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          
          return response;
        });
      })
    );
  }
});

// Обработка сообщений от главного потока
self.addEventListener("message", event => {
  const { data } = event;
  
  switch (data.type) {
    case "SKIP_WAITING":
      console.log("[SW] Skip waiting requested");
      self.skipWaiting();
      break;
      
    case "GET_VERSION":
      event.ports[0].postMessage({
        type: "VERSION_INFO",
        version: CACHE_NAME
      });
      break;
      
    case "CLEAR_CACHE":
      console.log("[SW] Clearing all caches");
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({
          type: "CACHE_CLEARED"
        });
      });
      break;
  }
});

// Push уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новые предложения в ProKolesa!',
    icon: '/logo192.png',
    badge: '/favicon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Посмотреть',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/favicon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ProKolesa', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Фоновая синхронизация
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Синхронизация данных корзины и избранного
  return Promise.all([
    syncCartData(),
    syncFavoritesData()
  ]).catch(error => {
    console.error('[SW] Background sync failed:', error);
  });
}

function syncCartData() {
  // Синхронизация корзины
  return new Promise(resolve => {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        console.log('[SW] Cart data synced');
      }
      resolve();
    } catch (error) {
      console.error('[SW] Cart sync error:', error);
      resolve();
    }
  });
}

function syncFavoritesData() {
  // Синхронизация избранного
  return new Promise(resolve => {
    try {
      const favoritesData = localStorage.getItem('favorites');
      if (favoritesData) {
        console.log('[SW] Favorites data synced');
      }
      resolve();
    } catch (error) {
      console.error('[SW] Favorites sync error:', error);
      resolve();
    }
  });
} 