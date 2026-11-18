// Milovice RP 5.138 – verify six exact OSM ways and inside-road bend seals.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPrubeznaStreetBendSeals,PRUBEZNA_BENDS_5138}
 from './osm-prubezna-bends-5138.js';
import {planMappedRoadWidth} from './osm-road-width-5108.js';
const raw=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const ways=raw.elements.filter(e=>e.tags?.highway);
const cos=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const widths=new Map(ways.map(w=>[String(w.id),
 planMappedRoadWidth(w.tags,w.tags.highway==='residential'?7.8:4.5,'mlada').width]));
const original=JSON.stringify(ways);
const plan=planPrubeznaStreetBendSeals({
 regionId:'mlada',ways,widths,toWorld
});
assert(plan,'Must select the six source-exact roads');
assert.equal(plan.version,'5.138');
assert.equal(plan.sourceWayCount,6);
assert.equal(plan.plannedBendSeals,18);
assert.deepEqual(plan.byStreet,{Průběžná:4,Sportovní:14});
assert.equal(plan.sourceWays.length,6);
assert.equal(plan.sourceMainStreetId,'83076189');
assert.equal(JSON.stringify(ways),original);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
for(const wedge of plan.wedges){
 const way=ways.find(w=>String(w.id)===wedge.sourceWayId);
 assert(way,'Every seal must point to an existing way');
 assert.equal(way.tags.name,wedge.street);
 assert.equal(wedge.width,widths.get(wedge.sourceWayId));
 assert.equal(wedge.newRoadSegment,false);
 const sourcePoint=way.geometry[wedge.sourceVertexIndex];
 assert.deepEqual(wedge.sourceGPS,sourcePoint);
 const v=toWorld(sourcePoint);
 assert(dist(wedge.c,v)<.00000001);
 assert(Math.abs(dist(wedge.a,v)-wedge.width/2)<.00000001);
 assert(Math.abs(dist(wedge.b,v)-wedge.width/2)<.00000001);
 const cross=(wedge.a.x-v.x)*(wedge.b.z-v.z)-
  (wedge.b.x-v.x)*(wedge.a.z-v.z);
 assert(Math.abs(.5*Math.abs(cross)-wedge.areaSquareMeters)<.001);
 assert(wedge.areaSquareMeters>=.08&&wedge.areaSquareMeters<=13);
}
assert.deepEqual(plan.wedges,planPrubeznaStreetBendSeals({
 regionId:'mlada',ways:ways.slice().reverse(),widths,toWorld
}).wedges,'Reversing import order must not move the corners');
for(const expected of PRUBEZNA_BENDS_5138.sources){
 const originalWay=ways.find(w=>String(w.id)===expected.id);
 for(const corrupt of [
  w=>({...w,tags:{...w.tags,name:'Other'}}),
  w=>({...w,tags:{...w.tags,access:'private'}}),
  w=>({...w,geometry:w.geometry.map((p,i)=>i===1?
    {...p,lon:p.lon+.0000002}:p)}),
  w=>({...w,geometry:w.geometry.slice(1)})
 ]){
  const edited=ways.map(w=>String(w.id)===expected.id?corrupt(w):w);
  assert.equal(planPrubeznaStreetBendSeals({
   regionId:'mlada',ways:edited,widths,toWorld
  }),null,'Changed OSM source must fail closed: '+expected.id);
 }
 assert(originalWay);
}
for(const patch of [{regionId:'vrutice'},{widths:new Map()},
 {maxWedges:-1},{toWorld:null}]){
 assert.equal(planPrubeznaStreetBendSeals({
  regionId:'mlada',ways,widths,toWorld,...patch
 }),null);
}
for(const key of ['addedRoads','addedColliders','addedSidewalks',
 'addedCrossings','addedParkingSpaces','addedStreetLamps','queuedStandaloneMeshes'])
 assert.equal(plan[key],0);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-prubezna-bends-5138.js?v=513800'",
 'const prubeznaBendPlan=planPrubeznaStreetBendSeals({',
 'for(const wedge of prubeznaBendPlan?.wedges||[])',
 'window.__milovicePrubeznaBendsRuntime=()=>({',
 "'prubezna-bends-west-5138':{",
 "'prubezna-bends-east-5138':{",
 'streetAudit=prubezna-bends-west-5138',
 'streetAudit=prubezna-bends-east-5138'
])assert(html.includes(part),'Missing in-game bend renderer: '+part);
console.log('PASS 5.138 Průběžná/Sportovní OSM: six exact existing residential roads, 18 inside-bend seals, 0 added roads or furniture');
