import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyFacadeEdgeLength} from './facade-perimeter.js';
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
assert(hero.includes('chunk.walls.push(shortWall)'));
assert(hero.includes('state.shortWallSegmentsSealed++'));
assert(!hero.includes('if(len<3||len>70)continue'));
console.log(JSON.stringify({audited:buildings.length,shortReturns,shortBuildings,detailed,degenerate,
 skolskaShortReturnMetres:segments.find(l=>l>1&&l<1.5)},null,2));
console.log('Roof-wall perimeter closure across Milovice: short wall returns always solid PASS');
