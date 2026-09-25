const V = "kfit-v3";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  // The actual bug: this handler used to wrap EVERY request, including
  // POST/PATCH writes to Supabase (saving a workout, syncing attendance).
  // The Cache API can only ever store GET requests -- caching a POST is
  // invalid and silently fails. That's harmless on its own, but the moment
  // the network hiccups (gym wifi, exactly when someone's mid-workout),
  // the fallback tries caches.match() on that same POST request, finds
  // nothing (a POST can never have been cached), and hands the browser
  // `undefined` instead of a real response -- which is exactly the
  // "Returned response is null" error that was surfacing as unsynced
  // workouts. Only GET requests are safe to run through this cache-first
  // logic at all; everything else must go straight to the network,
  // untouched, exactly as if this service worker didn't exist.
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-store" }).then(res => {
      const clone = res.clone();
      caches.open(V).then(c => c.put(e.request, clone)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
