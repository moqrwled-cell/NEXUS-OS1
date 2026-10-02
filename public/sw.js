self.addEventListener('install', (event) => {
  console.log('Nexus OS Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Dummy fetch event to satisfy PWA install requirements
  return;
});
