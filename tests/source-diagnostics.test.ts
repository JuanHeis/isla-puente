import assert from "node:assert/strict";
import test from "node:test";
import { createRiverReader } from "../src/lib/prefectura.ts";
import type { SourceIssue } from "../src/lib/river.ts";

test("failed source exposes only a safe category/code while keeping the user message", async () => {
  const timeout = new Error("internal details must not be exposed"); timeout.name = "TimeoutError";
  const errors: SourceIssue[] = [];
  const reader = createRiverReader(async () => { throw timeout; }, () => Date.UTC(2026,9,13), (issue) => errors.push(issue));
  const report = await reader();
  assert.equal(report.current, null);
  assert.deepEqual(report.history, []);
  assert.equal(report.sourceIssue?.kind, "timeout");
  assert.equal(report.sourceIssue?.code, "SOURCE_TIMEOUT");
  assert.deepEqual(errors, [report.sourceIssue]);
  assert.ok(!JSON.stringify(report).includes("internal details"));
});

test("transport causes remain distinguishable without paths or remote payload", async () => {
  const error = new Error("fetch failed", { cause: { code: "ETIMEDOUT", message: "not public" } });
  const reader = createRiverReader(async () => { throw error; }, Date.now, () => {});
  const report = await reader();
  assert.equal(report.sourceIssue?.kind, "transport");
  assert.equal(report.sourceIssue?.code, "ETIMEDOUT");
  assert.ok(!JSON.stringify(report).includes("not public"));
});

test("a valid transport response with the wrong station is a format error", async () => {
  const reader = createRiverReader(async () => '<html>not station 230</html>', Date.now, () => {});
  assert.equal((await reader()).sourceIssue?.code, "SOURCE_WRONG_STATION");
});
