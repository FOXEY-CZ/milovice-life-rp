import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {TOPOLOVA_CONNECTED_5164,planTopolovaConnectedWalk5164,
 makeTopolovaConnectedRoute5164,sampleTopolovaConnectedRoute5164,
 advanceTopolovaConnectedRoute5164} from './osm-topolova-connected-5164.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const original=JSON.stringify(elements);
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
assert(rowPlan&&shortWalkPlan&&promenadePlan);
const params={regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways};
const plan=planTopolovaConnectedWalk5164(params);
assert(plan,'source-locked GPS line from driveway via corner to long promenade');
assert.equal(plan.originalWorldNodeCount,11);
assert.deepEqual(plan.sourceWayIds,['1316882860','1316882852']);
assert.equal(plan.junctionNodeIndex,1);
assert.equal(plan.contiguousOriginalWayTransitions,1);
assert.equal(plan.modelsSimulated,1);
assert(plan.originalOSMRouteMeters>196&&plan.originalOSMRouteMeters<198);
assert(plan.navigableRouteMeters>190&&plan.navigableRouteMeters<192);
assert.equal(plan.routeInternalTurns,9);
for(const field of ['newPavementMeshes','createdRoads','createdCrossings',
 'createdEntrances','createdColliders','createdStreetProps'])
 assert.equal(plan[field],0,field);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const route=makeTopolovaConnectedRoute5164(plan,toWorld);
assert(route);
assert.equal(route.segments.length,10);
assert(Math.abs(route.length-plan.navigableRouteMeters)<.12);
assert(route.junctionDistance>27&&route.junctionDistance<28);
assert.equal(route.segments[0].sourceWayId,'1316882860');
assert(route.segments.slice(1).every(x=>x.sourceWayId==='1316882852'));
for(let i=1;i<route.segments.length;i++){
 const last=route.segments[i-1],next=route.segments[i];
 assert(Math.hypot(last.b.x-next.a.x,last.b.z-next.a.z)<1e-8,
  'No teleport across actual OSM nodes');
}
const south=sampleTopolovaConnectedRoute5164(route,route.junctionDistance-.4);
const north=sampleTopolovaConnectedRoute5164(route,route.junctionDistance+.4);
assert(south.onSpur);
assert(!north.onSpur);
assert(Math.hypot(south.x-north.x,south.z-north.z)<.85);
const turn=advanceTopolovaConnectedRoute5164(route,
 route.junctionDistance-.7,1,2.2);
assert(turn.segmentIndex===1);
assert.equal(turn.sourceWayId,'1316882852');
assert.equal(turn.bounces,0);
const end=advanceTopolovaConnectedRoute5164(route,route.length-.3,1,1.5);
assert.equal(end.direction,-1);
assert.equal(end.bounces,1);
assert(end.distance<route.length);
const reverse=advanceTopolovaConnectedRoute5164(route,.4,-1,2);
assert.equal(reverse.direction,1);
assert.equal(reverse.bounces,1);
assert(!sampleTopolovaConnectedRoute5164(route,Infinity));
for(const change of [
 {regionId:'old'},
 {rowPlan:{...rowPlan,contiguousExactSharedPartyWalls:2}},
 {shortWalkPlan:{...shortWalkPlan,sourceFootwayHash:'other'}},
 {promenadePlan:{...promenadePlan,version:'5.162'}},
 {ways:ways.filter(w=>String(w.id)!=='1316882860')},
 {ways:ways.map(w=>String(w.id)==='1316882852'?{...w,
  geometry:w.geometry.map((p,i)=>i===18?{...p,lat:p.lat+.0000001}:p)}:w)},
 {ways:ways.map(w=>String(w.id)==='202399863'?{...w,
  tags:{...w.tags,service:'parking_aisle'}}:w)}
])assert.equal(planTopolovaConnectedWalk5164({...params,...change}),null);
assert.equal(JSON.stringify(elements),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-topolova-connected-5164.js?v=516400'",
 'const topolovaConnectedPlan=planTopolovaConnectedWalk5164({',
 'function rpSpawnTopolovaConnected5164(){',
 'rpSpawnTopolovaConnected5164();',
 'window.__miloviceTopolovaConnectedRuntime=()=>{',
 "'topolova-connected-5164':{",
 'if(obj.connectedRoute5164){'
])assert(html.includes(key),'Missing 5.164 game integration: '+key);
console.log('PASS 5.164: 197m 2-OSM-way continuous route, 10 physically connected segments, genuine 90-degree turn without road crossing or scene geometry');
