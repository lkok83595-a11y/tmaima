// Service worker: always loads the newest page from the network (bypassing the browser HTTP cache);
// falls back to the saved copy only when offline. Bump VERSION on each deploy.
const VERSION = "2026-11-26-7";
const CACHE = "tamima-shell-" + VERSION;
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("tamima-shell-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;
  e.respondWith(
    fetch(req, { cache: "no-store" }).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./", copy)); return res; })
      .catch(() => caches.match("./"))
  );
});
