import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaParkingMap5203 as plan}
 from './osm-visnova-parking-map-5203.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(raw).elements;
const building=es.find(w=>String(w.id)==='1025752710');
assert(building,'original parking-house RUIAN way');
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
});
const args={regionId:'mlada',building,toWorld};
const data=plan(args);
assert(data,'marker must derive from true polygon');
assert.equal(data.sourceBuildingId,'1025752710');
assert.equal(data.sourceRUIANId,'105243469');
assert.equal(data.markerSymbol,'P');
assert.equal(data.insideMappedBuilding,true);
assert.equal(data.notAnEntrance,true);
assert.equal(data.notAnExactParkingSpace,true);
assert.equal(data.photoVerifiedEntrance,false);
assert(Number.isFinite(data.point.x)&&Number.isFinite(data.point.z));
for(const attr of ['newThreeDObjects','newColliders','newParkingPlaces',
 'newRoads','newFootways'])assert.equal(data[attr],0);
assert.deepEqual(plan(args).point,data.point,
 'same original polygon always yields the same minimap location');
for(const changed of [
 {regionId:'old'},{approvedLocationOverride:true},
 {building:{...building,id:0}},
 {building:{...building,tags:{...building.tags,parking:'surface'}}},
 {building:{...building,tags:{...building.tags,'ref:ruian:building':'wrong'}}},
 {building:{...building,geometry:building.geometry.slice(0,-1)}},
 {building:{...building,geometry:building.geometry.map((p,i)=>
  i===2?{...p,lat:p.lat+.0000001}:p)}}
])assert.equal(plan({...args,...changed}),null,'fail closed on changed OSM facts');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-visnova-parking-map-5203.js?v=520300'",
 'visnovaParkingMap5203=planVisnovaParkingMap5203({',
 "mc.fillText('P',u,v+4);",
 'window.__miloviceVisnovaParkingMapRuntime5203=()=>',
 'visnovaParkingMap5203=null;',
 'const BUILD_ID='
])assert(html.includes(term),'missing live minimap integration '+term);
console.log('PASS 5.203: source-derived P minimap icon inside original 2-floor parking house; no invented garage entrances or geometry');
