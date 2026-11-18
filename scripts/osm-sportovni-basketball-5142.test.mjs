// 5.142 – source-guarded real OSM basketball court, exactly TWO hoops.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSportovniBasketballHoops,SPORTOVNI_BASKETBALL_5142}
 from './osm-sportovni-basketball-5142.js';
import {insideMappedPitch} from './osm-pitch-markings-599.js';

const data=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8'));
const source=data.elements.filter(e=>String(e.id)==='1278746587');
assert.equal(source.length,1);
const way=source[0];
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const road={isClear:()=>true},buildings={isClear:()=>true};
const inputs={regionId:'mlada',way,toWorld,roads:road,buildings};
const initial=JSON.stringify(way);
const plan=planSportovniBasketballHoops(inputs);
assert(plan,'Exact OSM court must be recognized');
assert.equal(plan.version,'5.142');
assert.equal(plan.sourceCourtId,SPORTOVNI_BASKETBALL_5142.id);
assert.equal(plan.sourceOSMHash,'40a2c301');
assert.equal(plan.sourceBasketCount,2);
assert.equal(plan.hoops.length,2);
assert.equal(plan.placedWithinOriginalPitch,true);
assert.equal(plan.inventedHoops,0);
assert.equal(plan.inventedFences,0);
assert.equal(plan.inventedCourtPolygons,0);
assert.equal(plan.newCollisionVolumes,0);
assert.equal(plan.photographicBasketLocationsVerified,false);
assert(plan.courtMeters.length>=23&&plan.courtMeters.width>=9);
const outline=way.geometry.map(toWorld);
for(const h of plan.hoops){
 assert.equal(h.heightMeters,3.05);
 for(const p of [h.post,h.board,h.rim])
  assert(insideMappedPitch(p.x,p.z,outline),'All points on actual OSM court');
}
assert(Math.hypot(plan.hoops[0].post.x-plan.hoops[1].post.x,
 plan.hoops[0].post.z-plan.hoops[1].post.z)>20);
assert.equal(JSON.stringify(way),initial,'Never mutate the source polygon');
for(const change of [
 {regionId:'old'}, {way:{...way,tags:{...way.tags,hoops:'1'}}},
 {way:{...way,tags:{...way.tags,access:'private'}}},
 {way:{...way,tags:{...way.tags,sport:'tennis'}}},
 {way:{...way,geometry:way.geometry.map((p,i)=>i===2?
  {...p,lat:p.lat+.0000001}:p)}},
 {way:{...way,geometry:way.geometry.slice(0,-1)}},
 {roads:{isClear:()=>false}}, {buildings:{isClear:()=>false}}
]){
 assert.equal(planSportovniBasketballHoops({...inputs,...change}),null,
  'Incorrect, unverified or blocked source must suppress ALL hoops');
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 "from './scripts/osm-sportovni-basketball-5142.js?v=514200'",
 'planSportovniBasketballHoops({',
 'renderSportovniBasketballHoops(THREE,',
 '__miloviceSportovniBasketballRuntime',
 'streetAudit=sportovni-basketball-5142'
]){
 assert(html.includes(snippet),'Court must be integrated into live scene: '+snippet);
}
console.log('PASS 5.142: exactly two OSM-mapped basketball hoops inside original Sportovni court; 0 invented or mutated public objects');
