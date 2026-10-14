/** Illustrative range retained from the existing map, not a surveyed contour. */
export const BEACH_FULL_LEVEL = .6;
export const BEACH_HIDE_LEVEL = 2;

type Point = readonly [number, number];
type Curve = readonly [Point, Point, Point];

const start: Point = [710, 550];

// The approved island's eastern shoreline. The third cubic is split exactly
// in half to keep the same topology as the authored maximum sand profile.
const shoreline: readonly Curve[] = [
  [[724.2, 555.3], [742.3, 559.3], [757, 566]],
  [[771.7, 572.7], [784.7, 582.2], [798, 590]],
  [[804.65, 593.9], [813.7, 597.7], [821.4375, 601.5]],
  [[829.175, 605.3], [835.6, 609.1], [837, 613]],
  [[839.8, 620.8], [824.7, 628.8], [815, 637]],
  [[805.3, 645.2], [792.2, 654.7], [779, 662]],
  [[765.8, 669.3], [749.8, 674], [736, 681]],
];

// Rounded interpretation of the user's red contour, anchored to both
// shoulders. Its furthest point is 77 SVG units east of the original tip.
const maximum: readonly Curve[] = [
  [[734, 555], [753, 558], [771, 559]],
  [[794, 560], [824, 572], [850, 581]],
  [[873, 589], [888, 592], [895, 603]],
  [[902, 614], [914, 617], [914, 625]],
  [[914, 633], [882, 636], [861, 645]],
  [[840, 654], [826, 662], [808, 672]],
  [[790, 682], [762, 674], [736, 681]],
];

function bounded(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

export function beachProgress(level: number | null) {
  if (level === null || !Number.isFinite(level)) return 0;
  return bounded((BEACH_HIDE_LEVEL - level) / (BEACH_HIDE_LEVEL - BEACH_FULL_LEVEL));
}

function coordinates(point: Point) {
  return point.map((coordinate) => Number(coordinate.toFixed(4))).join(" ");
}

function interpolate(from: Point, to: Point, progress: number): Point {
  return [from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress];
}

/** Same cubic topology at every level; at zero the edges coincide exactly. */
export function beachOutline(progress: number) {
  const amount = bounded(progress);
  let path = `M${coordinates(start)}`;
  for (let index = 0; index < shoreline.length; index++) {
    const outer = shoreline[index].map((point, position) =>
      interpolate(point, maximum[index][position], amount));
    path += `C${outer.map(coordinates).join(" ")}`;
  }
  // The inner edge returns on the unmodified shoreline, beneath the foliage.
  for (let index = shoreline.length - 1; index >= 0; index--) {
    const curve = shoreline[index];
    const prior = index === 0 ? start : shoreline[index - 1][2];
    path += `C${coordinates(curve[1])} ${coordinates(curve[0])} ${coordinates(prior)}`;
  }
  return `${path}Z`;
}

export function beachPath(level: number | null) {
  const progress = beachProgress(level);
  return progress > 0 ? beachOutline(progress) : null;
}
