# Transición agua–copas · Impeccable polish

Defecto local: las copas anteriores sobresalían más que la franja de agua. El borde claro seguía el contorno geográfico y la vegetación lo ocultaba, especialmente al sur de Curupí. El patrón de grandes coronas también dejaba puntas fuertes y repetidas.

La corrección trabaja sobre la silueta visible del monte, conservando los cuatro contornos geográficos como anclas intactas. Una máscara continua de curvas redondeadas aporta irregularidades pequeñas y agrupadas, con desplazamiento máximo de unas 4.34 unidades. La franja clara nace de la envolvente más suave de esas copas, sin seguir cada hojita. Su ancho visible varía entre 8.1 y 11.88 unidades en Puente y 7.4 y 10.71 en Curupí. La punta y los extremos quedan fijados.

## Integración

Ejecutar `node apply-layer.cjs INPUT.svg OUTPUT.svg`. El helper cambia exclusivamente siete elementos existentes: cinco máscaras y dos paths `water-zone-*`. Puede aplicarse sobre la fuente final con calles, bloques y lapachos; no requiere restaurar una versión anterior.

Sin cambios: geometría, río #A09071, agua de orilla #A79C7A con opacidad 1, marcador #DBB03B/#2C382E con radios 14/8 en (831, 616), calles y bloques del continente, ondas, arena dinámica, encuadre, estado, datos y gráfico. No agrega filtros, desenfoque ni degradado. Mantiene ambos patrones de textura forestal existentes, incluyendo la muestra interior limpia de Curupí.

El helper comprueba que todo el contenido exterior a esos siete elementos permanezca idéntico. `invariants.json` registra los cuatro paths, 382 vías, marcador y arena sin cambios. `candidate.svg` sirve como inspección del resultado, no sustituye el helper fusionable.

## Material

La textura de las copas se prolonga sólo 2.6 unidades hacia el interior para cubrir el encuentro con el bitmap sin exponer píxeles marrones. No se pintan hojas aisladas ni coronas planas. Las copas pasan a compartir una silueta coherente, de pequeños entrantes y salientes suaves.

## Comparación visual

Las pruebas geométricas son auxiliares. La aceptación visual se verifica sobre la app real en 1440 y 390, con un recorte equivalente del sur de Puente y ambos bordes de Curupí. Una ronda inicial, una sola tanda de correcciones de defectos concretos si aparecen, y una confirmación como máximo.

Ronda integrada revisada: `app-desktop.jpg`, `app-mobile.jpg` y `app-borde.jpg`. Las tres provienen de capturas reales de la app; el recorte se obtiene del JPEG completo, sin render SVG independiente. En escritorio la franja permanece visible y estrecha debajo de Puente, encima y debajo de Curupí; desaparecen las copas aisladas fuertes. En móvil la copa se lee suavemente irregular y el claro no compite con la isla. La lectura oficial 3.47 m, el gráfico y el encuadre siguen intactos. No se detectó un fallo concreto que exigiera otra ronda.
