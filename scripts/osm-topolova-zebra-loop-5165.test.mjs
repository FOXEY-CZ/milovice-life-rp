import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165,makeTopolovaZebraLoop5165,
 sampleTopolovaZebraLoop5165,advanceTopolovaZebraLoop5165}
 from './osm-topolova-zebra-loop-5165.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const snapshot=JSON.stringify(elements);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({
 regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways
});
assert(rowPlan&&shortWalkPlan&&promenadePlan&&connectedPlan);
const params={regionId:'mlada',connectedPlan,promenadePlan,ways};
const plan=planTopolovaZebraLoop5165(params);
assert(plan,'source-locked two real zebras and two original pavements');
assert.equal(plan.actualOSMNodeCount,7);
assert.equal(plan.originalSegmentCount,6);
assert.deepEqual(plan.sourceWayIds,[
 '1316882852','1316882854','1314665579','1316882853'
]);
assert(plan.originalLoopMetres>222&&plan.originalLoopMetres<224);
assert.equal(plan.actualMarkedCrossings,2);
assert.equal(plan.originalCrossingSegments,4);
assert.equal(plan.simulatedPedestrians,1);
assert.equal(plan.carsDoNotYieldToNewWalkerYet,true);
for(const key of ['createdCrossings','createdFootways','createdRoads',
 'createdEntrances','createdColliders','createdProps'])
 assert.equal(plan[key],0,key);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const route=makeTopolovaZebraLoop5165(plan,toWorld);
assert(route);assert.equal(route.segments.length,6);
assert.equal(route.newGeometry,0);
assert(Math.abs(route.length-plan.originalLoopMetres)<.12);
for(let i=0;i<route.segments.length;i++){
 const s=route.segments[i],next=route.segments[(i+1)%6];
 assert(Math.hypot(s.b.x-next.a.x,s.b.z-next.a.z)<1e-8,
  'No teleport at OSM intersections or loop boundary');
}
const firstCross=route.segments[1];
assert.equal(firstCross.sourceWayId,'1316882854');
assert.equal(firstCross.isCrossing,true);
const nearCross=sampleTopolovaZebraLoop5165(route,route.segments[0].endMetres-.4);
assert.equal(nearCross.isCrossing,false);
const onCross=advanceTopolovaZebraLoop5165(route,nearCross.distance,2);
assert.equal(onCross.sourceWayId,'1316882854');
assert.equal(onCross.isCrossing,true);
const onWest=advanceTopolovaZebraLoop5165(route,nearCross.distance,12.3);
assert.equal(onWest.sourceWayId,'1314665579');
assert.equal(onWest.isCrossing,false);
const onNorth=sampleTopolovaZebraLoop5165(route,route.segments[4].startMetres+.2);
assert.equal(onNorth.sourceWayId,'1316882853');
assert.equal(onNorth.isCrossing,true);
const afterLap=advanceTopolovaZebraLoop5165(route,route.length-.1,.2);
assert.equal(afterLap.laps,1);
assert.equal(afterLap.sourceWayId,'1316882852');
assert(Math.hypot(
 sampleTopolovaZebraLoop5165(route,route.length-.001).x-
 sampleTopolovaZebraLoop5165(route,route.length+.001).x,
 sampleTopolovaZebraLoop5165(route,route.length-.001).z-
 sampleTopolovaZebraLoop5165(route,route.length+.001).z)<.01);
for(const change of [
 {regionId:'old'},
 {connectedPlan:{...connectedPlan,version:'5.163'}},
 {promenadePlan:{...promenadePlan,version:'5.162'}},
 {ways:ways.filter(w=>String(w.id)!=='1314665579')},
 {ways:ways.map(w=>String(w.id)==='1314665579'?{...w,
   geometry:w.geometry.map((p,i)=>i===13?{...p,lon:p.lon+.0000001}:p)}:w)},
 {ways:ways.map(w=>String(w.id)==='1316882854'?{...w,
   tags:{...w.tags,crossing:'no'}}:w)},
 {ways:ways.map(w=>String(w.id)==='8618275'?{...w,
   geometry:w.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}:w)}
])assert.equal(planTopolovaZebraLoop5165({...params,...change}),null);
assert.equal(JSON.stringify(elements),snapshot);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-topolova-zebra-loop-5165.js?v=516500'",
 'const topolovaLoopPlan=planTopolovaZebraLoop5165({',
 'function rpSpawnTopolovaLoop5165(){',
 'rpSpawnTopolovaLoop5165();',
 'window.__miloviceTopolovaLoopRuntime=()=>{',
 "'topolova-loop-5165':{",
 'if(obj.zebraLoop5165){'
])assert(html.includes(key),'Missing 5.165 integration '+key);
console.log('PASS 5.165 two-zebra 222.74m real OSM pedestrian loop, source-lock/continuity, no new street geometry');
