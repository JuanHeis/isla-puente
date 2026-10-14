const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const [input,output]=process.argv.slice(2);
assert.ok(input&&output,'Usage: node apply-layer.cjs INPUT.svg OUTPUT.svg');
const layers=JSON.parse(fs.readFileSync(path.join(__dirname,'delight-layers.json'),'utf8'));
const source=fs.readFileSync(input,'utf8');
assert.ok(!source.includes('id="vegetation-'),'Use a preDELIGHT source; layer already applied');
let svg=source;
for(const [tag,id]of[['filter','shore-water-soften'],['mask','shore-water-only'],['linearGradient','shore-water-tint']])svg=svg.replace(new RegExp('<'+tag+' id="'+id+'"[\\s\\S]*?</'+tag+'>'),'');
svg=svg.replace(/<path id="leaf-edge-[ab]"[^>]*\/>/g,'');
svg=svg.replace(/<g id="island-edge-leaves"[\s\S]*?<\/g>/,'');
svg=svg.replace('</defs>',layers.defs+'</defs>');
assert.ok(/<g id="shore-water-transition"/.test(svg),'Previous water group missing');
svg=svg.replace(/<g id="shore-water-transition"[\s\S]*?<\/g>/,layers.water);
svg=svg.replace(/<g id="river-ripples"[\s\S]*?<\/g>/,layers.waves);
for(const id of layers.canopyWrappers){
  const match=svg.match(new RegExp('<path id="'+id+'"[^>]*>\\s*<image[^>]*>'))?.[0];
  assert.ok(match,'Approved path/image pair missing: '+id);
  const clean=match.replace(/ clip-path="url\(#texture(?:Puente|Curupi)\)"/,'');
  svg=svg.replace(match,'<g id="vegetation-'+id+'" mask="url(#canopy-'+id+')">'+clean+'</g>'+layers.edgeTextures[id]);
}
const coast=svg.match(/<path id="costa-parana"[^>]*>/)[0];
svg=svg.replace(coast,coast+layers.coastVegetation);
const palette=layers.palette;
svg=svg.replace(/<linearGradient id="rio"[\s\S]*?<\/linearGradient>/,tag=>tag.replace(/stop-color="[^"]+"/g,'stop-color="'+palette.river+'"'));
svg=svg.replace(/<circle id="punta-playa"[^>]*\/>/,'<circle id="punta-playa" cx="831" cy="616" r="'+palette.outerRadius+'" fill="'+palette.outerMarker+'"/>');
svg=svg.replace(/<circle cx="831" cy="616"[^>]*\/>/,'<circle cx="831" cy="616" r="'+palette.innerRadius+'" fill="'+palette.innerMarker+'"/>');
for(const id of ['isla-puente','islote-curupi','costa-parana','costa-santa-fe']){
  const tag=source.match(new RegExp('<path id="'+id+'"[^>]*>'))[0];
  assert.ok(svg.includes(tag),'Approved geometry changed: '+id);
}
const roads=[...source.matchAll(/<path id="road-[^"]+"[^>]*>/g)];for(const[road]of roads)assert.ok(svg.includes(road),'Road changed');
assert.ok(svg.includes('<path id="island-beach" fill="#D8BC82" hidden/>'));
fs.writeFileSync(output,svg);
console.log('Delight applied. '+roads.length+' road paths and four base contours unchanged.');
