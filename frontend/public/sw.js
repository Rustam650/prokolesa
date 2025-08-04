const CACHE_NAME = "prokolesa-v1.4.2";
const urlsToCache = [
  "/",
  "/static/js/main.a058c8ab.js",
  "/static/css/main.7bfffcd4.css",
  "/manifest.json",
  "/site.webmanifest",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/logo192.png",
  "/logo512.png"
];

// Установка Service Worker
self.addEventListener("install", event => {
  console.log("Service Worker: Install Event");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Service Worker: Caching Files");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("Service Worker: Skip Waiting");
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener("activate", event => {
  console.log("Service Worker: Activate Event");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Service Worker: Claiming Clients");
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener("fetch", event => {
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Возвращаем кэш, если есть, иначе делаем сетевой запрос
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            // Проверяем, что ответ валидный
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }
            
            // Клонируем ответ для кэша
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
        })
    );
  }
});

// Обработка сообщений для обновления
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Уведомление об обновлении
self.addEventListener("message", event => {
  if (event.data && event.data.type === "CHECK_UPDATE") {
    event.ports[0].postMessage({
      type: "UPDATE_AVAILABLE",
      version: CACHE_NAME
    });
  }
});

// Push уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новые предложения в ProKolesa!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Посмотреть',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/xmark.png'
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
  // Здесь можно синхронизировать данные корзины, избранное и т.д.
  return fetch('/api/sync')
    .then((response) => response.json())
    .then((data) => {
      console.log('Background sync completed:', data);
    })
    .catch((error) => {
      console.error('Background sync failed:', error);
    });
} 