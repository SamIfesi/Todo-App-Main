self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("todo-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/src/style.css",
        "/src/prompt.css",
        "/src/main.js",
        // "/src/install.js",
        "/assets/icons/icon-192.png",
        "/assets/icons/icon-512.png",
        "/assets/images/icon-cross.svg",
        "/assets/images/icon-check.svg",
        "/assets/images/icon-moon.svg",
        "/assets/images/icon-sun.svg",
        "/assets/images/bg-mobile-light.jpg",
        "/assets/images/bg-mobile-dark.jpg",
        "/assets/images/bg-desktop-light.jpg",
        "/assets/images/bg-desktop-dark.jpg"
      ]);
    })
  );
});

// service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request) 
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();

            caches.open('my-app-cache')
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', event.request.url, error);
            throw error;
          });
      })
  );
});
