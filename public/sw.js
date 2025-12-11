// Service Worker for Koroba PWA
const CACHE_NAME = 'african-heritage-v2';
const STATIC_CACHE = 'african-heritage-static-v2';
const DYNAMIC_CACHE = 'african-heritage-dynamic-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/landing',
  '/explore',
  '/manifest.json',
  '/logo.svg',
  '/placeholder.jpg',
  '/placeholder.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Supabase API calls (they need fresh data)
  if (url.hostname.includes('supabase.co')) return;

  // Skip Next.js internal routes (except assets handled below)
  if (url.pathname.startsWith('/_next/')) {
    // If it's a static file (css/js/media), we might want to cache it, but Next.js hashes files so they are unique.
    // We generally rely on browser cache for these.
    return;
  }

  // Network First Strategy for HTML Navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
        })
        .catch(() => {
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              return caches.match('/landing');
            });
        })
    );
    return;
  }

  // Cache First Strategy for everything else (Images, Fonts, etc.)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) return response;

            // Clone the response for caching
            const responseClone = response.clone();

            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return response;
          });
      })
  );
});

// Background sync for offline actions (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync for offline actions
  // This would sync pending proverb submissions, likes, etc.
  console.log('Background sync triggered');
}

// Push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});