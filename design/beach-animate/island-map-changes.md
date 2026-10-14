# IslandMap: sólo animar la arena

Copiar `beach.ts` a `src/lib/beach.ts`. En `river.ts` sustituir únicamente la función anterior `beachPath` por `export { beachPath } from "./beach.ts";` (las etiquetas quedan iguales).

En `island-map.tsx`, sustituir la importación de `beachPath` por:

```tsx
import { beachOutline, beachProgress } from "../lib/beach";
```

Cambiar la importación de React a `useEffect, useRef, useState`. Sustituir el bloque `const art = useMemo(...,[level])` por el siguiente. La inicialización perezosa conserva el objeto del SVG de 239 KB durante toda la interacción, con la playa correspondiente a la primera lectura real ya dibujada desde el servidor:

```tsx
const progressRef = useRef<number | null>(null);
const [art] = useState(() => ({ __html: approvedMap.replace(
  '<path id="island-beach" fill="#D8BC82" hidden=""/>',
  `<path id="island-beach" fill="#D8BC82" d="${beachOutline(beachProgress(level))}"/>`
) }));
```

En el SVG, pasar ese objeto estable directamente: `dangerouslySetInnerHTML={art}`, sustituyendo `dangerouslySetInnerHTML={{ __html: art }}`. Es importante estabilizar también el objeto de la prop, para que React no vuelva a asignar `innerHTML` al cambiar el nivel o actualizar el registro. `useState` sólo captura el primer nivel; el efecto inferior aplica todos los cambios posteriores.

Añadir este efecto después del bloque anterior, conservando el resto del componente, resize observer, cierres de papel y norte tal como están:

```tsx
useEffect(() => {
  const sand = mapRef.current?.querySelector<SVGPathElement>("#island-beach");
  if (!sand) return;
  const target = beachProgress(level);
  const origin = progressRef.current;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const paint = (amount: number) => {
    progressRef.current = amount;
    sand.setAttribute("d", beachOutline(amount));
  };
  // First paint presents the real state immediately. Motion explains changes.
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
```

La limpieza deja `progressRef` en la última forma dibujada: al invertir el deslizador, se retoma desde ese punto sin salto ni cola de animaciones. No usa opacity, blur, filtros, trazos, transformaciones globales ni librerías. Un solo `d` se recalcula unos 15–22 fotogramas. No hay bucle continuo.

En `tests/river.test.ts`, la prueba de los cinco cortes debe conservar `beachState(2) === "Casi no hay playa"`, y cambiar `assert.ok(beachPath(2))` por `assert.equal(beachPath(2), null)`.

Copiar también `beach.test.ts` a `tests/beach.test.ts`, usando import `../src/lib/beach.ts`.
