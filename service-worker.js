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
    caches.match(event.request) // Try to match from cache first
      .then((cachedResponse) => {
        // If a cached response is found, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, try to fetch from the network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // both the browser and the cache can consume it.
            const responseToCache = networkResponse.clone();

            caches.open('my-app-cache') // Replace 'my-app-cache' with your actual cache name
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            // This catch block handles network errors from fetch()
            console.error('Fetch failed:', event.request.url, error);
            // You could serve an offline page or a generic fallback here
            // Example: return caches.match('/offline.html');
            throw error; // Re-throw if you want to propagate the error, or handle it gracefully
          });
      })
  );
});
