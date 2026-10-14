# Isla Puente

Web Next.js independiente para consultar la playa de Isla Puente según la altura oficial de la estación Paraná (230). Conserva el estilo y el mapa aprobados.

## Usar localmente

Requiere Node 22.x (verificado con 22.17.1).

```sh
npm ci
npm run dev
```

Abre http://127.0.0.1:59957/. Para producción local: `npm run build` y `npm start`. No requiere claves ni variables de entorno.

## Publicar desde GitHub en Vercel

El usuario creó y publicó el repositorio en la rama `main`, con remoto GitHub existente. Los cambios locales posteriores conservan esa rama; esta preparación no realiza pushes ni despliegues. El ignore evita nuevos archivos temporales, dependencias, builds, variables privadas y estudios de trabajo. El primer commit del usuario conserva investigaciones históricas ya versionadas; no son necesarias para ejecutar la app. Las capturas aprobadas y las referencias de pruebas se conservan.

1. Crea tu repositorio vacío en GitHub y sube este proyecto. Puedes usar GitHub Desktop o guardar un commit y añadir la URL de tu repositorio como remoto. Sube la rama `main`.
2. En Vercel, elige **Add New → Project** e importa ese repositorio de GitHub.
3. Deja el preset **Next.js** y la carpeta raíz del repositorio. Usa `main` como rama de producción. Node 22.x queda fijado en `package.json`; conserva los comandos de build y salida predeterminados. No necesitas variables de entorno.
4. Publica desde Vercel. La URL HTTPS permite instalar la PWA y Vercel actualizará el proyecto tras los próximos pushes a esa rama.

La app necesita su servidor Next.js para consultar Prefectura. No usar exportación estática. `vercel.json` fija únicamente la región de ejecución `gru1` (São Paulo), necesaria para alcanzar la fuente desde el servidor. El dominio público está definido sólo en canonical y metadata de compartir.

Guías oficiales: [importación Git en Vercel](https://vercel.com/docs/git), [Node en Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) y [PWA en Next.js](https://nextjs.org/docs/app/guides/progressive-web-apps).

## Instalar y consultar rápido

Después de publicarla con HTTPS, abre la URL y utiliza **Instalar aplicación** si tu navegador lo ofrece. En iPhone/iPad, abre Safari y usa **Compartir → Agregar a inicio**. La disponibilidad y el nombre de la acción dependen del navegador. El favicon ICO incluye 16/32/48/64 px; los iconos 192/512, maskable 512 y Apple 180 usan el mismo marcador amarillo/verde.

Una apertura nueva sin conexión muestra una pantalla clara para reintentar; no presenta una altura guardada como actual. La PWA almacena sólo recursos estáticos y esa pantalla offline, con una caché limitada y recursos consultados primero por red. Nunca almacena respuestas de `/api/river`, HTML de la app ni RSC. No solicita notificaciones o permisos. En una vista ya abierta conserva el último registro obtenido e informa los fallos de actualización.

## Datos y límites

El servidor consulta [la página oficial de Prefectura](https://contenidosweb.prefecturanaval.gob.ar/alturas/?id=230&page=historico&tiempo=30). La fuente publica el historial numérico en su HTML; no se encontró un feed JSON público separado. El adaptador extrae números y fechas sin ejecutar JavaScript remoto y puede usar la tabla publicada. La cabecera se reconcilia con el historial por timestamp, sin retroceder ni duplicar lecturas.

`GET /api/river` expone los registros normalizados, sin caché HTTP. Las fechas de estación corresponden a Argentina (UTC−03:00). El gráfico muestra los últimos 30 días y permite consultar alturas/fechas con puntero, tacto o teclado; mantiene sólo la referencia de playa de 2 m y no cambia el estado actual al recorrer historia.

La fuente se consulta como máximo una vez cada diez minutos por proceso, agrupando solicitudes simultáneas. La vista actualiza cada cinco minutos cuando está visible y al volver a ella. Si falla la fuente conserva el último registro disponible y muestra el problema; un arranque sin fuente muestra «Sin dato actual». Una lectura de más de 24 horas se identifica como antigua. En Vercel esta caché es temporal y propia de cada instancia; no persiste ni se comparte entre arranques. Un cambio en el HTML oficial puede requerir actualizar el adaptador. Ante un fallo, la API incluye sólo categoría, código seguro y duración en `sourceIssue` (y región Vercel si existe); los logs usan `[isla-puente:prefectura]`. La UI conserva el mensaje discreto, sin mostrar diagnósticos técnicos.

Los 2 m son una referencia basada en experiencia personal, no un umbral de playa establecido por Prefectura. La dinámica fluvial erosiona y deposita arena, por lo que la playa puede variar. La altura de estación no indica profundidad o seguridad en la playa; las formas y cortes inferiores son ilustrativos.

| Altura | Estado |
| --- | --- |
| Mayor a 2,00 m | No hay playa |
| 1,90–2,00 m inclusive | Casi no hay playa |
| 1,60–menos de 1,90 m | Hay poca playa |
| 1,20–menos de 1,60 m | Hay playa |
| Menor a 1,20 m | Hay mucha playa |

La arena llega a área y borde cero a 2,00 m, manteniendo «Casi no hay playa» en ese límite; su máximo ilustrativo se satura a 0,60 m. Las transiciones son interrumpibles y respetan reducción de movimiento. «Simular altura» modifica únicamente título y arena, con etiqueta SIMULACIÓN; altura oficial, fecha e historial siguen reales. «Volver al nivel real» cierra la prueba. No se guarda una simulación entre sesiones.

Desde 4,70/5,00 m aparecen mensajes contextuales según las referencias de alerta/evacuación publicadas para Paraná y verificadas el 13/10/2026. No acreditan una orden emitida y en simulación lo indican explícitamente; no añaden líneas al gráfico.

## Verificación y base visual

```sh
npm test
npm run typecheck
npm run build
```

31 pruebas cubren estados, fechas, parser, orden/deduplicación, fallos/caché, geometría de costa/arena, simulación, mensajes de río alto y política PWA/offline. Se comprobaron navegación sin servidor y recuperación real, manifiesto, iconos, headers, escritorio/móvil y teclado.

[DESIGN.md](DESIGN.md) guarda el estilo aprobado, tokens y capturas. [PRODUCT.md](PRODUCT.md) mantiene las decisiones funcionales. [AGENTS.md](AGENTS.md) orienta cambios futuros. Las capturas reales, ejemplos explícitamente simulados y evidencia están en [design/verification](design/verification/).

El mapa es una ilustración geográfica aproximada, con cuatro siluetas conservadas y 77 nombres/382 segmentos OSM. La procedencia y licencia están en [design/ATTRIBUTION.md](design/ATTRIBUTION.md); la atribución se muestra en la app. Archivo y Archivo Black se alojan localmente, con sus licencias OFL en `public/fonts/`.

## Compartir

La imagen OG/Twitter de 1200 × 630 px está en `public/og-isla-puente.png`. Reutiliza el paisaje y las fuentes locales, sin altura ni estado actual para evitar una lectura desactualizada en cachés sociales. OG, Twitter y canonical apuntan a https://isla-puente.vercel.app. La imagen se sirve estáticamente y no consulta Prefectura. Puede regenerarse con `node scripts/generate-og.mjs`, usando Sharp ya incluido por Next.js; no es un paso del build.

## Publicación verificada

La app está publicada en https://isla-puente.vercel.app/. El 13/10/2026 por la noche se comprobó HTTP 200, último registro 3,47 m del mismo día a las 12:00 de Argentina, 60 muestras y ningún error de fuente. En la región predeterminada `iad1`, el diagnóstico detectó `UND_ERR_CONNECT_TIMEOUT` después de unos 10,5 s al conectar con Prefectura. Ejecutar las funciones en `gru1` permitió consultar la misma URL oficial correctamente: API 200 en 822 ms. Se conservaron HTTPS, timeout, validación de fechas/estación y datos oficiales. La evidencia HTTP y los commits funcionales están en [design/verification/publicacion.json](design/verification/publicacion.json). Las capturas de estilo son locales; no se obtuvo una captura nueva de producción porque el navegador de verificación no tenía superficies disponibles.

Regiones según la [documentación oficial de Vercel](https://vercel.com/docs/functions/configuring-functions/region). Si vuelve a fallar la fuente, se aplica la recuperación documentada y puede consultarse el código seguro de `sourceIssue`.
