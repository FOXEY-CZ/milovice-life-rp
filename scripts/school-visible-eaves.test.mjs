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
console.log('5.47 real-world school roof eaves:',JSON.stringify({
 perimeter:polygon.length,exterior:full.exteriorEdges,tiles:full.tiles.length,
 fascia:full.fascia.length,width:full.width,overhang:full.maxActualOverhang
}));
