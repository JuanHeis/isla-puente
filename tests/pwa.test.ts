import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import manifest from "../src/app/manifest.ts";

const code = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const origin = "https://isla-puente.example";
type WorkerEvent = { request?: Request; respondWith?: (response: Promise<Response>) => void; waitUntil: (work: Promise<unknown>) => void };

function worker(network: (request: Request) => Promise<Response>) {
  const handlers = new Map<string, (event: WorkerEvent) => void>();
  const caches = new Map<string, Map<string, Response>>();
  const waits: Promise<unknown>[] = [];
  const key = (request: Request | string) => typeof request === "string" ? new URL(request, origin).href : request.url;
  let claimed = false;
  runInNewContext(code, {
    URL, Response,
    self: {
      location: { origin },
      addEventListener: (name: string, handler: (event: WorkerEvent) => void) => handlers.set(name, handler),
      skipWaiting: async () => {},
      clients: { claim: async () => { claimed = true; } },
    },
    fetch: network,
    caches: {
      open: async (name: string) => {
        if (!caches.has(name)) caches.set(name, new Map());
        const store = caches.get(name)!;
        return {
          addAll: async (urls: string[]) => { for (const url of urls) store.set(key(url), new Response(url === "/offline.html" ? "Sin conexión" : "static")); },
          match: async (request: Request | string) => store.get(key(request))?.clone(),
          put: async (request: Request, response: Response) => { store.set(key(request), response); },
          keys: async () => [...store.keys()].map((url) => ({ url })),
          delete: async (request: Request) => store.delete(key(request)),
        };
      },
      keys: async () => [...caches.keys()],
      delete: async (name: string) => caches.delete(name),
    },
  });
  const event = { waitUntil: (work: Promise<unknown>) => waits.push(work) };
  return {
    caches,
    claimed: () => claimed,
    async install() { handlers.get("install")!(event); await Promise.all(waits); },
    async activate() { handlers.get("activate")!(event); await Promise.all(waits); },
    async fetch(path: string, mode = "cors", headers: Record<string, string> = {}, method = "GET") {
      let response: Promise<Response> | undefined;
      const request = { url: new URL(path, origin).href, method, mode, headers: new Headers(headers) } as Request;
      handlers.get("fetch")!({ ...event, request, respondWith: (work) => { response = work; } });
      const result = response ? await response : undefined;
      await Promise.all(waits);
      return result;
    },
  };
}

test("manifest installs the named app at the root with proper icon purposes", () => {
  const value = manifest();
  assert.equal(value.name, "Isla Puente");
  assert.equal(value.short_name, "Isla Puente");
  assert.equal(value.start_url, "/");
  assert.equal(value.scope, "/");
  assert.equal(value.display, "standalone");
  assert.equal(value.theme_color, "#F5F4E9");
  assert.equal(value.background_color, "#F5F4E9");
  assert.deepEqual(value.icons?.map((icon) => [icon.sizes, icon.purpose]), [["192x192", "any"], ["512x512", "any"], ["512x512", "maskable"]]);
});

test("API, RSC, mutations and foreign requests bypass offline caching", async () => {
  const world = worker(async () => { throw Error("must bypass"); });
  await world.install();
  for (const [url, mode, headers, method] of [
    ["/api/river", "cors", {}, "GET"],
    ["/?_rsc=abc", "cors", {}, "GET"],
    ["/", "cors", { RSC: "1" }, "GET"],
    ["/map/isla-puente.svg", "cors", {}, "POST"],
    ["https://external.example/image.png", "cors", {}, "GET"],
  ] as [string, string, Record<string,string>, string][]) assert.equal(await world.fetch(url, mode, headers, method), undefined);
  assert.ok([...world.caches.values()].every((store) => [...store.keys()].every((url) => !url.includes("/api/") && !url.includes("_rsc"))));
});

test("online navigation remains fresh and never saves SSR HTML", async () => {
  let reads = 0;
  const world = worker(async () => new Response("current SSR " + ++reads, { headers: { "Content-Type": "text/html" } }));
  await world.install();
  assert.equal(await (await world.fetch("/", "navigate"))!.text(), "current SSR 1");
  assert.equal(await (await world.fetch("/", "navigate"))!.text(), "current SSR 2");
  assert.ok([...world.caches.values()].every((store) => !store.has(origin + "/")));
});

test("new offline navigation offers no reading or simulated beach", async () => {
  const world = worker(async () => { throw Error("offline"); });
  await world.install();
  assert.equal(await (await world.fetch("/", "navigate"))!.text(), "Sin conexión");
  const html = readFileSync(new URL("../public/offline.html", import.meta.url), "utf8");
  assert.ok(html.includes("necesitamos conexión") && html.includes('href="/"'));
  assert.ok(!html.includes("3,47") && !html.includes("No hay playa") && !html.includes("/api/river"));
});

test("static assets use network first, then cached fallback without caching HTML", async () => {
  let online = true;
  let version = 0;
  const world = worker(async () => {
    if (!online) throw Error("offline");
    return new Response("image " + ++version, { headers: { "Content-Type": "image/png" } });
  });
  assert.equal(await (await world.fetch("/map/title-forest.png"))!.text(), "image 1");
  assert.equal(await (await world.fetch("/map/title-forest.png"))!.text(), "image 2");
  online = false;
  assert.equal(await (await world.fetch("/map/title-forest.png"))!.text(), "image 2");
  const htmlWorld = worker(async () => new Response("unexpected HTML", { headers: { "Content-Type": "text/html" } }));
  await htmlWorld.fetch("/map/missing.png");
  assert.equal([...htmlWorld.caches.values()].flatMap((store) => [...store.keys()]).length, 0);
});

test("activation removes only previous app versions and claims its scope", async () => {
  const world = worker(async () => new Response("static"));
  await world.install();
  world.caches.set("isla-puente-static-old", new Map());
  world.caches.set("another-app", new Map());
  await world.activate();
  assert.ok(!world.caches.has("isla-puente-static-old"));
  assert.ok(world.caches.has("isla-puente-static-v1") && world.caches.has("another-app"));
  assert.ok(world.claimed());
});

test("static cache is bounded and keeps its offline shell", async () => {
  const world = worker(async () => new Response("asset", { headers: { "Content-Type": "application/javascript" } }));
  await world.install();
  for (let index = 0; index < 70; index++) await world.fetch("/_next/static/chunk-" + index + ".js");
  const store = world.caches.get("isla-puente-static-v1")!;
  assert.equal(store.size, 64);
  assert.ok(store.has(origin + "/offline.html"));
});
