const staticDev = 'shakemate';
const assets = [
    '/',
    '/asstes/audio/message.mp3',
    '/assets/css/style.css',
    '/assets/css/responsive.css',
    '/assets/css/video-grid.css',
    '/assets/img/bg.png',
    '/assets/img/send.png',
    '/assets/img/upload.png',
    '/assets/js/call.js',
    '/assets/js/media.js',
    '/assets/js/video-grid.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
];

self.addEventListener('install', (installEvent) => {
    installEvent.waitUntil(
        caches.open(staticDev).then((cache) => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch', (fetchEvent) => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((res) => {
            return res || fetch(fetchEvent.request);
        })
    );
});
