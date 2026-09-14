const V = "kfit-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => e.respondWith(
  // no-store forces a genuinely fresh network request every time, bypassing
  // any HTTP-level cache (browser or CDN) that could otherwise satisfy this
  // fetch() with a stale response even though the logic here is already
  // "network first" -- that HTTP-level caching was the real gap; the
  // service worker's own Cache Storage was never the problem, it was only
  // ever a fallback for offline use.
  fetch(e.request, { cache: "no-store" }).then(res => {
    const clone = res.clone();
    caches.open(V).then(c => c.put(e.request, clone));
    return res;
  }).catch(() => caches.match(e.request))
));
