// 5.123: only source-documented surface; never infer car slots or roads.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planClinicPhotographedForecourt,CLINIC_FORECOURT_SOURCE}
 from './osm-clinic-forecourt-5123.js';
const source=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const clinic=source.find(e=>e.id===1057548624);
const street=source.find(e=>e.id===246652750);
const footway=source.find(e=>e.id===1339091016);
assert(clinic&&street&&footway);
const k=111320,cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*k*cos,z:-(p.lat-50.226)*k});
const polygon=clinic.geometry.slice(0,-1).map(world);
const face=exteriorFacadeFrame(polygon,2);
const wrap=e=>({id:e.id,kind:e.tags.highway,
 name:e.tags.name||'',tags:e.tags,
 width:e.tags.highway==='service'?4.5:7.8,
 points:e.geometry.map(world)});
const cars=source.filter(e=>
 ['service','residential'].includes(e.tags?.highway)&&
 e.geometry?.some(p=>Math.abs(p.lat-50.22872)<.0011&&
 Math.abs(p.lon-14.86410)<.0012)).map(wrap);
const options={id:clinic.id,tags:clinic.tags,polygon,front:face,
 regionId:'mlada',street:wrap(street),walkingWay:wrap(footway),
 carriageways:cars};
const before=JSON.stringify([clinic,street,footway]);
const plan=planClinicPhotographedForecourt(options);
assert(plan,'Photo forecourt must be generated on genuine OSM data');
assert.equal(plan.clinicId,'1057548624');
assert.equal(plan.sourceStreetId,'246652750');
assert.equal(plan.sourceFootwayId,'1339091016');
assert.equal(plan.photo,CLINIC_FORECOURT_SOURCE.photo);
assert.equal(plan.photoObservedPaving,true);
assert.equal(plan.pavingBoundaryMeasured,false);
assert.equal(plan.oneMergedSurfaceMesh,true);
assert.equal(plan.material,'shared-city-paving');
assert(plan.cells.length>=160&&plan.cells.length<=1200);
assert(plan.pavedModelArea>120&&plan.pavedModelArea<760);
assert(plan.sourceRoadCenterDistance>16);
assert(plan.sourceRoadCenterDistance<21);
assert(plan.sourceMappedFootwayDistance>5.5);
assert(plan.sourceMappedFootwayDistance<11.5);
assert(plan.minCarriagewayClearance>=.22);
assert.equal(plan.inferredParkingBays,0);
assert.equal(plan.inferredPaintedParkingLines,0);
assert.equal(plan.newPedestrianRoutes,0);
assert.equal(plan.newRoads,0);
assert.equal(plan.newBuildings,0);
assert.equal(plan.paintedFictiveCrossings,0);
assert.equal(plan.sourceFootwaysUntouched,true);
assert.deepEqual(plan,planClinicPhotographedForecourt(options));
assert.equal(JSON.stringify([clinic,street,footway]),before,
 'Planner must never alter the OSM export');
const cross=(p,q)=>p.x*q.z-p.z*q.x;
for(const cell of plan.cells){
 assert.equal(cell.corners.length,4);
 assert(cell.area>.01);
 for(const point of cell.corners){
  assert(Number.isFinite(point.x)&&Number.isFinite(point.z));
  const d=(point.x-face.mx)*face.nx+(point.z-face.mz)*face.nz;
  assert(d>=.41&&d<15.1,'Paving cannot go behind surveyed OSM wall');
 }
}
for(const patch of [
 {id:1057548618},{regionId:'old'},
 {tags:{...clinic.tags,name:'Poliklinika Praha'}},
 {tags:{...clinic.tags,amenity:'hospital'}},
 {front:null},{front:{...face,index:1}},
 {polygon:polygon.slice(0,3)},
 {street:{...wrap(street),id:8585544}},
 {street:{...wrap(street),name:'Armádní'}},
 {street:{...wrap(street),width:12}},
 {walkingWay:{...wrap(footway),id:1339091025}},
 {walkingWay:{...wrap(footway),tags:{highway:'footway'}}},
 {walkingWay:{...wrap(footway),points:[]}},
 {carriageways:[]}, // Accepts main photographed road as fallback.
 {street:{...wrap(street),points:[{x:face.mx+2,z:face.mz-6},
  {x:face.mx+2,z:face.mz},{x:face.mx+2,z:face.mz+6}]}}
]){
 const p=planClinicPhotographedForecourt({...options,...patch});
 if(patch.carriageways) {
  assert(p,'Core mapped road must still constrain without optional streets');
  continue;
 }
 assert.equal(p,null,'Reject photo/OSM mismatch '+JSON.stringify(patch).slice(0,120));
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 "from './scripts/osm-clinic-forecourt-5123.js?v=512300'",
 "const pavement=planClinicPhotographedForecourt({",
 "mesh.name='Milovice_OSM_Spojovaci_ClinicPhotoPaving_5123'",
 "terrainAt(v.x,v.z)+.105",
 "new THREE.Mesh(geometry,osmSidewalkMat)",
 "window.__miloviceClinicForecourtAudit={",
 "window.__miloviceClinicForecourtRuntime=()=>{",
 "existingFootwayAboveSurface:true,existingAsphaltAboveSurface:true",
 "const BUILD_ID='20261118-spojovaci-photo-lit-paving-protection-512800'",
 'href="?v=512800&streetAudit=armadni-clinic-5118"'
])assert(html.includes(text),'Missing render integration '+text);
console.log('PASS 5.123 paved Poliklinika Spojovací forecourt: photo+real OSM road/sidewalk clipped, zero parking invention');
