import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaMappedWalkers5162} from './osm-topolova-mapped-walkers-5162.js';
import {TOPOLOVA_PROMENADE_5163,planTopolovaPromenade5163,
 topolovaPromenadeSegment5163} from './osm-topolova-promenade-5163.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const original=JSON.stringify(elements);
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const rowPlan=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const shortWalkPlan=planTopolovaMappedWalkers5162({regionId:'mlada',rowPlan,ways});
assert(rowPlan&&shortWalkPlan);
const opts={regionId:'mlada',rowPlan,shortWalkPlan,ways};
const plan=planTopolovaPromenade5163(opts);
assert(plan,'source-locked 102m sidewalk must exist');
assert.equal(plan.sourceSidewalkId,'1316882852');
assert.equal(plan.sourceSidewalkHash,'a50c0251');
assert.deepEqual(plan.originalOSMSegmentIndices,[21,22]);
assert.deepEqual(plan.sourceCrossingIDs,['1316882854','1316882853']);
assert.equal(plan.modelWalkerCount,2);
assert.equal(plan.trimEachEndMeters,4);
assert(plan.originalMetres>102&&plan.originalMetres<103);
assert(Math.abs(plan.originalMetres-plan.modelWalkerSpanMeters-8)<.002);
assert(plan.parallelRoadOffsetMeters.every(x=>x>=3.8&&x<=5.5));
for(const key of ['createdPedestrianCrossings','createdNewFootways',
 'changedOriginalRoads','changedOriginalBuildings','addedStreetMeshes','addedColliders'])
 assert.equal(plan[key],0);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const seg=topolovaPromenadeSegment5163(plan,world);
assert(seg);
assert(seg.len>94&&seg.len<95);
const [sa,sb]=plan.originalGPSNodes.map(world);
assert(Math.abs(Math.hypot(seg.a.x-sa.x,seg.a.y-sa.y)-4)<1e-4);
assert(Math.abs(Math.hypot(seg.b.x-sb.x,seg.b.y-sb.y)-4)<1e-4);
assert.equal(seg.syntheticStreetGeometry,0);
for(const change of [
 {regionId:'wrong'},
 {rowPlan:{...rowPlan,contiguousExactSharedPartyWalls:3}},
 {shortWalkPlan:{...shortWalkPlan,version:'5.161'}},
 {ways:ways.filter(x=>String(x.id)!=='1316882854')},
 {ways:ways.map(x=>String(x.id)==='1316882852'?{...x,
  geometry:x.geometry.map((p,i)=>i===22?{...p,lat:p.lat+.0000001}:p)}:x)},
 {ways:ways.map(x=>String(x.id)==='1316882853'?{...x,
  tags:{...x.tags,crossing:'unmarked'}}:x)},
 {ways:ways.map(x=>String(x.id)==='8618275'?{...x,
  tags:{...x.tags,name:'Something else'}}:x)}
])assert.equal(planTopolovaPromenade5163({...opts,...change}),null);
assert.equal(JSON.stringify(elements),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-topolova-promenade-5163.js?v=516300'",
 'const topolovaPromenadePlan=planTopolovaPromenade5163({',
 'function rpSpawnTopolovaPromenade5163(){',
 'rpSpawnTopolovaPromenade5163();',
 'window.__miloviceTopolovaPromenadeRuntime=()=>{',
 "'topolova-promenade-5163':{"
])assert(html.includes(token),'missing 5.163 integration: '+token);
console.log('PASS 5.163: 102.5m original Topolova OSM sidewalk, source zebras at both endpoints, 2 safe NPCs, zero invented geometry');
