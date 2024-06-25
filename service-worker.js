// service-worker xd

const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/detalle.html',
    '/style.css',
    '/script.js',
    '/detalle.js',
    '/manifiesto.json'
];

// Evento de instalación: Precachear recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de activación: Limpiar cachés antiguas
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de fetch: Responder con recursos del caché o hacer una solicitud a la red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
