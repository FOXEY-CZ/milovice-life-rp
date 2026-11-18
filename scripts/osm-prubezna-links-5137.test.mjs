// Milovice RP 5.137: two *existing* asphalt sidewalk connections,
 // strictly gated by each original OSM vertex and the original road.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPrubeznaPedestrianLinks,isPrubeznaPedestrianLink,PRUBEZNA_5137_SOURCE}
 from './osm-prubezna-links-5137.js';
const data=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const ways=data.elements.filter(e=>e.tags?.highway);
const plan=planPrubeznaPedestrianLinks({regionId:'mlada',ways});
assert(plan,'Must use the exact shipped OSM walking paths');
assert.equal(plan.version,'5.137');
assert.equal(plan.sourceMainRoadId,'83076189');
assert.deepEqual(plan.sourceFootwayIds,['1282219855','1282219856']);
assert.equal(plan.originalFootwayMetres,48.8);
assert.equal(plan.sourceFootwayCount,2);
assert.deepEqual(plan.sourceFootways.map(w=>w.unchangedOSMVertices),[2,2]);
for(const w of plan.sourceFootways){
 assert.equal(isPrubeznaPedestrianLink(plan,ways.find(x=>String(x.id)===w.id)),true);
}
for(const [key,value] of Object.entries({
 addedFootways:0,addedColliders:0,addedParkingSpots:0,
 addedLightingPoles:0,addedCrossings:0,addedCurbs:0
}))assert.equal(plan[key],value,'No model invention: '+key);
assert.equal(plan.originalFootwayOSMGeometryPreserved,true);
assert.equal(plan.originalOneWayTrafficPreserved,true);
assert.equal(plan.actualRepavingOfTheseExactLinksPhotographed,false);
const alter=(id,update)=>ways.map(w=>String(w.id)===id?update(w):w);
for(const source of PRUBEZNA_5137_SOURCE.ways){
 const id=source.id,original=ways.find(w=>String(w.id)===id);
 for(const update of [
  w=>({...w,tags:{...w.tags,surface:'paving_stones'}}),
  w=>({...w,tags:{...w.tags,footway:'crossing'}}),
  w=>({...w,tags:{...w.tags,access:'private'}}),
  w=>({...w,geometry:w.geometry.map((p,i)=>i?{...p,lat:p.lat+.000002}:p)}),
  w=>({...w,geometry:w.geometry.slice(0,1)})
 ])assert.equal(planPrubeznaPedestrianLinks({regionId:'mlada',
  ways:alter(id,update)}),null,'Fail closed on source changes '+id);
 assert.equal(isPrubeznaPedestrianLink(plan,{...original,id:999}),false);
}
assert.equal(planPrubeznaPedestrianLinks({regionId:'vrutice',ways}),null);
assert.equal(planPrubeznaPedestrianLinks({regionId:'mlada',
 ways:alter('83076189',w=>({...w,tags:{...w.tags,oneway:'no'}}))}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-prubezna-links-5137.js?v=513700'",
 'const prubeznaLinkPlan=planPrubeznaPedestrianLinks({regionId,ways:roadWays})',
 'isPrubeznaPedestrianLink(prubeznaLinkPlan,el)',
 'prubeznaLinkPlan.renderedExistingSegments+=drawn',
 "'prubezna-links-5137':{",
 'streetAudit=prubezna-links-5137',
 'window.__milovicePrubeznaLinksRuntime=()=>(',
 "prubeznaPaver||prubeznaLink",
])assert(html.includes(term),'Required real visual integration missing: '+term);
assert(PRUBEZNA_5137_SOURCE.tender.includes('contract_display_51.html'));
console.log('PASS 5.137: 2 original OSM asphalt footway links / 48.8 m, safeguarded and material-rendered only');
