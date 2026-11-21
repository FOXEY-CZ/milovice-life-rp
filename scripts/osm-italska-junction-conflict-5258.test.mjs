import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaRoadSidewalk5252} from './osm-italska-road-sidewalk-5252.js';
import {createItalskaJunctionGuard5258,inspectItalskaJunctionGuard5258,
 ITALSKA_JUNCTION_GUARD_5258 as C} from './osm-italska-junction-conflict-5258.js';
const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(source).elements;
const way=id=>elements.find(e=>e.id===id);
const roadPlan=planItalskaRoadSidewalk5252({regionId:'mlada',
 road:way(8590284),sidewalk:way(1484073943),defaultWidth:7.8});
assert(roadPlan);
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 y:-p.lat*111320});
function makeSegments(id){
 const g=way(id).geometry;
 return g.slice(1).map((p,i)=>{
  const a=xy(g[i]),b=xy(p);
  return {osmId:id,kind:'residential',a,b,
   width:id===8590284?5:7.8,len:Math.hypot(a.x-b.x,a.y-b.y),
   oneway:0};
 }).filter(s=>s.len>=2.5&&s.len<=175);
}
const narrow=makeSegments(8590284),ital=makeSegments(8585601),
 kastan=makeSegments(1107814416);
const all=[...narrow,...ital,...kastan];
const model=createItalskaJunctionGuard5258({roadPlan,segments:all});
assert(model?.ready);
const meta=inspectItalskaJunctionGuard5258(model);
assert.equal(meta.connectedTJunctions,2);
assert.equal(meta.originalNarrowSegments,8);
assert.deepEqual(meta.mapArms.map(x=>x.count),[3,3]);
assert.deepEqual(meta.mapArms.map(x=>x.namedOSMId),['8585601','1107814416']);
assert.equal(C.stopCenterMetres,5.8);
const start=(s,node)=>Math.hypot(s.a.x-node.x,s.a.y-node.y)<.05;
function actor(id,segment,node,d,toward,speed=7){
 const atStart=start(segment,node),direction=toward?
  (atStart?-1:1):(atStart?1:-1);
 return {id,seg:segment,direction,
  progress:atStart?d/segment.len:1-d/segment.len,speed,
  driven:false,parked:false,trafficTerminal5241:false,service:null};
}
const zone=model.zones[0],n=narrow[0],
 branch=zone.arms.find(a=>a.segment.osmId===8585601).segment;
const first=actor(3,n,zone.node,6.4,true,8);
const second=actor(8,branch,zone.node,8,true,5);
const before=JSON.stringify([first,second]);
let caps=model.evaluate([first,second]);
assert.equal(caps.has(3),false);
assert(Math.abs(caps.get(8)-2.2)<.001,JSON.stringify([...caps]));
assert.equal(JSON.stringify([first,second]),before,'Traffic arbiter must not move cars');
second.progress=start(branch,zone.node)?5.8/branch.len:1-5.8/branch.len;
caps=model.evaluate([first,second]);
assert.equal(caps.get(8),0,'Sticky reservation avoids ETA flip');
const out=zone.arms.find(a=>a.segment.osmId===8585601&&
 a.segment!==branch).segment;
first.seg=out;
first.direction=start(out,zone.node)?1:-1;
first.progress=start(out,zone.node)?3/out.len:1-3/out.len;
caps=model.evaluate([first,second]);
assert.equal(caps.get(8),0,'Occupying vehicle owns the junction');
first.progress=start(out,zone.node)?12/out.len:1-12/out.len;
caps=model.evaluate([first,second]);
assert.equal(caps.has(8),false,'Release only after clearing node');
assert.equal(zone.ownerId,8);
assert(model.audit().yieldFrames>=3);
assert(model.audit().fullStops>=2);
const busModel=createItalskaJunctionGuard5258({roadPlan,segments:all});
const car=actor(10,n,zone.node,6.4,true,5),
 bus={...actor(20,branch,zone.node,9,true,3),service:'432'};
caps=busModel.evaluate([car,bus]);
assert.equal(caps.has(20),false,'Bus remains on legacy movement');
assert(Math.abs(caps.get(10)-.6)<.001);
const parkedModel=createItalskaJunctionGuard5258({roadPlan,segments:all});
assert.equal(parkedModel.evaluate([car,{...bus,parked:true,service:null}]).size,0);
assert.equal(parkedModel.evaluate([{...car,driven:true},bus]).size,0);
assert.equal(createItalskaJunctionGuard5258({roadPlan:{
 ...roadPlan,roadGeometryHash:'drift'},segments:all}),null);
const removed=zone.arms.find(a=>a.segment.osmId===8585601).segment;
assert.equal(createItalskaJunctionGuard5258({roadPlan,
 segments:all.filter(s=>s!==removed)}),null);
assert.equal(createItalskaJunctionGuard5258({roadPlan,
 segments:all.map(s=>s===n?{...s,width:7.8}:s)}),null);
assert.equal(inspectItalskaJunctionGuard5258(null).ready,false);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 'osm-italska-junction-conflict-5258.js?v=525800',
 'createItalskaJunctionGuard5258({',
 'window.__miloviceItalskaJunctionConflictRuntime5258=()=>',
 'const conflictCaps5258=italskaJunctionGuard5258?.evaluate(trafficCars);',
 'conflictCaps5258?.get(obj.id)??Infinity',
 "const BUILD_ID='20261122-italska-junction-yield-525800'"
])assert(html.includes(token),'5.258 integration missing '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),source);
console.log('PASS 5.258: two original 3-way junctions, sticky traffic reservations, old roads/buses/player unchanged');
