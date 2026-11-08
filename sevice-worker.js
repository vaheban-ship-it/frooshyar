const CACHE_NAME = 'frooshyar-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon.ico'
];

// نصب سرویس وورکر و ذخیره فایل‌ها در کش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache assets during install:', err);
      })
  );
  self.skipWaiting();
});

// مدیریت درخواست‌ها و بارگذاری از کش یا شبکه
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر فایل در کش موجود بود، آن را برگردان، در غیر این صورت از شبکه درخواست کن
        return response || fetch(event.request);
      })
      .catch(() => {
        // در صورت عدم دسترسی به شبکه و موجود نبودن در کش
      })
  );
});

// فعال‌سازی و پاکسازی کش‌های قدیمی
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
