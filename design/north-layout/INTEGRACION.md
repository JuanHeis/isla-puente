# Norte discreto

La isla conduce la mirada; la orientación ocupa un margen secundario de agua.

Insertar `north-indicator.svg` como SVG inline al final de `.map-surface`, después de los bordes de papel, en `src/components/island-map.tsx`. En JSX convertir `class` en `className` y los atributos SVG con guiones a camelCase. Añadir `north-indicator.css` a los estilos del mapa. No introducirlo en `approvedMap` ni en su `viewBox`: su tamaño de 28 × 46 px permanece constante y su ubicación pertenece al contenedor del mapa.

El conjunto se alinea con el margen izquierdo ya existente, a 56 px de la parte superior en escritorio y 40 px hasta 640 px. Se ubica por debajo del borde de papel y antes del monte. Verde oliva `#52614F` al 60 %, sin tarjeta, círculo, sombra, animación ni interacción. Una sola N de Archivo y una aguja SVG. `aria-hidden` y `focusable=false` conservan el orden de lectura y foco.

## Dirección

No se eligió una flecha vertical por conveniencia. La orientación procede de `roads-research/calles-principales.json`, que conserva la misma georreferencia GPS → imagen fuente → mundo SVG utilizada por la red vial. Con longitud constante y latitud creciente, el vector de origen es `[-0.12932, -14.547964]`. Aplicando la matriz imagen → SVG resulta `[+7.163893, -31.535036]`. El norte apunta 12,8° a la derecha de la vertical. Es aproximado como el mapa, pero coherente con él.

## Evaluación de layout

La evidencia de referencia es la captura de escritorio del checkpoint vigente y `globals.css`/`island-map.tsx` de la app. La lectura principal sigue siendo estado → isla/punta → gráfico. El indicador reúne letra y aguja en una única marca, sin nuevo grupo de datos ni borde. La densidad queda deliberadamente baja: una marca pequeña sobre el espacio libre superior izquierdo, lejos de la costa de Santa Fe visible a la derecha. Los márgenes se toman de la escala existente y el cambio móvil sólo reduce la distancia superior para acompañar el borde de papel de 26 px.

El recorte de mundo, la geometría, las calles, el marcador de la playa, los datos y los demás textos permanecen iguales. El indicador no reordena DOM ni foco, no ocupa espacio de flujo y no cambia con lectura desconocida o rótulo largo. `.map-surface` ya tiene posición relativa y recorte de overflow. Revisar una captura integrada de escritorio y móvil junto a las demás capas: sin cruce con olas nuevas ni copas. No requiere un ciclo de capturas separado.

Verificación mecánica local: detector `--scope layout` sobre estos dos archivos sin hallazgos. Caja comprobada en 320, 390, 640, 900, 1440 y 2000 px: sin overflow y con 11–14 px de separación respecto del borde de papel; cálculos en `verification.json`. La confirmación visual integrada queda a cargo del integrador en su captura final conjunta.
