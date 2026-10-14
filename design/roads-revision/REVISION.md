# Isla Puente — red vial y POLISH continental

## Alcance

Las cuatro siluetas aprobadas se conservan idénticas, junto con el recorte, la punta `(831, 616)`, la isla como foco, el agua, los datos y el gráfico. La red procede del extracto oficial de OpenStreetMap descargado el 13 de octubre de 2026. Las líneas rojas del usuario sirvieron para identificar cobertura faltante, no como coordenadas para calcar.

## Diagnóstico y ciclos

1. **Estado inicial:** `cycle-0-app.jpg`. La selección de catorce nombres dejaba incompletos el circuito oeste y Puerto Viejo, los recorridos propios de Parque Urquiza y la trama Puerto Sánchez–Thompson. Los grosores y opacidades casi iguales hacían difícil distinguir los corredores. La comparación anterior usaba un encuadre distinto del render real.
2. **Candidata 1:** `cycle-1-app-desktop.jpg`, `cycle-1-comparison.jpg` y `comparacion-ciclo-1.html`. Ampliación de la red con 77 nombres y caminos sin nombre que figuran en OSM, todos bajo una transformación común. Se recuperan las conexiones interiores y los circuitos de parques. El usuario aprobó esta red macro. La comparación identifica ruido de vías paralelas y caminos de menor entidad demasiado presentes.
3. **POLISH autorizado:** `calles-revisadas.svg`. Se retiran 23 senderos/ciclovías adyacentes a una calle y 11 calzadas redundantes del mismo corredor. Permanecen los 77 nombres, 382 segmentos OSM y 15 caminos autónomos de parque. Las principales conservan mayor peso; calles interiores y senderos bajan de grosor/contraste. `polish-comparison.jpg` compara oeste, centro y este contra el estado aprobado y la referencia a la misma caja de mundo.
4. **Continente:** `bloques-verdes.svg`. Suelo oliva uniforme entre grupos de árboles. Siete grupos se ubican en espacios verdes de la referencia vial; Santa Fe tiene dos grupos discretos. Seis lapachos de rosa gris suave aparecen en Urquiza. Los grupos siguen espacios verdes reconocibles; cada árbol y la especie ilustrada son una decisión estética, no un inventario medido.

## Comparación alineada

`comparison-frame.json` guarda las cajas exactas de la app a 1440 × 1000 y la transformación de la referencia limpia al mundo SVG. Los recortes oeste, centro y este comparten la misma escala y límites en referencia, captura de app y candidata. La zona no cubierta por la referencia se muestra vacía; no se deforma para rellenarla. El comparator conserva los tramos que salen del encuadre como recortados.

El ajuste GPS a imagen hereda cuatro controles del trabajo geográfico. La transformación histórica de imagen a mundo es única. El residual del ajuste no significa precisión topográfica: los controles están leídos de capturas y las costas son estilizadas. La revisión visual contrasta giros, cruces, rotondas, curvas y conexiones, no una exactitud catastral.

## Integración mínima

- Reemplazar solamente `g#coast-main-roads` por `calles-revisadas.svg`.
- Reemplazar `g#parques-costeros` por `bloques-verdes.svg`, antes de la capa vial, dentro de `coast-details`.
- Cambiar únicamente el relleno de `costa-parana` y `costa-santa-fe` de `url(#coast-foliage)` a `#9CAA85`.
- Retirar la definición del patrón `coast-foliage` que queda sin referencias. Conservar `bosque`, clips de islas, agua, máscaras, hojas y demás tratamientos entregados por el agente de estética.
- El SVG completo `mapa-candidato-polish.svg` sirve para investigación; no sustituye el mapa entero porque puede carecer del último patch DELIGHT del otro agente.

## Verificaciones y límites

Las dos capas entregadas son XML SVG válido. Los cuatro `d` de costas/islas coinciden por SHA-256 con la entrada aprobada. Todos los ID de vías son únicos y tienen procedencia OSM, clase y coordenadas en `calles-revisadas.json`. `polishRemovedWays` documenta cada exclusión; `bloques-verdes.json` documenta grupos y árboles ilustrados. Las vías están recortadas a tierra firme y no hay rótulos visibles ni pasajes inventados.

Fuente y licencia: [OpenStreetMap](https://www.openstreetmap.org/copyright). Extracto: `https://api.openstreetmap.org/api/0.6/map?bbox=-60.55,-31.73,-60.48,-31.685`.

El dibujo sigue siendo aproximado. La precisión visual se usa para conservar recorridos reconocibles y referencias de orientación; la app no funciona como mapa de navegación.
