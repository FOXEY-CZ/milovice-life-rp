// Part 20: real OSM-facing entrance orientation regression.
// Execute with node --experimental-default-type=module scripts/street-frontage-index.test.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeStreetFrontageIndex} from './street-frontage-index.js';

const building=[{x:0,y:0},{x:12,y:0},{x:12,y:8},{x:0,y:8}];
const publicRoad={osmId:11,kind:'residential',width:7.8,
 points:[{x:-25,y:-11},{x:25,y:-11}]};
const unrelatedPrivate={osmId:5,kind:'service',access:'private',
 points:[{x:-25,y:10},{x:25,y:10}]};
const parkingAisle={osmId:6,kind:'service',serviceTag:'parking_aisle',
 points:[{x:-25,y:10},{x:25,y:10}]};
const spatial=makeStreetFrontageIndex();
assert.equal(spatial.select(building),null,'No streets means no invented door');
spatial.addRoad(unrelatedPrivate);
spatial.addRoad(parkingAisle);
assert.equal(spatial.select(building),null,'Private driveways/parking aisles do not establish street frontage');
spatial.addRoad(publicRoad);
let chosen=spatial.select(building);
assert(chosen,'Public roadway should identify the actual external facade');
assert.equal(chosen.roadId,'11');
assert(Math.abs(chosen.mx-6)<.001&&Math.abs(chosen.mz)<.001,
 'Door remains attached to the bottom OSM wall, never the back garden');
assert.equal(chosen.photographicallyVerified,false);
assert.equal(chosen.inferred,true);
const other=makeStreetFrontageIndex();
other.addRoad({...publicRoad,points:[...publicRoad.points].reverse()});
chosen=other.select([...building].reverse());
assert(chosen,'Reversing valid OSM winding must preserve the correct street');
assert(Math.abs(chosen.mx-6)<.001&&Math.abs(chosen.mz)<.001,
 'Reversed OSM outline still points to the same physical wall');
assert.equal(chosen.roadId,'11');
assert.equal(spatial.summary().syntheticDriveways,0);
assert.equal(spatial.summary().privateEntrancesInferred,0);

// Cross-check the planner on exact, unmodified OSM coordinates in TWO districts.
// These are coverage sanity checks, not claims that actual door positions
// or house facades have been surveyed in person.
const cosine=Math.cos(50.226*Math.PI/180);
const toWorld=p=>({x:(p.lon-14.889)*111320*cosine,
 y:-(p.lat-50.226)*111320});
for(const [id,minRoadFronts] of [['mlada',690],['vrutice',340]]){
 const data=JSON.parse(readFileSync(
  new URL('../data/regions/'+id+'.json',import.meta.url),'utf8'));
 const index=makeStreetFrontageIndex();
 for(const e of data.elements){
  const tags=e.tags||{};
  if(!tags.highway||!Array.isArray(e.geometry))continue;
  index.addRoad({points:e.geometry.map(toWorld),kind:tags.highway,
   width:7.8,osmId:e.id,access:tags.access||'',
   serviceTag:tags.service||''});
 }
 let candidates=0,matched=0;
 for(const el of data.elements){
  if(!['house','residential','yes','detached','terrace','semidetached_house']
   .includes(el.tags?.building)||!Array.isArray(el.geometry))continue;
  const outline=el.geometry.map(toWorld);
  if(outline.length<4)continue;
  const xs=outline.map(p=>p.x),ys=outline.map(p=>p.y);
  if(Math.max(...xs)-Math.min(...xs)<2||Math.max(...ys)-Math.min(...ys)<2)
   continue;
  candidates++;
  const face=index.select(outline);
  if(!face)continue;
  matched++;
  assert(face.roadDistance<=38,'Road exceeds search distance');
  assert(face.facing>=.45,'Selected facade does not face its street');
  assert(face.alignment>=.38,'Road intersects unsupported building side');
  assert.equal(face.photographicallyVerified,false);
 }
 assert(matched>=minRoadFronts,
  id+': too few whole-city houses have public street-facing sides');
 assert(matched<=candidates,'No imaginary buildings may be added');
 const info=index.summary();
 assert(info.spatialCandidates<200000,'Indexed lookup must remain suitable for mobile');
 assert.equal(info.syntheticRoads,0);
 console.log(id+': mapped street-facing facades '+matched+'/'+candidates+
  ', spatial candidates '+info.spatialCandidates);
}
console.log('PASS public OSM street-frontage 5.91 Part 20: real street sides, private access filtering, winding invariance');
