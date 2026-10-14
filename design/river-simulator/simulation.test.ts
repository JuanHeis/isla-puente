import assert from "node:assert/strict";
import test from "node:test";
import { initialSimulationLevel, parseSimulationLevel, simulationBounds } from "./simulation.ts";

test("empty, partial and malformed drafts never become a false zero or NaN", () => {
  for (const value of ["", " ", ",", "-", "NaN", "Infinity", "1e2", "1,000", "1.2.3", "1 200"]) {
    assert.equal(parseSimulationLevel(value), null, value);
  }
  assert.equal(parseSimulationLevel("0"), 0);
  assert.equal(parseSimulationLevel(" 1,90 "), 1.9);
  assert.equal(parseSimulationLevel("1.9"), 1.9);
  assert.equal(parseSimulationLevel(",90"), .9);
});

test("bounds accept two decimals and both extremes, without silently clamping a draft", () => {
  for (const value of ["-0.01", "6.01", "100"]) assert.equal(parseSimulationLevel(value), null);
  for (const value of ["0.00", "1.19", "1.20", "1.60", "1.90", "2.00", "2.01", "6.00"]) {
    assert.equal(parseSimulationLevel(value), Number(value));
  }
});

test("activation seeds the freshest official level, while missing data remains an explicit simulation", () => {
  assert.equal(initialSimulationLevel(3.47), 3.47);
  assert.equal(initialSimulationLevel(3.58), 3.58);
  assert.equal(initialSimulationLevel(null), 2);
  assert.equal(initialSimulationLevel(NaN), 2);
});

test("a real value outside the default slider extends its bounds rather than changing it", () => {
  const bounds = simulationBounds(7.23);
  assert.deepEqual(bounds, { min: 0, max: 8 });
  assert.equal(parseSimulationLevel("7,23", bounds), 7.23);
  assert.deepEqual(simulationBounds(3.47, 7.23), bounds);
  const low = simulationBounds(-.2);
  assert.equal(initialSimulationLevel(-.2), -.2);
  assert.equal(parseSimulationLevel("-0,20", low), -.2);
});
