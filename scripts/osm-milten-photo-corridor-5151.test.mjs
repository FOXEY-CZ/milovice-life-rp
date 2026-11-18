import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {insideMappedPitch} from './osm-pitch-markings-599.js';
import {MILTEN_CORRIDOR_5151 as S,planMiltenCorridor5151}
 from './osm-milten-photo-corridor-5151.js';

const source=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const pitch=source.find(e=>String(e.id)===S.pitchId),
 hall=source.find(e=>String(e.id)===S.hallId);
assert(pitch&&hall);
const sourceGPS=JSON.stringify([pitch,hall]);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const plan=planMiltenCorridor5151({
 regionId:'mlada',pitch,hall,toWorld
});
assert(plan,'Only correct two source OSM footprints can render fence');
assert.equal(plan.version,'5.151');
assert.equal(plan.sourceCourtId,'612386900');
assert.equal(plan.sourceHallId,'53866046');
assert.equal(plan.sourceHallRUIAN,'27906272');
assert.equal(plan.sourceHashCourt,'3dfef3a9');
assert.equal(plan.sourceHashHall,'b4bc8b6d');
assert.equal(plan.sourcePhoto,S.photoURL);
assert(plan.sourcePhotoShowsFenceAndWalkway);
assert.equal(plan.sourcePhotoGeotagged,false);
assert.equal(plan.photographicEdgeIdentification,false);
assert(plan.fenceSideModelInferred);
assert.equal(plan.footwayRouteMapped,false);
assert(plan.lengthMeters>29&&plan.lengthMeters<33);
assert.equal(plan.widthMeters,2.10);
assert.equal(plan.heightMeters,2.15);
assert.equal(plan.posts.length,11);
assert.equal(plan.pathStartOffset,.48);
assert.equal(plan.pathEndOffset,2.58);
for(const p of plan.posts)
 assert(!insideMappedPitch(p.x,p.z,pitch.geometry.map(toWorld)),
  'Every fence post is adjacent to, not inside, the court');
for(const t of [.07,.16,.3,.5,.7,.84,.93])
 for(const offset of [.12,.48,1.20,2.58]){
  const p=plan.point(t,offset);
  assert(!insideMappedPitch(p.x,p.z,pitch.geometry.map(toWorld)),
   'No invented walkway overlaps original clay OSM court');
 }
assert.equal(plan.realFootwaysAdded,0);
assert.equal(plan.newColliders,0);
assert.equal(plan.inventedGates,0);
assert.equal(plan.inventedParking,0);
assert.equal(plan.inventedStreetlights,0);
assert.equal(plan.hallBuildingNotTouched,true);
assert.equal(plan.originalOSMGeometryUnmodified,true);
assert.equal(plan.roadNetworkUnmodified,true);
assert.equal(JSON.stringify([pitch,hall]),sourceGPS);
for(const change of [
 {regionId:'old'},
 {pitch:{...pitch,id:0}},
 {pitch:{...pitch,tags:{...pitch.tags,surface:'asphalt'}}},
 {pitch:{...pitch,geometry:pitch.geometry.map((p,i)=>
   i===2?{...p,lon:p.lon+.0000001}:p)}},
 {pitch:{...pitch,geometry:pitch.geometry.slice(0,-1)}},
 {hall:{...hall,tags:{...hall.tags,'ref:ruian:building':'0'}}},
 {hall:{...hall,geometry:hall.geometry.map((p,i)=>
   i===9?{...p,lat:p.lat+.0000001}:p)}},
 {toWorld:()=>({x:0,z:0})}
])assert.equal(planMiltenCorridor5151({
 regionId:'mlada',pitch,hall,toWorld,...change
}),null,'Unknown source => skip all photo-inferred new objects');

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-milten-photo-corridor-5151.js?v=515100'",
 'planMiltenCorridor5151({',
 'renderMiltenCorridor5151(THREE,',
 'window.__miloviceMiltenCorridorRuntime=()=>({',
 'streetAudit=milten-court-corridor-5151',
 'hall:hall[0]'
])assert(html.includes(token),'Missing live 5.151 camera and renderer: '+token);
console.log('PASS 5.151 photo-existence model court fence/walkway; two locked original OSM polygons, zero new routes and collisions');
