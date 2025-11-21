const CACHE_NAME = "TodoApp-main";
const urlsToCache = [
  "/",
  "/index.html",
  // "/manifest.json",
  "/src/style.css",
  "/src/prompt.css",
  "/src/main.js",
  // "/src/install.js",
  "/icon-192.png",
  "/icon-512.png",
  "/images/icon-cross.svg",
  "/images/icon-check.svg",
  "/images/icon-moon.svg",
  "/images/icon-sun.svg",
  "/images/bg-mobile-light.jpg",
  "/images/bg-mobile-dark.jpg",
  "/images/bg-desktop-light.jpg",
  "/images/bg-desktop-dark.jpg",
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
