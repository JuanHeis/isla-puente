export const SIMULATION_MIN = 0;
export const SIMULATION_MAX = 6;

export function simulationBounds(realLevel: number | null, simulatedLevel: number | null = null) {
  const levels = [realLevel, simulatedLevel].filter((value): value is number => value !== null && Number.isFinite(value));
  return {
    min: Math.min(SIMULATION_MIN, ...levels.map(Math.floor)),
    max: Math.max(SIMULATION_MAX, ...levels.map(Math.ceil)),
  };
}

export function initialSimulationLevel(realLevel: number | null) {
  return realLevel !== null && Number.isFinite(realLevel) ? Math.round(realLevel * 100) / 100 : 2;
}

export function parseSimulationLevel(input: string, { min = SIMULATION_MIN, max = SIMULATION_MAX } = {}) {
  const value = input.trim();
  if (!/^-?(?:\d+(?:[.,]\d{0,2})?|[.,]\d{1,2})$/.test(value)) return null;
  const level = Number(value.replace(",", "."));
  return Number.isFinite(level) && level >= min && level <= max ? Math.round(level * 100) / 100 : null;
}
