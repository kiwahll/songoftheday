// Allgemein
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Push Notifications
self.addEventListener("push", (event) => {
    const payload = event.data?.json();
    const title = payload?.title || "Neue Nachricht";
    const options = {
        body: payload?.body || "",
        icon: "/icons/icon-192.png",
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});