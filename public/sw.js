self.addEventListener('install', (event) => {
  console.log('Nexus OS Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through to avoid caching stale bundles
  return;
});
