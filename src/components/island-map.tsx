"use client";

import { useEffect, useRef, useState } from "react";
import { beachOutline, beachProgress } from "../lib/beach";
import { approvedMap } from "./map-art";

export function IslandMap({ level }: { level: number | null }) {
  const mapRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<number | null>(null);
  const [art] = useState(() => ({ __html: approvedMap.replace(
    '<path id="island-beach" fill="#D8BC82" hidden=""/>',
    `<path id="island-beach" fill="#D8BC82" stroke="${beachProgress(level) > 0 ? "#A79C7A" : "none"}" stroke-width="${3.4 * Math.min(1, beachProgress(level) / .1)}" stroke-linecap="round" stroke-linejoin="round" d="${beachOutline(beachProgress(level))}"/>`
  ) }));

  useEffect(() => {
    const sand = mapRef.current?.querySelector<SVGPathElement>("#island-beach");
    if (!sand) return;
    const target = beachProgress(level);
    const origin = progressRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paint = (amount: number) => {
      progressRef.current = amount;
      sand.setAttribute("d", beachOutline(amount));
      sand.setAttribute("stroke", amount > 0 ? "#A79C7A" : "none");
      sand.setAttribute("stroke-width", String(3.4 * Math.min(1, amount / .1)));
    };
    if (origin === null || origin === target || reduced.matches) {
      paint(target);
      return;
    }
    let frame = 0;
    let began: number | null = null;
    const duration = target > origin ? 360 : 240;
    const tick = (time: number) => {
      began ??= time;
      const elapsed = Math.min(1, (time - began) / duration);
      const eased = 1 - (1 - elapsed) ** 3;
      paint(origin + (target - origin) * eased);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    const onPreferenceChange = () => {
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        paint(target);
      }
    };
    reduced.addEventListener("change", onPreferenceChange);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, [level]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const reframe = () => {
      const bounds = map.getBoundingClientRect();
      if (!bounds.width) return;
      const width = bounds.width <= 640 ? 1220 : 1550;
      const height = width * bounds.height / bounds.width;
      map.setAttribute("viewBox", [831 - width * 2 / 3, 616 - height * .465, width, height].join(" "));
    };
    const observer = new ResizeObserver(reframe);
    observer.observe(map);
    reframe();
    return () => observer.disconnect();
  }, []);

  return <div className="map-surface">
    <svg ref={mapRef} id="island-map" className="scene" xmlns="http://www.w3.org/2000/svg" viewBox="-202.33 180 1550 948"
      role="img" aria-label="Isla Puente y el río Paraná. La playa de la punta crece cuando baja el río."
      dangerouslySetInnerHTML={art} />
    <svg className="paper-edge top" viewBox="0 0 1600 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H1600V9C1400 32 1280 12 1130 18S800 43 640 28S330 12 180 22S50 21 0 7Z" /></svg>
    <svg className="paper-edge bottom" viewBox="0 0 1600 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0 48H1600V34C1370 34 1250 42 1070 34S850 40 650 30S310 35 140 25S60 23 0 20Z" /></svg>
    <svg className="paper-edge side left" viewBox="0 0 12 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H8C12 80 5 190 8 280S11 410 7 490S5 620 9 730S6 900 8 1000H0Z" /></svg>
    <svg className="paper-edge side right" viewBox="0 0 12 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H8C12 80 5 190 8 280S11 410 7 490S5 620 9 730S6 900 8 1000H0Z" transform="translate(12 0) scale(-1 1)" /></svg>
    <svg xmlns="http://www.w3.org/2000/svg" className="map-north" viewBox="0 0 28 46" width="28" height="46" aria-hidden="true" focusable="false">
  <text x="14" y="11" textAnchor="middle" fill="currentColor" fontFamily="Archivo, sans-serif" fontSize="11" fontWeight="650">N</text>
  <g transform="rotate(12.8 14 31)" fill="currentColor">
    <path d="M14 18 17.4 26 14 23.6 10.6 26Z" />
    <path d="M14 23.6V40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </g>
</svg>
  </div>;
}

