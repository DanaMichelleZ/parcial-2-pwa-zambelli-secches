const CACHE_NAME = 'v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/detalle.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/detalle.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-256.png',
    '/icons/icon-384.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', event => {
    console.log('Service worker instalado');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache)
                    .then(() => {
                        console.log('Caching completado');
                        self.skipWaiting();
                    })
                    .catch(error => {
                        console.error('Error al añadir recursos al caché:', error);
                    });
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker activado');
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
    console.log('Fetch interrumpido:', event.request.url);

    const { request } = event;

    if (request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        console.log('Respuesta encontrada:', event.request.url);
                        return response;
                    }
                    const fetchRequest = request.clone();
                    return fetch(fetchRequest)
                        .then(response => {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                console.log('Respuesta inválida:', response);
                                return response;
                            }
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    console.log('Guardando respuesta:', event.request.url);
                                    cache.put(request, responseToCache);
                                });

                            return response;
                        })
                        .catch(error => {
                            console.error('Error fetch:', error);
                            throw error;
                        });
                })
                .catch(error => {
                    console.error('Error al recuperar desde caché:', error);
                    return caches.match('/offline.html');
                })
        );
    }
});