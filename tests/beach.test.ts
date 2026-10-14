import assert from "node:assert/strict";
import test from "node:test";
import { beachOutline, beachPath, beachProgress } from "../src/lib/beach.ts";

type Point = [number, number];

// Sample the actual rendered path, independent of its control-point tables.
function polygon(path: string) {
  const numbers = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  let prior: Point = [numbers[0], numbers[1]];
  const points: Point[] = [prior];
  for (let index = 2; index < numbers.length; index += 6) {
    const a: Point = [numbers[index], numbers[index + 1]];
    const b: Point = [numbers[index + 2], numbers[index + 3]];
    const end: Point = [numbers[index + 4], numbers[index + 5]];
    for (let step = 1; step <= 32; step++) {
      const t = step / 32, u = 1 - t;
      points.push([0, 1].map((axis) => u ** 3 * prior[axis] + 3 * u ** 2 * t * a[axis]
        + 3 * u * t ** 2 * b[axis] + t ** 3 * end[axis]) as Point);
    }
    prior = end;
  }
  return points;
}

function area(points: Point[]) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0)) / 2;
}

function orientation(a: Point, b: Point, c: Point) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function hasCrossing(points: Point[]) {
  for (let first = 0; first < points.length - 1; first++) {
    for (let second = first + 2; second < points.length - 1; second++) {
      if (first === 0 && second === points.length - 2) continue;
      const a = points[first], b = points[first + 1];
      const c = points[second], d = points[second + 1];
      if (orientation(a, b, c) * orientation(a, b, d) < -1e-10
        && orientation(c, d, a) * orientation(c, d, b) < -1e-10) return true;
    }
  }
  return false;
}

test("sand has zero area at two metres and never displays an invalid reading", () => {
  for (const level of [null, NaN, Infinity, 2, 2.01, 6]) {
    assert.equal(beachProgress(level), 0);
    assert.equal(beachPath(level), null);
  }
  assert.ok(area(polygon(beachOutline(0))) < 1e-7);
  assert.ok(beachPath(1.999));
});

test("the illustrative maximum saturates at the existing 0.60 m bound", () => {
  assert.equal(beachPath(0), beachPath(.6));
  assert.equal(beachPath(-1), beachPath(.6));
  assert.equal(beachProgress(.6), 1);
  assert.equal(beachOutline(4), beachOutline(1));
  assert.equal(beachOutline(-1), beachOutline(0));
});

test("exposed sand area decreases continuously as the river rises", () => {
  const levels = [.6, 1.2, 1.6, 1.9, 1.99, 1.999];
  let previous = Infinity;
  for (const level of levels) {
    const current = area(polygon(beachPath(level)!));
    assert.ok(current > 0 && current < previous, `${level}: ${current} >= ${previous}`);
    previous = current;
  }
  assert.ok(previous < 10);
});

test("the moving shoreline has no crossed segments across the complete range", () => {
  for (const progress of [.001, .01, .05, .1, .2, .4, .6, .8, 1]) {
    assert.equal(hasCrossing(polygon(beachOutline(progress))), false, `progress ${progress}`);
  }
});

test("maximum and intermediate shapes remain anchored and below the reference limit", () => {
  for (const progress of [0, .05, .25, .5, .75, 1]) {
    const path = beachOutline(progress);
    const points = polygon(path);
    assert.deepEqual(points[0], [710, 550]);
    assert.deepEqual(points.at(-1), points[0]);
    assert.ok(Math.max(...points.map(([x]) => x)) <= 914);
    assert.ok(Math.min(...points.map(([, y]) => y)) >= 550);
    assert.ok(Math.max(...points.map(([, y]) => y)) <= 681);
    assert.equal((path.match(/C/g) ?? []).length, 14);
  }
});
