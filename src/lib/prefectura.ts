import { mergeReadings, PREFECTURA_URL, REFRESH_MS, reconcileReports } from "./river.ts";
import type { Reading, RiverReport, SourceIssue } from "./river.ts";

class PrefecturaError extends Error {
  kind: SourceIssue["kind"];
  code: string;
  constructor(kind: SourceIssue["kind"], code: string, message: string) {
    super(message);
    this.kind = kind;
    this.code = code;
  }
}

function sourceIssue(error: unknown, elapsedMs: number): SourceIssue {
  const region = process.env.VERCEL_REGION;
  const location = region && /^[a-z0-9]{3,12}$/.test(region) ? { region } : {};
  if (error instanceof PrefecturaError) return { kind: error.kind, code: error.code, elapsedMs, ...location };
  if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) {
    return { kind: "timeout", code: "SOURCE_TIMEOUT", elapsedMs, ...location };
  }
  const cause = error instanceof Error ? (error as Error & { cause?: { code?: unknown } }).cause : undefined;
  const code = typeof cause?.code === "string" && /^[A-Z0-9_]{1,50}$/.test(cause.code) ? cause.code : "FETCH_FAILED";
  return { kind: "transport", code, elapsedMs, ...location };
}

const DAY_MS = 86_400_000;
const MONTHS: Record<string, number> = { ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5, JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11 };

function validReading(timestamp: unknown, level: unknown, now: number): timestamp is number {
  return typeof timestamp === "number" && Number.isFinite(timestamp) && timestamp >= Date.UTC(2000, 0, 1)
    && timestamp <= now + 15 * 60 * 1000 && typeof level === "number" && Number.isFinite(level) && level >= -5 && level <= 15;
}

function localTimestamp(year: number, month: number, day: number, hour: number, minute: number) {
  if (![year, month, day, hour, minute].every(Number.isInteger) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return NaN;
  const local = new Date(Date.UTC(year, month, day, hour, minute));
  if (local.getUTCFullYear() !== year || local.getUTCMonth() !== month || local.getUTCDate() !== day) return NaN;
  return local.getTime() + 3 * 60 * 60 * 1000;
}

export function parsePrefectura(html: string, now = Date.now()): { current: Reading; history: Reading[] } {
  if (html.length > 2_000_000) throw new PrefecturaError("format", "SOURCE_TOO_LARGE", "Respuesta demasiado grande.");
  const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ").replace(/&Uacute;|&#218;/g, "Ú").replace(/\s+/g, " ");
  if (!/name=["']id["']\s+value=["']230["']/i.test(html) || !/Puerto:\s*PARAN[AÁ]\s+en\s+r[ií]o\s+PARAN[AÁ]/i.test(text)) {
    throw new PrefecturaError("format", "SOURCE_WRONG_STATION", "La respuesta no corresponde a la estación Paraná 230.");
  }

  let history: Reading[] = [];
  const series = html.match(/series\s*:\s*\[\s*\{[\s\S]*?name\s*:\s*['"]Registro['"][\s\S]*?data\s*:\s*(\[\s*\[[\d\s.,+\-\[\]]*\]\s*\])/i);
  if (series) {
    try {
      const values: unknown = JSON.parse(series[1]);
      if (Array.isArray(values)) history = values.flatMap((pair: unknown) => {
        if (!Array.isArray(pair) || pair.length !== 2 || !validReading(pair[0], pair[1], now)) return [];
        return [{ timestamp: pair[0] as number, level: pair[1] as number }];
      });
    } catch { /* The published table is a fallback if the numeric series format changes. */ }
  }

  if (!history.length) {
    for (const row of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells = row[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
      const value = cells.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})\s+([+\-]?\d+(?:[.,]\d+)?)\s*Mts/i);
      if (!value) continue;
      const timestamp = localTimestamp(+value[1], +value[2] - 1, +value[3], +value[4], +value[5]);
      const level = Number(value[6].replace(",", "."));
      if (validReading(timestamp, level, now)) history.push({ timestamp, level });
    }
  }

  const header = text.match(/[ÚU]ltimo\s+registro:\s*([+\-]?\d+(?:[.,]\d+)?)\s*Mts\s+el\s+(\d{1,2})\/([A-Z]{3})\/(\d{2}|\d{4})\s*-\s*(\d{2}):?(\d{2})/i);
  let latest: Reading | undefined;
  if (header) {
    const year = Number(header[4]) + (header[4].length === 2 ? 2000 : 0);
    const timestamp = localTimestamp(year, MONTHS[header[3].toUpperCase()], +header[2], +header[5], +header[6]);
    const level = Number(header[1].replace(",", "."));
    if (validReading(timestamp, level, now)) latest = { timestamp, level };
  }

  history = mergeReadings(history, latest);
  const current = history.at(-1);
  if (!current) throw new PrefecturaError("data", "SOURCE_NO_VALID_READINGS", "Prefectura no publicó registros válidos.");
  // The table may contain a full year despite tiempo=30. Keep the requested month.
  history = history.filter((reading) => reading.timestamp >= now - 30 * DAY_MS);
  if (!history.some((reading) => reading.timestamp === current.timestamp)) history.push(current);
  return { current, history };
}

export async function fetchPrefecturaPage() {
  const response = await fetch(PREFECTURA_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: { Accept: "text/html" },
  });
  if (!response.ok) throw new PrefecturaError("http", `SOURCE_HTTP_${response.status}`, `Prefectura respondió ${response.status}.`);
  if (!response.headers.get("content-type")?.includes("text/html")) throw new PrefecturaError("format", "SOURCE_CONTENT_TYPE", "Formato de respuesta inesperado.");
  if (Number(response.headers.get("content-length")) > 2_000_000) throw new PrefecturaError("format", "SOURCE_TOO_LARGE", "Respuesta demasiado grande.");
  return response.text();
}

export function createRiverReader(fetchPage = fetchPrefecturaPage, clock = Date.now, onFailure: (issue: SourceIssue) => void = (issue) => console.warn("[isla-puente:prefectura]", issue)) {
  let report: RiverReport = { current: null, history: [], fetchedAt: null, error: null, sourceIssue: null };
  let nextCheck = 0;
  let pending: Promise<RiverReport> | null = null;

  async function refresh() {
    const started = clock();
    try {
      const parsed = parsePrefectura(await fetchPage(), clock());
      // A cached upstream page must never replace a newer record already obtained.
      report = reconcileReports(report, { ...parsed, fetchedAt: clock(), error: null, sourceIssue: null });
    } catch (error) {
      const issue = sourceIssue(error, Math.max(0, clock() - started));
      onFailure(issue);
      report = { ...report, sourceIssue: issue, error: report.current
        ? "No pudimos actualizar Prefectura. Mostramos el último registro obtenido."
        : "No pudimos consultar Prefectura. Volvé a intentar en unos minutos." };
    }
    nextCheck = clock() + REFRESH_MS;
    return report;
  }

  return async () => {
    if (pending) return pending;
    if (clock() < nextCheck) return report;
    pending = refresh();
    try { return await pending; } finally { pending = null; }
  };
}

