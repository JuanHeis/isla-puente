---
name: Isla Puente
description: Mapa vivo de la costa del Paraná, con la isla como protagonista.
colors:
  paper: "#F5F4E9"
  ink: "#29362B"
  forest: "#4B6245"
  plotLine: "#506344"
  river: "#A09071"
  shoreWater: "#A79C7A"
  tipOuter: "#DBB03B"
  tipInner: "#2C382E"
  mainland: "#9CAA85"
  sand: "#D8BC82"
  ripples: "#bfa878"
  secondaryInk: "#52614F"
  roads: "#DFE2CF"
  lapachos: "#B7A2A0"
typography:
  display:
    fontFamily: "ArchivoBlack, sans-serif"
    fontSize: "clamp(46px, 9.8cqw, 132px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  displayMobile:
    fontSize: "clamp(42px, 11.8cqw, 62px)"
  body:
    fontFamily: "Archivo, sans-serif"
  brand:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(22px, 2.4cqw, 34px)"
    fontWeight: 800
    letterSpacing: "-0.03em"
  reading:
    fontFamily: "Archivo, sans-serif"
    fontSize: "15px"
    lineHeight: 1.45
  utility:
    fontFamily: "Archivo, sans-serif"
    fontSize: "14px"
spacing:
  horizontal: "clamp(22px, 4.6cqw, 76px)"
  brandGap: "13px"
rounded:
  input: "0px"
components:
  quiet-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "10px 0"
  decimal-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "8px 6px"
    width: "74px"
---

# Design System: Isla Puente

## Overview

**Creative North Star: "Mapa vivo de la costa"**

Esta es la base visual aprobada por el usuario el 13 de octubre de 2026. Conserva el mapa reconocible, la tipografía contundente y el paisaje cálido. El estado se entiende primero; después aparece la isla, con verdes más vivos y más textura que sus alrededores. Los datos acompañan con discreción.

La composición es una lámina centrada sobre papel continuo. La ilustración conserva sus formas aunque cambie el recorte. El monte y el agua aportan riqueza; el resto de la interfaz permanece sobrio.

**Key Characteristics:**

- Isla como foco principal.
- Geometría compartida entre escritorio y móvil.
- Monte texturado con copas suaves y continuas.
- Agua terrosa, orilla estrecha y ondas discretas.
- Tipografía grande; datos y herramientas discretos.

Referencias del estado aprobado, diferenciadas de las pruebas:

- [Escritorio con lectura real](design/verification/isla-puente-desktop.jpg) y [móvil con lectura real](design/verification/isla-puente-mobile.jpg), con [detalle del gráfico móvil](design/verification/chart-mobile.jpg).
- [Simulación de arena máxima a 0,60 m](design/verification/simulation-max-desktop.jpg): incluye el borde final de 3,4 unidades.
- [Simulación de alerta a 4,70 m](design/verification/simulation-alert-desktop.jpg) y [simulación de río alto a 5,00 m](design/verification/simulation-high-mobile.jpg).
- [Título de dos líneas en simulación](design/verification/polish-two-lines-mobile.jpg) y [apertura sin conexión](design/verification/offline-mobile.jpg).

Las lecturas de esas capturas son instantáneas de verificación. Los valores vivos pertenecen a la fuente oficial; las decisiones funcionales se mantienen en [PRODUCT.md](PRODUCT.md).

## Colors

Los valores exactos del frontmatter son la autoridad. Se extraen de `src/app/globals.css`, el SVG aprobado y sus componentes; no convertirlos en una paleta aproximada.

El monte vivo es el acento principal. La textura original de Isla Puente y Curupí se conserva en el activo del mapa; forest sostiene la marca y los controles, mientras plotLine colorea la curva del gráfico. Tierra firme usa mainland sólido y bloques verdes localizados, subordinados a las islas. Los lapachos rosa se reservan a unos pocos árboles de Urquiza.

El río usa river uniforme. shoreWater sirve para la banda orgánica junto al borde visible de las copas y costas, con opacidad 1 y sin blur; también colorea el borde fino de arena. No ampliar esa banda para hacerla más visible ni aclarar su color. ripples se reserva a las ondas.

La arena usa sand únicamente en la playa dinámica oriental y en la mínima referencia del Thompson. El marcador focal usa tipOuter y tipInner; el punto del nombre continúa en forest. Papel, títulos y lectura secundaria usan paper, ink y secondaryInk. Las calles usan roads en distintos grosores y opacidades.

## Typography

Archivo Black sostiene los estados y Archivo el nombre, datos, controles y vínculos. Los archivos se alojan en `public/fonts/` con sus licencias OFL. El peso 400 del título corresponde al archivo Archivo Black; no sustituirlo por una fuente genérica en negrita.

El tamaño del título usa unidades de contenedor, con el ajuste displayMobile hasta 640 px. A una columna de 900 px su tamaño es 88,2 px. Se conserva el interletraje compacto, altura de línea y balance de líneas; los estados largos pueden ocupar más de una línea. La marca usa brand, con 23 px y 22 px de separación superior en móvil.

Sólo los cinco títulos de estado usan el mismo follaje bitmap del monte. `public/map/title-forest.png` es un recorte sin alterar de 240 × 120 px del interior de `referencia-estilo.png` (410,565–650,685); se repite a 300 × 150 px con una capa de tinta rgba(41,54,43,.58). El detalle de hojas se reconoce sin aclarar el título ni competir con la isla. El fondo sólido conserva la lectura si falla el activo, y forced-colors usa texto sólido. No extender la textura a fechas, mensajes, controles o fuentes.

El título reserva .16em debajo de la línea para pintar completa la «y». Su margen inferior compensa ese espacio: calc(12px - .16em), 15px en móvil. La alineación óptica corrige el bearing del archivo: −.045em para H/N y −.012em para C/S; hasta 640 px, −.025em y .02em respectivamente. La lectura recibe 1 px de ajuste izquierdo. No recortar el glifo ni reducir la tipografía para resolver estos detalles.

La lectura principal usa reading, reducida a 14 px en móvil; la altura tiene peso 800 y números tabulares. El gráfico emplea un rótulo de 18 px, 16 px en móvil; fechas, procedencia y avisos usan texto secundario de 14–15 px.

## Layout

Toda la app, incluidos nombre, estado, mapa, gráfico, simulador y fuentes, se centra en un máximo de 900 px. El papel exterior es idéntico al interior. El contenedor define la escala; una ventana ancha no agranda la tipografía ni el mapa.

Los márgenes comparten spacing.horizontal. El mapa mide `clamp(340px, 54.5cqw, 490px)` en escritorio: a 900 px de ancho tiene 490 px de alto. Hasta 640 px usa `min(91cqw, 410px)` con mínimo 270 px. El gráfico mide 190 px de alto, 144 px en móvil.

Los cierres superior e inferior son ondas de papel de 45 px, reducidas a 26 px en móvil. Los lados tienen pequeños cierres orgánicos nítidos de 12 px, 8 px en móvil. No usar blur, sombras, líneas de borde o esquinas redondeadas para esconder el recorte.

El borde exterior usa tres dibujos casi iguales con GSAP. El usuario pidió suavizar el acabado y eliminar el ciclo perceptible: cada lado elige aleatoriamente otro de los tres trazos y una duración de 900–1700 ms, con `sine.inOut`, sin una secuencia fija ni los cuatro lados sincronizados. Tras resultar imperceptible la variación de 0,35–0,7 unidades, se amplió cinco veces a 1,75–3,5 unidades en las curvas, manteniendo el ritmo suave y aleatorio. Sólo cambian los cuatro cierres de papel; la geografía, el encuadre y el Norte permanecen quietos. El movimiento se pausa fuera de pantalla o con la pestaña oculta. La preferencia de movimiento reducido conserva el primer dibujo estático, también al cambiarla durante la sesión. Referencias del efecto en `design/verification/map-border-boil-*`.

El mismo mundo SVG se encuadra según la caja real: ancho 1550 en escritorio y 1220 en móvil. La punta fija `(831,616)` queda a dos tercios del ancho del mapa dentro de la columna y al 46,5 % de su altura. No mover costas por separado. El recorte móvil puede dejar elementos secundarios afuera.

El Norte es un adorno de 28 × 46 px sobre el margen izquierdo, a 56 px desde arriba del mapa, 40 px en móvil. Su giro de 12,8° sigue la georreferencia común; usa secondaryInk al 60 %. Queda fuera del mundo SVG, sin ocupar flujo ni captar interacción.

## Elevation & Depth

La interfaz es plana: papel continuo, sin tarjetas, sombras ni superficies de alarma. La profundidad procede del contraste entre el monte vivo y tierra firme, la textura interior, los bloques de vegetación y las curvas del paisaje.

La orilla es agua de tono apenas distinto, estrecha y sin filtro. No sustituirla por arena, un contorno oscuro o un brillo. Los avisos se distinguen por texto y jerarquía, manteniendo la misma superficie.

## Shapes

Los trazados base de Isla Puente, Curupí y ambas costas son las anclas aprobadas. Sus cuatro atributos `d` se conservan en `public/map/isla-puente.svg`; el espejo `src/components/map-art.ts` debe permanecer sincronizado. El dibujo es ilustrativo, con relaciones geográficas cuidadas; no exige detalle topográfico.

Las copas forman una envolvente irregular continua, con entradas y salidas suaves. La textura exterior se toma del interior del mismo bosque para evitar píxeles de agua dentro del monte. La banda clara se deriva de esa envolvente visible y permanece estrecha: alrededor de 10 ±2 unidades en Puente, 9 ±2 en Curupí y 6 ±2 en las costas. La punta queda libre.

La red vial conserva 77 nombres reales y 382 segmentos de OpenStreetMap, con una transformación común aproximada. La jerarquía es principal 4/.64, conexión 2,6/.50, local 1,65/.34 y parque 1,15/.30 (grosor SVG/opacidad). No recuperar veredas o calzadas paralelas redundantes. Tierra firme contiene grupos arbolados localizados y seis lapachos suaves; no un patrón uniforme de árboles.

Las 16 ondas usan curvas cortas irregulares, trazo de 2,65 unidades y remates redondos. Siguen tangentes aproximadas del cauce, sin filas ni repetición mecánica. Su máscara las limita al agua. Por pedido del usuario del 14 de octubre de 2026, GSAP anima estas ondas con una deriva zen. La última corrección del usuario fija la corriente de derecha a izquierda: cada onda avanza 48–72 unidades SVG hacia la izquierda en la dirección de su tangente, a velocidad constante durante 18–22 segundos, sin retroceso. El usuario descartó el serpenteo porque parecía un gusano. Cada curva ahora se aplana y recupera su arco completo de forma coherente, entre el 65 % y el 105 % de su amplitud original respecto a la cuerda de cada subtrazo, con extremos fijos. GSAP interpola esos dos dibujos con `sine.inOut` en ciclos de 8–12 segundos desfasados: sin crestas que recorran el cuerpo ni deformaciones laterales. Aparece y se desvanece suavemente durante 3 segundos en cada extremo, reiniciando invisible. El desfase de 430 ms y el arranque adelantado 12 segundos distribuyen los ciclos y dejan el río activo desde el inicio; la opacidad máxima es 0,88. Se conservan sus rotaciones originales, posición base, color y máscara; la isla sigue siendo el foco. El movimiento se pausa fuera de pantalla o al ocultar la pestaña, y la preferencia de movimiento reducido restaura las ondas estáticas. El SVG público continúa como referencia estática sincronizada de la geometría. La verificación de movimiento se registra en `design/verification/river-motion.json`, con capturas `river-motion-desktop.png` y `river-motion-mobile.png`.

El marcador usa radios exteriores/interiores de 16/9,2 y mantiene su posición fija. En dispositivos con hover y puntero fino, pasar por cualquier parte del mapa amplía el conjunto a escala 1,35 desde su propio centro; al salir vuelve a su tamaño base. La transición dura 180 ms y usa desaceleración cúbica. La reducción de movimiento elimina la transición; en táctil conserva el tamaño base. El adorno no incorpora una acción de clic.

La arena máxima se une a los hombros `(710,550)` y `(736,681)` y alcanza `(914,625)`, interpretando el contorno suministrado por el usuario. La forma se retrae de manera continua hacia la costa, sin un triángulo suelto. Su borde claro tiene ancho máximo 3,4 unidades, remates suaves y se retira a ancho cero con el área; a 2 m no queda línea fantasma.

## Components

El nombre compacto y su punto verde preceden al estado grande. El estado tiene una línea discreta de altura, fecha y procedencia. Los cinco textos y los límites funcionales pertenecen a PRODUCT.md; aquí se conserva su tratamiento visual. Sin lectura válida se muestra texto sólido «Sin dato actual», sin dibujar una playa inventada.

La arena se satura en su máximo ilustrativo a 0,60 m y llega a área cero a 2,00 m; el título en ese límite conserva «Casi no hay playa». La primera lectura se dibuja desde SSR. Los cambios crecen en 360 ms y se retiran en 240 ms, con desaceleración cúbica, retomando el progreso visible al interrumpirse. Sólo cambia el `d` y borde de arena; los demás nodos SVG permanecen estables. La preferencia de reducción de movimiento aplica el resultado directamente.

El gráfico es una línea SVG sencilla de 3 px en plotLine, sin puntos permanentes. Conserva fechas reales, alturas en metros y una única referencia discontinua de playa de 2 m. Por pedido del usuario del 14 de octubre de 2026, la inspección agrega un punto circular de 8 px en plotLine sobre la lectura consultada, junto a la línea vertical tenue de 1 px, discontinua y al 50 %. El punto conserva su tamaño y forma en escritorio y móvil, y acompaña la selección con puntero, tacto o teclado; al limpiar la selección desaparece con la guía. Su lectura consultada acompaña el rótulo; el puntero o teclado no cambian el estado ni la arena. En móvil se reserva una franja izquierda de 26 px para separar «2 m» del eje. Una nota quieta de 13 px y altura de línea 1.45 aclara que el umbral proviene de experiencia personal y que la dinámica fluvial puede cambiar la arena. Referencias: `design/verification/chart-hover-desktop.png` y `design/verification/chart-hover-mobile.png`.

El simulador permanece cerrado por defecto. «Simular altura» abre campo decimal y deslizador discretos bajo el gráfico, sin tarjeta. SIMULACIÓN y la altura manual se muestran junto al estado; el último registro oficial continúa visible. «Volver al nivel real» cierra la herramienta y devuelve el foco. Campos y acciones ofrecen al menos 44 px de altura; el campo tiene 74 px de ancho, fondo transparente y sólo una línea inferior.

Los avisos de río alto son texto pequeño bajo la lectura, sólo al alcanzar las referencias publicadas de 4,70/5,00 m. La simulación lo identifica explícitamente; no son una orden emitida ni nuevas líneas del gráfico. El detalle funcional y procedencia siguen en PRODUCT.md.

El texto estático no es seleccionable. Los campos editables del simulador conservan selección, caret y teclado normal, incluido Ctrl+A. Los vínculos y acciones son subrayados, con foco visible de 2 px y separación de 5 px. La recuperación de fuente se muestra discretamente en esa zona; conserva la lectura válida y su fecha. No cambiarla por una tarjeta de error o añadir decoración permanente.

La pantalla de una apertura sin conexión conserva papel, nombre y punto verde, con título sólido «Sin conexión», explicación breve y enlace «Volver a consultar». No dibuja estado de playa ni una lectura anterior. La instalación utiliza el símbolo focal amarillo/verde en favicon e iconos; no cambia el punto verde del nombre. La [imagen estática para compartir](public/og-isla-puente.png), de 1200 × 630 px, reutiliza papel, fuentes, follaje y el mismo mapa con la punta a dos tercios. Su pregunta «¿Hay playa en la punta?» no incluye altura, fecha ni estado vivo que pueda quedar antiguo en caché social.

## Do's and Don'ts

- Conservar a la isla como foco, con más textura y verdes más vivos que tierra firme.
- Mantener la punta a dos tercios del mapa dentro de la columna y recortar el mismo mundo en móvil.
- Reutilizar los activos aprobados y mantener sincronizados el SVG público y su espejo React.
- Diferenciar visualmente lectura oficial, consulta histórica y simulación.
- Documentar los cambios visuales explícitamente pedidos por el usuario sobre esta base.
- No reintroducir rótulos geográficos, caleta eliminada, borde oscuro en islas o arena continua sobre tierra firme.
- No sustituir copas por tréboles aislados, ni bloques arbolados por una trama uniforme.
- No ampliar la banda clara, agregar blur o cambiar los colores exactos para compensar otro ajuste.
- No inventar grillas de calles ni devolver trazos paralelos ruidosos.
- No convertir datos de una captura en valores vivos ni conservar una simulación silenciosa.

Esta guía registra el estado aprobado; los pedidos explícitos futuros del usuario pueden revisarlo y deben actualizar la documentación correspondiente.
