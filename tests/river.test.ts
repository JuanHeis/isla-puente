import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { beachPath, beachState, formatDate, REFRESH_MS, reconcileReports } from "../src/lib/river.ts";
import { createRiverReader, parsePrefectura } from "../src/lib/prefectura.ts";
import { approvedMap } from "../src/components/map-art.ts";

const now = Date.UTC(2026, 9, 13, 21);
const midnight = Date.UTC(2026, 9, 13, 3);
const noon = Date.UTC(2026, 9, 13, 15);
function page(header = "3.47 Mts el 13/OCT/26 - 1200", series = `[[${midnight},3.45],[${midnight - 43200000},3.43]]`) {
  return `<input name="id" value="230"><b>Puerto:</b> PARANA en río PARANA<br><b>Último registro:</b> ${header}<br>
    <script>series: [{type:'area',name:'Registro',data:${series}},{name:'Sin escala'}]</script>`;
}

test("the five confirmed bands include exactly two metres", () => {
  for (const [level, expected] of [[2.01, "No hay playa"], [2, "Casi no hay playa"], [1.9, "Casi no hay playa"], [1.89, "Hay poca playa"], [1.6, "Hay poca playa"], [1.59, "Hay playa"], [1.2, "Hay playa"], [1.19, "Hay mucha playa"], [-.2, "Hay mucha playa"]] as const) {
    assert.equal(beachState(level), expected);
  }
  assert.throws(() => beachState(NaN));
  assert.equal(beachPath(2.01), null);
  assert.equal(beachPath(null), null);
  assert.equal(beachPath(2), null);
  assert.notEqual(beachPath(2), beachPath(.6));
});

test("official header is added to the ordered history at its actual local time", () => {
  const result = parsePrefectura(page(), now);
  assert.deepEqual(result.current, { timestamp: noon, level: 3.47 });
  assert.equal(result.history.length, 3);
  assert.deepEqual(result.history.at(-2), { timestamp: midnight, level: 3.45 });
  assert.match(formatDate(noon), /12:00/);
});

test("comma decimals, deduplication, and a newer series point", () => {
  const result = parsePrefectura(page("3,47 Mts el 13/OCT/2026 - 1200", `[[${noon},3.45],[${midnight},3.45],[${midnight},3.46]]`), now);
  assert.equal(result.history.length, 2);
  assert.equal(result.current.level, 3.47);
  const newer = parsePrefectura(page("3.43 Mts el 12/OCT/26 - 1200"), now);
  assert.equal(newer.current.timestamp, midnight);
});

test("invalid and future records are never treated as river observations", () => {
  const result = parsePrefectura(page("999 Mts el 31/FEB/26 - 1200", `[[${midnight},3.45],[${now + 86400000},1.2],[${noon},999],[123,1.2]]`), now);
  assert.deepEqual(result.current, { timestamp: midnight, level: 3.45 });
  assert.equal(result.history.length, 1);
  assert.throws(() => parsePrefectura(page().replace('value="230"', 'value="231"'), now));
  assert.throws(() => parsePrefectura("<html>Servidor no disponible</html>", now));
  assert.throws(() => parsePrefectura(page("NaN", "[]"), now));
});

test("published table is used if series format disappears, without evaluating scripts", () => {
  const fixture = page("sin registro", "[malicious()]") + "<table><tr><td>1</td><td><i></i>2026-10-13 <i></i>00:00</td><td>3,45 Mts</td></tr></table>";
  assert.deepEqual(parsePrefectura(fixture, now).current, { timestamp: midnight, level: 3.45 });
});

test("cache coalesces requests, retains last real data on failure, and never regresses", async () => {
  let time = now;
  let calls = 0;
  let fail = false;
  let html = page();
  const reader = createRiverReader(async () => { calls++; if (fail) throw new Error("offline"); return html; }, () => time);
  const [first, second] = await Promise.all([reader(), reader()]);
  assert.equal(calls, 1);
  assert.deepEqual(first, second);
  await reader();
  assert.equal(calls, 1);
  time += REFRESH_MS + 1;
  fail = true;
  const stale = await reader();
  assert.deepEqual(stale.current, first.current);
  assert.deepEqual(stale.history, first.history);
  assert.equal(stale.fetchedAt, now);
  assert.ok(stale.error);
  time += REFRESH_MS + 1;
  fail = false;
  html = page("3.45 Mts el 13/OCT/26 - 0000");
  const later = await reader();
  assert.deepEqual(later.current, first.current);
  assert.equal(later.error, null);
});

test("cold-start source failure has no invented status or chart data", async () => {
  const result = await createRiverReader(async () => { throw new Error("offline"); }, () => now)();
  assert.equal(result.current, null);
  assert.deepEqual(result.history, []);
  assert.equal(result.fetchedAt, null);
  assert.ok(result.error);
});

test("approved island and coastline geometry survives visual refinements", () => {
  const original = readFileSync(new URL("../design/boceto-base/index.html", import.meta.url), "utf8");
  for (const id of ["costa-santa-fe", "costa-parana", "isla-puente", "islote-curupi", "punta-playa", "playa-thompson-minima"]) {
    const tag = new RegExp(`<[^>]+id="${id}"[^>]*>`);
    const migrated = approvedMap.match(tag)?.[0]; const prior = original.match(tag)?.[0]; assert.ok(migrated && prior, id); if (id === "punta-playa") { for (const axis of ["cx", "cy"]) { const coordinate = new RegExp(axis + '="([^"]+)"'); assert.equal(migrated.match(coordinate)?.[1], prior.match(coordinate)?.[1], id); } } else assert.equal(migrated.match(/\bd="([^"]+)"/)?.[1], prior.match(/\bd="([^"]+)"/)?.[1], id);
  }
  assert.ok(approvedMap.includes('id="river-ripples"'));
  assert.equal(approvedMap.match(/stroke="#[^"]+"[^>]*id="isla-puente"/), null);
});


test("a restarted server or out-of-order response cannot regress an open view", () => {
  const previous = { current: {timestamp:noon,level:3.47}, history:[{timestamp:midnight,level:3.45},{timestamp:noon,level:3.47}], fetchedAt:now, error:null };
  const older = { current: {timestamp:midnight,level:3.45}, history:[{timestamp:midnight,level:3.45}], fetchedAt:now+1000, error:null };
  const merged = reconcileReports(previous, older);
  assert.deepEqual(merged.current, previous.current);
  assert.deepEqual(merged.history.at(-1), previous.current);
  const failed = reconcileReports(previous, {current:null,history:[],fetchedAt:null,error:"offline"});
  assert.deepEqual(failed.history, previous.history);
  assert.equal(failed.error, "offline");
});



