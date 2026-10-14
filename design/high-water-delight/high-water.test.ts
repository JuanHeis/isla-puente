import assert from "node:assert/strict";
import test from "node:test";
import { highWaterNotice } from "./high-water.ts";

test("the reference message is absent below alert and without a finite height", () => {
  for (const level of [null, NaN, Infinity, -Infinity, -1, 2, 4.69]) assert.equal(highWaterNotice(level), null);
});

test("4.70 is inclusive, evacuation replaces alert at 5.00 without claiming an issued order", () => {
  for (const level of [4.7, 4.99]) {
    const notice = highWaterNotice(level);
    assert.equal(notice?.severity, "alert");
    assert.equal(notice?.threshold, 4.7);
    assert.match(notice?.message ?? "", /referencia de alerta de Paraná \(4,70 m\)/);
  }
  for (const level of [5, 5.01]) {
    const notice = highWaterNotice(level);
    assert.equal(notice?.severity, "evacuation");
    assert.equal(notice?.threshold, 5);
    assert.match(notice?.message ?? "", /referencia de evacuación de Paraná \(5,00 m\)/);
    assert.doesNotMatch(notice?.message ?? "", /se emitió|orden de evacuación|evacuá/i);
  }
});

test("manual heights identify the entire notice as simulation and returning real clears it", () => {
  for (const level of [4.7, 4.99, 5, 5.01]) {
    const notice = highWaterNotice(level, true);
    assert.equal(notice?.title, "Simulación con río alto.");
    assert.match(notice?.message ?? "", /Esta altura simulada/);
    assert.doesNotMatch(notice?.message ?? "", /Seguí|Consultá/);
  }
  assert.equal(highWaterNotice(3.47, false), null);
});
