"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { beachOutline, beachProgress } from "../lib/beach";
import { approvedMap } from "./map-art";

const paperEdges = [
  { side: "top", viewBox: "0 0 1600 48", frames: [
    "M0 0H1600V9C1400 32 1280 12 1130 18S800 43 640 28S330 12 180 22S50 21 0 7Z",
    "M0 0H1600V10.75C1400 28.5 1280 15.5 1130 19.75S800 39.5 640 24.5S330 15.5 180 23.75S50 17.5 0 8.75Z",
    "M0 0H1600V7.25C1400 33.75 1280 10.25 1130 16.25S800 44.75 640 29.75S330 10.25 180 18.5S50 24.5 0 5.25Z",
  ] },
  { side: "bottom", viewBox: "0 0 1600 48", frames: [
    "M0 48H1600V34C1370 34 1250 42 1070 34S850 40 650 30S310 35 140 25S60 23 0 20Z",
    "M0 48H1600V35.75C1370 30.5 1250 43.75 1070 35.75S850 36.5 650 31.75S310 31.5 140 26.75S60 24.75 0 18.25Z",
    "M0 48H1600V32.25C1370 37.5 1250 38.5 1070 32.25S850 41.75 650 28.25S310 36.75 140 23.25S60 19.5 0 21.75Z",
  ] },
  { side: "side left", viewBox: "0 0 12 1000", frames: [
    "M0 0H8C12 80 5 190 8 280S11 410 7 490S5 620 9 730S6 900 8 1000H0Z",
    "M0 0H8C10.25 80 6.75 190 9.75 280S9.25 410 5.25 490S6.75 620 7.25 730S7.75 900 8 1000H0Z",
    "M0 0H8C12 80 3.25 190 6.25 280S12.75 410 8.75 490S3.25 620 10.75 730S4.25 900 8 1000H0Z",
  ] },
  { side: "side right", viewBox: "0 0 12 1000", frames: [
    "M0 0H8C12 80 5 190 8 280S11 410 7 490S5 620 9 730S6 900 8 1000H0Z",
    "M0 0H8C10.25 80 6.75 190 6.25 280S12.75 410 8.75 490S3.25 620 7.25 730S7.75 900 8 1000H0Z",
    "M0 0H8C12 80 3.25 190 9.75 280S9.25 410 5.25 490S6.75 620 10.75 730S4.25 900 8 1000H0Z",
  ] },
];

export function IslandMap({ level }: { level: number | null }) {
  const mapRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<number | null>(null);
  const [art] = useState(() => ({ __html: approvedMap.replace(
    '<path id="island-beach" fill="#D8BC82" hidden=""/>',
    `<path id="island-beach" fill="#D8BC82" stroke="${beachProgress(level) > 0 ? "#A79C7A" : "none"}" stroke-width="${3.4 * Math.min(1, beachProgress(level) / .1)}" stroke-linecap="round" stroke-linejoin="round" d="${beachOutline(beachProgress(level))}"/>`
  ) }));

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const current = gsap.timeline({ paused: true });
      const ripples = Array.from(map.querySelectorAll<SVGPathElement>("#river-ripples > path"), ripple => ({
        ripple, outline: ripple.getAttribute("d") ?? "",
      }));
      ripples.forEach(({ ripple, outline }, index) => {
        const rotation = ripple.getAttribute("transform") ?? "";
        const distance = 48 + index % 3 * 12;
        const duration = 18 + index % 5;
        const drift = gsap.timeline({ repeat: -1 });
        drift.fromTo(ripple, {
          attr: { transform: `${rotation} translate(${distance / 2} 0)` },
        }, {
          attr: { transform: `${rotation} translate(${-distance / 2} 0)` },
          duration,
          ease: "none",
        }, 0)
          .fromTo(ripple, { opacity: 0 }, { opacity: .88, duration: 3, ease: "sine.inOut" }, 0)
          .to(ripple, { opacity: 0, duration: 3, ease: "sine.inOut" }, duration - 3);
        current.add(drift, index * .43);
        const swell = (amplitude: number) => outline.split(/(?=M)/).map(segment => {
          const points = segment.match(/-?\d*\.?\d+/g)!.map(Number);
          const [startX, startY] = points;
          const endX = points[points.length - 2], endY = points[points.length - 1];
          let coordinate = 0, x = startX;
          // Cada trazo se aplana sobre su cuerda; los extremos permanecen fijos.
          return segment.replace(/-?\d*\.?\d+/g, value => {
            if (coordinate++ % 2 === 0) { x = Number(value); return value; }
            const baseline = startY + (endY - startY) * (x - startX) / (endX - startX);
            return (baseline + (Number(value) - baseline) * amplitude).toFixed(2);
          });
        }).join("");
        current.fromTo(ripple, { attr: { d: swell(.65) } }, {
          attr: { d: swell(1.05) },
          duration: 4 + index % 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }, index * .43);
      });
      current.time(12);
      let inView = false;
      const syncPlayback = () => {
        current.paused(!inView || document.hidden);
      };
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      });
      observer.observe(map);
      document.addEventListener("visibilitychange", syncPlayback);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        ripples.forEach(({ ripple, outline }) => ripple.setAttribute("d", outline));
      };
    });
    return () => motion.revert();
  }, []);

  useEffect(() => {
    const surface = mapRef.current?.parentElement;
    if (!surface) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const edges = surface.querySelectorAll(".paper-edge path");
      const poses = paperEdges.map(() => 0);
      const loop = gsap.timeline({ repeat: -1, repeatRefresh: true, paused: true });
      loop.to(edges, {
        attr: { d: (index: number) => {
          poses[index] = (poses[index] + gsap.utils.random(1, 2, 1)) % 3;
          return paperEdges[index].frames[poses[index]];
        } },
        duration: () => gsap.utils.random(.9, 1.7),
        ease: "sine.inOut",
      });
      let inView = false;
      const updatePlayback = () => { loop.paused(!inView || document.hidden); };
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updatePlayback();
      });
      observer.observe(surface);
      document.addEventListener("visibilitychange", updatePlayback);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", updatePlayback);
      };
    });
    return () => media.revert();
  }, []);

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
    {paperEdges.map(({ side, viewBox, frames }) => <svg key={side} className={`paper-edge ${side}`} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
      <path d={frames[0]} transform={side === "side right" ? "translate(12 0) scale(-1 1)" : undefined} />
    </svg>)}
    <svg xmlns="http://www.w3.org/2000/svg" className="map-north" viewBox="0 0 28 46" width="28" height="46" aria-hidden="true" focusable="false">
  <text x="14" y="11" textAnchor="middle" fill="currentColor" fontFamily="Archivo, sans-serif" fontSize="11" fontWeight="650">N</text>
  <g transform="rotate(12.8 14 31)" fill="currentColor">
    <path d="M14 18 17.4 26 14 23.6 10.6 26Z" />
    <path d="M14 23.6V40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </g>
</svg>
  </div>;
}

