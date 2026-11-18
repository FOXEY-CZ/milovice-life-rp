import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SPORTOVNI_NORTHWALK_5146 as S,planSportovniPhotoNorthWalk}
 from './osm-sportovni-photo-northwalk-5146.js';
const e=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements,ways=e.filter(x=>x.tags?.highway);
const road=e.find(x=>String(x.id)===S.road),
 south=e.find(x=>String(x.id)===S.south);
assert(road&&south);
const original=JSON.stringify([road,south]);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const input={regionId:'mlada',ways,toWorld,roadWidth:7.8,
 roads:{isClear:()=>true},buildings:{isClear:()=>true}};
const result=planSportovniPhotoNorthWalk(input);
assert(result,'The source-matched photo strip must be buildable');
assert.equal(result.version,'5.146');
assert.equal(result.sourceRoadHash,S.roadHash);
assert.equal(result.sourceSouthernHash,S.southHash);
assert(result.modelNorthLengthMeters>46&&result.modelNorthLengthMeters<51);
assert(result.samples.length>15);
assert(result.nearestMappedFootwayMeters>2.25);
assert(result.samples.every(x=>x.outer.z<x.inner.z));
for(const q of result.samples)
 assert(Math.abs(Math.hypot(q.outer.x-q.inner.x,q.outer.z-q.inner.z)-1.85)<1e-7);
assert(result.photoProvesExistence&&result.exactPositionUnsurveyed);
for(const key of ['addedRoutingEdges','addedColliders','changedRoadCenterlines',
 'addedZebras','addedParking','addedTrees','addedLamps','addedBuildings'])
 assert.equal(result[key],0);
assert.equal(JSON.stringify([road,south]),original);
for(const changes of [
 {regionId:'old'},{roadWidth:12},
 {roads:{isClear:()=>false}},{buildings:{isClear:()=>false}},
 {ways:ways.filter(x=>x.id!==S.road)},
 {ways:ways.map(w=>w.id===road.id?{...w,tags:{...w.tags,oneway:'yes'}}:w)},
 {ways:ways.map(w=>w.id===road.id?{...w,geometry:w.geometry.map((p,i)=>
  i===2?{...p,lat:p.lat+.0000001}:p)}:w)},
 {ways:ways.map(w=>w.id===south.id?{...w,tags:{...w.tags,surface:'asphalt'}}:w)}
 ])assert.equal(planSportovniPhotoNorthWalk({...input,...changes}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-sportovni-photo-northwalk-5146.js?v=514600'",
 'const sportovniPhotoNorthWalkPlan=planSportovniPhotoNorthWalk({',
 'renderSportovniPhotoNorthWalk(THREE,',
 'window.__miloviceSportovniNorthWalkRuntime=()=>({',
 "'sportovni-photo-northwalk-5146':{",
 'streetAudit=sportovni-photo-northwalk-5146'
])assert(html.includes(part),'In-game integration absent: '+part);
console.log('PASS 5.146 source-locked photo-based north walkway model; no road, routing or collision alterations');
