self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// Handle share target requests
self.addEventListener('fetch', (event) => {
    console.log('Service Worker handling fetch:', event.request.url);

    // Let the network handle all requests
    event.respondWith(fetch(event.request));
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);
});
