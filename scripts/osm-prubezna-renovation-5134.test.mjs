// 5.134: the city's 2023 permit and 2025 public works contract
// authorize concrete paving *as a material model* on existing Průběžná
// OSM footways; no guessed parking spaces, crossing, lamps or kerbs.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 planPrubezna2025Pavers,isPrubezna2025PaverWay,PRUBEZNA_2025
} from './osm-prubezna-renovation-5134.js';
const source=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const ids=[83076189,1046197808,1278746581];
const ways=source.elements.filter(w=>ids.includes(w.id));
assert.equal(ways.length,3,'Checked-in city OSM geometry changed');
const original=JSON.stringify(ways);
const plan=planPrubezna2025Pavers({regionId:'mlada',ways});
assert(plan,'Mapped Průběžná source connection missing');
assert.equal(plan.version,'5.134');
assert.deepEqual(plan.sourceFootwayIds,['1046197808','1278746581']);
assert.equal(plan.sourceRoadId,'83076189');
assert.equal(plan.updatedSurfaceWayCount,2);
assert.equal(plan.originalOSMFootwayLengthMeters,301);
assert.deepEqual(plan.sourceFootways.map(p=>p.originalVertexCount),[10,7]);
assert.deepEqual(plan.sourceFootways.map(p=>p.osmSurfaceTag),[null,'asphalt']);
assert.deepEqual([plan.plannedParkingTotal,plan.plannedAngleParking,
 plan.plannedPerpendicularParking,plan.plannedAccessibleSpaces,plan.plannedLights],
 [109,94,15,6,22]);
assert.equal(plan.plannedAngleParking+plan.plannedPerpendicularParking,109);
assert.equal(plan.exactRenovationBoundariesSurveyed,false);
assert.equal(plan.asBuiltPhotographicMatch,false);
assert.equal(plan.newParkingBays,0);
assert.equal(plan.newLightPoles,0);
assert.equal(plan.newFootways,0);
assert.equal(plan.newColliders,0);
assert.equal(plan.existingOSMGeometryPreserved,true);
assert.equal(isPrubezna2025PaverWay(plan,ways[1]),true);
assert.equal(isPrubezna2025PaverWay(plan,ways[2]),true);
assert.equal(isPrubezna2025PaverWay(plan,ways[0]),false);
assert.equal(PRUBEZNA_2025.plannedParkingTotal,109);
assert(PRUBEZNA_2025.permit.includes('14345'));
assert(PRUBEZNA_2025.tender.includes('contract_display_51'));
assert.equal(JSON.stringify(ways),original);
const changes=[
 {regionId:'old'},
 {regionId:'vrutice'},
 {ways:ways.slice(0,2)},
 {ways:ways.map(w=>w.id===83076189?{...w,tags:{...w.tags,oneway:'no'}}:w)},
 {ways:ways.map(w=>w.id===83076189?{...w,tags:{...w.tags,name:'Sportovní'}}:w)},
 {ways:ways.map(w=>w.id===1046197808?{...w,tags:{...w.tags,surface:'gravel'}}:w)},
 {ways:ways.map(w=>w.id===1278746581?{...w,tags:{...w.tags,footway:'crossing'}}:w)},
 {ways:ways.map(w=>w.id===1278746581?{...w,geometry:w.geometry.map((p,i)=>i===2?{...p,lat:p.lat+.0002}:p)}:w)},
 {ways:ways.map(w=>w.id===1046197808?{...w,id:1046197807}:w)}
];
for(const mod of changes)
 assert.equal(planPrubezna2025Pavers({regionId:'mlada',ways,...mod}),null,
  'City material override must reject unrelated/altered OSM sources');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-prubezna-renovation-5134.js?v=513400'",
 "const prubezna2025Plan=planPrubezna2025Pavers({regionId,ways:roadWays})",
 "isPrubezna2025PaverWay(prubezna2025Plan,el)",
 "'prubezna-concrete':cityMatte(",
 "window.__milovicePrubezna2025Audit=prubezna2025Plan",
 "'prubezna-renovation-5134':{",
 'streetAudit=prubezna-renovation-5134',
 'prubezna2025Plan.appliedVisualSegments+=drawn'
])assert(html.includes(token),'Game renderer missing source-gated paving: '+token);
console.log('PASS 5.134: 301m of two original OSM walking ways, city concrete pavers only, 0 invented parking bays/lamps/roads/crossings.');
