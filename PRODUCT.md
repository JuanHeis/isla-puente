# Isla Puente

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js. El usuario delegó la elección y confirmó Next.js. Consultar Prefectura desde el servidor.

## Users

Personas que consultan si hay playa en la punta oriental de la Isla Puente frente a Paraná.

## Product Purpose

Mostrar de inmediato cuánta playa hay en la punta de Isla Puente mediante cinco estados, según la última altura publicada por Prefectura para la estación 230 (Paraná).

## Capabilities and Constraints

- Proyecto nuevo e independiente del expense-tracker.
- El estado a 2,00 m es «Casi no hay playa». La última corrección visual del usuario hace que la arena llegue a área cero a 2,00 m exactos; por encima el estado es «No hay playa».
- El mapa debe ser SVG e interactivo: la arena crece visualmente al bajar el río y desaparece al superar el umbral.
- Un gráfico muestra el historial real del nivel del agua.
- La altura de la estación no expresa la profundidad del agua en la playa.
- Ubicación confirmada por el usuario: punta oriental frente al Thompson, junto al marcador «Árbol salvador» en el enlace suministrado.
- Sin dato válido no se debe inventar un estado ni presentar datos de demostración como reales.

## Evidence on Hand

Fuente oficial: https://contenidosweb.prefecturanaval.gob.ar/alturas/?id=230&page=historico&tiempo=30

Ubicación: https://www.google.com/maps/@-31.7079823,-60.5195607,1095m/data=!3m1!1e3?entry=ttu

Inspección del 13 de octubre de 2026: Prefectura muestra «Último registro: 3.47 Mts el 13/OCT/26 - 1200» y el histórico termina en 3.45 m del mismo día a las 00:00. El gráfico incorpora pares [timestamp, altura] en un script de la página. No se verificó una API JSON pública documentada. La integración tendrá que conservar fecha y procedencia y resolver esta discrepancia.

## Product Principles

- La respuesta principal debe entenderse de un vistazo.
- El estado usa el umbral confirmado por el usuario, inclusive en 2,00 m.
- La forma y tamaño de la playa en el mapa son ilustrativos; no implican mediciones topográficas.
- Los datos reales, su antigüedad y cualquier simulación deben distinguirse con claridad.


## Brand Commitments

El usuario eligió «Mapa vivo de la costa» y pidió que el dibujo se reconozca como Isla Puente. Los colores deben asemejarse al río Paraná y a su paisaje: agua de tonos terrosos y oliva, monte verde oscuro y arena natural. La silueta de la isla y las posiciones de las costas cercanas deben ser reconocibles aunque simplificadas; no se exige precisión cartográfica.

La referencia satelital suministrada muestra la Isla Puente separada de ambas costas, con punta oriental frente al Thompson; el islote Curupí al sur y ligeramente al este; la costa urbana de Paraná debajo y a la derecha; la costa opuesta al norte. Mantener esa relación geográfica. La playa dinámica se ubica únicamente en la punta oriental.

La playa dinámica de la punta de Isla Puente es el foco principal. Las costas de Paraná y Santa Fe no llevan franjas continuas de arena. Excepción confirmada por el usuario: representar una porción muy pequeña y discreta de playa en el Thompson como referencia geográfica. Los marcadores, líneas del gráfico y adornos exteriores no usarán el color arena. En el estado «No hay playa» no aparece arena expuesta ni un halo de arena en las islas; el estado se refiere únicamente a la playa de Isla Puente. Por corrección posterior del usuario, omitir el canal de la caleta del Club Náutico y dejar la costa continua en ese tramo. Conservar la pequeña referencia de playa en el Thompson, discreta y secundaria.



### Minimalismo y ajuste de las costas

Corrección del usuario: quitar los nombres geográficos explicativos del mapa. Conservar la escala, la silueta y la posición visual de Isla Puente y Curupí del boceto aprobado; ajustar solamente los alrededores. Acercar la costa de Paraná al sur de Curupí para que ese brazo del río sea más estrecho. Alejar la costa de Santa Fe hacia el norte para que el cauce principal sobre Isla Puente sea mucho más amplio. La costa de Paraná hacia la derecha debe subir con una curva o diagonal más suave. Mantener el dibujo simplificado pero cuidar estas relaciones espaciales. Conservar la pequeña referencia de playa en el Thompson, sin nombres sobre el dibujo. La caleta se omite por corrección posterior del usuario.

### Tramo sudoeste junto a Parque Urquiza

El usuario precisó el contorno de la costa de Paraná al sudoeste de Isla Puente mediante un trazo rojo sobre una captura satelital. Ese tramo debe acercarse más al flanco sudoeste de la isla y seguir una diagonal descendente hacia el este, hacer un quiebre corto hacia el sur junto a Parque Urquiza y después abrirse en curva hacia la costa bajo Curupí. No convertirlo en una única curva circular uniforme. Mantener las islas en su posición y escala aprobadas. El trazo rojo es una referencia del contorno, no un elemento que deba aparecer en el mapa final.

### Encuadre responsive

El usuario autorizó una versión más amplia en escritorio y un recorte automático en celular. Isla Puente es siempre el foco principal. La geografía debe provenir de un único trazado con distancias y proporciones coherentes: cambia el encuadre, no la ubicación relativa de cada costa. Elementos secundarios, como el Thompson o parte de las otras costas, pueden quedar fuera del recorte móvil. Evitar comprimir la costa derecha para hacerlos entrar. Las calles pueden eliminarse o reducirse a trazos discretos: la prioridad es el contorno costero.

### Trazado costero revisado

La referencia para construir el mapa es el dibujo SVG revisado en design/coast/, con sus capturas y coordenadas de comparación. Los encuadres normal, móvil y extendido comparten exactamente la misma geometría. Conservar ese trazado completo para evitar desplazar costas individualmente en regeneraciones posteriores. Las calles inventadas se eliminaron. Las siluetas y posiciones aprobadas de Isla Puente y Curupí siguen siendo las anclas: su diferencia residual con la referencia satelital es orientativa, no un levantamiento topográfico. El Thompson se ve en escritorio ancho y puede salir del recorte móvil. La caleta se quitó por pedido del usuario; los archivos de comparación previos documentan el trazado anterior.

### Nombre y estados confirmados

Nombre de la app: «Isla Puente». Cortes iniciales aceptados por el usuario:

- Mayor a 2,00 m: «No hay playa».
- De 1,90 a 2,00 m inclusive: «Casi no hay playa».
- De 1,60 a menos de 1,90 m: «Hay poca playa».
- De 1,20 a menos de 1,60 m: «Hay playa».
- Menor a 1,20 m: «Hay mucha playa».

Los cortes inferiores son estimaciones iniciales para ajustar con observaciones; no representan una medición topográfica de la playa.

### Estilo base y detalle costero

El boceto interactivo en design/boceto-base/ conserva el estilo aprobado: título de estado grande, fondo claro cálido, río terroso, monte vivo en la isla y gráfico verde sencillo. Mantener la punta de Isla Puente a aproximadamente un tercio del borde derecho de la pantalla, tanto en escritorio como en celular. Cambia el encuadre de todo el mapa, nunca se desplazan las costas por separado.

Agregar vegetación discreta en tierra firme y los corredores viales importantes basados en referencias reales. La autorización posterior para ampliar la red sustituye los cuatro trazos iniciales por la capa OSM documentada en design/roads/. Nada de grillas inventadas ni nombres geográficos. Las líneas se recortan dentro de tierra firme. Conservar los verdes más vivos y la mayor riqueza visual para Isla Puente y Curupí.

Onditas sobre el agua muy suaves, de poco contraste y sin competir con la playa. El mapa sigue siendo una ilustración aproximada.

El boceto aprobado sigue archivado en design/boceto-base/. Desde el 13 de octubre de 2026, http://127.0.0.1:59957/ sirve la app Next.js con lecturas reales de Prefectura y sin el control «Altura de prueba» ni el «Historial ilustrativo».
### Siluetas y detalle visual vigentes

Se conservan las cuatro siluetas macro aprobadas, el encuadre común y la punta en (831,616), a dos tercios del ancho visible. Las islas no llevan contorno oscuro, rótulos ni halo de arena. Las autorizaciones posteriores del usuario permiten copas continuas de textura verde y una banda estrecha de agua clara alrededor de su envolvente visual. La caleta permanece omitida.

### Integración real con Prefectura

La app Next.js consulta desde el servidor el HTML oficial de la estación 230, valida estación, números y fechas y extrae la serie numérica sin ejecutar JavaScript externo. Si cambia el formato de la serie, puede leer la tabla publicada. La cabecera y el historial se combinan por timestamp, sin duplicados y sin retroceder a lecturas anteriores. El gráfico conserva las fechas reales, el eje temporal y la referencia de 2 m. La consulta de un punto histórico sólo cambia su fecha/altura en el gráfico: el estado principal y la arena siguen la última lectura real.

Caché de diez minutos por proceso; consultas simultáneas agrupadas. La vista se actualiza cada cinco minutos mientras está visible y al volver a ella. Ante un fallo se conserva la última lectura válida en el servidor o en una vista ya abierta y se informa discretamente. Un arranque sin datos presenta «Sin dato actual» y no muestra registros ficticios. Se identifica una lectura publicada hace más de 24 horas. La caché no es persistente entre reinicios.


### Red vial y continente: revisión final

El usuario aprobó la red ampliada y pidió eliminar caminos paralelos que añadían ruido. La capa final en design/roads-revision/ conserva 77 nombres reales de OpenStreetMap y 382 segmentos, con cuatro niveles de trazo. Se retiraron 23 senderos/ciclovías paralelos y 11 calzadas redundantes; quedan 15 senderos independientes. Las geometrías y la atribución se conservan. Los mapas de investigación previos son históricos.

Tierra firme usa #9CAA85 sólido, sin el patrón uniforme de árboles. Siete grupos verdes guiados por los parques y dos sectores en la costa opuesta sustituyen el grupo anterior; seis lapachos rosa suaves quedan en Urquiza. Las islas mantienen la mayor riqueza y el verde más vivo.

### Monte, ondas y agua: instrucciones finales

Las pequeñas hojas aisladas de la primera propuesta se sustituyen por una masa continua de copas irregulares con la misma textura interior, sin modificar las siluetas macro. La franja exterior usa monte muestreado desde el interior del mismo bitmap para evitar píxeles de agua en la vegetación de Curupí. La revisión final mantiene 16 grupos de ondas suaves en #BFA878; se recortan al agua y evitan la orilla, copas, punta e indicador Norte.

Los pines posteriores del usuario reemplazan los colores, anchos y blur de cualquier estudio anterior: río #A09071 exacto; orilla #A79C7A exacto, opacidad 1, banda estrecha orgánica y sin blur. Su contorno sigue el borde visual de las copas para mantenerse visible. Marcador fijo: aro de radio 14 #DBB03B y centro de radio 8 #2C382E. La marca verde del encabezado y la arena dinámica no cambian. Los activos y límites de aplicación se conservan en design/aesthetics/revision-delight/ y design/shore-polish/.

### Norte y simulación local

El indicador Norte es un adorno SVG de 28 × 46 px, oliva #52614F al 60 %, situado sobre el margen izquierdo del río. Su aguja rota 12,8° según el ajuste común GPS → SVG. Se aloja fuera del mundo SVG y no modifica el encuadre.

El simulador de altura es opcional y no se activa al abrir la app. Cuando el usuario lo activa, muestra SIMULACIÓN y modifica únicamente el título de estado y la arena del mapa. El último registro oficial, su fecha y el historial continúan reales. Volver al nivel real recupera la lectura oficial más reciente, sin escribir datos en el servidor ni guardar una simulación entre sesiones.

### Columna a 900 px aprobada

El usuario confirmó la propuesta Shape: toda la app se centra en una columna de máximo 900 px, con el mismo papel en los laterales. Título, márgenes y mapa escalan por ancho de columna; el mapa a 900 px mide 490 px de alto. Dos cierres de papel orgánicos nítidos de 8–12 px unen los lados con las ondas de arriba y abajo, sin blur, sombras ni borde oscuro. En móvil se mantiene el recorte del mismo mundo. La punta queda a dos tercios del ancho del mapa dentro de la columna, no de la ventana completa.

### Arena animada y referencias de río alto

La forma máxima de arena interpreta el contorno rojo del usuario y se une a los dos hombros de la isla. Su rango ilustrativo va de 0,60 m (máximo, saturado para valores menores) a 2,00 m (área cero). El estado a 2,00 m continúa «Casi no hay playa». Sólo cambia el borde de la arena, en 360 ms al crecer y 240 ms al retirarse; las interrupciones retoman el progreso visible y reducción de movimiento aplica el resultado inmediato. La primera arena también se dibuja desde SSR. La forma lleva un borde fino #A79C7A de ancho máximo 3,4 unidades, que disminuye con el progreso y desaparece completamente a 2,00 m. El objeto SVG y los demás nodos permanecen estables.

Desde 4,70 m aparece un mensaje contextual según la referencia de alerta publicada por Prefectura; desde 5,00 m usa la referencia de evacuación. Se verificaron ambas en la estación 230 el 13/10/2026. Alcanzar una altura no acredita una orden o alerta emitida; la simulación lo identifica explícitamente. Estas referencias se usan sólo en el mensaje, sin líneas nuevas en el gráfico. Las 16 ondas acompañan tangentes aproximadas del cauce, y el título conserva su verde oscuro con una textura vectorial de hojas muy suave dentro de los glifos.
