const CACHE_NAME = "animated-pwa-cache-v2";
const urlsToCache = [
  "index.html", 
  "manifest.json",
  "styles.css",
  "script.js",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDh42tHL_EFsPoYIfkryodgq_NAxbDkFa9TQ&s",
  "https://www.w3schools.com/html/mov_bbb.mp4"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If network fails and no cache available, return a basic offline response for HTML
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});