self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("todo-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/src/style.css",
        "/src/main.js",
        "/src/manifest.json",
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

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
