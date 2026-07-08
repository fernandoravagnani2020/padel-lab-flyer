/* Pádel Lab Flyers — service worker: red primero, caché como respaldo */
var CACHE = 'pl-flyer-v3';
var BASE = [
  './',
  './index.html',
  './manifest.json',
  './assets/plantilla2.png',
  './assets/padel-lab-isotipo-negativo.svg',
  './assets/padel-lab-isotipo-app.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-180.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(BASE); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(claves){
      return Promise.all(claves.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copia = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copia); });
      return res;
    }).catch(function(){
      return caches.match(e.request, {ignoreSearch:true});
    })
  );
});
