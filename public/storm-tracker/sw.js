/* Storm Tracker service worker.
 * Scope is /storm-tracker/ only, so this file must stay at
 * /storm-tracker/sw.js and must not be registered from the rest of the site.
 * Cross-origin NWS requests from the app are handled network-first with a
 * cached fallback. Other ReadyGearHub routes are never intercepted.
 */
const CACHE = 'rgh-storm-tracker-v1';
const SHELL = [
  '/storm-tracker/',
  '/storm-tracker/app.css',
  '/storm-tracker/app.js',
  '/storm-tracker/manifest.webmanifest',
  '/storm-tracker/icon-192.png',
  '/storm-tracker/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // Only handle this app's files. Do not intercept the rest of readygearhub.com.
  const isAppAsset = url.origin === self.location.origin && url.pathname.startsWith('/storm-tracker');
  const isNws = url.hostname === 'api.weather.gov';
  if (!isAppAsset && !isNws) return;

  event.respondWith(networkFirst(event.request));
});
