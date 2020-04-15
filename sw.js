var cacheName = "hello-pwa";
var filesToCache = [
  "/",
  "./index.html",
  "./css/style.css",
  "./js/main.js",
  "./fonts/Cantarell-Regular-webfont.woff",
  "./images/bg.png",
  "./css/all.css",
  './webfonts/fa-solid-900.eot',
  './webfonts/fa-solid-900.woff2',
  './webfonts/fa-solid-900.woff',
  './webfonts/fa-solid-900.ttf',
  './webfonts/fa-solid-900.svg',
  './webfonts/fa-regular-400.eot',
  './webfonts/fa-regular-400.woff2',
  './webfonts/fa-regular-400.woff',
  './webfonts/fa-regular-400.ttf',
  './webfonts/fa-regular-400.svg',
  './webfonts/fa-brands-400.eot',
  './webfonts/fa-brands-400.woff2',
  './webfonts/fa-brands-400.woff',
  './webfonts/fa-brands-400.ttf',
  './webfonts/fa-brands-400.svg',

];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
    console.log("You fetched " + e.url)
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
