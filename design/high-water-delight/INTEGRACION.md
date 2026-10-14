# Río alto y ondas orientadas

## Tesis de delight

La isla responde con una frase breve y serena cuando el río deja de ser un plan de playa; las ondas acompañan las curvas del cauce.

## Fuente comprobada

https://contenidosweb.prefecturanaval.gob.ar/alturas/?id=230&page=historico&tiempo=30

Verificación directa de HTML realizada el 13/10/2026. La cabecera de Paraná y las líneas declaradas en el gráfico oficial coinciden:

```html
<b>Alerta: </b>4.70 Mts<br>
<b>Evacuación: </b>5.00 Mts<br>
```

Estos son niveles de referencia publicados. La app no recibe ni acredita una alerta u orden de evacuación emitida. El extracto de búsqueda web estaba fechado varios días antes; se verificó el HTML directo, no se tomó el extracto como estado actual.

## Cambios que debe integrar el agente de Next.js

1. Copiar `high-water.ts` a `src/lib/high-water.ts` y `high-water-note.tsx` a `src/components/high-water-note.tsx`.
2. Añadir el import de `HighWaterNote` en `river-app.tsx`.
3. Inmediatamente después de `p.current-reading`, antes de `IslandMap`, añadir:

```tsx
<HighWaterNote level={displayedLevel} simulated={simulatedLevel !== null} />
```

4. Añadir `high-water-note.css` al final de `globals.css`.
5. Copiar `high-water.test.ts` a `tests/high-water.test.ts` y cambiar su import a `../src/lib/high-water.ts`.
6. Reemplazar únicamente el grupo completo `g#river-ripples` en el SVG público y en `approvedMap` por `river-ripples.svg`. No sustituir el documento SVG completo.

`RiverChart`, su serie, sus ejes, su referencia de 2 m y sus rótulos permanecen intactos. No agregar referencias de 4,70 o 5,00 al gráfico de la app. El mapa y los cinco estados de playa tampoco cambian por esta entrega.

## Mensajes

- Menos de 4,70 m: nada visible; el contenedor accesible queda vacío.
- Desde 4,70 m y antes de 5,00 m: «La isla puede esperar.» más lectura/referencia de alerta y recomendación de consultar avisos locales.
- Desde 5,00 m: «El río está muy alto.» más lectura/referencia de evacuación e indicaciones de seguir avisos locales.
- En simulación: «Simulación con río alto.» y «Esta altura simulada…», sin presentar un aviso real.

El tratamiento es tipográfico, pequeño y sobrio, debajo de la lectura. No incorpora tarjetas, fondos de alarma, nuevos iconos, animaciones ni cambios al título principal. La región `role=status` permanece montada y sólo se llena cuando corresponde. Al ajustar la altura dentro del mismo rango, el texto permanece constante.

## Ondas

Las 16 formas y sus centros se conservan. Cambia sólo su orientación respecto de tangentes aproximadas del canal: cerca de la costa sudoeste bajan en diagonal; bajo Curupí son casi horizontales; en el brazo oriental giran hacia arriba con la costa; sobre la isla acompañan la inclinación del cauce. Los ángulos varían entre −42° y +36°.

Se conserva color exacto `#bfa878`, grosor 2,65, remates suaves y máscara `shore-water-only`. La geometría macro, las copas, la orilla, las calles, la playa dinámica y el norte no se modifican.

## Verificación

Tres pruebas de comportamiento pasan: ausencia bajo umbral/sin dato finito; límites inclusivos 4,70/5,00; identificación explícita de simulación y desaparición al volver a nivel real 3,47. Casos incluidos: 4,69 / 4,70 / 4,99 / 5,00 / 5,01, null, NaN, ±Infinity.

QA integrado completado en una ronda conjunta: desktop de app centrada a 900 px, mobile 390 px con simulación 5,00 m y desktop con arena máxima simulada a 0,60 m. Se revisaron `app-high-mobile.jpg`, `../nextjs-work/isla-puente-desktop.jpg` y `../beach-animate/app-max-desktop.jpg`. Ondas completas y orientadas con el cauce, sin colisiones con copas, arena o compás; mensaje de altura simulada explícito y sin desborde; gráfico sin alertas nuevas. No se detectaron defectos ni se abrió una ronda adicional.

## Ampliación autorizada: hojas suaves en las letras

El usuario añadió textura suave de hojas al título grande. Copiar `title-leaves.svg` a `public/map/title-leaves.svg` y añadir `title-leaves.css` al final de `globals.css`. Al `h1.status` existente añadir `data-beach-status={displayedLevel !== null}`.

El motivo vegetal sólo aparece dentro de los glifos de los cinco estados. Se mantienen Archivo Black, tamaño, peso, espaciado, posición y base verde oscuro. No afecta la lectura, los mensajes contextuales ni el pie. Hay hojas de 14–22 px con tintes cercanos al color base y opacidades de 0,07–0,14; se distinguen al mirar de cerca. Sin movimiento, resplandor, blur, nueva imagen raster o dependencia.

El fondo sólido verde continúa disponible si la imagen falla; sin `background-clip:text` se conserva el texto sólido original. La selección usa un fondo claro con letras verdes legibles. `forced-colors` vuelve explícitamente a `CanvasText` sólido. Los lectores de pantalla reciben el mismo `h1` textual. Incorporar esta revisión a la ronda conjunta ya prevista, sin abrir rondas adicionales.
