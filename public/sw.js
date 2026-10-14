const CACHE_PREFIX = "isla-puente-static-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const OFFLINE = "/offline.html";
const SHELL = [OFFLINE, "/fonts/Archivo-Variable.ttf", "/fonts/ArchivoBlack-Regular.ttf", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

async function keepStatic(request, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
  const keys = await cache.keys();
  const disposable = keys.filter((key) => !SHELL.includes(new URL(key.url).pathname));
  for (const key of disposable.slice(0, Math.max(0, keys.length - 64))) await cache.delete(key);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Los datos vivos y las respuestas de React nunca entran en la caché offline.
  if (url.pathname.startsWith("/api/") || request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(OFFLINE) || Response.error();
    }));
    return;
  }

  const staticResource = ["/_next/static/", "/fonts/", "/map/", "/icons/"].some((prefix) => url.pathname.startsWith(prefix))
    || url.pathname === "/favicon.ico";
  if (!staticResource) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && /^(image\/|font\/|text\/css|(?:text|application)\/javascript)/i.test(response.headers.get("Content-Type") || "")) {
        event.waitUntil(keepStatic(request, response.clone()));
      }
      return response;
    } catch {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(request) || Response.error();
    }
  })());
});
