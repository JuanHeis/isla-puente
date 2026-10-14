"use client";

import { useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { formatDate, formatLevel } from "../lib/river";
import type { Reading } from "../lib/river";

export function RiverChart({ readings }: { readings: Reading[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!readings.length) return <section className="history" aria-label="Historial del río"><p className="empty-chart">El historial aparecerá cuando podamos consultar Prefectura.</p></section>;

  const first = readings[0];
  const last = readings.at(-1)!;
  const low = Math.min(2, ...readings.map((reading) => reading.level)) - .12;
  const high = Math.max(2, ...readings.map((reading) => reading.level)) + .15;
  const x = (reading: Reading) => readings.length === 1 ? 984 : 34 + (reading.timestamp - first.timestamp) / Math.max(1, last.timestamp - first.timestamp) * 950;
  const y = (level: number) => 147 - (level - low) / (high - low) * 127;
  const path = readings.map((reading, index) => `${index ? "L" : "M"}${x(reading).toFixed(2)} ${y(reading.level).toFixed(2)}`).join(" ");
  const active = readings[selected ?? readings.length - 1] ?? last;
  const labelReadings = [first, readings[Math.floor(readings.length / 2)], last];

  function selectPointer(event: PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const target = first.timestamp + Math.max(0, Math.min(1, ((event.clientX - bounds.left) / bounds.width * 1000 - 34) / 950)) * (last.timestamp - first.timestamp);
    let nearest = 0;
    for (let index = 1; index < readings.length; index++) {
      if (Math.abs(readings[index].timestamp - target) < Math.abs(readings[nearest].timestamp - target)) nearest = index;
    }
    setSelected(nearest);
  }

  function selectKey(event: KeyboardEvent<SVGSVGElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End", "Escape"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Escape") return setSelected(null);
    if (event.key === "Home") return setSelected(0);
    if (event.key === "End") return setSelected(readings.length - 1);
    setSelected(Math.max(0, Math.min(readings.length - 1, (selected ?? readings.length - 1) + (event.key === "ArrowLeft" ? -1 : 1))));
  }

  return <section className="history" aria-label="Historial del río">
    <figure>
      <figcaption><span>Nivel del río <span className="period">· 30 días</span></span>
        <output className="chart-reading" aria-live="polite">{formatLevel(active.level)} <span>· {formatDate(active.timestamp)}</span></output>
      </figcaption>
      <div className="chart-wrap">
        <span className="chart-two" style={{ top: `${y(2) / 190 * 100}%` }} aria-hidden="true">2 m</span>
        <svg className="chart" viewBox="0 0 1000 190" preserveAspectRatio="none" role="slider" tabIndex={0}
          aria-label="Recorrer el historial del río" aria-describedby="chart-help" aria-valuemin={0} aria-valuemax={readings.length - 1}
          aria-valuenow={selected ?? readings.length - 1} aria-valuetext={`${formatLevel(active.level)}, ${formatDate(active.timestamp)}`}
          onPointerMove={selectPointer} onPointerDown={selectPointer} onPointerLeave={() => setSelected(null)} onKeyDown={selectKey}>
          <path d="M34 12V153H984" fill="none" stroke="#3B4938" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          <path d={`M34 ${y(2)}H984`} fill="none" stroke="#91917D" strokeWidth="1.8" strokeDasharray="12 8" vectorEffect="non-scaling-stroke" />
          <path d={path} fill="none" stroke="#506344" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          {selected !== null && <path d={`M${x(active)} 15V153`} stroke="#506344" strokeWidth="1" strokeDasharray="3 5" opacity=".5" vectorEffect="non-scaling-stroke" />}
          <g stroke="#6A765B" strokeWidth="1.5" vectorEffect="non-scaling-stroke">{labelReadings.map((reading, index) => <path key={index} d={`M${x(reading)} 153v7`} />)}</g>
        </svg>
        <div className="chart-dates" aria-hidden="true">{labelReadings.map((reading, index) => <span key={index}>{formatDate(reading.timestamp, false)}</span>)}</div>
      </div>
      <p className="beach-reference-note">Los 2 m son una referencia basada en experiencia personal. La playa puede variar por la dinámica fluvial: las corrientes erosionan y depositan arena.</p>
      <p id="chart-help" className="sr-only">Tocá el gráfico o usá las flechas para consultar la altura y fecha de cada registro. La línea discontinua indica la referencia personal de playa de 2 metros.</p>
      {readings.length === 1 && <p className="data-note">Sólo hay una lectura disponible.</p>}
    </figure>
  </section>;
}

