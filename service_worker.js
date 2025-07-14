const CACHE_NAME = 'shopnow-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/service-worker.js',
  '/manifest.json',
  '/styles.css',
  'https://i.imgur.com/0y8Ftya.png',
  'https://i.imgur.com/1bX5QH6.png',
  'https://i.imgur.com/8Km9tLL.png'
];

// Install event: Cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch event: Serve cached assets if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});

// Push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'ShopNow', body: 'New offer available!' };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://i.imgur.com/8Km9tLL.png'
  });
});
