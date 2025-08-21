const CACHE_NAME = "animated-pwa-cache-v3";
const urlsToCache = [
  "./",
  "./index.html", 
  "./manifest.json",
  "./styles.css",
  "./script.js",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDh42tHL_EFsPoYIfkryodgq_NAxbDkFa9TQ&s",
  "https://www.w3schools.com/html/mov_bbb.mp4"
];

self.addEventListener("install", event => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Caching files...");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("All files cached, skipping waiting...");
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", event => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Service Worker taking control...");
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log("Serving from cache:", event.request.url);
          return response;
        }
        
        // Try to fetch from network
        return fetch(event.request)
          .then(fetchResponse => {
            // Cache successful responses for future use
            if (fetchResponse && fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            console.log("Network failed for:", event.request.url);
            // If network fails and no cache available, return offline fallback for HTML
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            // For other resources, return a basic offline response
            if (event.request.destination === 'image') {
              return new Response('Image not available offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            }
          });
      })
  );
});