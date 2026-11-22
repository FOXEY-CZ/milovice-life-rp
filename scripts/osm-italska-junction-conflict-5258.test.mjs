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
// Multi-frame approach using the actual source OSM branches (traffic-only
// model, not a running browser or a physical collision certification).
const frameModel=createItalskaJunctionGuard5258({roadPlan,segments:all});
const frameZone=frameModel.zones[0];
const frameNarrow=frameZone.arms.find(a=>a.segment.osmId===8590284).segment;
const frameCross=frameZone.arms.find(a=>a.segment.osmId===8585601).segment;
const leader=actor(101,frameNarrow,frameZone.node,2.5,true,.5);
const follower=actor(102,frameCross,frameZone.node,13,true,6);
const frameDt=.1;
const distanceToNode=(car,segment)=>{
 const atBeginning=start(segment,frameZone.node);
 return (atBeginning?car.progress:1-car.progress)*segment.len;
};
let framesYielded=0,minimumFollowerDistance=Infinity;
for(let frame=0;frame<28;frame++){
 const frameCaps=frameModel.evaluate([leader,follower]);
 const allowance=Math.min(leader.speed*frameDt,frameCaps.get(leader.id)??Infinity);
 leader.progress+=leader.direction*allowance/leader.seg.len;
 const otherAllowance=Math.min(follower.speed*frameDt,
  frameCaps.get(follower.id)??Infinity);
 follower.progress+=follower.direction*otherAllowance/follower.seg.len;
 const remaining=distanceToNode(follower,frameCross);
 minimumFollowerDistance=Math.min(minimumFollowerDistance,remaining);
 if(frameCaps.has(follower.id))framesYielded++;
 assert(remaining>=C.stopCenterMetres-1e-6,
  'Conflicting NPC must remain outside the model stop line while first approaches');
}
assert(framesYielded>=20,'Both NPCs should interact during successive snapshots');
assert(Math.abs(minimumFollowerDistance-C.stopCenterMetres)<.001,
 'Conflicting NPC should reach the hold position without crossing it');
assert.equal(frameZone.ownerId,leader.id,'Reservation stays with first approaching NPC');
// Simulate the same leader having passed through to a mapped outbound arm.
const frameExit=frameZone.arms.find(a=>a.segment.osmId===8585601&&
 a.segment!==frameCross).segment;
leader.seg=frameExit;
leader.direction=start(frameExit,frameZone.node)?1:-1;
leader.progress=start(frameExit,frameZone.node)?10/frameExit.len:1-10/frameExit.len;
const afterExit=frameModel.evaluate([leader,follower]);
assert.equal(afterExit.has(follower.id),false,
 'Second NPC can resume after leader is more than 9m beyond mapped node');
assert.equal(frameZone.ownerId,follower.id);
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
 'window.__miloviceItalskaNpcEncounterRuntime5259=()=>',
 "get('npcAudit')==='italska-encounter-5259'",
 "const BUILD_ID='20261122-kastanova-source-setts-526100'"
])assert(html.includes(token),'5.258 integration missing '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),source);
console.log('PASS 5.258: two original 3-way junctions, sticky traffic reservations, old roads/buses/player unchanged');
