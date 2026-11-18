// 5.150: exactly four real source polygons, seven schematic Milten courts.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {insideMappedPitch} from './osm-pitch-markings-599.js';
import {planMiltenTennis5150,MIlTEN_TENNIS_5150 as ref}
 from './osm-sportovni-tennis-5150.js';
const source=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const ways=source.filter(w=>ref.sites.some(s=>s.id===String(w.id)));
assert.equal(ways.length,4,'Four original mapped pitches, no new polygons');
const before=JSON.stringify(ways);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const plan=planMiltenTennis5150({regionId:'mlada',ways,toWorld});
assert(plan,'Four exact source hashes and court geometry must match');
assert.equal(plan.version,'5.150');
assert.equal(plan.courts.length,7);
assert.equal(plan.modeledNets,7);
assert.equal(plan.sourceCountFourPolygons,4);
assert.equal(plan.sourcePublicCourtCount,7);
assert(plan.sevenCourtSplitEstimated);
assert.equal(plan.trueCourtPositionsSurveyed,false);
assert.deepEqual(plan.sourceOSMIDs,ref.sites.map(s=>s.id));
for(const spec of ref.sites){
 const way=ways.find(w=>String(w.id)===spec.id);
 const pitches=plan.courts.filter(c=>c.pitchId===spec.id);
 assert.equal(pitches.length,spec.count);
 assert.equal(plan.segmentsById[spec.id].length,spec.count*9);
 const outline=way.geometry.map(toWorld);
 for(const court of pitches){
  assert(court.allGeometryInsideOriginalOSM);
  assert.equal(court.netHeightMeters,.91);
  assert.equal(court.postHeightMeters,1.07);
  assert.equal(court.netWidthMeters,12.8);
  assert.equal(court.netLocationsPhotoVerified,false);
  for(const p of [court.center,...court.posts])
   assert(insideMappedPitch(p.x,p.z,outline),
    'Net must stay inside its exact source OSM court');
  assert(Math.hypot(court.posts[0].x-court.posts[1].x,
   court.posts[0].z-court.posts[1].z)>12.7);
  for(const seg of plan.segmentsById[spec.id])
   for(const p of [seg.a,seg.b])
    assert(insideMappedPitch(p.x,p.z,outline),
     'All nine stripe lines on existing source area');
 }
 const [first,second]=spec.count===2?pitches:[null,null];
 if(first&&second){
  assert(Math.hypot(first.center.x-second.center.x,
   first.center.z-second.center.z)>17);
 }
 assert(plan.siteDimensions[spec.id].lengthMeters>=34);
 if(spec.count===2)
  assert(plan.siteDimensions[spec.id].widthMeters>=33);
}
assert.equal(Object.values(plan.segmentsById).flat().length,63);
assert.equal(JSON.stringify(ways),before,'Do not move real source GPS');
for(const alter of [
 {regionId:'center'},
 {ways:ways.slice(1)},
 {ways:[...ways,ways[0]]},
 {ways:ways.map((w,i)=>i===0?{...w,tags:{...w.tags,sport:'basketball'}}:w)},
 {ways:ways.map((w,i)=>i===2?{...w,geometry:w.geometry.map((p,j)=>
   j===1?{...p,lon:p.lon+.0000002}:p)}:w)},
 {toWorld:()=>({x:0,z:0})}
])assert.equal(planMiltenTennis5150({
 regionId:'mlada',ways,toWorld,...alter}),null,
 'Fail closed on wrong regions, GPS or sport labels');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8'),
 land=readFileSync(new URL('./landscapes.js',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-sportovni-tennis-5150.js?v=515000'",
 'planMiltenTennis5150({','renderMiltenTennisNets5150(THREE,',
 '__miloviceMiltenTennisRuntime',
 'tennisPlan:miltenTennisPlan',
 'streetAudit=pitch-tennis-milten-5150'
])assert(html.includes(token),'5.150 missing real scene integration: '+token);
assert(land.includes("tennisPlan?.version==='5.150'"));
assert(land.includes("tennisPlan.segmentsById[entry.id]"));
console.log('PASS 5.150 seven schematic courts and nets, four unchanged OSM polygons, 2+2+2+1 geometrically guarded');
