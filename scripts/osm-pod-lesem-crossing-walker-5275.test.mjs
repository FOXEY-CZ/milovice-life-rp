import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPodLesemCross5270} from './osm-pod-lesem-municipal-crossing-5270.js';
import {SOURCE5275,planPodLesemWalker5275 as plan,
 advancePodLesemWalker5275 as advance,
 podLesemVehicleThreat5276 as threat} from './osm-pod-lesem-crossing-walker-5275.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements,snapshot=JSON.stringify(E);
const crossing=planPodLesemCross5270({regionId:'mlada',ways:E});
const opts={regionId:'mlada',ways:E,crossing},p=plan(opts);
assert(p,'source-locked 5.274 model zebra and mapped sidewalk');
assert.equal(p.version,'5.275');
assert.equal(p.sourceFootwayId,SOURCE5275.walkId);
assert.equal(p.sourceRoadId,SOURCE5275.roadId);
assert.equal(p.sourceFootwayHash,'263e12b3');
assert.deepEqual(p.sourceSharedGPS,{lat:50.2285685,lon:14.8727322});
assert.equal(p.crossingAt,11);assert.equal(p.totalMetres,22);
assert.equal(p.roadAccess,'no');assert.equal(p.originalFootwayLegs,2);
assert.equal(p.predictiveVehicleSafety5276,true);
assert.equal(p.forecastSeconds5276,4);
assert(p.modelOnly&&!p.paintSurveyed&&p.originalGPSUnchanged&&
 p.originalGraphUnchanged);
for(const name of ['newFootways','newRoads','newCrossings','newColliders',
 'newPavementMeshes'])assert.equal(p[name],0);
const d=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
assert(Math.abs(d(p.a,p.center)-11)<1e-5);
assert(Math.abs(d(p.b,p.center)-11)<1e-5);
const center=advance(p,10,1,1);
assert(d(center,p.center)<1e-7&&center.onZebra);
const car={x:p.center.x,z:p.center.z};
const block=advance(p,6.7,1,1,[car]);
assert(block.waitingForVehicle&&block.distance<=11-p.crossingHalfWidth);
assert(!advance(p,block.distance,1,1,[]).waitingForVehicle);
const reverse=advance(p,15.3,-1,1,[car]);
assert(reverse.waitingForVehicle&&reverse.distance>=11+p.crossingHalfWidth);
assert(!advance(p,6.7,1,1,[{x:p.center.x+30,z:p.center.z}]).waitingForVehicle);
// 5.276 forecast: car currently far away, but will enter the junction
// during the pedestrian's approach. The legacy 6.2m radius missed it.
const incoming={x:p.center.x+20,z:p.center.z,vx:-5,vz:0};
assert(threat(p,incoming),'moving vehicle will reach zebra inside forecast');
assert(advance(p,6.7,1,1,[incoming]).waitingForVehicle,
 'the pedestrian must wait BEFORE stepping onto the crossing');
assert(advance(p,15.3,-1,1,[incoming]).waitingForVehicle,
 'the mirrored approach must obey the same predicted car');
const outbound={...incoming,vx:5};
assert(!threat(p,outbound),'vehicle moving away must not stop the walker');
assert(!advance(p,6.7,1,1,[outbound]).waitingForVehicle);
assert(!threat(p,{x:p.center.x+40,z:p.center.z,vx:-2,vz:0}),
 'a vehicle many seconds away is not a blocker');
assert(!threat(p,{x:p.center.x+20,z:p.center.z,vx:80,vz:0}),
 'teleport/jitter velocity must not be treated as real traffic');
assert(threat(p,{x:p.center.x,z:p.center.z}),
 'a stationary close car remains blocked as in 5.275');
// Don't freeze a person who is ALREADY crossing when a car arrives.
const committed=advance(p,p.crossingAt,1,.3,[incoming]);
assert(committed&&!committed.waitingForVehicle&&committed.distance>p.crossingAt,
 'finish a started crossing, never stop halfway in front of the car');
assert.equal(threat(p,{x:NaN,z:0,vx:0,vz:0}),false);
assert.equal(threat(p,incoming,8),false,'reject excessively long forecasts');
let at=6.8,heading=1,entered=0,last=false;
for(let i=0;i<300;i++){
 const next=advance(p,at,heading,.1);
 assert(next&&Number.isFinite(next.x)&&Number.isFinite(next.z));
 if(next.onZebra&&!last)entered++;
 last=next.onZebra;at=next.distance;heading=next.direction;
}
assert(entered>0,'walker traverses existing mapped axis');
assert.equal(plan({...opts,regionId:'old'}),null);
for(const id of [SOURCE5275.walkId,SOURCE5275.roadId]){
 const orig=E.find(w=>String(w.id)===id);
 assert.equal(plan({...opts,ways:E.filter(w=>String(w.id)!==id)}),null);
 assert.equal(plan({...opts,ways:[...E,orig]}),null);
 assert.equal(plan({...opts,ways:E.map(w=>String(w.id)===id?
  {...w,geometry:w.geometry.map((v,i)=>i===1?{...v,lon:v.lon+.0000001}:v)}:w)}),null);
}
assert.equal(plan({...opts,crossing:{...crossing,version:'5.273'}}),null);
assert.equal(JSON.stringify(E),snapshot);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const item of ["from './scripts/osm-pod-lesem-crossing-walker-5275.js?v=527500'",
 'planPodLesemWalker5275({','rpSpawnPodLesemWalker5275(area.id);',
 'advancePodLesemWalker5275(', 'if(obj.podLesemWalker5275){',
 "window.__milovicePodLesemWalkerRuntime5275=()=>({",
 "'pod-lesem-pedestrian-5275':{",
 "const BUILD_ID='20261122-pod-lesem-predictive-yield-527600'"])
 assert(html.includes(item),'5.275 integration '+item);
console.log('PASS 5.276 Pod Lesem pedestrian predicts approaching road vehicles before curb entry; source-locked geometry and no new routes');
