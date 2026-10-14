"use client";

import { useCallback, useEffect, useState } from "react";
import { beachState, formatDate, formatLevel, OLD_READING_MS, PREFECTURA_URL, reconcileReports } from "../lib/river";
import type { RiverReport } from "../lib/river";
import { IslandMap } from "./island-map";
import { RiverChart } from "./river-chart";
import { RiverSimulator } from "./river-simulator";
import { HighWaterNote } from "./high-water-note";

export function RiverApp({ initialReport }: { initialReport: RiverReport }) {
  const [report, setReport] = useState(initialReport);
  const [checking, setChecking] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [simulatedLevel, setSimulatedLevel] = useState<number | null>(null);

  const update = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/river", { cache: "no-store", signal: AbortSignal.timeout(20_000) });
      const next: RiverReport = await response.json();
      if (!response.ok && response.status !== 503) throw new Error("No se pudo actualizar.");
      setReport((previous) => reconcileReports(previous, next));
    } catch {
      setReport((previous) => ({ ...previous, error: previous.current
        ? "No pudimos actualizar Prefectura. Mostramos el último registro obtenido."
        : "No pudimos consultar Prefectura. Volvé a intentar en unos minutos." }));
    } finally { setNow(Date.now()); setChecking(false); }
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => {
      setNow(Date.now());
      if (document.visibilityState === "visible") void update();
    }, 5 * 60 * 1000);
    const onVisible = () => { if (document.visibilityState === "visible") void update(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, [update]);

  const current = report.current;
  const displayedLevel = simulatedLevel ?? current?.level ?? null;
  const statusTitle = displayedLevel !== null ? beachState(displayedLevel) : "Sin dato actual";
  const old = current && now !== null && now - current.timestamp > OLD_READING_MS;
  return <main className="isla-app">
    <header className="masthead"><span>Isla Puente</span><span className="brand-dot" aria-hidden="true" /></header>
    <h1 className="status" data-beach-status={displayedLevel !== null} data-initial={statusTitle[0]} aria-live="polite">{statusTitle}</h1>
    <p className="current-reading">{simulatedLevel !== null
      ? <><span className="simulation-indicator">SIMULACIÓN</span><strong>{formatLevel(simulatedLevel)}</strong>
        <span className="simulation-official">Último registro: {current
          ? <>{formatLevel(current.level)}<span aria-hidden="true"> · </span><time dateTime={new Date(current.timestamp).toISOString()}>{formatDate(current.timestamp)}</time><span className="reading-origin"> · Paraná</span></>
          : "sin dato actual."}</span></>
      : current
        ? <><strong>{formatLevel(current.level)}</strong><span aria-hidden="true"> · </span><time dateTime={new Date(current.timestamp).toISOString()}>{formatDate(current.timestamp)}</time><span className="reading-origin"> · Paraná</span></>
        : "Consultamos la altura del río en Paraná."}</p>
    <HighWaterNote level={displayedLevel} simulated={simulatedLevel !== null} />
    <IslandMap level={displayedLevel} />
    <RiverChart readings={report.history} />
    <RiverSimulator level={simulatedLevel} realLevel={current?.level ?? null} onLevelChange={setSimulatedLevel} />
    <footer className="source">
      <a href={PREFECTURA_URL} target="_blank" rel="noreferrer">Datos de Prefectura</a><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
      {old && !report.error && <span className="data-note">El último registro publicado tiene más de 24 horas.</span>}
      {report.error && <div className="update-error" role="status"><span>{report.error}</span><button type="button" onClick={() => void update()} disabled={checking}>{checking ? "Consultando…" : "Volver a consultar"}</button></div>}
    </footer>
  </main>;
}

