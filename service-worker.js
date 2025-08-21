const CACHE_NAME = "animated-pwa-cache-v2";
// Only cache same-origin app shell files during install to avoid CORS failures.
const urlsToCache = [
  "index.html",
  "manifest.json",
  "styles.css",
  "script.js",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", event => {
  // Make install resilient: don't fail install if a single resource fails to cache.
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(urlsToCache);
        console.log('Service Worker: App shell cached');
      } catch (err) {
        console.warn('Service Worker: cache.addAll failed, caching items individually', err);
        // Try to add individually so one failure doesn't block install
        await Promise.all(urlsToCache.map(async (url) => {
          try {
            await cache.add(url);
          } catch (e) {
            console.warn('Service Worker: failed to cache', url, e);
          }
        }));
      }
    })
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches and take control immediately
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) return caches.delete(key);
    }));
    await self.clients.claim();
    console.log('Service Worker: activated and clients claimed');
  })());
});

self.addEventListener("fetch", event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    try {
      const networkResponse = await fetch(event.request);
      // Put a copy in the cache for future use (best-effort)
      try {
        // Some responses are opaque for cross-origin requests; still ok to cache.
        await cache.put(event.request, networkResponse.clone());
      } catch (e) {
        // ignore cache put failures
        console.warn('Service Worker: cache.put failed for', event.request.url, e);
      }
      return networkResponse;
    } catch (err) {
      // Network failed. If it's a navigation, serve the cached app shell.
      if (event.request.mode === 'navigate' || event.request.destination === 'document') {
        return caches.match('index.html');
      }

      // If request is an image, return a tiny placeholder SVG
      if (event.request.destination === 'image') {
        return new Response(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666">Offline</text></svg>',
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      }

      // Otherwise, respond with nothing so the page can handle it.
      return new Response(null, { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});