import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot=path.join(root,'public');
const W=1200,H=630,mapY=205,mapHeight=H-mapY;
let map=await fs.readFile(path.join(publicRoot,'map/isla-puente.svg'),'utf8');
const texture=(await fs.readFile(path.join(publicRoot,'map/referencia-estilo.png'))).toString('base64');
const worldWidth=1550,worldHeight=worldWidth*mapHeight/W;
const viewBox=[831-worldWidth*2/3,616-worldHeight*.465,worldWidth,worldHeight].join(' ');
map=map.replace(/viewBox="[^"]+"/,`viewBox="${viewBox}" width="${W}" height="${mapHeight}"`)
  .replaceAll('href="/map/referencia-estilo.png"',`href="data:image/png;base64,${texture}"`);
const mapImage=await sharp(Buffer.from(map)).png().toBuffer();

async function text(value,font,size,filename){
  return sharp({text:{text:value,font:`${font} ${size}`,fontfile:path.join(publicRoot,'fonts',filename),rgba:true,dpi:72}}).png().toBuffer({resolveWithObject:true});
}
const brand=await text('<span foreground="#29362B" weight="800">Isla Puente</span>','Archivo',30,'Archivo-Variable.ttf');
const question=await text('<span foreground="white">¿Hay playa en la punta?</span>','Archivo Black',72,'ArchivoBlack-Regular.ttf');
if(question.info.width>1104) throw new Error('El título OG excede el margen aprobado.');
const forest=await sharp(path.join(publicRoot,'map/title-forest.png')).resize(300,150)
  .extract({left:0,top:0,width:Math.min(300,question.info.width),height:Math.min(150,question.info.height)}).png().toBuffer();
const ink=Buffer.from(`<svg width="${question.info.width}" height="${question.info.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#29362B" opacity=".58"/></svg>`);
const texturedText=await sharp({create:{width:question.info.width,height:question.info.height,channels:4,background:'#29362B'}})
  .composite([{input:forest,tile:true},{input:ink},{input:question.data,blend:'dest-in'}]).png().toBuffer();
const edges=Buffer.from(`<svg width="1200" height="425" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H1200V25C1060 5 980 29 825 27S660 8 520 16S255 35 130 20S48 13 0 7Z" fill="#F5F4E9"/><path d="M0 410C130 420 205 433 360 421S605 416 775 419S1040 410 1200 413V425H0Z" fill="#F5F4E9"/></svg>`);
const dot=Buffer.from(`<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" fill="#4B6245"/></svg>`);
await sharp({create:{width:W,height:H,channels:4,background:'#F5F4E9'}})
  .composite([{input:mapImage,left:0,top:mapY},{input:edges,left:0,top:mapY},{input:brand.data,left:56,top:42},{input:dot,left:56+brand.info.width+13,top:44},{input:texturedText,left:50,top:108}])
  .png().toFile(path.join(publicRoot,'og-isla-puente.png'));
console.log(JSON.stringify({size:[W,H],brand:brand.info.width,heading:question.info.width,liveReading:false,asset:'public/og-isla-puente.png'}));
