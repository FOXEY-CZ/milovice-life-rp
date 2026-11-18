// Milovice RP 5.124: source-backed LEMON tenant + photographed clinic glazing.
// Ground shopfront glass is based on ABP + SPADIA exterior photos, not
// guessed pharmacy unit locations, sign boards or additional walkable doors.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotoEntry} from './osm-armadni-clinic-entry-5121.js';
import {planClinicPhotoStorefronts,CLINIC_STOREFRONT_SOURCES}
 from './osm-clinic-storefronts-5124.js';
const source=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=source.find(el=>el.id===1057548624);
const street=source.find(el=>el.id===246652750);
assert(clinic&&street);
const k=111320,cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
const points=clinic.geometry.slice(0,-1).map(world);
const frame=exteriorFacadeFrame(points,2);
const road={osmId:street.id,kind:street.tags.highway,
 name:street.tags.name,points:street.geometry.map(world)};
const entry=planClinicPhotoEntry({
 id:clinic.id,regionId:'mlada',tags:clinic.tags,polygon:points,
 front:frame,sourceRoad:road,floors:4,modelHeight:12.9
});
assert(entry);
const options={id:clinic.id,regionId:'mlada',tags:clinic.tags,
 polygon:points,front:frame,floors:4,modelHeight:12.9,
 existingEntrance:entry};
const baseline=JSON.stringify([clinic,street]);
const planned=planClinicPhotoStorefronts(options);
assert(planned,'Photo source and real clinic OSM input must be eligible');
assert.equal(planned.sourceBuildingId,'1057548624');
assert.equal(planned.frontFaceEdge,2);
assert.equal(planned.bays,8);
assert.equal(planned.existingMainEntranceBay,4);
assert.equal(planned.groundWindowBays,7);
assert.equal(planned.originalFloatingGroundWindowsRemoved,7);
assert.equal(planned.replacementGlassPanels,7);
assert.equal(planned.framePiecesPerBay,7);
assert.equal(planned.newBusinessSignMeshes,0);
assert.equal(planned.newAssumedShopDoorHoles,0);
assert.equal(planned.newRoads,0);
assert.equal(planned.newParkingBays,0);
assert.equal(planned.newFootways,0);
assert.equal(planned.actualPharmacyInBuilding,true);
assert.equal(planned.actualLabInBuilding,true);
assert.equal(planned.pharmacyBusinessName,'Lékárna LEMON');
assert.equal(planned.labBusinessName,'SPADIA odběrové místo');
assert.equal(planned.pharmacyExactShopfrontBayKnown,false);
assert.equal(planned.pharmacySignPhysicallyObserved,false);
assert.equal(planned.allMullionDimensionsEstimated,true);
assert.equal(planned.allGroundGlazingPhotoSupported,true);
assert.equal(planned.photoSource,CLINIC_STOREFRONT_SOURCES.constructionPhoto);
assert.equal(planned.secondExterior,CLINIC_STOREFRONT_SOURCES.recentExteriorPhoto);
assert.equal(planned.pharmacySource,CLINIC_STOREFRONT_SOURCES.pharmacyOfficial);
assert.equal(planned.groundGlass.length,7);
assert.deepEqual(planned.groundGlass.map(g=>g.bay),[0,1,2,3,5,6,7]);
for(const g of planned.groundGlass){
 assert(g.glassWidth>3.7&&g.glassWidth<4.0);
 assert(g.topAboveFoundation>2.8&&g.topAboveFoundation<3.2);
 assert.equal(g.mullionAlong.length,4);
 assert.equal(g.frameThickness,.062);
 assert(g.transomHeightFromGround>1&&g.transomHeightFromGround<1.3);
 assert.equal(g.realDoorExistsHere,false);
 assert.equal(g.glassWallIsPassable,false);
 assert(Math.abs(g.along)+g.glassWidth*.5<frame.len/2-.25);
}
assert.deepEqual(planned,planClinicPhotoStorefronts(options));
assert.equal(JSON.stringify([clinic,street]),baseline,
 'Do not mutate actual clinic or Spojovaci OSM source data');
// Reject other medical buildings and altered facade/level/photo status.
for(const patch of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,building:'hospital'}},
 {tags:{...clinic.tags,name:'Poliklinika Nymburk'}},
 {tags:{...clinic.tags,healthcare:'hospital'}},
 {tags:{...clinic.tags,height:'13'}},
 {tags:{...clinic.tags,'building:levels':'4'}},
 {tags:{...clinic.tags,access:'private'}},
 {polygon:points.slice(0,3)},
 {front:null},{front:{...frame,index:0}},
 {front:{...frame,nx:-frame.nx}},
 {floors:3},{modelHeight:10.2},
 {existingEntrance:null},
 {existingEntrance:{...entry,faceIndex:1}},
 {existingEntrance:{...entry,bayIndex:3}},
 {photoReviewed:true},{approvedArchitecture:true}
]){
 assert.equal(planClinicPhotoStorefronts({...options,...patch}),null,
  'Wrong street source must not produce storefront '+JSON.stringify(patch).slice(0,110));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-clinic-storefronts-5124.js?v=512400'",
 "const shopPlan=entryPlan?planClinicPhotoStorefronts({",
 "if(level===0&&shopPlan&&entryGrade)",
 "const grade=planGroundedEntrance(facade,{",
 "archPart('clinicShopGlass'",
 "archPart('clinicShopFrame'",
 "window.__miloviceClinicShopfrontAudit={",
 "window.__miloviceClinicShopfrontRuntime=()=>{",
 "kind.startsWith('clinicShop')",
 "clinicPhotoGroundGlazedBays",
 "physicalPharmacySignAdded:false",
 "pharmacyPlacementOnFacadeVerified:false",
 "const BUILD_ID='20261118-spojovaci-photographed-verge-saplings-512900'",
 "href=\"?v=512900&streetAudit=armadni-clinic-5118\"",
 "id=\"street-audit-clinic-tenants\" hidden",
 "clinicTenantPanel.hidden=rpStreetAuditId!=='armadni-clinic-5118'",
 "Přesné umístění jednotlivých provozoven na fasádě není potvrzené."
])assert(html.includes(token),'Missing grounding or tenant audit '+token);
for(const v of ['window.__miloviceClinicEntranceRuntime=()=>{',
 'window.__miloviceClinicForecourtRuntime=()=>{',
 'window.__miloviceBillaTrolleyRuntime=()=>{'])
 assert(html.includes(v),'Previous whole-street photo work must remain '+v);
console.log('PASS 5.124: real OSM clinic seven floor-height photographed glass storefronts; LEMON/SPADIA tenant addresses not fictitious signs or doors');
