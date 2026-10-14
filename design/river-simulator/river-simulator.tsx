"use client";

import { useId, useRef, useState } from "react";
import { formatLevel } from "../lib/river";
import { initialSimulationLevel, parseSimulationLevel, simulationBounds } from "../lib/simulation";

type Props = {
  level: number | null;
  realLevel: number | null;
  onLevelChange: (level: number | null) => void;
};

function editableLevel(level: number) { return level.toFixed(2).replace(".", ","); }

export function RiverSimulator({ level, realLevel, onLevelChange }: Props) {
  const id = useId();
  const startButton = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bounds = simulationBounds(realLevel, level);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const errorMessage = `Ingresá una altura entre ${bounds.min} y ${bounds.max} m, con hasta dos decimales.`;

  function start() {
    const initial = initialSimulationLevel(realLevel);
    setDraft(editableLevel(initial));
    setError(null);
    onLevelChange(initial);
  }

  function stop() {
    setError(null);
    onLevelChange(null);
    requestAnimationFrame(() => startButton.current?.focus());
  }

  function edit(value: string) {
    setDraft(value);
    const next = parseSimulationLevel(value, bounds);
    if (next !== null) { setError(null); onLevelChange(next); }
    else setError(value.trim() ? errorMessage : null);
  }

  function finishEditing() {
    const next = parseSimulationLevel(draft, bounds);
    if (next === null) { setError(errorMessage); return; }
    setDraft(editableLevel(next));
    setError(null);
    onLevelChange(next);
  }

  return <section className="river-simulator" aria-label="Simular altura del río">
    {level === null
      ? <button ref={startButton} className="simulation-action" type="button" onClick={start}>Simular altura</button>
      : <>
        <div className="simulation-controls">
          <label className="simulation-value" htmlFor={`${id}-value`}>
            <span>Altura simulada</span>
            <span className="simulation-input-wrap">
              <input id={`${id}-value`} type="text" inputMode="decimal" autoComplete="off" spellCheck={false}
                value={draft} onChange={(event) => edit(event.target.value)} onBlur={finishEditing}
                onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); finishEditing(); } }}
                aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`} aria-invalid={Boolean(error)} />
              <span aria-hidden="true">m</span>
            </span>
          </label>
          <input className="simulation-range" type="range" min={bounds.min} max={bounds.max} step="0.01" value={level} autoFocus
            aria-label="Ajustar altura simulada" aria-valuetext={`${formatLevel(level)}. Simulación.`} aria-describedby={hintId}
            onChange={(event) => {
              const next = parseSimulationLevel(event.target.value, bounds);
              if (next === null) return;
              setDraft(editableLevel(next)); setError(null); onLevelChange(next);
            }} />
          <button className="simulation-action" type="button" onClick={stop}>Volver al nivel real</button>
        </div>
        <p id={hintId} className="simulation-hint">El historial conserva los datos de Prefectura.</p>
        {error && <p id={errorId} className="simulation-error" role="status">{error}</p>}
      </>}
  </section>;
}
