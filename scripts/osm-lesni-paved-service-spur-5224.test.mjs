// 5.224 source proof for original 40m service road connected to Lesní.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESNI_PAVED_SERVICE_SPUR_5224 as C,
 planLesniPavedServiceSpur5224 as plan}
 from './osm-lesni-paved-service-spur-5224.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elems=JSON.parse(raw).elements;
const original=JSON.stringify(elems);
const parent=elems.find(x=>String(x.id)===C.parentId);
const spur=elems.find(x=>String(x.id)===C.id);
assert(parent&&spur,'both mapped OSM ways exist');
const p=plan({regionId:'mlada',ways:elems});
assert(p,'exactly connected original roads must have validated original geometries');
assert.equal(p.version,'5.224');
assert.equal(p.sourceOSMId,'1282136966');
assert.equal(p.parentOSMId,'83026442');
assert.equal(p.sourceHash,'90818fe3');
assert.equal(p.parentHash,'9cc757ea');
assert.equal(p.originalJunctionGPS,'50.2309313,14.8734086');
assert.equal(p.originalNodes,3);
assert.equal(p.originalSegments,2);
assert.equal(p.parentOriginalSegments,9);
assert.equal(p.connectedOriginalSegments,11);
assert(Math.abs(p.originalLengthMeters-40.007)<.1);
assert(Math.abs(p.parentOriginalMeters-293.563)<.1);
assert(Math.abs(p.connectedOriginalMeters-333.570)<.1);
assert.equal(p.material,'visnova-tagged-paving-stones');
assert.equal(p.sourceHighway,'service');
assert.equal(p.sourceSurface,'paving_stones');
assert.equal(p.sourceVehicle,'destination');
assert.equal(p.parentSourceHighway,'living_street');
assert.equal(p.parentSourceMotorVehicle,'destination');
assert.equal(p.realPaverColourPhotoVerified,false);
assert.equal(p.realPaverPatternPhotoVerified,false);
for(const k of ['originalOSMConnectionAlreadyExists','sourceGeometryUnchanged',
 'sourceRoadWidthsUnchanged','vehicleRestrictionsUnchanged'])
 assert.equal(p[k],true,k);
for(const k of ['addedRoadConnections','newRoads','newFootways','newBuildings',
 'newParking','newKerbs','newColliders','newSigns'])
 assert.equal(p[k],0,k);
const mutation=(id,changes)=>elems.map(e=>String(e.id)===String(id)?
 {...e,...changes}:e);
for(const [label,config] of [
 ['other region',{regionId:'vrutice',ways:elems}],
 ['missing parent',{regionId:'mlada',ways:elems.filter(e=>String(e.id)!==C.parentId)}],
 ['duplicate spur',{regionId:'mlada',ways:[...elems,spur]}],
 ['change spur tag',{regionId:'mlada',ways:mutation(C.id,{tags:{...spur.tags,surface:'asphalt'}})}],
 ['change vehicle access',{regionId:'mlada',ways:mutation(C.id,{tags:{...spur.tags,vehicle:'yes'}})}],
 ['change highway',{regionId:'mlada',ways:mutation(C.id,{tags:{...spur.tags,highway:'residential'}})}],
 ['extra OSM tag',{regionId:'mlada',ways:mutation(C.id,{tags:{...spur.tags,lit:'yes'}})}],
 ['reverse spur',{regionId:'mlada',ways:mutation(C.id,{geometry:[...spur.geometry].reverse()})}],
 ['move spur GPS',{regionId:'mlada',ways:mutation(C.id,{geometry:spur.geometry.map((q,i)=>i===1?{...q,lat:q.lat+.0000001}:q)})}],
 ['change endpoint',{regionId:'mlada',ways:mutation(C.id,{geometry:spur.geometry.map((q,i)=>i===2?{...q,lon:q.lon+.0000001}:q)})}],
 ['change parent surface',{regionId:'mlada',ways:mutation(C.parentId,{tags:{...parent.tags,surface:'asphalt'}})}],
 ['reverse parent',{regionId:'mlada',ways:mutation(C.parentId,{geometry:[...parent.geometry].reverse()})}],
 ['move parent junction',{regionId:'mlada',ways:mutation(C.parentId,{geometry:parent.geometry.map((q,i)=>i===9?{...q,lat:q.lat+.0000001}:q)})}]
])assert.equal(plan(config),null,'fail closed '+label);
assert.equal(JSON.stringify(elems),original,'no mutation of source objects');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const str of [
 "from './scripts/osm-lesni-paved-service-spur-5224.js?v=522400'",
 'const lesniServiceSpur5224=planLesniPavedServiceSpur5224({',
 'const lesniSpurWay5224=lesniServiceSpur5224&&',
 'material:lesniSpurWay5224.material',
 'const lesniSpurDrawBefore5224=',
 'osmSurfaceAudit.drawnSegments-lesniSpurDrawBefore5224',
 'window.__miloviceLesniServiceSpurRuntime5224=()=>',
 "'lesni-service-spur-5224':{",
 'href="?v=522400&streetAudit=lesni-service-spur-5224"',
 'window.__miloviceLesniServiceSpurAudit5224=null;'
])assert(html.includes(str),'missing original-scene integration '+str);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'build strings consistent');
console.log('PASS 5.224 exact original Lesní junction 333.57m/11 road pieces,',
 'new 40.007m service spur 2 road pieces; no fabricated junction or traffic rules');
