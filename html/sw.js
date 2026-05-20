/* ===== Service Worker — SKI v1.0 ===== */
const CACHE = 'ski-cache-v1';
const STATIC = [
  '/',
  '/css/subdomain.min.css',
  '/images/logo.png',
  '/images/favicon.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  const {request} = e;
  const url = new URL(request.url);

  // Cache-first for static assets
  if (/\.(css|js|png|jpg|webp|svg|woff2?|ico)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(request).then(r => r || fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return res;
      }))
    );
    return;
  }

  // Network-first for HTML/navigation
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Default: network-first
  e.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
