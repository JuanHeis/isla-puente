# Arena animada de Isla Puente

Tesis: el único movimiento es el borde de la playa que se retira hacia la isla cuando sube el río y sale de los mismos hombros cuando baja. Continuidad del nivel, sin movimiento decorativo permanente. La primera lectura se dibuja directamente; cambios posteriores usan 360 ms al crecer y 240 ms al retirarse, con desaceleración cúbica. Interrupciones retoman la forma visible. Reducción de movimiento aplica el resultado inmediato.

El máximo interpreta el trazo rojo suministrado por el usuario: nace en `(710,550)`, termina en `(736,681)` y alcanza `(914,625)`. Curvas suaves y punta ligeramente redondeada. No reproducir la línea roja. El frente se interpola con la costa real aprobada de la isla; la misma topología evita saltos, puntas cruzadas o deformaciones de los otros elementos.

Conservar `#D8BC82`, el color actual de arena. No modificar agua `#a09071`, agua somera `#a79c7a`, vegetación, caminos, norte, círculo `(831,616)` ni geometrías base. La capa permanece donde ya estaba, detrás de la vegetación y delante del agua.

Forma ilustrativa: rango lineal `0,60–2,00 m`, heredado de la fórmula anterior. A `0,60 m` o menos alcanza el máximo y no se agranda más. A `2,00 m` exactos su área es cero. Se mantienen todos los rótulos acordados, incluido «Casi no hay playa» a `2,00 m`: es el límite visual.

Entregables: `beach.ts`, `beach.test.ts` y `island-map-changes.md`. El integrador es propietario de la app; este agente no modifica esos archivos.

Verificación prevista en la app integrada: forma máxima `0/0,60`, intermedia `1,20/1,60`, mínima `1,90`, oculta `2/2,10`; escritorio y celular, retarget rápido, retorno al dato real y preferencia de reducción de movimiento. El gráfico y el registro de Prefectura permanecen reales.

## Verificación completada

El integrador copió el helper, los cinco tests y el efecto al proyecto Next.js. Los cinco tests geométricos pasan; el conjunto de la app suma 18 pruebas aprobadas. Typecheck aprobado. La inicialización del objeto HTML usa `useState` perezoso: la primera playa real también está presente en el HTML del servidor, y ese objeto permanece estable en los cambios posteriores.

Se revisó en una sola ronda conjunta la app integrada: escritorio máximo `0,60`, intermedio `1,60`, mínimo `1,90` y cero `2,00`; móvil máximo `0,60` y cero `2,00`. Las capturas `app-max-desktop.jpg`, `app-mid-desktop.jpg`, `app-min-desktop.jpg`, `app-zero-desktop.jpg`, `app-max-mobile.jpg` y `app-zero-mobile.jpg` están en esta carpeta. Sin defectos que requieran una corrección visual.

El integrador comprobó progresos parciales y retarget rápido sin recrear el nodo de arena ni destello de área cero. El gráfico y la lectura oficial permanecieron en `3,47 m`, con la simulación identificada aparte. A `2,00 m` el path de ida/vuelta coincide y su área es cero; el título conserva «Casi no hay playa». El comportamiento de reducción de movimiento se implementa tanto al iniciar como al cambiar la preferencia durante la transición. No se añadieron dependencias ni movimiento constante.

El último build combinado, con mejoras de otros agentes ajenas a la arena, lo gestiona el integrador. Esta revisión sólo evalúa la arena; la forma y la saturación a `0,60 m` siguen siendo ilustrativas.
