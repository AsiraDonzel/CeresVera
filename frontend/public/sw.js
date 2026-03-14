// Minimal Service Worker for PWA installation satisfaction
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
});

self.addEventListener('fetch', (event) => {
  // Pass-through for network requests
  event.respondWith(fetch(event.request));
});
