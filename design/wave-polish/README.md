# Ondas del Paraná — Impeccable polish

Sustituir únicamente el grupo `g#river-ripples` de `public/map/isla-puente.svg` por `river-ripples.svg`. Conservar su ubicación entre las capas; no reemplazar el SVG completo ni las definiciones.

16 grupos de curvas orgánicas, frente a los 7 anteriores. Longitudes de 48–134 unidades; amplitudes de 3–9 unidades, con 6 remates cortos. Repartidos entre cauce abierto, flanco oeste, canal bajo Isla Puente y brazo de Curupí, sin filas ni ritmo uniforme. 15 grupos entran total o parcialmente en el encuadre móvil; 16 en escritorio.

- Color exacto `#bfa878`, sin transparencia, blur, animación ni textura adicional.
- Trazo de 2,65 unidades con extremos redondos. En escritorio aparece aproximadamente a 2,44 px; en celular a 0,85 px, manteniendo la escala del paisaje.
- Reutiliza la máscara existente `#shore-water-only`, ya adaptada a las copas visibles por shore_polish. Sin ids nuevos ni colisiones.
- Posiciones alejadas del indicador Norte, la punta, la arena dinámica y las siluetas vegetales. Las ondas no se recolorean según la altura.
- Geometría, orilla, vegetación, red vial, marcador y comportamiento quedan intactos.

El integrador hará una sola ronda visual agrupada con Norte y simulador. `candidate.svg` permite inspeccionar la capa en el mapa completo, pero no debe copiarse encima de cambios posteriores.
