import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeTopolovaFootJob5179,advanceTopolovaFootJob5179}
 from './osm-topolova-foot-job-5179.js';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways});
const loop=planTopolovaZebraLoop5165({regionId:'mlada',connectedPlan,promenadePlan,ways});
assert(loop,'source-locked OSM loop is a precondition for this job');
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const plan=makeTopolovaFootJob5179(loop,world);
assert(plan);
assert.equal(plan.sourceWayId,'1314665579');
assert.equal(plan.rewardCZK,80);
assert.equal(plan.roadCrossingsRequired,0);
assert.equal(plan.streetAssetsAdded,0);
assert.equal(plan.simulatedDelivery,true);
assert.equal(plan.checkpoints.length,3);
assert(plan.routeLengthMetres>102&&plan.routeLengthMetres<103);
assert(Math.hypot(plan.checkpoints[0].x-plan.checkpoints[1].x,
 plan.checkpoints[0].z-plan.checkpoints[1].z)>40);
assert(Math.hypot(plan.checkpoints[1].x-plan.checkpoints[2].x,
 plan.checkpoints[1].z-plan.checkpoints[2].z)>40);
assert.equal(makeTopolovaFootJob5179({...loop,version:'wrong'},world),null);
assert.equal(makeTopolovaFootJob5179({...loop,sourceWayIds:['x']},world),null);
const job={...plan,next:0},start=plan.checkpoints[0];
const blocked=advanceTopolovaFootJob5179(job,start,false);
assert.equal(blocked.arrived,false);
assert.equal(blocked.next,0);
assert.equal(blocked.pausedInVehicle,true);
const distant=advanceTopolovaFootJob5179(job,{x:start.x+15,z:start.z},true);
assert.equal(distant.arrived,false);
assert.equal(distant.next,0);
const arrived=advanceTopolovaFootJob5179(job,start,true);
assert.equal(arrived.next,1);
assert.equal(arrived.complete,false);
job.next=1;
assert.equal(advanceTopolovaFootJob5179(job,plan.checkpoints[1],true).next,2);
job.next=2;
const finish=advanceTopolovaFootJob5179(job,plan.checkpoints[2],true);
assert.equal(finish.next,3);
assert.equal(finish.complete,true);
assert.equal(advanceTopolovaFootJob5179({...job,next:3},start,true),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "from './scripts/osm-topolova-foot-job-5179.js?v=517900'",
 'id="topolova-foot-job-start"',
 'id="topolova-foot-job-hud"',
 'function rpStartTopolovaFootJob5179(){',
 'function rpEndTopolovaFootJob5179(){',
 'advanceTopolovaFootJob5179(job,{x:px,z:pz},walking)',
 "window.__miloviceTopolovaFootJobRuntime5179=()=>"
])assert(html.includes(snippet),'missing live integration '+snippet);
console.log('PASS 5.179: 3 source-locked foot checkpoints, vehicle pauses, 80 Kč only on third arrival, no new physical street assets');
