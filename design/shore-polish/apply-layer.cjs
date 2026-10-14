const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const [input,output]=process.argv.slice(2);
assert.ok(input&&output,'Usage: node apply-layer.cjs INPUT.svg OUTPUT.svg');
const source=fs.readFileSync(input,'utf8');
const {replacements}=JSON.parse(fs.readFileSync(path.join(__dirname,'shore-polish-layers.json'),'utf8'));
let svg=source;
for(const layer of replacements){
  const pattern=layer.kind==='path'?new RegExp('<path id="'+layer.id+'"[^>]*\\/>'):new RegExp('<mask id="'+layer.id+'"[\\s\\S]*?<\\/mask>');
  assert.ok(pattern.test(svg),'Missing target: '+layer.id);
  svg=svg.replace(pattern,layer.svg);
}
const protectedTags=[...source.matchAll(/<path id="(?:isla-puente|islote-curupi|costa-parana|costa-santa-fe|road-[^"]+|island-beach)"[^>]*>/g),...source.matchAll(/<circle[^>]*cx="831"[^>]*cy="616"[^>]*>/g)];
for(const [tag] of protectedTags)assert.ok(svg.includes(tag),'Protected geometry or marker changed');
function excludeTargets(markup){for(const layer of replacements){const pattern=layer.kind==='path'?new RegExp('<path id="'+layer.id+'"[^>]*\\/>'):new RegExp('<mask id="'+layer.id+'"[\\s\\S]*?<\\/mask>');markup=markup.replace(pattern,'');}return markup;}
assert.equal(excludeTargets(source),excludeTargets(svg),'Churn outside scoped seven targets');
fs.writeFileSync(output,svg);
console.log('Shore polish applied; seven local targets changed, all other SVG content byte-identical.');
