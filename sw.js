const V = "kfit-v21";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(
  // v16: batch 8 (coach phone notifications). Bumping
  // the version wipes every old cache so no phone keeps an old app copy.
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

// ---- Coach phone notifications (Merge) ----
// The server sends {title, body, url, tag, silent}. We show it, bump the
// number on the KFit Coach icon, and tapping it opens Merge at that client.
async function kfitBadgeBump(){
  try{
    const c = await caches.open("kfit-badge");
    const r = await c.match("/__badge"); const n = (r ? parseInt(await r.text(), 10) || 0 : 0) + 1;
    await c.put("/__badge", new Response(String(n)));
    if (self.navigator && self.navigator.setAppBadge) await self.navigator.setAppBadge(n);
  }catch(e){}
}
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: "KFit", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(Promise.all([
    self.registration.showNotification(d.title || "KFit", {
      body: d.body || "", tag: d.tag || undefined, renotify: !!d.tag, silent: !!d.silent,
      icon: "/icon-coach-192.png", badge: "/icon-coach-192.png", data: { url: d.url || "/kfit-coach-merged.html" }
    }),
    kfitBadgeBump()
  ]));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/kfit-coach-merged.html";
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      if (c.url.indexOf("kfit-coach-merged") >= 0) { c.postMessage({ type: "kfit-open", url }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
