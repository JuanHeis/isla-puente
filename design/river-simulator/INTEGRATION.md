# Simulador de altura

Copiar `river-simulator.tsx` a `src/components/`, `simulation.ts` a `src/lib/` y agregar `simulator.css` al final de `src/app/globals.css`. `river-app.patch.diff` muestra los únicos cambios necesarios en `RiverApp`: un estado local `number | null`, la altura usada por título y mapa y un componente debajo del gráfico.

La lectura oficial, su fecha, el historial, los errores y la actualización de Prefectura siguen usando `report`. El valor manual no toca el reporte, el caché, la API, la URL ni el almacenamiento local. Al regresar, `displayedLevel` toma el `report.current` de ese momento. La actualización oficial puede continuar mientras el usuario simula, sin sobrescribir su valor.

Por defecto el simulador permanece cerrado y desactivado. Al activarlo toma la última altura oficial válida, o 2 m si falta la fuente; en este caso el encabezado sigue marcado **SIMULACIÓN** y el registro oficial dice «sin dato actual». El rango habitual es 0–6 m, paso 0,01. Si la lectura oficial supera esos extremos, el control amplía su rango para conservar el valor real de inicio.

El campo decimal acepta coma o punto, actualiza sólo valores válidos y conserva la altura aplicada mientras está vacío o inválido. La salida «Volver al nivel real» desactiva la simulación. El slider recibe foco al abrir para conservar la navegación por teclado sin abrir el teclado decimal del celular.

Pruebas del parser: `node --experimental-strip-types --test simulation.test.ts`. Para incluirlas en el repo, copiar a `tests/simulation.test.ts` y cambiar su import a `../src/lib/simulation.ts`.

Verificación integrada a cargo del agente Next.js: activación; niveles 3,47 / 2,00 / 1,70 / 1,40 / 0,90; entrada con coma; campo vacío e inválido; salida al registro real vigente; gráfico y fechas intactos; escritorio y celular sin desbordamiento; foco por teclado. No crear una segunda serie histórica ficticia.
