import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlunickoStoreys5153} from './osm-slunicko-storeys-5153.js';
import {planSlunickoWestElevation5154} from './osm-slunicko-west-elevation-5154.js';
const data=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const main=data.find(x=>x.id===53865699),other=data.find(x=>x.id===53865700);
assert(main&&other);
const orig=JSON.stringify([main,other]);
const base=planSlunickoStoreys5153({id:main.id,regionId:'mlada',
 tags:main.tags,geometry:main.geometry,baseFloors:2});
assert(base);
const plan=planSlunickoWestElevation5154({basePlan:base,geometry:main.geometry});
assert(plan);
assert.equal(plan.westEdgeIndex,1);
assert(Math.abs(plan.westEdgeMeters-44.429)<.01);
assert(Math.abs(plan.eastEdgeMeters-44.299)<.01);
assert.equal(plan.modelHeightMeters,13.15);
assert.equal(plan.increaseMeters,.95);
assert.equal(plan.page,5);
assert.equal(plan.roofHeightNotSurveyed,true);
assert.equal(plan.originalOSMGeometryUntouched,true);
assert.equal(plan.originalOSMLevelsUntouched,true);
for(const key of ['newShades','newDoors','newBuildings','newRoads',
 'newFootways','newColliders','newTrees','newLamps','newParking'])
 assert.equal(plan[key],0);
for(const patch of [
 {basePlan:{...base,sourceOSMId:'53865700'}},
 {basePlan:{...base,originalOSMHash:'xx'}},
 {basePlan:{...base,modelHeightMeters:13.15}},
 {geometry:main.geometry.slice(0,-1)},
 {geometry:main.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.00001}:p)},
 {geometry:main.geometry.map((p,i)=>i===7?{...p,lon:p.lon+.00003}:p)}
])assert.equal(planSlunickoWestElevation5154({
 basePlan:base,geometry:main.geometry,...patch}),null);
assert.equal(JSON.stringify([main,other]),orig);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-slunicko-west-elevation-5154.js?v=515400'",
 'const slunickoWestPlan=slunickoPlan?',
 'if(slunickoWestPlan)h=slunickoWestPlan.modelHeightMeters;',
 'wallSpanMeters:slunickoWallSpan',
 'window.__miloviceSlunickoWestRuntime=()=>{',
 "'topolova-slunicko-west-5154':{"
])assert(html.includes(key),'Missing 5.154 integration '+key);
console.log('PASS 5.154 source-locked west 44.429m wall and estimated 13.15m height, without invented furniture');
