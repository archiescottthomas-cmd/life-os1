const CACHE = 'life-os-v4';
const ASSETS = [
  './life-os.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/htm@3.1.1/dist/htm.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' || req.url.endsWith('life-os.html') || req.url.endsWith('/');
}

self.addEventListener('fetch', e => {
  const req = e.request;

  // Always go to the network first for the app shell so updates land immediately.
  // cache: 'no-store' bypasses the browser's HTTP cache (GitHub Pages sends
  // max-age=600 on the HTML, which would otherwise make "network-first" still
  // resolve from a stale disk-cached response for up to 10 minutes).
  // Cache is only a fallback for when the phone is offline.
  if (isHtmlRequest(req)) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {
          caches.open(CACHE).then(c => c.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./life-os.html')))
    );
    return;
  }

  // Static assets (icons, vendored libs) rarely change — cache-first is fine.
  e.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(res => {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      })
    )
  );
});
