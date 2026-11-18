// Milovice RP 5.139: one real 24-vertex north housing-estate sidewalk.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSportovni2025Sidewalk,isSportovni2025Sidewalk,SPORTOVNI_5139_SOURCE}
 from './osm-sportovni-sidewalk-5139.js';
const data=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const ways=data.elements.filter(w=>w.tags?.highway);
const plan=planSportovni2025Sidewalk({regionId:'mlada',ways});
assert(plan,'The real OSM 24-node Sportovní footway must be present');
assert.equal(plan.version,'5.139');
assert.equal(plan.sourceFootwayId,'1278749454');
assert.equal(plan.sourcePairedOneWayId,'83076186');
assert.equal(plan.sourceOSMVertices,24);
assert.equal(plan.sourceOSMSegments,23);
assert.equal(plan.sourceOSMMeters,162.9);
assert.equal(plan.originalOSMSurface,'asphalt');
assert.equal(plan.proposedVisualMaterial,'prubezna-concrete');
assert.deepEqual(plan.unchangedCrossingIDs,['1278749453','1278749455']);
assert.equal(plan.originalCrossingsUnmarked,true);
assert.equal(plan.actualSpecificPathAsBuiltPhotographed,false);
assert.equal(plan.exactRenovationExtentSurveyed,false);
assert.equal(plan.mappedFootwayUnchanged,true);
assert.equal(plan.roadOneWayUnchanged,true);
assert.equal(plan.cityProjectMentionsSportovniSidewalks,true);
const foot=ways.find(w=>String(w.id)===plan.sourceFootwayId);
assert(isSportovni2025Sidewalk(plan,foot));
for(const key of ['newFootways','newRoads','newColliders',
 'newZebraCrossings','newStreetLamps','newCurbs','newParkingSpaces'])
 assert.equal(plan[key],0);
const withChange=(id,transform)=>ways.map(w=>
 String(w.id)===id?transform(w):w);
for(let i=0;i<foot.geometry.length;i++){
 const changed=withChange(plan.sourceFootwayId,w=>({...w,geometry:w.geometry.map((p,k)=>
  k===i?{...p,lon:p.lon+.0000002}:p)}));
 assert.equal(planSportovni2025Sidewalk({regionId:'mlada',ways:changed}),null,
  'Must fail closed if even one of 24 original OSM vertices changes: '+i);
}
for(const transform of [
 w=>({...w,tags:{...w.tags,surface:'paving_stones'}}),
 w=>({...w,tags:{...w.tags,footway:'crossing'}}),
 w=>({...w,geometry:w.geometry.slice(1)}),
 w=>({...w,tags:{...w.tags,access:'private'}})
]){
 assert.equal(planSportovni2025Sidewalk({regionId:'mlada',
  ways:withChange(plan.sourceFootwayId,transform)}),null);
}
for(const id of SPORTOVNI_5139_SOURCE.untouchedUnmarkedCrossings)
 assert.equal(planSportovni2025Sidewalk({regionId:'mlada',
  ways:withChange(id,w=>({...w,tags:{...w.tags,'crossing:markings':'zebra'}}))}),null,
  'Do not assume or paint a currently unmapped zebra');
assert.equal(planSportovni2025Sidewalk({regionId:'vrutice',ways}),null);
assert.equal(planSportovni2025Sidewalk({regionId:'mlada',
 ways:withChange('83076186',w=>({...w,tags:{...w.tags,oneway:'no'}}))}),null);
assert.equal(planSportovni2025Sidewalk({regionId:'mlada',
 ways:[...ways,foot]}),null,'Duplicates must not double-render');
assert.equal(isSportovni2025Sidewalk(plan,{...foot,id:987654}),false);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const text of [
 "from './scripts/osm-sportovni-sidewalk-5139.js?v=513900'",
 'const sportovniSidewalkPlan=planSportovni2025Sidewalk({regionId,ways:roadWays})',
 'isSportovni2025Sidewalk(sportovniSidewalkPlan,el)',
 'sportovniSidewalkPlan.renderedFootwayPieces+=drawn',
 "'sportovni-sidewalk-5139':{",
 'streetAudit=sportovni-sidewalk-5139',
 'window.__miloviceSportovniSidewalkRuntime=()=>({'
])assert(html.includes(text),'Missing physical sidewalk renderer: '+text);
console.log('PASS 5.139: 162.9m genuine Sportovní 24-vertex sidewalk, two genuine unchanged unmarked crossings, no fabricated road furniture');
