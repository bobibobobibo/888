// Service Worker for offline support
const CACHE_NAME = 'checkin-system-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/js/config.js',
    '/js/main.js',
    '/js/agents/UIAgent.js',
    '/js/agents/DataAgent.js',
    '/js/agents/MapAgent.js',
    '/js/agents/AnalyticsAgent.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
