const CACHE_NAME = "tonnage-auto";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// INSTALL → télécharge la nouvelle version
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ACTIVATE → supprime les anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH → sert le cache + met à jour en arrière-plan
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => response);

      return response || fetchPromise;
    })
  );
});
