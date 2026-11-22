import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {POD_LESEM_CROSS_5270 as C,planPodLesemCross5270 as plan}
 from './osm-pod-lesem-municipal-crossing-5270.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const snapshot=JSON.stringify(E);
const p=plan({regionId:'mlada',ways:E});
assert(p,'source-locked existing Pod Lesem / Armadni junction');
assert.equal(p.version,'5.274');
assert.equal(p.sideRoadId,'128087258');
assert.equal(p.mainRoadId,'1331897690');
assert.equal(p.sideHash,'6e14ec02');
assert.equal(p.mainHash,'197dbea8');
assert.deepEqual(p.junctionGPS,{lat:50.2286371,lon:14.8727931});
assert.equal(p.roadWidthMetres,6);
assert.equal(p.stripeLengthMetres,3.4);
assert(p.modelDistanceFromJunctionMetres>8.77&&
 p.modelDistanceFromJunctionMetres<8.80,
 'source map footway intersection must be about 8.78 m from Armadni');
assert.equal(p.oldEstimatedMetresFromJunction,10.5);
assert(p.alignmentCorrectionMetres>1.70&&p.alignmentCorrectionMetres<1.73);
assert.equal(p.sourceSidewalkOSMId,'1005977571');
assert.equal(p.sourceSidewalkHash,'263e12b3');
assert.deepEqual(p.sharedSidewalkRoadGPS,{lat:50.2285685,lon:14.8727322});
assert(p.alignedToExistingOSMSidewalkVertex);
assert(p.sidewalkTagsCrossingPaintNotProven);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const sharedWorld=world(p.sharedSidewalkRoadGPS);
assert(Math.hypot(sharedWorld.x-p.centerWorld.x,sharedWorld.y-p.centerWorld.y)<1e-7,
 'paint model center is identical to shared original OSM vertex');
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
for(const id of [C.sideId,C.mainId,C.sidewalkId]){
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
// Regress 5.271: a mapped polyline may cross the model center even when
// BOTH of its vertices are farther than the original 22m endpoint test.
const toGps=point=>({
 lat:50.226-point.y/111320,
 lon:14.889+point.x/(111320*Math.cos(50.226*Math.PI/180))
});
const longCross=offset=>({
 type:'way',id:999999998,tags:{highway:'footway',footway:'crossing'},
 geometry:[
  toGps({x:p.centerWorld.x-35,y:p.centerWorld.y+offset}),
  toGps({x:p.centerWorld.x+35,y:p.centerWorld.y+offset})
 ]
});
const longOnTop=longCross(0);
for(const vertex of longOnTop.geometry){
 const x=(vertex.lon-14.889)*111320*Math.cos(50.226*Math.PI/180);
 const y=-(vertex.lat-50.226)*111320;
 assert(Math.hypot(x-p.centerWorld.x,y-p.centerWorld.y)>22,
  'both endpoints really are outside the old radius');
}
assert.equal(plan({regionId:'mlada',ways:[...E,longOnTop]}),null,
 'long mapped crossing must veto duplicate paint between vertices');
assert.equal(plan({regionId:'mlada',ways:[...E,longCross(20)]}),null,
 'mapped line passing within 22m also vetoes duplicate paint');
assert(plan({regionId:'mlada',ways:[...E,longCross(30)]}),
 'mapped line beyond 22m must not disable unrelated model');
assert(plan({regionId:'mlada',ways:[...E,{...longOnTop,
 geometry:[{lat:NaN,lon:14.8727}]}]}),
 'malformed mapped-crossing coordinates cannot create false veto');
assert.equal(JSON.stringify(E),snapshot);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-pod-lesem-municipal-crossing-5270.js?v=527400'",
 'planPodLesemCross5270({',
 'window.__milovicePodLesemCrossRuntime5270=()=>',
 "'pod-lesem-municipal-crossing-5270':{",
 "const BUILD_ID='20261122-pod-lesem-walk-aligned-527400'"])
 assert(html.includes(token),'Missing 5.270 integration '+token);
console.log('PASS 5.274 municipality-backed Pod Lesem crossing aligned to original OSM sidewalk vertex 8.782m before Armadni, no new paths or surveyed-paint claim');
