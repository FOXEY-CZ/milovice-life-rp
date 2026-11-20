import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-walkers-5164.js';
import {planTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
import {planTopolovaWestWalk5175,makeTopolovaWestWalk5175} from './osm-topolova-west-walker-5175.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways});
const loop=planTopolovaZebraLoop5165({regionId:'mlada',connectedPlan,promenadePlan,ways});
assert(loop);
const plan=planTopolovaWestWalk5175(loop);
assert(plan,'west sidewalk must be sourced from verified 5.165 route');
assert.equal(plan.sourceWayId,'1314665579');
assert.equal(plan.walkerCount,1);
assert.equal(plan.trimMetres,4);
assert.equal(plan.actuallyCrossesRoad,false);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const seg=makeTopolovaWestWalk5175(plan,toWorld);
assert(seg&&seg.len>93&&seg.len<96);
assert.equal(seg.neverCrossesRoad,true);
for(const name of ['newPaths','newCrossings','newStreetMeshes','newColliders'])
 assert.equal(plan[name],0);
assert.equal(planTopolovaWestWalk5175({...loop,version:'invalid'}),null);
assert.equal(planTopolovaWestWalk5175({...loop,sourceWayIds:['wrong']}),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'original GPS data never changed');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of ["from './scripts/osm-topolova-west-walker-5175.js?v=517500'",
 'window.__miloviceTopolovaWestWalkPlan=',
 'function rpSpawnTopolovaWestWalk5175(){',
 'rpSpawnTopolovaWestWalk5175();'])
 assert(html.includes(token),'missing live game integration '+token);
console.log('PASS 5.175: seventh simulated walker follows existing WEST sidewalk, 4m turns before both zebras, no new street meshes');
