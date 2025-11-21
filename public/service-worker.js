const CACHE_NAME = "TodoApp-main";
const urlsToCache = [
  "/",
  "/index.html",
  // "/manifest.json",
  "/src/style.css",
  "/src/prompt.css",
  "/src/main.js",
  // "/src/install.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/assets/images/icon-cross.svg",
  "/assets/images/icon-check.svg",
  "/assets/images/icon-moon.svg",
  "/assets/images/icon-sun.svg",
  "/assets/images/bg-mobile-light.jpg",
  "/assets/images/bg-mobile-dark.jpg",
  "/assets/images/bg-desktop-light.jpg",
  "/assets/images/bg-desktop-dark.jpg",
];

// service-worker.js
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(e.request);
    })
  );
});
