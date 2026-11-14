import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyFacadeEdgeLength,planFacadePerimeterTrims} from './facade-perimeter.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const buildings=osm.elements.filter(el=>el.tags?.building&&el.geometry?.length>=3);
assert.equal(buildings.length,684);
let shortReturns=0,detailed=0,degenerate=0,shortBuildings=0;
const cos=Math.cos(50.226*Math.PI/180);
for(const b of buildings){
 const points=b.geometry;
 const count=points.length>3&&
  points[0].lat===points.at(-1).lat&&
  points[0].lon===points.at(-1).lon?points.length-1:points.length;
 let own=0;
 for(let i=0;i<count;i++){
  const p=points[i],q=points[(i+1)%count];
  const length=Math.hypot((p.lon-q.lon)*111320*cos,(p.lat-q.lat)*111320);
  const kind=classifyFacadeEdgeLength(length);
  if(kind==='solid-return'){shortReturns++;own++;}
  else if(kind==='detailed')detailed++;
  else degenerate++;
 }
 if(own)shortBuildings++;
}
// Every valid wall edge must receive the SAME continuous plinth and upper
// trim, including newly repaired returns shorter than 3m and reversed rings.
// This audits the complete OSM core, not only a hardcoded house ID.
let plannedBands=0,plannedShortBands=0,totalTrimMetres=0;
for(const building of buildings){
 const raw=building.geometry.map(p=>({
  x:(p.lon-14.889)*111320*cos,z:-(p.lat-50.226)*111320
 }));
 if(raw.length>3&&Math.hypot(raw[0].x-raw.at(-1).x,
  raw[0].z-raw.at(-1).z)<.05)raw.pop();
 const centroid={x:raw.reduce((sum,p)=>sum+p.x,0)/raw.length,
  z:raw.reduce((sum,p)=>sum+p.z,0)/raw.length};
 for(let i=0;i<raw.length;i++){
  const a=raw[i],b=raw[(i+1)%raw.length];
  const len=Math.hypot(b.x-a.x,b.z-a.z),kind=classifyFacadeEdgeLength(len);
  const trims=planFacadePerimeterTrims(a,b,centroid,{base:17,height:3.75});
  if(kind==='degenerate'){
   assert.equal(trims,null,'Degenerate lines cannot receive ornaments');
   continue;
  }
  assert(trims,'Missing facade trim on OSM '+building.id+' edge '+i);
  assert(['base','sill'].every((k,j)=>[trims.base,trims.upper][j].kind===k));
  assert(trims.base.width>=len&&trims.upper.width>=len);
  assert(trims.base.width<=len+.321&&trims.upper.width<=len+.321);
  assert(Math.abs(trims.base.y-(17+.23))<1e-8);
  assert(Math.abs(trims.upper.y-(17+3.75-.12))<1e-8);
  assert([trims.base,trims.upper].every(band=>
   [band.x,band.y,band.z,band.width,band.depth,band.yaw].every(Number.isFinite)));
  // Neither the reversed polygon nor opposite wall traversal may change
  // which side of the masonry carries the exterior bands.
  const back=planFacadePerimeterTrims(b,a,centroid,{base:17,height:3.75});
  assert(Math.abs(back.nx-trims.nx)<1e-8&&Math.abs(back.nz-trims.nz)<1e-8);
  if(kind==='solid-return')plannedShortBands++;
  totalTrimMetres+=len;plannedBands++;
 }
}
assert(plannedBands>1500&&plannedShortBands>20);
assert(totalTrimMetres>10000);
const skolska=buildings.find(b=>b.id===118487980);
assert(skolska);
const pts=skolska.geometry;
const segments=pts.slice(0,-1).map((p,i)=>{
 const q=pts[(i+1)%(pts.length-1)];
 return Math.hypot((p.lon-q.lon)*111320*cos,(p.lat-q.lat)*111320);
});
assert(segments.some(l=>l>1&&l<1.5),'Real Školská OSM has a ~1.2m return wall');
assert(segments.some(l=>classifyFacadeEdgeLength(l)==='solid-return'));
assert.equal(classifyFacadeEdgeLength(1.203),'solid-return');
assert.equal(classifyFacadeEdgeLength(2.999),'solid-return');
assert.equal(classifyFacadeEdgeLength(3),'detailed');
assert.equal(classifyFacadeEdgeLength(0),'degenerate');
assert.equal(classifyFacadeEdgeLength(71),'degenerate');
assert(shortReturns>20&&shortBuildings>15,
 'Several mapped Milovice buildings have short wall segments, never leave them open');
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
assert(hero.includes("wallKind==='solid-return'"));
assert(hero.includes('const edgeFrame=exteriorFacadeFrame(pts,sideIndex);'));
assert(hero.includes('const trim=planFacadePerimeterTrims(a,b,centroid,{base,height,frame:edgeFrame});'));
assert(hero.includes('RECESSED_GLAZING'));
assert(hero.includes('flushBoxOffset(.32)'));
assert(hero.includes('addBand(trim.base);')&&hero.includes('addBand(trim.upper);'));
assert(hero.includes('state.trimmedShortReturns++'));
assert(hero.includes('if(len<.08)return null;'),
 'Sub-metre valid short returns need solid walls as well as both trim bands');
assert(!hero.includes('if(len<1)return null;'),
 'The old 1m limit left roof-to-wall gaps on micro-returns');
assert(hero.indexOf('addBand(trim.base);')<hero.indexOf("if(wallKind==='solid-return'){"),
 'Repair trims must be emitted BEFORE the early-return short-wall branch');
assert.equal(hero.split('addBand(trim.base);').length,2,'Avoid duplicate base bands');
assert.equal(hero.split('addBand(trim.upper);').length,2,'Avoid duplicate cornices');
assert(hero.includes('chunk.walls.push(shortWall)'));
assert(hero.includes('state.shortWallSegmentsSealed++'));
assert(!hero.includes('if(len<3||len>70)continue'));
console.log(JSON.stringify({audited:buildings.length,shortReturns,shortBuildings,detailed,degenerate,
 skolskaShortReturnMetres:segments.find(l=>l>1&&l<1.5)},null,2));
// Legacy (non-hero) fallback: formerly len<5 skipped every band.
const world=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(!world.includes('if(len<5||len>90)continue'),
 'No short mapped facade edge may be dropped before its trim is considered');
assert(world.includes('if(len<5){')&&
 world.includes("archPart('foundationBand',mx+nx*flushBoxOffset(.10),baseHeight+.52"),
 'Existing non-hero foundation band must continue on short returns');
assert(world.includes('window.__miloviceLegacyFacadeBandAudit'),
 'Instrument the fallback renderer for missing short-edge trim');
console.log('Roof-wall facade closure across Milovice: short return and continuous base/cornice bands PASS',JSON.stringify({plannedBands,plannedShortBands,totalTrimMetres:Math.round(totalTrimMetres)}));
