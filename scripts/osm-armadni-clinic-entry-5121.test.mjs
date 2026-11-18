// Milovice RP 5.121: real OSM clinic + photo-supported entrance guard.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame,facadePoint} from './facade-anchors.js';
import {planClinicPhotoEntry,CLINIC_FRONT_SOURCES}
 from './osm-armadni-clinic-entry-5121.js';
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const old=JSON.parse(readFileSync(new URL(
 '../data/regions/vrutice.json',import.meta.url),'utf8')).elements;
const clinic=elements.find(e=>e.id===1057548624);
const spojovaci=elements.find(e=>e.id===246652750);
assert(clinic&&spojovaci,'Both sources need actual OSM ways');
assert(!old.some(e=>e.id===1057548624));
assert.equal(clinic.tags.amenity,'clinic');
assert.equal(spojovaci.tags.name,'Spojovací');
const cos=Math.cos(50.226*Math.PI/180),k=111320;
const project=p=>({x:(p.lon-14.889)*k*cos,
 z:-(p.lat-50.226)*k});
const points=clinic.geometry.slice(0,-1).map(project);
const frame=exteriorFacadeFrame(points,2);
assert(frame&&frame.nx>.95);
const road={osmId:spojovaci.id,
 kind:spojovaci.tags.highway,name:spojovaci.tags.name,
 points:spojovaci.geometry.map(project)};
const params={id:clinic.id,regionId:'mlada',tags:clinic.tags,
 polygon:points,front:frame,sourceRoad:road,
 floors:4,modelHeight:12.9};
const snapshot=JSON.stringify([clinic,spojovaci]);
const plan=planClinicPhotoEntry(params);
assert(plan,'Existing OSM photo façade must be eligible');
assert.equal(plan.sourceWayId,'1057548624');
assert.equal(plan.streetWayId,'246652750');
assert.equal(plan.faceIndex,2);
assert.equal(plan.bays,8);
assert.equal(plan.bayIndex,4);
assert.equal(plan.entrance.usableWalkingPortal,false);
assert.equal(plan.photoEntranceSurveyed,false);
assert.equal(plan.estimatedCanopyDimensions,true);
assert.equal(plan.originalGeometryUntouched,true);
assert.equal(plan.roadGeometryChanged,false);
assert.equal(plan.newFootpaths,0);
assert.equal(plan.parkingPolygonsCreated,0);
assert.equal(plan.inferredOutdoorSteps,0);
assert(plan.facadeAdjacentRoadDistanceMetres>17);
assert(plan.facadeAdjacentRoadDistanceMetres<20);
const expected=facadePoint(frame,plan.along,0);
assert(Math.hypot(expected.x-plan.center.x,expected.z-plan.center.z)<1e-9);
assert(plan.entrance.width<plan.canopy.width);
assert(plan.canopy.projection<=1.2);
assert.equal(plan.photoSource,CLINIC_FRONT_SOURCES.photo);
assert.deepEqual(plan,planClinicPhotoEntry(params));
assert.equal(JSON.stringify([clinic,spojovaci]),snapshot,
 'Planner must never mutate source map content');
// Tag, roof height, photography, street direction or source changes
// must NOT trigger plausible but invented clinics elsewhere in town.
for(const invalid of [
 {id:53865798},{regionId:'vrutice'},
 {tags:{...clinic.tags,name:'Poliklinika Praha'}},
 {tags:{...clinic.tags,height:'13'}},
 {tags:{...clinic.tags,'building:levels':'4'}},
 {tags:{...clinic.tags,access:'private'}},
 {tags:{...clinic.tags,amenity:'school'}},
 {polygon:points.slice(0,3)}, {front:{...frame,index:0}},
 {front:{...frame,nx:-frame.nx}},
 {sourceRoad:{...road,osmId:1}},
 {sourceRoad:{...road,name:'Armádní'}},
 {sourceRoad:{...road,kind:'service'}},
 {sourceRoad:{...road,points:[]}},
 {floors:2},{modelHeight:11.2},
 {photoReviewed:true},{approvedArchitecture:true},
 {sourceRoad:{...road,points:[{x:frame.mx+2,z:frame.mz-8},
 {x:frame.mx+2,z:frame.mz+8}]}}
]){
 assert.equal(planClinicPhotoEntry({...params,...invalid}),null,
  'Must reject changed building/access/photo source '+JSON.stringify(invalid).slice(0,105));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const tokens=[
 "from './scripts/osm-armadni-clinic-entry-5121.js?v=512100'",
 "const entryPlan=planClinicPhotoEntry({",
 "const entryGrade=entryPlan?planGroundedEntrance(facade,{",
 "if(level===0&&entryPlan&&entryGrade&&bay===entryPlan.bayIndex)",
 "archPart('clinicEntryGlass'",
 "archPart('clinicEntryFrame'",
 "archPart('clinicEntryCanopy'",
 "window.__miloviceClinicEntranceAudit={",
 "window.__miloviceClinicEntranceRuntime=()=>{",
 "kind.startsWith('clinicEntry')",
 "exactEntranceBayVerified:false",
 "walkingPortalCreated:false",
 "inventedParkingSpaces:0,newFootpaths:0",
 "href=\"?v=513000&streetAudit=armadni-clinic-5118\"",
 "href=\"?v=513000&streetAudit=armadni-billa-5118\""
];
for(const tok of tokens)assert(html.includes(tok),'Missing '+tok);
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert.equal(html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],build);
assert.equal(html.split('id="build-label">')[1]?.split('</strong>')[0],build);
for(const previous of [
 "window.__miloviceArmLandmarksRuntime=()=>{",
 "window.__miloviceBillaTrolleyRuntime=()=>{",
 "window.__miloviceBillaSignAudit={",
 "window.__miloviceStreetGeometryAudit=sidewalkGeometryStats",
 "const isArmClinic=armLandmark?.kind==='polyclinic'"
])assert(html.includes(previous),'Preserve previous work '+previous);
console.log('PASS 5.121 OSM Poliklinika photo canopy, terrain-following glazed portal, source street and no inferred parking/footpaths');
