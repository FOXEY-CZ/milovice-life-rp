// Milovice RP 5.127 — official SPADIA photographed yellow diagonal X.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotographedForecourt} from './osm-clinic-forecourt-5123.js';
import {planPhotoClinicYellowCross} from './osm-clinic-yellow-cross-5127.js';
const elements=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=elements.find(e=>e.id===1057548624);
const street=elements.find(e=>e.id===246652750);
const foot=elements.find(e=>e.id===1339091016);
assert(clinic&&street&&foot);
const original=JSON.stringify([clinic,street,foot]);
const k=111320,c=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*c,z:-(p.lat-50.226)*k});
const front=exteriorFacadeFrame(clinic.geometry.slice(0,-1).map(world),2);
const path=e=>({id:e.id,kind:e.tags.highway,name:e.tags.name||'',tags:e.tags,width:e.tags.highway==='service'?4.5:7.8,points:e.geometry.map(world)});
const roads=elements.filter(e=>['service','residential'].includes(e.tags?.highway)&&e.geometry?.some(p=>Math.abs(p.lat-50.22872)<.0011&&Math.abs(p.lon-14.86410)<.0012)).map(path);
const pavement=planClinicPhotographedForecourt({id:clinic.id,regionId:'mlada',tags:clinic.tags,polygon:clinic.geometry.slice(0,-1).map(world),front,street:path(street),walkingWay:path(foot),carriageways:roads});
assert(pavement&&pavement.cells.length>300);
const opts={id:clinic.id,regionId:'mlada',tags:clinic.tags,front,pavement,street:path(street),footway:path(foot),preExistingCarriageways:roads};
const plan=planPhotoClinicYellowCross(opts);
assert(plan,'Photo yellow X must fit the original OSM mapped forecourt');
assert.equal(plan.version,'5.127');
assert.equal(plan.osmClinicId,'1057548624');
assert.equal(plan.streetWayId,'246652750');
assert.equal(plan.footwayId,'1339091016');
assert.equal(plan.yellowXActuallyPhotoObserved,true);
assert.equal(plan.exactPaintLocationKnown,false);
assert.equal(plan.legallyRestrictedAreaClaimed,false);
assert.equal(plan.markingLegalPurposeKnown,false);
assert.equal(plan.paintedDiagonalCount,2);
assert.equal(plan.triangleCount,32);
assert.equal(plan.drawMeshes,1);
assert(plan.minRoadClearance>=.45);
assert(plan.minFootwayDistance>=1.5);
for(const stroke of plan.strokes){
 assert.equal(stroke.samples.length,18);
 for(const p of stroke.samples){
  const x=p.x-front.mx,z=p.z-front.mz;
  const depth=x*front.nx+z*front.nz;
  assert(depth>3.6&&depth<6.75);
 }
}
for(const key of ['newRoads','newFootways','newParkingBays','newLegalRoadMarkings','newCrosswalks','newSigns','newTrees','newStreetFurniture'])assert.equal(plan[key],0);
assert.equal(plan.pavingCellsPreserved,true);
assert.equal(plan.existingOSMUnmodified,true);
assert.deepEqual(plan,planPhotoClinicYellowCross(opts));
assert.equal(JSON.stringify([clinic,street,foot]),original);
for(const patch of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,name:'Other'}},
 {front:null},{front:{...front,index:1}},
 {pavement:null},{pavement:{...pavement,cells:[]}},
 {street:{...path(street),id:0}},
 {footway:{...path(foot),id:0}},
 {preExistingCarriageways:[{id:'addedroad',width:11,points:[{x:front.mx,z:front.mz},{x:front.mx+15,z:front.mz}]}]}
])assert.equal(planPhotoClinicYellowCross({...opts,...patch}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-clinic-yellow-cross-5127.js?v=512700'",
 "const yellowPlan=planPhotoClinicYellowCross({",
 "yellow.name='Milovice_Spojovaci_ClinicPhotoYellowPavingCross_5127'",
 'window.__miloviceClinicPhotoYellowCrossRuntime=()=>{',
 'yellow.userData.lodDetail=false',
 'terrainAt(v.x,v.z)+.120',
 "const BUILD_ID='20261118-spojovaci-complete-photo-street-context-513000'",
 'window.__miloviceClinicParkingInlaysRuntime=()=>{',
 'window.__miloviceClinicPhotoPharmacySignRuntime=()=>{'
])assert(html.includes(token),'Missing 5.127 integration '+token);
console.log('PASS 5.127: photographed decorative yellow X, 32 triangles, zero new roads, footways, or parking rights');
