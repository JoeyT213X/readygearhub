/* Generated service worker. Do not edit dist output; change src/pwa/sw-template.js
 * and src/data/pwa-apps.json. Scope must stay inside this app's path so the rest
 * of the site is not controlled. */
const config = __PWA_CONFIG__;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(config.cacheName).then((cache) => cache.addAll(config.precache)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== config.cacheName).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(config.cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function cacheOnFetch(request) {
  const cache = await caches.open(config.cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

function sameOrigin(url) {
  return url.origin === self.location.origin;
}

function inScope(url) {
  return sameOrigin(url) && url.pathname.startsWith(config.scope);
}

function isHashedAsset(url) {
  return sameOrigin(url) && (config.cacheOnFetchPrefixes || []).some((prefix) => url.pathname.startsWith(prefix));
}

function isNetworkFirstHost(url) {
  return (config.networkFirstHosts || []).includes(url.hostname);
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Never intercept the rest of the site (lane pages, tools, etc.).
  if (isNetworkFirstHost(url) || inScope(url)) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (isHashedAsset(url)) {
    event.respondWith(cacheOnFetch(event.request));
  }
});
