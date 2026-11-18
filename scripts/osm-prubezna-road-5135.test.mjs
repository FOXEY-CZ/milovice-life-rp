// Milovice RP 5.135 — one real mapped road, same 12 centreline segments.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPrubeznaRoadRenewal,isPrubeznaRenovatedRoad,PRUBEZNA_5135_SOURCE}
 from './osm-prubezna-road-5135.js';
const src=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const road=src.elements.find(e=>e.id===83076189);
assert(road,'Original OSM Průběžná one-way way missing from Mladá');
const original=JSON.stringify(road);
const plan=planPrubeznaRoadRenewal({regionId:'mlada',ways:[road]});
assert(plan,'Original way must pass strict map identity and route guard');
assert.equal(plan.version,'5.135');
assert.equal(plan.sourceRoadId,'83076189');
assert.equal(plan.sourceOSMVertices,13);
assert.equal(plan.sourceOSMSegments,12);
assert.equal(plan.sourceOSMMetres,256.6);
assert.equal(plan.documentedTotalRenovationApproxMetres,400);
assert.equal(plan.preciseResurfacingBoundarySurveyed,false);
assert.equal(plan.roadWideningOrNarrowingSurveyed,false);
assert.equal(plan.originalRoadWidthPreserved,true);
assert.equal(plan.originalVertexGeometryPreserved,true);
assert.equal(plan.originalTrafficGraphPreserved,true);
assert.equal(plan.originalPedestrianPathsPreserved,true);
assert.equal(plan.oldOSMOneWayPreserved,true);
assert.equal(plan.newRoadSegments,0);
assert.equal(plan.addedMeshes,0);
assert.equal(plan.addedColliders,0);
assert.equal(plan.newCurbs,0);
assert.equal(plan.inventedParkingSpaces,0);
assert.equal(plan.inventedStreetLights,0);
assert.equal(plan.inventedPaintedLines,0);
assert.equal(isPrubeznaRenovatedRoad(plan,road),true);
assert.equal(isPrubeznaRenovatedRoad(plan,{...road,id:83076190}),false);
assert.equal(JSON.stringify(road),original);
for(const invalid of [
 {regionId:'old'},
 {regionId:'vrutice'},
 {ways:[]},
 {ways:[{...road,tags:{...road.tags,name:'Sportovní'}}]},
 {ways:[{...road,tags:{...road.tags,highway:'footway'}}]},
 {ways:[{...road,tags:{...road.tags,oneway:'no'}}]},
 {ways:[{...road,tags:{...road.tags,surface:'gravel'}}]},
 {ways:[{...road,geometry:road.geometry.slice(1)}]},
 {ways:[{...road,geometry:road.geometry.map((p,i)=>i===7?
  {...p,lon:p.lon+.0009}:p)}]},
 {ways:[{...road,geometry:road.geometry.map((p,i)=>i===2?
  {...p,lat:p.lat+.00001}:p)}]}
]){
 assert.equal(planPrubeznaRoadRenewal({regionId:'mlada',ways:[road],...invalid}),null,
  'Changed street metadata or geometry must disable asphalt override');
}
assert(PRUBEZNA_5135_SOURCE.tender.includes('contract_display_51.html'));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-prubezna-road-5135.js?v=513500'",
 "const prubeznaRoadPlan=planPrubeznaRoadRenewal({regionId,ways:roadWays})",
 "isPrubeznaRenovatedRoad(prubeznaRoadPlan,el)",
 "'prubezna-repaired-asphalt':cityMatte(",
 "'prubezna-road-asphalt-5135':{",
 'streetAudit=prubezna-road-asphalt-5135',
 'window.__milovicePrubeznaRoadRuntime=()=>({',
 'prubeznaRoadPlan.renderedExistingSegments+=drawn',
 'oneway:el.tags.oneway',
 'osmRoadSegment(points[i-1],points[i],width,kind,surfacePlan)'
])assert(html.includes(token),'Real OSM asphalt renderer missing '+token);
console.log('PASS 5.135 original Průběžná OSM: 256.6m / 12 road segments / original oneway, 0 new road geometry or invented infrastructure');
