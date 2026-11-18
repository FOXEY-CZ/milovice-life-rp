import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {TOPOLOVA_WALK_5162,planTopolovaMappedWalkers5162,
 toTopolovaWalkSegment5162} from './osm-topolova-mapped-walkers-5162.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const before=JSON.stringify(elements);
const homes=elements.filter(x=>x.tags?.building&&x.geometry);
const roads=elements.filter(x=>x.tags?.highway&&x.geometry);
const row=planTopolovaPanelRow5155({regionId:'mlada',ways:homes});
assert(row);
const args={regionId:'mlada',rowPlan:row,ways:roads};
const plan=planTopolovaMappedWalkers5162(args);
assert(plan,'OSM 1316882860 must connect to exact sidewalk and service nodes');
assert.equal(plan.sourceFootwayHash,'35c50c19');
assert.equal(plan.visibleWalkers,2);
assert.equal(plan.connectedOnActualOSMNode,true);
assert.equal(plan.noCrossingIntoServiceRoad,true);
assert(plan.rawLengthMetres>29&&plan.rawLengthMetres<30.5);
assert(Math.abs(plan.rawLengthMetres-plan.routeWalkableMetres-4)<.002);
for(const key of ['inventedFootwaySegments','sourceRoadVerticesChanged',
 'addedPavementGeometry','addedColliders'])assert.equal(plan[key],0);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const seg=toTopolovaWalkSegment5162(plan,world);
assert(seg);
assert.equal(seg.wayId,TOPOLOVA_WALK_5162.footway.id);
assert(seg.len>25&&seg.len<26.5);
assert.equal(seg.width,1.8);
const start=world(plan.routeOriginalGPS[0]),end=world(plan.routeOriginalGPS[1]);
assert(Math.abs(Math.hypot(seg.a.x-start.x,seg.a.y-start.y)-2)<.0001);
assert(Math.abs(Math.hypot(seg.b.x-end.x,seg.b.y-end.y)-2)<.0001);
for(const changed of [
 {regionId:'old'},
 {rowPlan:{...row,contiguousExactSharedPartyWalls:3}},
 {ways:roads.filter(w=>String(w.id)!=='202399863')},
 {ways:roads.map(w=>String(w.id)==='1316882860'?
  {...w,geometry:w.geometry.map((p,i)=>i===0?{...p,lat:p.lat+.0000001}:p)}:w)},
 {ways:roads.map(w=>String(w.id)==='1316882860'?
  {...w,tags:{...w.tags,surface:'asphalt'}}:w)},
 {ways:roads.map(w=>String(w.id)==='1316882852'?
  {...w,tags:{...w.tags,footway:'crossing'}}:w)}
])assert.equal(planTopolovaMappedWalkers5162({...args,...changed}),null);
assert.equal(JSON.stringify(elements),before,'No source road or building mutation');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const literal of [
 "from './scripts/osm-topolova-mapped-walkers-5162.js?v=516200'",
 'planTopolovaMappedWalkers5162({',
 'function rpSpawnTopolovaWalkers5162(){',
 'window.__miloviceTopolovaWalkersRuntime=()=>{',
 "'topolova-walkers-5162':{",
 'rpSpawnTopolovaWalkers5162();'
])assert(html.includes(literal),'Missing 5.162 integration '+literal);
console.log('PASS 5.162: two simulated NPC walkers on one original 29m OSM footway; no fictional sidewalks, 2m real-world endpoint clearance');
