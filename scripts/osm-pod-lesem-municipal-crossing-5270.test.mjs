import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {POD_LESEM_CROSS_5270 as C,planPodLesemCross5270 as plan}
 from './osm-pod-lesem-municipal-crossing-5270.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const snapshot=JSON.stringify(E);
const p=plan({regionId:'mlada',ways:E});
assert(p,'source-locked existing Pod Lesem / Armadni junction');
assert.equal(p.version,'5.270');
assert.equal(p.sideRoadId,'128087258');
assert.equal(p.mainRoadId,'1331897690');
assert.equal(p.sideHash,'6e14ec02');
assert.equal(p.mainHash,'197dbea8');
assert.deepEqual(p.junctionGPS,{lat:50.2286371,lon:14.8727931});
assert.equal(p.roadWidthMetres,6);
assert.equal(p.stripeLengthMetres,3.4);
assert.equal(p.modelDistanceFromJunctionMetres,10.5);
assert.equal(p.sourceSegmentEndIndex,2);
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
assert(Math.abs(d(...p.modelFootwayAxis)-6)<1e-8);
assert.equal(p.mappedCrossingFound,false);
assert(p.actualMarkingsFromMunicipalContract);
assert(p.originalGPSUnchanged&&p.originalRoadGraphUnchanged&&
 p.originalOSMSurfaceUnchanged);
assert(p.geometryPlacementEstimated&&!p.photoMeasuredPlacement);
for(const k of ['newMappedCrossingWays','newSidewalks','newKerbs',
 'newColliders','newRoads','newTrafficRoutes','newMaterials','newLights'])
 assert.equal(p[k],0,k);
assert.equal(plan({regionId:'old',ways:E}),null);
for(const id of [C.sideId,C.mainId]){
 assert.equal(plan({regionId:'mlada',ways:E.filter(w=>String(w.id)!==id)}),null);
 const bad=E.map(w=>String(w.id)===id?{...w,geometry:
  w.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.0000001}:p)}:w);
 assert.equal(plan({regionId:'mlada',ways:bad}),null,'GPS source lock '+id);
 const tagged=E.map(w=>String(w.id)===id?{...w,tags:{
  ...w.tags,source:'invented'}}:w);
 assert.equal(plan({regionId:'mlada',ways:tagged}),null,'tag lock '+id);
}
const duplicate=[...E,{type:'way',id:999999999,tags:{
 highway:'footway',footway:'crossing'},geometry:[{lat:50.228575,lon:14.87269},
 {lat:50.22856,lon:14.87268}]}];
assert.equal(plan({regionId:'mlada',ways:duplicate}),null,
 'never overlap future mapped crossing');
assert.equal(JSON.stringify(E),snapshot);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-pod-lesem-municipal-crossing-5270.js?v=527000'",
 'planPodLesemCross5270({',
 'window.__milovicePodLesemCrossRuntime5270=()=>',
 "'pod-lesem-municipal-crossing-5270':{",
 "const BUILD_ID='20261122-pod-lesem-crossing-527000'"])
 assert(html.includes(token),'Missing 5.270 integration '+token);
console.log('PASS 5.270 municipal 2025 crossing on original Pod Lesem 6m asphalt, 10.5m estimated from Armadni, strict non-duplicate OSM lock and no new path');
