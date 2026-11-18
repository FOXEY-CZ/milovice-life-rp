// 5.125: actual OSM / 2023 photographed red paver inlay safety regression.
// These source-backed separators are decorative and do not specify the
// legal total number, dimensions or reserved type of parking places.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotographedForecourt}
 from './osm-clinic-forecourt-5123.js';
import {planPhotographedClinicParkingInlays,CLINIC_PARKING_INLAY_SOURCES}
 from './osm-clinic-parking-inlays-5125.js';
const source=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=source.find(el=>el.id===1057548624),
 street=source.find(el=>el.id===246652750),
 footway=source.find(el=>el.id===1339091016);
assert(clinic&&street&&footway);
const baseline=JSON.stringify([clinic,street,footway]);
const k=111320,c=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*c,z:-(p.lat-50.226)*k});
const face=exteriorFacadeFrame(clinic.geometry.slice(0,-1).map(world),2);
const path=e=>({id:e.id,kind:e.tags.highway,
 name:e.tags.name||'',tags:e.tags,
 width:e.tags.highway==='service'?4.5:7.8,
 points:e.geometry.map(world)});
const roads=source.filter(e=>
 ['service','residential'].includes(e.tags?.highway)&&
 e.geometry?.some(p=>Math.abs(p.lat-50.22872)<.0011&&
 Math.abs(p.lon-14.86410)<.0012)).map(path);
const paved=planClinicPhotographedForecourt({
 id:clinic.id,regionId:'mlada',tags:clinic.tags,
 polygon:clinic.geometry.slice(0,-1).map(world),front:face,
 street:path(street),walkingWay:path(footway),carriageways:roads
});
assert(paved&&paved.cells.length>300);
const options={id:clinic.id,regionId:'mlada',tags:clinic.tags,
 front:face,pavement:paved,street:path(street),
 footway:path(footway),preExistingCarriageways:roads};
const plan=planPhotographedClinicParkingInlays(options);
assert(plan,'Photo inlays should pass unchanged authentic OSM frontage');
assert.equal(plan.osmClinicId,'1057548624');
assert.equal(plan.streetWayId,'246652750');
assert.equal(plan.footwayId,'1339091016');
assert.equal(plan.photoSource,CLINIC_PARKING_INLAY_SOURCES.completedPhoto);
assert.equal(plan.civilEngineeringSource,CLINIC_PARKING_INLAY_SOURCES.municipal2022DIO);
assert.equal(plan.parkingPresencePhotoConfirmed,true);
assert.equal(plan.reddishInlaysSeenOnPhoto,true);
assert.equal(plan.directionPerpendicularToMappedFacade,true);
assert.equal(plan.exactStallCountKnown,false);
assert.equal(plan.actualParkingBayCountClaimed,0);
assert.equal(plan.spacingMetresApproximate,true);
assert.equal(plan.paverTextureMeasured,false);
assert.equal(plan.newParkingLotPolygons,0);
assert.equal(plan.newParkingRoads,0);
assert.equal(plan.newRoads,0);
assert.equal(plan.newFootways,0);
assert.equal(plan.newZebraCrossings,0);
assert.equal(plan.newParkingSigns,0);
assert.equal(plan.originalPavingPreserved,true);
assert.equal(plan.originalOSMDataPreserved,true);
assert.equal(plan.streetGeometryChanged,false);
assert.equal(plan.pedestrianCollisionChanged,false);
assert.equal(plan.drawMeshes,1);
assert(plan.modelledSeparatorCount>=5&&plan.modelledSeparatorCount<=14);
assert.equal(plan.modelledSeparatorCount,plan.lines.length);
assert.equal(plan.triangleCount,plan.lines.length*14);
assert.equal(plan.material,'one-shared-red-inlay');
for(const line of plan.lines){
 assert.equal(line.samples.length,16);
 assert(line.depthStart>9&&line.depthStart<12);
 assert(line.depthEnd>12&&line.depthEnd<14.5);
 assert(line.depthEnd-line.depthStart>2.35);
 for(const p of line.samples){
  assert(Number.isFinite(p.x)&&Number.isFinite(p.z));
  const dx=p.x-face.mx,dz=p.z-face.mz;
  const out=dx*face.nx+dz*face.nz;
  assert(out>=line.depthStart-.1&&out<=line.depthEnd+.1,
   'Decorative strip must stay inside source photo forecourt');
 }
}
assert.deepEqual(plan,planPhotographedClinicParkingInlays(options));
assert.equal(JSON.stringify([clinic,street,footway]),baseline);
// No unrelated building, changed mapped access or invented forecourt source.
for(const patch of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,amenity:'hospital'}},
 {tags:{...clinic.tags,healthcare:'hospital'}},
 {tags:{...clinic.tags,name:'Unrelated clinic'}},
 {front:null},{front:{...face,index:0}},
 {front:{...face,nx:-face.nx}},
 {pavement:null},
 {pavement:{...paved,photoObservedPaving:false}},
 {pavement:{...paved,clinicId:'123'}},
 {pavement:{...paved,inferredParkingBays:15}},
 {pavement:{...paved,cells:[]}},
 {street:{...path(street),id:2}},
 {street:{...path(street),name:'Slepá'}},
 {street:{...path(street),width:12}},
 {footway:{...path(footway),id:1011011}},
 {footway:{...path(footway),tags:{highway:'footway'}}},
 {footway:{...path(footway),points:[]}}
]){
 assert.equal(planPhotographedClinicParkingInlays({...options,...patch}),null,
  'Invalid map/photo source must NOT create parking stripe '+JSON.stringify(patch).slice(0,110));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-clinic-parking-inlays-5125.js?v=512500'",
 'const stripePlan=planPhotographedClinicParkingInlays({',
 "inlay.name='Milovice_Spojovaci_ClinicPhotoRedPaverInlays_5125'",
 "const redPavers=new THREE.MeshStandardMaterial({",
 'terrainAt(v.x,v.z)+.117',
 'window.__miloviceClinicParkingInlaysAudit={',
 'window.__miloviceClinicParkingInlaysRuntime=()=>{',
 "inlay.userData.lodDetail=false",
 "const BUILD_ID='20261118-tyrsova-armadni-osm-zebra-estate-513100'",
 'href="?v=513100&streetAudit=armadni-clinic-5118"',
 'window.__miloviceClinicShopfrontRuntime=()=>{',
 'window.__miloviceClinicForecourtRuntime=()=>{'
])assert(html.includes(token),'Missing integrated 5.125 safeguard '+token);
console.log('PASS 5.125 original OSM Spojovaci + photographed visitor parking: single unmeasured red paver detail mesh, zero new roads/stalls/crossings');
