import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165,makeTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
import {planTopolovaPriority5166,makeTopolovaPriority5166,
 topolovaApproach5166,topolovaYieldCar5166,topolovaWaitAtCurb5166}
 from './osm-topolova-priority-5166.js';
import {planTopolovaEncounter5167} from './osm-topolova-encounter-5167.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const original=JSON.stringify(elements);
const roads=elements.filter(e=>e.tags?.highway&&e.geometry);
const houses=elements.filter(e=>e.tags?.building&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:houses});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways:roads});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways:roads});
const connectedPlan=planTopolovaConnectedWalk5164({regionId:'mlada',rowPlan,
 shortWalkPlan,promenadePlan,ways:roads});
const loopPlan=planTopolovaZebraLoop5165({regionId:'mlada',connectedPlan,promenadePlan,ways:roads});
const priorityPlan=planTopolovaPriority5166({regionId:'mlada',loopPlan,ways:roads});
assert(loopPlan&&priorityPlan);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const route=makeTopolovaZebraLoop5165(loopPlan,toWorld);
const control=makeTopolovaPriority5166(priorityPlan,toWorld);
assert(route&&control);
const driveSegments=control.roadSegments.map((s,i)=>({
 a:{x:s.a.x,y:s.a.z},b:{x:s.b.x,y:s.b.z},len:s.len,
 osmId:priorityPlan.roadId,width:7,oneway:0
}));
const args={regionId:'mlada',priorityPlan,control,route,driveSegments};
const plan=planTopolovaEncounter5167(args);
assert(plan,'source-anchored encounter must be accepted');
assert.equal(plan.realDriveSegment,driveSegments[0],'same mutable segment as actual traffic');
assert.equal(plan.sourceCrossingId,'1316882854');
assert.equal(plan.sourceRoadId,'8618275');
assert.equal(plan.version,'5.167');
assert.equal(plan.speed,8);
assert(Math.abs((1-plan.originalVehicleProgress)*plan.realDriveSegment.len-13.5)<.001);
assert.equal(plan.initialWalkerOffsetMetres,route.segments[0].endMetres-.7);
assert.equal(plan.controlledOnlyForAudit,true);
for(const field of ['newRoads','newCrossings','newSidewalks','newColliders'])
 assert.equal(plan[field],0,field);
const mockCar={seg:plan.realDriveSegment,progress:plan.originalVehicleProgress,
 direction:1,driven:false,parked:false};
const approach=topolovaApproach5166(control,mockCar);
assert.equal(approach?.key,'south');
assert(Math.abs(approach.distanceAhead-13.5)<.001);
const intent={key:'south',onCrossing:false};
assert.equal(topolovaYieldCar5166(control,mockCar,intent,.05).yielding,true);
const danger=topolovaWaitAtCurb5166(control,route,
 plan.initialWalkerOffsetMetres,1.5,[mockCar]);
assert.equal(danger?.wait,true);
const carStopped={...mockCar,progress:1-3.65/plan.realDriveSegment.len};
assert.equal(topolovaWaitAtCurb5166(control,route,
 plan.initialWalkerOffsetMetres,1.5,[carStopped])?.wait,false);
const bad=[
 {regionId:'old'},
 {control:{...control,version:'old'}},
 {priorityPlan:{...priorityPlan,sourceRoadHash:'wrong'}},
 {route:{...route,segments:[...route.segments.slice(0,1),
   {...route.segments[1],sourceWayId:'wrong'},...route.segments.slice(2)]}},
 {driveSegments:[]},
 {driveSegments:[driveSegments[0],driveSegments[0]]},
 {driveSegments:[{...driveSegments[0],
   a:{...driveSegments[0].a,x:driveSegments[0].a.x+2}}]},
 {driveSegments:[{...driveSegments[0],osmId:'random'}]}
];
for(const diff of bad)
 assert.equal(planTopolovaEncounter5167({...args,...diff}),null);
assert.equal(JSON.stringify(elements),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const tag of [
 "from './scripts/osm-topolova-encounter-5167.js?v=516700'",
 "'topolova-encounter-5167':{",
 'function rpSeedTopolovaEncounter5167(){',
 'rpSeedTopolovaEncounter5167();',
 'window.__miloviceTopolovaEncounterRuntime=()=>{',
 'if(obj.encounter5167){'
])assert(html.includes(tag),'5.167 integration missing: '+tag);
console.log('PASS 5.167: real OSM 8618275 AI segment and live 5.165 walker for special camera, 13.5m approach, fail-closed, no new source geometry');
