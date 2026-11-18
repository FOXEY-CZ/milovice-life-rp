// Milovice RP 5.129 — photo-grounded trio of young trees by Spojovací.
// Real RE/MAX street-level photograph shows three saplings in a grass verge.
// Every modeled tree must clear the ORIGINAL mapped road, opposite sidewalk,
// other OSM ways and ALL local real building footprints.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotographedForecourt} from './osm-clinic-forecourt-5123.js';
import {planPhotographedClinicVergeSaplings,
 CLINIC_PHOTO_SAPLINGS_SOURCE} from './osm-clinic-photo-saplings-5129.js';
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=elements.find(e=>e.id===1057548624);
const street=elements.find(e=>e.id===246652750);
const walkway=elements.find(e=>e.id===1339091016);
const opposite=elements.find(e=>e.id===1092081938);
const eastBuilding=elements.find(e=>e.id===202380957);
assert(clinic&&street&&walkway&&opposite&&eastBuilding);
const unchanged=JSON.stringify([clinic,street,walkway,opposite,eastBuilding]);
const co=Math.cos(50.226*Math.PI/180),metres=111320;
const world=p=>({x:(p.lon-14.889)*metres*co,
 z:-(p.lat-50.226)*metres});
const geom=el=>el.geometry.map(world);
const facade=exteriorFacadeFrame(geom(clinic).slice(0,-1),2);
const baseWidth=t=>t.highway==='primary'?11:t.highway==='secondary'?9:
 t.highway==='tertiary'?8:t.highway==='pedestrian'?4:
 t.highway==='footway'?1.8:
 ['path','steps'].includes(t.highway)?1.65:
 t.highway==='cycleway'?2:t.highway==='service'?4.5:7.8;
const path=el=>({id:el.id,kind:el.tags.highway,
 name:el.tags.name||'',tags:el.tags,
 width:baseWidth(el.tags),points:geom(el)});
const isCar=type=>[
 'primary','secondary','tertiary','unclassified','residential',
 'living_street','service'].includes(type);
const siteRoads=elements.filter(el=>isCar(el.tags?.highway)&&
 el.geometry?.some(p=>Math.abs(p.lat-50.22872)<.0011&&
 Math.abs(p.lon-14.86410)<.0012)).map(path);
const siteWalks=elements.filter(el=>[
 'footway','path','cycleway'].includes(el.tags?.highway)&&
 el.geometry?.some(p=>Math.abs(p.lat-50.22872)<.0011&&
 Math.abs(p.lon-14.86410)<.0012)).map(path);
const siteBuildings=elements.filter(el=>el.tags?.building&&
 el.geometry?.some(p=>Math.abs(p.lat-50.22872)<.0011&&
 Math.abs(p.lon-14.86410)<.0012))
 .map(el=>({id:el.id,tags:el.tags,points:geom(el)}));
const paving=planClinicPhotographedForecourt({
 id:clinic.id,regionId:'mlada',tags:clinic.tags,
 polygon:geom(clinic).slice(0,-1),front:facade,
 street:path(street),walkingWay:path(walkway),
 carriageways:siteRoads});
assert(paving&&paving.cells.length===422);
const options={
 id:clinic.id,regionId:'mlada',tags:clinic.tags,
 front:facade,pavement:paving,street:path(street),
 oppositeFootway:path(opposite),
 nearbyRoads:siteRoads,nearbyFootways:siteWalks,
 nearbyBuildings:siteBuildings
};
const plan=planPhotographedClinicVergeSaplings(options);
assert(plan,'Photographed trees must clear real Milovice road and footway');
assert.equal(plan.version,'5.129');
assert.equal(plan.sourceClinicId,CLINIC_PHOTO_SAPLINGS_SOURCE.clinic);
assert.equal(plan.sourceRoadId,'246652750');
assert.equal(plan.sourceOppositeFootwayId,'1092081938');
assert.equal(plan.sourcePhoto,CLINIC_PHOTO_SAPLINGS_SOURCE.photo);
assert.equal(plan.photographedForegroundSaplings,3);
assert.equal(plan.modelledSaplings,3);
assert.equal(plan.saplings.length,3);
assert.equal(plan.modelledPlantingDisks,3);
assert.equal(plan.numberFromPhoto,true);
assert.equal(plan.measuredTreeCoordinates,false);
assert.equal(plan.estimatedSaplingSizes,true);
assert.equal(plan.sourceSpeciesIdentified,false);
assert.equal(plan.actualGrassParcelMapped,false);
assert.equal(plan.existingPavingPreserved,true);
assert.equal(plan.existingStreetPreserved,true);
assert.equal(plan.existingFootpathsPreserved,true);
assert.equal(plan.existingOSMBuildingsPreserved,true);
assert(plan.minMappedRoadClearance>=2);
assert(plan.minMappedFootwayClearance>=2);
assert(plan.minMappedBuildingClearance>=4);
assert.equal(plan.trunkInstances,3);
assert.equal(plan.primaryCrownInstances,3);
assert.equal(plan.secondaryCrownInstances,3);
assert.equal(plan.soilDiskInstances,3);
assert.equal(plan.visualDrawMeshCount,4);
assert.deepEqual(plan.saplings.map(t=>t.along),[-16,-4,8]);
assert.deepEqual(plan.saplings.map(t=>t.depth),[25.2,25.2,25.2]);
for(const tree of plan.saplings){
 assert(Number.isFinite(tree.x)&&Number.isFinite(tree.z));
 assert.equal(tree.exactPositionNotMeasured,true);
 assert.equal(tree.speciesNotInferred,true);
 assert(tree.trunkRadius<.1);
 assert(tree.canopyRadius>.8&&tree.canopyRadius<1.2);
}
for(const field of ['newRoads','newFootways','newParkingSpaces',
 'newSyntheticGrassPolygons','newTrafficSigns','newColliders',
 'newRandomTreesOutsidePhoto'])assert.equal(plan[field],0);
const second=planPhotographedClinicVergeSaplings(options);
assert.deepEqual(second,plan,'Photo tree coordinates must be deterministic');
assert.equal(JSON.stringify([clinic,street,walkway,opposite,eastBuilding]),
 unchanged,'Source OSM geometry cannot be modified');
for(const bad of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,name:'Other clinic'}},
 {tags:{...clinic.tags,amenity:'hospital'}},
 {front:{...facade,index:1}},
 {front:{...facade,nx:-facade.nx}},
 {pavement:null},
 {pavement:{...paving,cells:[]}},
 {pavement:{...paving,sourceStreetId:'0'}},
 {street:{...path(street),id:0}},
 {oppositeFootway:null},
 {oppositeFootway:{...path(opposite),id:0}},
 {nearbyRoads:[]},{nearbyFootways:[]},
 {nearbyBuildings:[]},
 {nearbyRoads:[...siteRoads,{
  id:'hypothetical-new-road',kind:'service',width:6,
  points:[{x:plan.saplings[0].x-10,z:plan.saplings[0].z},
   {x:plan.saplings[0].x+10,z:plan.saplings[0].z}]
 }]}
]){
 const wrong=planPhotographedClinicVergeSaplings({...options,...bad});
 assert.equal(wrong,null,'Do not place trees on wrong/modified real source: '+
 JSON.stringify(bad).slice(0,100));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-clinic-photo-saplings-5129.js?v=512900'",
 'const photoClinicSaplingLocations=[];',
 'const saplingPlan=oppositeClinicWalk?',
 'planPhotographedClinicVergeSaplings({',
 "new THREE.CylinderGeometry(1,1,1,6)",
 "new THREE.CircleGeometry(1,16)",
 "inst.userData.lodDetail=false",
 "inst.userData.photoFixtureLodProtected=true",
 'window.__miloviceClinicPhotoSaplingsAudit={',
 'window.__miloviceClinicPhotoSaplingsRuntime=()=>{',
 " 'clinic-verge-trees-5129':{",
 'camera:{lat:50.2284894,lon:14.8644826},heading:348.0',
 'href="?v=513000&streetAudit=clinic-verge-trees-5129"',
 'Otevřít herní pohled podél stromků',
 'Math.hypot(p.x-x,p.z-z)<2.65',
 "const BUILD_ID='20261118-spojovaci-complete-photo-street-context-513000'",
 'href="?v=513000&streetAudit=armadni-clinic-5118"',
 'window.__miloviceClinicPhotoYellowCrossRuntime=()=>{',
 'window.__miloviceClinicFurnitureProtectionRuntime=()=>{'
])assert(html.includes(token),
 'Missing photo-tree runtime integration '+token);
console.log('PASS 5.129: three photographed clinic saplings and mulch circles, entire OSM road/footway/building guards intact');
