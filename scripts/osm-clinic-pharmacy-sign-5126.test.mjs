// 5.126 source-gated pharmacy lettering: authentic OSM and photo, no invented logo.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotoEntry} from './osm-armadni-clinic-entry-5121.js';
import {planClinicPhotoStorefronts} from './osm-clinic-storefronts-5124.js';
import {planClinicPhotoPharmacySign,CLINIC_PHARMACY_SIGN_SOURCES}
 from './osm-clinic-pharmacy-sign-5126.js';
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=elements.find(x=>x.id===1057548624);
const street=elements.find(x=>x.id===246652750);
assert(clinic&&street);
const saved=JSON.stringify([clinic,street]);
const k=111320,cos=Math.cos(50.226*Math.PI/180);
const w=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
const polygon=clinic.geometry.slice(0,-1).map(w);
const front=exteriorFacadeFrame(polygon,2);
const sourceRoad={osmId:street.id,kind:street.tags.highway,
 name:street.tags.name,points:street.geometry.map(w)};
const entrance=planClinicPhotoEntry({id:clinic.id,regionId:'mlada',
 tags:clinic.tags,polygon,front,sourceRoad,floors:4,modelHeight:12.9});
assert(entrance);
const storefront=planClinicPhotoStorefronts({id:clinic.id,
 regionId:'mlada',tags:clinic.tags,polygon,front,floors:4,
 modelHeight:12.9,existingEntrance:entrance});
assert(storefront);
const args={id:clinic.id,regionId:'mlada',tags:clinic.tags,
 front,storefront,entrance};
const p=planClinicPhotoPharmacySign(args);
assert(p,'Source photographed clinic must have its pharmacy sign');
assert.equal(p.version,'5.126');
assert.equal(p.osmClinicId,'1057548624');
assert.equal(p.photoSource,CLINIC_PHARMACY_SIGN_SOURCES.photo);
assert.equal(p.photographedText,'LÉKÁRNA');
assert.equal(p.signActuallyVisibleInPhoto,true);
assert.equal(p.photoRelativeSouthSideConfirmed,true);
assert.equal(p.approximatedGlassBay,1);
assert(p.along<0);
assert(Math.abs(p.along)+p.width/2<front.len/2-.35);
assert.equal(p.exactStorefrontBayEstablished,false);
assert.equal(p.exactWorldLetteringPositionMeasured,false);
assert.equal(p.signDimensionsMeasured,false);
assert.equal(p.LEMONBrandSignObserved,false);
assert.equal(p.photoPixelsCopied,false);
assert.equal(p.addedSignMeshes,1);
for(const no of ['newDoors','newBuildings','newFootways','newRoads',
 'newParkingSpaces','newTrafficSigns'])assert.equal(p[no],0);
assert.equal(p.existingOSMBuildingUnchanged,true);
assert.equal(p.originalForecourtAndCarriagewayUntouched,true);
assert.deepEqual(p,planClinicPhotoPharmacySign(args));
assert.equal(JSON.stringify([clinic,street]),saved);
for(const patch of [
 {id:53865798},{regionId:'old'},
 {tags:{...clinic.tags,name:'Unrelated clinic'}},
 {tags:{...clinic.tags,healthcare:'hospital'}},
 {front:null},{front:{...front,index:1}},
 {front:{...front,nx:-front.nx}},
 {front:{...front,uz:-front.uz}},
 {storefront:null},
 {storefront:{...storefront,existingMainEntranceBay:3}},
 {storefront:{...storefront,groundGlass:[]}},
 {storefront:{...storefront,pharmacyExactShopfrontBayKnown:true}},
 {entrance:null},{entrance:{...entrance,bayIndex:2}},
 {photoReviewed:true},{approvedArchitecture:true}
])assert.equal(planClinicPhotoPharmacySign({...args,...patch}),null,
 'Reject wrong photo/OSM input: '+JSON.stringify(patch).slice(0,120));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const str of [
 "from './scripts/osm-clinic-pharmacy-sign-5126.js?v=512600'",
 'const signPlan=shopPlan?planClinicPhotoPharmacySign({',
 "sign.name='Milovice_Spojovaci_ClinicPhotoPharmacySign_5126'",
 'ctx.fillText(signPlan.photographedText,256,74)',
 'window.__miloviceClinicPhotoPharmacySignAudit={',
 'window.__miloviceClinicPhotoPharmacySignRuntime=()=>{',
 'sign.userData.lodDetail=false',
 'window.__miloviceClinicShopfrontAudit.physicalPharmacySignAdded=true',
 "const BUILD_ID='",
 'href="?v=513200&streetAudit=armadni-clinic-5118"',
 'window.__miloviceClinicParkingInlaysRuntime=()=>{',
 'window.__miloviceClinicForecourtRuntime=()=>{',
 'window.__miloviceClinicShopfrontRuntime=()=>{'
])assert(html.includes(str),'Missing 5.126 integration '+str);
console.log('PASS 5.126 photographed green LÉKÁRNA on the correct real OSM clinic, unmapped precise shop bay not asserted');
