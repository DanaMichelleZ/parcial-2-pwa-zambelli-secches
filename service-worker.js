// service-worker xd

const cacheTragos = 'v1';
const fuenteCache = [
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
        caches.open(cacheTragos)
            .then(cache => {
                return cache.addAll(fuenteCache);
            })
    );
});

// Evento de activación: Limpiar cachés antiguas
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheTragos];
    event.waitUntil(
        caches.keys().then(cacheNombres => {
            return Promise.all(
                cacheNombres.map(cacheNombres => {
                    if (cacheWhitelist.indexOf(cacheNombres) === -1) {
                        return caches.delete(cacheNombres);
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
