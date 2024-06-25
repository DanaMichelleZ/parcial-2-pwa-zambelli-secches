// service-worker xddd

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

// Evento instalacion: Precach recurso
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de activacion: Limpiar caches viejito
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

// Evento fetch: Responder con recurso cache o hacemo una solicitud a la red we
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
