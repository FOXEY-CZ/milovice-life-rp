import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {planSchoolGrounds} from './school-grounds-pass.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const roads=createRoadClearance(),world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
for(const el of osm.elements.filter(x=>x.tags?.highway&&x.geometry?.length>1)){
 const k=el.tags.highway,w=k==='primary'?11:k==='secondary'?9:k==='tertiary'?8:
  k==='pedestrian'?4:k==='footway'?1.8:k==='path'||k==='steps'?1.65:
  k==='cycleway'?2:k==='service'?4.5:7.8;
 roads.addRoad({id:el.id,points:el.geometry.map(world),width:w,kind:k});
}
const grounds=planSchoolGrounds(osm.elements,{roadClearance:roads});
assert(grounds?.osmId===118634917);
assert(grounds.fence.length>28&&grounds.fence.length<70);
assert(grounds.metres>40&&grounds.metres<85);
assert(grounds.rejected.gate>0&&grounds.mappedAccessOpen);
assert(grounds.plants.length===4&&grounds.positionSurveyed===false);
for(const f of grounds.fence)for(const p of [f.a,f.b])
 assert(roads.isClear(p.x,p.z,.18,.16),'Fence overlaps a mapped road/footway');
assert.equal(planSchoolGrounds(osm.elements,{roadClearance:null}),null);
assert.equal(planSchoolGrounds(osm.elements.filter(e=>e.id!==118634917),{
 roadClearance:roads}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('makeSchoolGrounds(THREE,')&&
 html.includes('schoolGrounds.create(elements);'));
console.log('5.51 school photo-grounded fence+trees PASS',grounds.fence.length,
 grounds.metres.toFixed(1),grounds.plants.length,grounds.rejected);
