export const PREFECTURA_URL = "https://contenidosweb.prefecturanaval.gob.ar/alturas/?id=230&page=historico&tiempo=30";
export const TIME_ZONE = "America/Argentina/Buenos_Aires";
export const REFRESH_MS = 10 * 60 * 1000;
export const OLD_READING_MS = 24 * 60 * 60 * 1000;

export type Reading = { timestamp: number; level: number };
export type RiverReport = {
  current: Reading | null;
  history: Reading[];
  fetchedAt: number | null;
  error: string | null;
};

export function beachState(level: number) {
  if (!Number.isFinite(level)) throw new TypeError("La altura debe ser un número válido.");
  if (level > 2) return "No hay playa";
  if (level >= 1.9) return "Casi no hay playa";
  if (level >= 1.6) return "Hay poca playa";
  if (level >= 1.2) return "Hay playa";
  return "Hay mucha playa";
}

export { beachPath } from "./beach.ts";

export function formatLevel(level: number) {
  return `${level.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
}

export function formatDate(timestamp: number, withTime = true) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "short",
    ...(withTime ? { year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" as const } : {}),
  }).format(timestamp);
}

export function mergeReadings(readings: Reading[], latest?: Reading) {
  const byTime = new Map(readings.map((reading) => [reading.timestamp, reading]));
  if (latest) byTime.set(latest.timestamp, latest);
  return [...byTime.values()].sort((a, b) => a.timestamp - b.timestamp);
}


export function reconcileReports(previous: RiverReport, incoming: RiverReport): RiverReport {
  if (!previous.current || (incoming.current && incoming.current.timestamp >= previous.current.timestamp)) return incoming;
  if (!incoming.current) return { ...previous, error: incoming.error };
  return { ...incoming, current: previous.current, history: mergeReadings(incoming.history, previous.current) };
}
