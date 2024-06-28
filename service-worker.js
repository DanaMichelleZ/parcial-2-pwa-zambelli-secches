const CACHE_NAME = 'v1';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/detalle.html',
                    '/css/style.css',
                    '/js/script.js',
                    '/js/detalle.js',
                    '/manifiesto.json',
                    '/icons/icono-192.png',
                    '/icons/icono-256.png',
                    '/icons/icono-384.png',
                    '/icons/icono-512.png'
                ]);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

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
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});