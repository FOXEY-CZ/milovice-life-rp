// Milovice RP 5.128 — prevent generated street lamps from occupying
// the actual photographed, OSM-road-clipped clinic paving at Spojovací.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotographedForecourt} from './osm-clinic-forecourt-5123.js';
import {planClinicPavingFurnitureProtection,
 CLINIC_NO_GUESSED_FURNITURE_SOURCES} from './osm-clinic-furniture-protection-5128.js';
const el=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=el.find(e=>e.id===1057548624),
 street=el.find(e=>e.id===246652750),
 foot=el.find(e=>e.id===1339091016),
 grass=el.find(e=>e.id===1454936713);
assert(clinic&&street&&foot&&grass);
const baseline=JSON.stringify([clinic,street,foot,grass]);
const k=111320,cos=Math.cos(50.226*Math.PI/180);
const w=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
const face=exteriorFacadeFrame(clinic.geometry.slice(0,-1).map(w),2);
const path=e=>({id:e.id,kind:e.tags.highway,
 name:e.tags.name||'',tags:e.tags,
 width:e.tags.highway==='service'?4.5:7.8,
 points:e.geometry.map(w)});
const nearby=el.filter(e=>['service','residential']
 .includes(e.tags?.highway)&&e.geometry?.some(p=>
  Math.abs(p.lat-50.22872)<.0011&&
  Math.abs(p.lon-14.86410)<.0012)).map(path);
const paved=planClinicPhotographedForecourt({
 id:clinic.id,regionId:'mlada',tags:clinic.tags,
 polygon:clinic.geometry.slice(0,-1).map(w),
 front:face,street:path(street),walkingWay:path(foot),
 carriageways:nearby});
assert(paved&&paved.cells.length===422);
const opt={id:clinic.id,regionId:'mlada',tags:clinic.tags,
 front:face,pavement:paved,street:path(street),footway:path(foot)};
const plan=planClinicPavingFurnitureProtection(opt);
assert(plan,'No-furniture photo-paving guard must be valid on original OSM');
assert.equal(plan.version,'5.128');
assert.equal(plan.clinicWayId,'1057548624');
assert.equal(plan.streetWayId,'246652750');
assert.equal(plan.footwayWayId,'1339091016');
assert.equal(plan.photoSource,CLINIC_NO_GUESSED_FURNITURE_SOURCES.photo);
assert.equal(plan.municipalSitePlan,CLINIC_NO_GUESSED_FURNITURE_SOURCES.sitePlan);
assert.equal(plan.basedOnActualPavingTiles,422);
assert.equal(plan.photoObservedPaving,true);
assert.equal(plan.streetIsLitInOSM,true);
assert.equal(plan.actualPoleCoordinatesKnown,false);
assert.equal(plan.suppressesOnlyInferredLampPoleCandidates,true);
assert.equal(plan.proceduralPoleSafetyMarginMeters,.55);
assert.equal(plan.onlyCandidateFilter,true);
assert.equal(plan.grasslandPolygonsUntouched,true);
for(const key of ['existingMappedLampPolesDeleted',
 'existingOSMBuildingsChanged','existingOSMRoadsChanged',
 'existingOSMFootwaysChanged','addedFurniture','addedTrees',
 'addedShrubs'])assert.equal(plan[key],0);
for(const cell of paved.cells){
 const centroid={x:cell.corners.reduce((n,p)=>n+p.x,0)/4,
  z:cell.corners.reduce((n,p)=>n+p.z,0)/4};
 assert.equal(plan.contains(centroid.x,centroid.z),true,
  'Every photo-paver cell must reject guessed 3D posts');
}
assert.equal(plan.contains(face.mx,face.mz),false,
 'A pole INSIDE the actual building wall must be handled by the building guard');
assert.equal(plan.contains(face.mx+face.nx*35,face.mz+face.nz*35),false,
 'Unrelated distant roads must retain their OSM-lit street estimates');
assert.equal(plan.contains(NaN,0),false);
assert.equal(plan.contains(0,Infinity),false);
const twin=planClinicPavingFurnitureProtection(opt);
assert.deepEqual(
 [plan.clinicWayId,plan.basedOnActualPavingTiles,plan.basePavingModelArea],
 [twin.clinicWayId,twin.basedOnActualPavingTiles,twin.basePavingModelArea]);
assert.equal(grass.tags.landuse,'grass','Preserve real OSM grass');
assert.equal(JSON.stringify([clinic,street,foot,grass]),baseline);
for(const bad of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,name:'Another clinic'}},
 {tags:{...clinic.tags,amenity:'hospital'}},
 {front:null},{front:{...face,index:1}},
 {front:{...face,nx:-face.nx}},
 {pavement:null},{pavement:{...paved,cells:[]}},
 {pavement:{...paved,sourceStreetId:'0'}},
 {pavement:{...paved,photoObservedPaving:false}},
 {street:{...path(street),id:0}},
 {street:{...path(street),tags:{...street.tags,lit:'no'}}},
 {footway:{...path(foot),id:0}},
 {footway:{...path(foot),tags:{...foot.tags,lit:'no'}}}
])assert.equal(planClinicPavingFurnitureProtection({...opt,...bad}),null,
 'Do not protect a fabricated or altered source area '+JSON.stringify(bad).slice(0,120));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-clinic-furniture-protection-5128.js?v=512800'",
 'const photoClinicNoFurnitureZones=[];',
 'const photoFurnitureGuard=planClinicPavingFurnitureProtection({',
 'if(photoClinicNoFurnitureZones.some(site=>site.contains(x,z)))',
 'photoAllowed:allowVerifiedRoadLitPoleEstimate',
 'window.__miloviceClinicFurnitureProtectionAudit={',
 'window.__miloviceClinicFurnitureProtectionRuntime=()=>{',
 "const BUILD_ID='20261118-spojovaci-photo-lit-paving-protection-512800'",
 'href="?v=512800&streetAudit=armadni-clinic-5118"',
 'window.__miloviceClinicPhotoPharmacySignRuntime=()=>{',
 'window.__miloviceClinicPhotoYellowCrossRuntime=()=>{',
 'window.__miloviceClinicParkingInlaysRuntime=()=>{'
])assert(html.includes(token),'Missing 5.128 scene/lighting hookup '+token);
console.log('PASS 5.128 real 422 photographed clinic paving tiles protected from guessed streetlight poles, existing green/roads untouched');
