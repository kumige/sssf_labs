"use strict";
const cacheName = "chargemap-pwa";
const filesToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/example.js",
  "./img/icon.png",
  "./img/logo.svg",
  "./img/splash.png",
  "./modules/leaflet/dist/leaflet.js",
  "./modules/esri-leaflet/dist/esri-leaflet.js",
  "./modules/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.js",
  "./modules/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css",
  "./modules/leaflet/dist/leaflet.css",
  "./modules/@fortawesome/fontawesome-free/css/all.min.css",
  "./modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2",
  "./modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff",
  "./modules/leaflet/dist/images/marker-icon.png",
  "./modules/leaflet/dist/images/marker-shadow.png",
  "./modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf"
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        // console.log(cache);
        return cache.addAll(filesToCache);
      } catch (e) {
        console.log("after install", e.message);
      }
    })()
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
  // console.log(e.request);
  e.respondWith(
    (async () => {
      try {
        const response = await caches.match(e.request);
        // console.log('resp', response);
        return response || fetch(e.request);
      } catch (e) {
        console.log("load cache", e.message);
      }
    })()
  );
});
/*
self.addEventListener("sync", (event) => {
  if (event.tag == "send-message") {
    event.waitUntil(sendToServer());
  }
});

const sendToServer = async () => {
  try {
    const outbox = await loadData("outbox");
    const sentMessages = await Promise.all(outbox.map(async (message) => await saveGreeting(message)))
    console.log(sentMessages)
    clearData('outbox')
  } catch (e) {
    console.log(e.message);
  }
};
*/