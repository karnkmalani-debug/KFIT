const V = "kfit-v6";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(
  // v5: new per-row fitness storage (kfit-fitness-store.js). Bumping the
  // version wipes every old cache so no phone keeps an old app copy.
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  const req = e.request;
  // Writes (POST/PATCH/DELETE) always go straight to the network.
  if (req.method !== "GET") return;
  // Only the app's own files (the HTML pages, icons, manifests, the shared
  // .js) are ever handled here. Supabase, fonts and CDN requests are NOT
  // touched. Previously every Supabase read went through this worker, which
  // caused two real bugs:
  //  1. If the worker's own re-fetch failed and nothing was cached, it
  //     answered with `undefined`, which the page sees as
  //     "TypeError: Load failed" -- the sync-error toast.
  //  2. If something WAS cached, it silently served an old copy of the
  //     client's data as if it were current. The tracker's sync then merged
  //     against that stale copy and wrote it back, overwriting newer changes
  //     (e.g. edits made from Merge).
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-store" }).then(res => {
      if (res && res.ok) {
        const clone = res.clone();
        caches.open(V).then(c => c.put(req, clone)).catch(() => {});
      }
      return res;
    }).catch(() =>
      caches.match(req).then(hit => {
        if (hit) return hit;
        // Never hand the browser `undefined`: return a real error response.
        return Response.error();
      })
    )
  );
});
