import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPerimeterRoofEaves} from './station-roof-eaves.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const item=osm.elements.find(e=>e.id===118487979);
assert(item);
const latScale=111320,lonScale=111320*Math.cos(50.226*Math.PI/180);
const polygon=item.geometry.map(p=>({x:(p.lon-14.889)*lonScale,z:-(p.lat-50.226)*latScale}));
if(Math.hypot(polygon[0].x-polygon.at(-1).x,polygon[0].z-polygon.at(-1).z)<.05)polygon.pop();
const roof={roofModel:'perimeter-constrained',eaveY:11.32};
const run=(pts,w)=>planPerimeterRoofEaves({outline:pts,originalOutline:pts,roof,width:w,thickness:.13});
const full=run(polygon,.26);
assert(full,'Complex 22-wall school needs sealed photographed roof eaves');
assert.equal(full.exteriorEdges,22,'No mapped exterior school eaves may disappear');
assert(full.tiles.length>=44&&full.fascia.length>=44&&full.soffit.length>=44);
assert(full.closedUnderside&&full.onlyMappedExterior);
assert(full.maxActualOverhang>=.25&&full.maxActualOverhang<=.50);
const reverse=run([...polygon].reverse(),.26);
assert(reverse&&reverse.exteriorEdges===22,'Reverse OSM winding must retain photo eaves');
assert(Math.abs(reverse.maxActualOverhang-full.maxActualOverhang)<.03);
for(const group of [full.tiles,full.fascia,full.soffit])
 for(const tri of group)for(const v of tri)
  assert([v.x,v.y,v.z,v.u,v.v].every(Number.isFinite),'Finite real eave geometry');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('Milovice_school_photo_eave_fascia'));
assert(html.includes('planPerimeterRoofEaves({'));
// Regression 5.48: actual mapped Milovice house 202775821 has a sharp
// corner that formerly caused the physical roof-eave mesh to vanish.
const house=osm.elements.find(x=>x.id===202775821);
assert(house&&house.geometry?.length>3);
const corners=house.geometry.map(p=>({
 x:(p.lon-14.889)*lonScale,z:-(p.lat-50.226)*latScale
}));
if(Math.hypot(corners[0].x-corners.at(-1).x,corners[0].z-corners.at(-1).z)<.05)corners.pop();
const sharp=[{x:0,z:0},{x:14,z:0},{x:1,z:2}];
for(const [name,shape] of [
 ['OSM acute 202775821',corners],
 ['OSM acute reversed',[...corners].reverse()],
 ['synthetic acute triangle',sharp]
]){
 const eaves=run(shape,.26);
 assert(eaves&&eaves.exteriorEdges===shape.length,
  name+' must retain every visible source eave');
 assert(eaves.tiles.length===shape.length*2&&eaves.maxActualOverhang<=.468001,
  name+' has missing or excessively protruding roof geometry');
 for(let i=0;i<shape.length;i++){
  const c=eaves.tiles[2*i][2],d=eaves.tiles[2*((i+1)%shape.length)+1][2];
  assert(Math.hypot(c.x-d.x,c.y-d.y,c.z-d.z)<1e-5,
   name+' has a disconnected outer eave corner');
 }
 for(const tri of [...eaves.tiles,...eaves.fascia,...eaves.soffit])
  assert(tri.every(p=>[p.x,p.y,p.z].every(Number.isFinite)));
}
assert.equal(run(sharp,NaN),null,'Non-finite eave width is invalid');

console.log('5.48 real-world school roof eaves:',JSON.stringify({
 perimeter:polygon.length,exterior:full.exteriorEdges,tiles:full.tiles.length,
 fascia:full.fascia.length,width:full.width,overhang:full.maxActualOverhang
}));
