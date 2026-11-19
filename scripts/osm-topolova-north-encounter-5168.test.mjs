import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165,makeTopolovaZebraLoop5165,
 sampleTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
import {planTopolovaPriority5166,makeTopolovaPriority5166,
 topolovaApproach5166,topolovaIntent5166,topolovaYieldCar5166,
 topolovaWaitAtCurb5166} from './osm-topolova-priority-5166.js';
import {planTopolovaNorthEncounter5168} from './osm-topolova-north-encounter-5168.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const immutable=JSON.stringify(elements);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',
 ways:elements.filter(e=>e.tags?.building&&e.geometry)});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({
 regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways});
const loopPlan=planTopolovaZebraLoop5165({regionId:'mlada',connectedPlan,promenadePlan,ways});
const priorityPlan=planTopolovaPriority5166({regionId:'mlada',loopPlan,ways});
assert(loopPlan&&priorityPlan);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const control=makeTopolovaPriority5166(priorityPlan,world);
const route=makeTopolovaZebraLoop5165(loopPlan,world);
assert(control&&route);
const driveSegments=control.roadSegments.map(s=>({
 osmId:priorityPlan.roadId,len:s.len,oneway:0,width:6.5,
 a:{x:s.a.x,y:s.a.z},b:{x:s.b.x,y:s.b.z}
}));
const args={regionId:'mlada',priorityPlan,control,route,driveSegments};
const north=planTopolovaNorthEncounter5168(args);
assert(north,'actual OSM source-locked north encounter plan must succeed');
assert.equal(north.version,'5.168');
assert.equal(north.sourceRoadHash,'c0fe69b0');
assert.equal(north.sourceCrossingId,'1316882853');
assert.equal(north.sourceRoadId,'8618275');
assert.equal(north.testCars,2);
assert.equal(north.actorTestStartRepositioned,true);
assert.equal(north.vehiclesOnlyWithAuditQuery,true);
assert.equal(north.usesExistingRoadGeometry,true);
assert.deepEqual(north.cars.map(x=>x.roadSegmentIndex),[1,2]);
assert.deepEqual(north.cars.map(x=>x.direction),[1,-1]);
assert.equal(north.cars[0].segment,driveSegments[1]);
assert.equal(north.cars[1].segment,driveSegments[2]);
for(const k of ['newRoads','newCrossings','newSidewalks','newColliders',
 'newEntrances','newStreetProps'])assert.equal(north[k],0,k);
for(const entry of north.cars){
 assert.equal(entry.initialAheadMetres,13.5);
 const car={seg:entry.segment,direction:entry.direction,
  progress:entry.progress,parked:false,driven:false};
 const approach=topolovaApproach5166(control,car);
 assert.equal(approach?.key,'north');
 assert(Math.abs(approach.distanceAhead-13.5)<.001);
 const intent=topolovaIntent5166(control,route,north.actorStartDistanceMetres);
 assert.equal(intent?.key,'north');
 assert.equal(intent.onCrossing,false);
 assert.equal(topolovaYieldCar5166(control,car,intent,.05).yielding,true);
}
const initial=sampleTopolovaZebraLoop5165(route,north.actorStartDistanceMetres);
assert.equal(initial?.sourceWayId,'1314665579');
assert.equal(initial.segmentIndex,3);
assert(Math.abs(north.northGateMetres-north.actorStartDistanceMetres-.7)<.001);
const cars=north.cars.map(entry=>({
 seg:entry.segment,direction:entry.direction,progress:entry.progress,
 parked:false,driven:false
}));
const wait=topolovaWaitAtCurb5166(control,route,north.actorStartDistanceMetres,1,cars);
assert.equal(wait?.wait,true,'pedestrian waits for both approaches');
assert(north.actorStartDistanceMetres+wait.step<north.northGateMetres);
const yielded=north.cars.map(entry=>({
 seg:entry.segment,direction:entry.direction,
 progress:entry.direction===1?1-3.65/entry.segment.len:
  3.65/entry.segment.len,
 parked:false,driven:false
}));
assert.equal(topolovaWaitAtCurb5166(control,route,
 north.actorStartDistanceMetres,1,yielded)?.wait,false);
assert.equal(topolovaWaitAtCurb5166(control,route,
 north.actorStartDistanceMetres,1,[yielded[0],cars[1]])?.wait,true,
 'a single moving approaching car still blocks entry');
assert.equal(topolovaWaitAtCurb5166(control,route,
 north.actorStartDistanceMetres,1,[])?.wait,false);
const invalid=[
 {regionId:'old'},
 {priorityPlan:{...priorityPlan,sourceRoadHash:'wrong'}},
 {priorityPlan:{...priorityPlan,sourceCrossingIDs:['1316882854','not-OSM']}},
 {route:{...route,segments:route.segments.map((s,i)=>i===4?
  {...s,sourceWayId:'invented'}:s)}},
 {control:{...control,version:'5.165'}},
 {driveSegments:[]},
 {driveSegments:[driveSegments[0]]},
 {driveSegments:[...driveSegments,driveSegments[2]]},
 {driveSegments:driveSegments.map((s,i)=>i===2?
  {...s,a:{...s.a,x:s.a.x+1}}:s)},
 {driveSegments:driveSegments.map((s,i)=>i===1?
  {...s,oneway:-1}:s)},
 {driveSegments:driveSegments.map((s,i)=>i===2?
  {...s,oneway:1}:s)}
];
for(const diff of invalid)
 assert.equal(planTopolovaNorthEncounter5168({...args,...diff}),null);
assert.equal(JSON.stringify(elements),immutable);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const entry of [
 "from './scripts/osm-topolova-north-encounter-5168.js?v=516800'",
 "'topolova-north-encounter-5168':{",
 'function rpSeedTopolovaNorthEncounter5168(){',
 'rpSeedTopolovaNorthEncounter5168();',
 'window.__miloviceTopolovaNorthEncounterRuntime=()=>{',
 'if(obj.northEncounter5168){'
])assert(html.includes(entry),'Missing browser integration '+entry);
console.log('PASS 5.168: actual GPS north zebra, west-to-east actor at western curb, two opposite AI cars on original Topolova road segments, simultaneous yield and source drift guards');
