import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {planTopolovaPromenade5163} from './osm-topolova-promenade-5163.js';
import {planTopolovaConnectedWalk5164} from './osm-topolova-connected-5164.js';
import {planTopolovaZebraLoop5165,makeTopolovaZebraLoop5165} from './osm-topolova-zebra-loop-5165.js';
import {planTopolovaPriority5166,makeTopolovaPriority5166,
 topolovaApproach5166,topolovaIntent5166,topolovaYieldCar5166,
 topolovaWaitAtCurb5166} from './osm-topolova-priority-5166.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const before=JSON.stringify(elements),ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',
 ways:elements.filter(e=>e.tags?.building&&e.geometry)});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
const promenadePlan=planTopolovaPromenade5163({regionId:'mlada',rowPlan,shortWalkPlan,ways});
const connectedPlan=planTopolovaConnectedWalk5164({
 regionId:'mlada',rowPlan,shortWalkPlan,promenadePlan,ways});
const loopPlan=planTopolovaZebraLoop5165({
 regionId:'mlada',connectedPlan,promenadePlan,ways});
assert(loopPlan);
const params={regionId:'mlada',loopPlan,ways};
const plan=planTopolovaPriority5166(params);
assert(plan);
assert.deepEqual(plan.sourceCrossingIDs,['1316882854','1316882853']);
assert.equal(plan.roadId,'8618275');
assert.equal(plan.sourceRoadHash,'c0fe69b0');
assert.equal(plan.playerCarNotAutomaticallyBraked,true);
for(const k of ['newRoads','newCrossings','newColliders','newProps'])
 assert.equal(plan[k],0,k);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const controls=makeTopolovaPriority5166(plan,toWorld);
const route=makeTopolovaZebraLoop5165(loopPlan,toWorld);
assert(controls&&route);
assert.equal(controls.roadSegments.length,3);
const car=(i,dir,dist=10,opts={})=>{
 const seg=controls.roadSegments[i],progress=dir===1?1-dist/seg.len:dist/seg.len;
 return {seg:{a:{x:seg.a.x,y:seg.a.z},b:{x:seg.b.x,y:seg.b.z},
   len:seg.len,osmId:plan.roadId},progress,direction:dir,
   parked:false,driven:false,...opts};
};
for(const [i,dir,key] of [[0,1,'south'],[1,-1,'south'],
 [1,1,'north'],[2,-1,'north']]){
 const a=topolovaApproach5166(controls,car(i,dir,10));
 assert.equal(a?.key,key);
 assert(Math.abs(a.distanceAhead-10)<.02);
}
assert.equal(topolovaApproach5166(controls,car(0,-1,10)),null);
assert.equal(topolovaApproach5166(controls,car(2,1,10)),null);
assert.equal(topolovaApproach5166(controls,{
 ...car(0,1,10),seg:{...car(0,1,10).seg,osmId:'other'}}),null);
const southGate=route.segments[0].endMetres;
const northGate=route.segments[3].endMetres;
const beforeSouth=southGate-.7,beforeNorth=northGate-.6;
const intent=topolovaIntent5166(controls,route,beforeSouth);
assert.equal(intent?.key,'south');
assert.equal(intent.onCrossing,false);
assert.equal(topolovaIntent5166(controls,route,southGate+.4)?.onCrossing,true);
assert.equal(topolovaIntent5166(controls,route,beforeNorth)?.key,'north');
const moving=car(0,1,10);
const y=topolovaYieldCar5166(controls,moving,intent,.05);
assert.equal(y.yielding,true);
assert(y.factor>0&&y.factor<1);
assert(Math.abs(y.capMetres-6.5)<.01);
assert.equal(topolovaYieldCar5166(controls,car(1,1,10),intent,.05).yielding,false);
assert.equal(topolovaYieldCar5166(controls,
 car(0,1,10,{driven:true}),intent,.05).yielding,false);
const step=2;
const waiting=topolovaWaitAtCurb5166(controls,route,beforeSouth,step,[moving]);
assert.equal(waiting.wait,true);
assert(waiting.step>=0&&waiting.step<.7);
assert(beforeSouth+waiting.step<southGate);
const stopped=car(0,1,3.6);
assert.equal(topolovaWaitAtCurb5166(controls,route,beforeSouth,step,[stopped]).wait,false);
assert.equal(topolovaWaitAtCurb5166(controls,route,beforeSouth,step,[]).wait,false);
assert.equal(topolovaWaitAtCurb5166(controls,route,
 southGate+.4,step,[moving]).wait,false);
assert.equal(topolovaWaitAtCurb5166(controls,route,beforeSouth,step,
 [car(0,1,2)]).wait,true,'already committed car must pass');
assert.equal(topolovaWaitAtCurb5166(controls,route,beforeSouth,step,
 [car(0,1,10,{driven:true})]).wait,true,
 'player-driven car not autobraked; simulated walker holds');
const southMovingAtNorth=car(0,1,10);
assert.equal(topolovaWaitAtCurb5166(controls,route,beforeNorth,step,
 [southMovingAtNorth]).wait,false);
assert.equal(topolovaWaitAtCurb5166(controls,route,beforeNorth,step,
 [car(2,-1,10)]).wait,true);
for(const change of [
 {regionId:'old'},
 {loopPlan:{...loopPlan,version:'5.164'}},
 {ways:ways.filter(w=>String(w.id)!=='8618275')},
 {ways:ways.map(w=>String(w.id)==='8618275'?{...w,
   geometry:w.geometry.map((p,i)=>i===2?{...p,lon:p.lon+.0000001}:p)}:w)},
 {ways:ways.map(w=>String(w.id)==='8618275'?{...w,
   tags:{...w.tags,name:'Other'}}:w)}
])assert.equal(planTopolovaPriority5166({...params,...change}),null);
assert.equal(JSON.stringify(elements),before,'immutable OSM');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const piece of [
 "from './scripts/osm-topolova-priority-5166.js?v=516600'",
 'const topolovaPriorityPlan=planTopolovaPriority5166({',
 'window.__miloviceTopolovaPriorityRuntime=()=>{',
 'rpActivateTopolovaPriority5166();',
 'const rightOfWay=topolovaYieldCar5166(',
 'const curb=topolovaWaitAtCurb5166(',
 "'topolova-priority-5166':{"
])assert(html.includes(piece),'Missing 5.166 browser integration '+piece);
console.log('PASS 5.166 actual road source; all four car approaches, driver exclusion, waiting curb, AI stop/yield, both zebras, fail-closed GPS');
