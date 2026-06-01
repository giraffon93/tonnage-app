const CACHE_NAME = "tonnage-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

// INSTALL
self.addEventListener("install", (event) => {
  self.skipWaiting(); // force activation immédiate

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // prend le contrôle direct
});

// FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
