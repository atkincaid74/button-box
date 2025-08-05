const CACHE_NAME = 'button-box-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sounds/kids_back_down_the_mines.mp3',
  '/sounds/GMAFBP.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Handle fullscreen on mobile
self.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
});