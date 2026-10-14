const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const source = fs.readFileSync(path.join(root, 'mapa-costa.svg'), 'utf8');
const coastDetails = fs.readFileSync(path.join(root, 'coast-details.svg'), 'utf8');
const artDefs = '<clipPath id="texturePuente"><use href="#isla-puente"/></clipPath><clipPath id="textureCurupi"><use href="#islote-curupi"/></clipPath><pattern id="coast-foliage" width="270" height="230" patternUnits="userSpaceOnUse"><rect width="270" height="230" fill="#9CAA85"/><g fill="#718665" opacity=".24"><path d="M13 34c-9-10-3-21 7-22 5-14 22-13 25-1 13-3 19 10 13 19 8 12-5 23-15 18-8 9-23 5-24-5-8 2-11-3-6-9z"/><path d="M168 22c-6-8-2-17 6-17 4-11 17-10 19-1 11-2 15 8 10 15 6 10-4 18-12 14-6 7-18 4-18-4-7 2-10-2-5-7z"/><path d="M83 155c-8-9-3-19 7-20 5-12 19-12 22-1 13-3 17 9 12 17 7 11-5 21-14 16-7 9-21 5-21-4-8 2-11-2-6-8z"/><path d="M225 160c-9-10-3-21 7-22 5-14 22-13 25-1 13-3 19 10 13 19 8 12-5 23-15 18-8 9-23 5-24-5-8 2-11-3-6-9z"/><path d="M140 210c-6-8-2-17 6-17 4-11 17-10 19-1 11-2 15 8 10 15 6 10-4 18-12 14-6 7-18 4-18-4-7 2-10-2-5-7z"/></g></pattern>';
const defs = source.slice(source.indexOf('<defs>'), source.indexOf('</defs>') + 7).replace('</defs>',artDefs+'</defs>');
let geometry = source.slice(source.indexOf('<g id="geometria">'), source.lastIndexOf('</svg>'));
for (const [id, clip, centerX, centerY, zoom] of [['isla-puente', 'texturePuente', 445, 610, 1.12], ['islote-curupi', 'textureCurupi', 635, 860, 1.4]]) {
  const tag = geometry.match(new RegExp('<path id="' + id + '"[^>]*\\/>'))[0];
  geometry = geometry.replace(tag, tag + '<image href="referencia-estilo.png" x="' + centerX * (1 - zoom) + '" y="' + centerY * (1 - zoom) + '" width="' + 1122 * zoom + '" height="' + 1402 * zoom + '" clip-path="url(#' + clip + ')"/>');
}
geometry = geometry.replace(/(<path id="costa-(?:parana|santa-fe)"[^>]*?)fill="#9CAA85"/g,'$1fill="url(#coast-foliage)"');
geometry = geometry.replace(/<g clip-path="url\(#clipPuente\)"[\s\S]*?<\/g>/, '');
geometry = geometry.replace(/<path clip-path="url\(#clipCurupi\)"[^>]*\/>/, '');
geometry = geometry.replace('<path id="costa-santa-fe"', '<g class="current-marks" fill="none" stroke="#756D53" stroke-width="2.2" stroke-linecap="round" opacity=".18"><path d="M290 365q26-12 50 0t47 0m9 7q16 5 29-1"/><path d="M645 325q24-12 47 0t47 0"/><path d="M470 790q24-12 46 0t47 0m10 7q17 5 30-1"/><path d="M1010 630q23-11 43 0t44 0"/><path d="M107 696q20-9 39 0t38 0"/><path d="M1170 418q19-9 38 0t37 0"/></g><path id="costa-santa-fe"');
const islandStart = geometry.indexOf('<path id="isla-puente"');
geometry = geometry.slice(0, islandStart) + coastDetails + '<path id="island-beach" fill="#D8BC82" hidden/>' + geometry.slice(islandStart);
const map = '<svg id="island-map" class="scene" xmlns="http://www.w3.org/2000/svg" viewBox="-202.33 180 1550 948" role="img" aria-label="Isla Puente y el río Paraná">' + defs + geometry + '</svg>';
const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Isla Puente — boceto</title>
<style>
@font-face{font-family:Archivo;src:url(Archivo-Variable.ttf) format('truetype');font-weight:100 900;font-display:swap}
@font-face{font-family:ArchivoBlack;src:url(ArchivoBlack-Regular.ttf) format('truetype');font-weight:400;font-display:swap}
:root{--paper:#F5F4E9;--ink:#29362B;--forest:#4B6245;--river:#A99977}
*{box-sizing:border-box}html{background:var(--paper);color:var(--ink)}body{margin:0;font-family:Archivo,sans-serif}button,input{font:inherit}
.masthead{padding:30px clamp(22px,4.6vw,76px) 0;display:flex;align-items:center;gap:13px;font-weight:800;font-size:clamp(22px,2.4vw,34px);letter-spacing:-.03em}
.brand-dot{width:.65em;height:.65em;display:block;border-radius:50%;background:var(--forest)}
.status{margin:25px clamp(22px,4.6vw,76px) 12px;font-family:ArchivoBlack,sans-serif;font-size:clamp(46px,9.8vw,132px);line-height:1.02;letter-spacing:-.035em;font-weight:400;text-wrap:balance;max-width:1300px}
.map-surface{position:relative;width:100%;height:clamp(340px,54vw,780px);overflow:hidden;background:var(--river)}
.scene{display:block;width:100%;height:100%}.scene [hidden]{display:none}
.paper-edge{position:absolute;left:0;width:100%;height:45px;pointer-events:none}.paper-edge.top{top:-1px}.paper-edge.bottom{bottom:-1px}.paper-edge path{fill:var(--paper)}
.history{padding:22px clamp(22px,4.6vw,76px) 0}.history figcaption{font-size:18px;color:#52614F;margin:0 0 12px 18px}.history figure{margin:0}.chart-wrap{position:relative}.chart-two{position:absolute;left:0;top:54%;transform:translateY(-50%);font-size:17px;font-weight:800}.chart{width:100%;height:190px;display:block;overflow:visible}
.chart text{font-family:Archivo,sans-serif;fill:#52614F;font-size:17px}.chart .threshold-label{font-weight:750;fill:var(--ink)}
.explore{display:flex;align-items:center;gap:24px;padding:15px clamp(22px,4.6vw,76px) 32px;font-size:16px;color:#4E5E49}.explore label{white-space:nowrap}.explore input{accent-color:var(--forest);width:min(420px,42vw);cursor:pointer}.explore output{font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ink)}
input:focus-visible{outline:2px solid var(--ink);outline-offset:5px}input[type=range]{height:28px}
@media(max-width:640px){.masthead{padding-top:22px;font-size:23px}.status{margin-top:26px;margin-bottom:15px;font-size:clamp(42px,11.8vw,62px);max-width:95%}.map-surface{height:min(91vw,410px);min-height:270px}.paper-edge{height:26px}.history{padding-top:15px}.history figcaption{font-size:14px;margin-left:8px;margin-bottom:8px}.chart{height:124px}.chart text{font-size:21px}.explore{padding-top:12px;display:grid;grid-template-columns:1fr auto;gap:6px 14px;font-size:14px}.explore input{grid-row:2;grid-column:1 / -1;width:100%}.explore output{justify-self:end}}
</style>
</head>
<body>
<main>
 <header class="masthead"><span>Isla Puente</span><span class="brand-dot" aria-hidden="true"></span></header>
 <h1 id="status" class="status" aria-live="polite">No hay playa</h1>
 <div class="map-surface">
  ${map}
  <svg class="paper-edge top" viewBox="0 0 1600 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H1600V9C1400 32 1280 12 1130 18S800 43 640 28S330 12 180 22S50 21 0 7Z"/></svg>
  <svg class="paper-edge bottom" viewBox="0 0 1600 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0 48H1600V34C1370 34 1250 42 1070 34S850 40 650 30S310 35 140 25S60 23 0 20Z"/></svg>
 </div>
 <section class="history" aria-label="Historial ilustrativo del río">
  <figure>
   <figcaption>Historial ilustrativo</figcaption>
   <div class="chart-wrap"><span class="chart-two" aria-hidden="true">2</span><svg class="chart" viewBox="0 0 1200 190" preserveAspectRatio="none" role="img" aria-label="Gráfico ilustrativo del nivel del río, con referencia en dos metros">
    <path d="M34 12V153H1177" fill="none" stroke="#3B4938" stroke-width="1.6" vector-effect="non-scaling-stroke"/>
    <path d="M34 102H1177" fill="none" stroke="#91917D" stroke-width="1.8" stroke-dasharray="12 8" vector-effect="non-scaling-stroke"/>
    <path d="M67 136C106 123 155 105 213 102S312 121 365 116S468 92 520 88S623 66 672 62S771 36 825 38S923 51 975 52S1081 74 1140 78" fill="none" stroke="#506344" stroke-width="3.5" vector-effect="non-scaling-stroke"/>
    <g class="chart-dots" fill="#506344"><ellipse cx="67" cy="136" rx="5" ry="5"/><ellipse cx="213" cy="102" rx="5" ry="5"/><ellipse cx="365" cy="116" rx="5" ry="5"/><ellipse cx="520" cy="88" rx="5" ry="5"/><ellipse cx="672" cy="62" rx="5" ry="5"/><ellipse cx="825" cy="38" rx="5" ry="5"/><ellipse cx="975" cy="52" rx="5" ry="5"/><ellipse cx="1140" cy="78" rx="5" ry="5"/></g>
    <g stroke="#6A765B" stroke-width="1.5" vector-effect="non-scaling-stroke"><path d="M132 166v10M322 166v10M512 166v10M702 166v10M892 166v10M1082 166v10"/></g>
   </svg></div>
  </figure>
 </section>
 <div class="explore">
  <label for="level">Altura de prueba</label>
  <input id="level" type="range" min="0.6" max="3.6" step="0.01" value="3.47" aria-describedby="level-value">
  <output id="level-value" for="level">3,47 m</output>
 </div>
</main>
<script src="states.js"></script>
<script>
const map = document.getElementById('island-map');
const levelInput = document.getElementById('level');
const beach = document.getElementById('island-beach');
function reframe() {
 const bounds = map.getBoundingClientRect();
 const width = bounds.width <= 640 ? 1220 : 1550;
 const height = width * bounds.height / bounds.width;
 map.setAttribute('viewBox', [831-width*2/3,616-height*.465,width,height].join(' '));
 const chartBounds = document.querySelector('.chart').getBoundingClientRect();
 for(const dot of document.querySelectorAll('.chart-dots ellipse')) {
  dot.setAttribute('rx',5*1200/chartBounds.width);
  dot.setAttribute('ry',5*190/chartBounds.height);
 }
}
function updateLevel() {
 const level = Number(levelInput.value);
 document.getElementById('status').textContent = beachState(level);
 document.getElementById('level-value').value = level.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})+' m';
 beach.toggleAttribute('hidden',level>2);
 if(level<=2){
  const length = 8+Math.min(1,(2-level)/1.4)*140;
  beach.setAttribute('d','M819 596 Q'+(840+length*.65)+' 598 '+(839+length)+' 618 Q'+(832+length*.55)+' 650 816 650 L804 633Z');
 }
 levelInput.setAttribute('aria-valuetext',document.getElementById('level-value').value+' — '+beachState(level));
}
new ResizeObserver(reframe).observe(map);
levelInput.addEventListener('input',updateLevel);
updateLevel();reframe();
</script>
</body>
</html>`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('Boceto Isla Puente integrado. Geografía original preservada.');
