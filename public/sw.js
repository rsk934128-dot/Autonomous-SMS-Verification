// Service Worker for TextVerified Hub & Sheikh Farid Studio PWA
const CACHE_NAME = 'farid-studio-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Never intercept non-GET, API calls, Vite internals, HMR, or local dev scripts
  const url = event.request.url;
  if (
    event.request.method !== 'GET' ||
    url.includes('/api/') ||
    url.includes('/@vite/') ||
    url.includes('/@fs/') ||
    url.includes('/src/') ||
    url.includes('?v=') ||
    url.includes('?import') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1')
  ) {
    return;
  }

  // Network-First strategy: Always fetch fresh from server, only fallback to cache if offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});
