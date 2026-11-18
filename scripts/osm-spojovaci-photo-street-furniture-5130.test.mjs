// Milovice RP 5.130 — complete clinic section of Spojovací verified by
// 2023+2026 independent photos and original OSM crossing/footway/building.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotographedForecourt} from './osm-clinic-forecourt-5123.js';
import {planPhotographedClinicVergeSaplings} from './osm-clinic-photo-saplings-5129.js';
import {planSpojovaciPhotoStreetFurniture,
 SPOJOVACI_PHOTO_STREET_SOURCES}
 from './osm-spojovaci-photo-street-furniture-5130.js';
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const by=id=>elements.find(el=>String(el.id)===String(id));
const clinic=by(1057548624),street=by(246652750),
 foot=by(1339091016),opposite=by(1092081938),
 crossing=by(1044078125),commercial=by(202380957),
 grass=by(1454936713);
for(const el of [clinic,street,foot,opposite,crossing,commercial,grass])
 assert(el,'Missing real OSM source');
const original=JSON.stringify([clinic,street,foot,opposite,crossing,commercial,grass]);
const k=111320,co=Math.cos(50.226*Math.PI/180);
const w=p=>({x:(p.lon-14.889)*k*co,z:-(p.lat-50.226)*k});
const geom=el=>el.geometry.map(w);
const facade=exteriorFacadeFrame(geom(clinic).slice(0,-1),2);
const width=t=>t.highway==='primary'?11:t.highway==='secondary'?9:
 t.highway==='tertiary'?8:t.highway==='pedestrian'?4:
 t.highway==='footway'?1.8:
 ['path','steps'].includes(t.highway)?1.65:
 t.highway==='cycleway'?2:t.highway==='service'?4.5:7.8;
const way=el=>({id:el.id,kind:el.tags.highway,
 tags:el.tags,name:el.tags.name||'',
 width:width(el.tags),points:geom(el)});
const carriageway=t=>[
 'primary','secondary','tertiary','unclassified',
 'residential','living_street','service'].includes(t);
const within=el=>el.geometry?.some(p=>
 Math.abs(p.lat-50.22872)<.0011&&
 Math.abs(p.lon-14.86410)<.0012);
const roads=elements.filter(el=>
 carriageway(el.tags?.highway)&&within(el)).map(way);
const footways=elements.filter(el=>[
 'footway','path','cycleway'].includes(el.tags?.highway)&&
 within(el)).map(way);
const buildings=elements.filter(el=>el.tags?.building&&within(el))
 .map(el=>({id:el.id,tags:el.tags,points:geom(el)}));
const pavement=planClinicPhotographedForecourt({
 id:clinic.id,regionId:'mlada',tags:clinic.tags,
 polygon:geom(clinic).slice(0,-1),front:facade,
 street:way(street),walkingWay:way(foot),carriageways:roads});
assert(pavement&&pavement.cells.length===422);
const saplings=planPhotographedClinicVergeSaplings({
 id:clinic.id,regionId:'mlada',tags:clinic.tags,
 front:facade,pavement,street:way(street),
 oppositeFootway:way(opposite),nearbyRoads:roads,
 nearbyFootways:footways,nearbyBuildings:buildings});
assert(saplings&&saplings.saplings.length===3);
const args={id:clinic.id,regionId:'mlada',tags:clinic.tags,
 front:facade,pavement,street:way(street),clinicFootway:way(foot),
 oppositeFootway:way(opposite),northernCrossing:way(crossing),
 oppositeCommercial:buildings.find(b=>b.id===202380957),
 westGrass:{id:grass.id,tags:grass.tags,points:geom(grass)},
 nearbyRoads:roads,nearbyFootways:footways,nearbyBuildings:buildings,
 existingPhotoSaplings:saplings.saplings};
const plan=planSpojovaciPhotoStreetFurniture(args);
assert(plan,'Model must fit original OSM clinic and street without obstacles');
assert.equal(plan.version,'5.130');
assert.equal(plan.sourceStreetId,'246652750');
assert.equal(plan.sourceClinicId,'1057548624');
assert.equal(plan.sourceNearFootwayId,'1339091016');
assert.equal(plan.sourceFarFootwayId,'1092081938');
assert.equal(plan.sourceNorthernCrossingId,'1044078125');
assert.equal(plan.sourceOppositeCommercialId,'202380957');
assert.equal(plan.sourceWestGrassId,'1454936713');
assert.equal(plan.sourceParkingSignPhoto,
 SPOJOVACI_PHOTO_STREET_SOURCES.parkingPlate);
assert.equal(plan.sourceStreetLampPhoto,
 SPOJOVACI_PHOTO_STREET_SOURCES.streetLight);
assert.equal(plan.photoLampFixtureActuallyVisible,true);
assert.equal(plan.photoBlueParkingPlateActuallyVisible,true);
assert.equal(plan.photographedTypesOnly,true);
assert.equal(plan.exactFixtureGPSKnown,false);
assert.equal(plan.totalPhysicalPolesInStreetKnown,false);
assert.equal(plan.parkingRightsOrReservedSpaceAsserted,false);
assert.equal(plan.oppositeBuildingExactlyOneOSMLevel,true);
assert.equal(commercial.tags['building:levels'],'1');
assert.equal(commercial.tags.building,'commercial');
assert.equal(plan.existingOSMCrossingPreserved,true);
assert.equal(plan.nearbyCrossingAlreadyRenderedByMappedPedestrianSystem,true);
assert.equal(plan.sourcePavingCellsPreserved,true);
assert.equal(plan.nearbyMappedGreenAreaUntouched,true);
assert.equal(plan.plannedVisibleFixtures,2);
assert.equal(plan.plannedDrawMeshes,5);
assert.equal(plan.renderItems.length,2);
assert.deepEqual(plan.renderItems.map(p=>p.kind),
 ['parkingP','singleBentStreetLamp']);
assert.equal(plan.clearanceAudit.length,2);
for(const item of plan.clearanceAudit){
 assert(item.roadClearance>1.25);
 assert(item.footwayClearance>1.25);
 assert(item.buildingClearance>1.7);
 assert(item.saplingClearance>3.25);
 assert.equal(item.onSourcePaving,true);
}
for(const fixture of plan.renderItems){
 assert(Number.isFinite(fixture.x)&&Number.isFinite(fixture.z));
 assert.equal(fixture.exactGPSUnmeasured,true);
 assert.equal(fixture.sizeEstimated,true);
 assert.equal(fixture.noGameplayCollision,true);
}
for(const key of ['newRoads','newFootways','newCrosswalks',
 'newParkingBays','newTrafficRestrictions','newTrees','newColliders'])
 assert.equal(plan[key],0);
assert.deepEqual(plan,planSpojovaciPhotoStreetFurniture(args));
assert.equal(JSON.stringify([clinic,street,foot,opposite,crossing,
 commercial,grass]),original,'Real OSM sources cannot be modified');
for(const patch of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,name:'Unknown place'}},
 {front:{...facade,index:1}},{front:null},
 {pavement:{...pavement,cells:[]}},
 {street:{...way(street),tags:{...street.tags,lit:'no'}}},
 {oppositeFootway:{...way(opposite),id:0}},
 {northernCrossing:{...way(crossing),id:0}},
 {northernCrossing:{...way(crossing),tags:{...crossing.tags,crossing:'uncontrolled'}}},
 {oppositeCommercial:{...args.oppositeCommercial,
  tags:{building:'residential','building:levels':'8'}}},
 {westGrass:{...args.westGrass,id:0}},
 {nearbyRoads:[]},{nearbyFootways:[]},{nearbyBuildings:[]},
 {existingPhotoSaplings:[]},
 {nearbyRoads:[...roads,{id:'unmapped-drive',
  width:8,points:[{x:plan.renderItems[0].x-4,z:plan.renderItems[0].z},
   {x:plan.renderItems[0].x+4,z:plan.renderItems[0].z}]}]}
]){
 assert.equal(planSpojovaciPhotoStreetFurniture({...args,...patch}),null,
 'Invalid OSM scene must not grow guessed poles: '+JSON.stringify(patch).slice(0,120));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-spojovaci-photo-street-furniture-5130.js?v=513000'",
 'const streetScenePlan=oppositeClinicWalk&&mappedNorthCrossing&&',
 'planSpojovaciPhotoStreetFurniture({',
 'window.__miloviceSpojovaciPhotoStreetAudit={',
 'window.__miloviceSpojovaciPhotoStreetRuntime=()=>{',
 "new THREE.CylinderGeometry(.037,.043,pSign.postHeight,8)",
 "paint.fillText('P',128,131)",
 "new THREE.CylinderGeometry(.06,.084,light.postHeight,8)",
 "mesh.userData.photoFixtureLodProtected=true",
 " 'spojovaci-north-crossing-5130':{",
 "href=\"?v=513000&streetAudit=spojovaci-north-crossing-5130\"",
 "const BUILD_ID='20261118-spojovaci-complete-photo-street-context-513000'",
 'window.__miloviceClinicPhotoSaplingsRuntime=()=>{',
 'window.__miloviceClinicPhotoYellowCrossRuntime=()=>{'
])assert(html.includes(token),'Missing source-backed street hookup '+token);
console.log('PASS 5.130 whole Spojovaci photo context: 1 blue P sign, 1 lamp, real OSM marked crossing and one-floor commercial neighbor');
