// service-worker xd

const cacheTragos = 'v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheTragos)
            .then(cache => {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/detalle.html',
                    '/style.css',
                    '/script.js',
                    '/detalle.js',
                    '/manifiesto.json'
                ]);
            })
            .then(() => self.skipWaiting())
    );
});


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
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== cacheTragos)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Evento de fetch: Responder con recursos del caché o hacer una solicitud a la red
self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(response => {
                if (response) {
                    return response;
                }

                const fetchRequest = request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(cacheTragos)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});
