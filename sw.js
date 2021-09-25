
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('recipes').then((cache) => cache.addAll([
            'reset.css',
        ])),
    );
});

self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});