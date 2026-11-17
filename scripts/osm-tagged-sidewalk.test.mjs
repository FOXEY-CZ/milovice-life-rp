// Milovice RP 5.95 — OSM-tagged side-of-road sidewalk infill regression.
// A side-tag proves a sidewalk side exists, NOT its exact curb position.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeSidewalkBuildingGuard,planOSMTaggedSidewalk}
 from './osm-tagged-sidewalk.js';
import {createRoadClearance} from './road-clearance.js';
import {isCarriageway,pedestrianPieceKey} from './reality-walkways.js';

function makeRoad(pts,width=7.8){
 const roads=createRoadClearance();
 roads.addRoad({id:1,points:pts,width,kind:'residential'});
 return roads;
}
const north=[{x:0,y:20},{x:0,y:-20}],emptyBuildings=makeSidewalkBuildingGuard();
const road=makeRoad(north);
function plan(tag,pts=north,roads=road,buildings=emptyBuildings){
 return planOSMTaggedSidewalk({tags:{highway:'residential',sidewalk:tag},
  points:pts,roadWidth:7.8,roads,buildings});
}
const left=plan('left'),right=plan('right');
assert(left.pieces.length&&right.pieces.length,'OSM left and right sides must render');
assert(left.pieces.every(p=>p.side==='left'&&p.a.x<0&&p.b.x<0),
 'Northbound OSM left side must be on the WEST side');
assert(right.pieces.every(p=>p.side==='right'&&p.a.x>0&&p.b.x>0),
 'Northbound OSM right side must be on the EAST side');
const reverse=plan('right',north.slice().reverse());
assert(reverse.pieces.every(p=>p.a.x<0&&p.b.x<0),
 'Reversing the mapped way reverses left/right semantics consistently');
for(const excluded of ['separate','no',undefined]){
 assert.equal(plan(excluded).pieces.length,0,
  'Do not fabricate duplicate/untagged sidewalk on '+excluded);
}
const privatePlan=planOSMTaggedSidewalk({tags:{
 highway:'residential',sidewalk:'both',access:'private'},
 points:north,roadWidth:7.8,roads:road,buildings:emptyBuildings});
assert.equal(privatePlan.pieces.length,0);
assert.equal(planOSMTaggedSidewalk({tags:{
 highway:'motorway',sidewalk:'left'},
 points:north,roadWidth:11,roads:road,buildings:emptyBuildings}).pieces.length,0);

const guard=makeSidewalkBuildingGuard();
const house=[{x:-6.3,y:-8},{x:-3.9,y:-8},{x:-3.9,y:8},{x:-6.3,y:8}];
assert(guard.add(10,house),'Mapped OSM home accepted');
assert(!guard.add(10,house),'Duplicate building polygons never multiply');
assert(!guard.isClear(-5,0,.8),'Building interiors must block sidewalk');
assert(!guard.isClear(-3.5,0,.8),'A building wall requires physical clearance');
const buildingClipped=plan('left',north,road,guard);
assert(buildingClipped.pieces.length>=2,'An actual house splits an assumed sidewalk');
assert(buildingClipped.meters<left.meters-10,'No paving is allowed through the house');
assert(buildingClipped.pieces.every(p=>
 Math.abs((p.a.z+p.b.z)*.5)>8),
 'No sidewalk strip spans the mapped footprint of a building');
const existingWalk=makeRoad(north);
existingWalk.addRoad({id:'mapped-footway',kind:'footway',width:1.8,
 points:[{x:-5.015,y:20},{x:-5.015,y:-20}]});
assert.equal(plan('left',north,existingWalk).pieces.length,0,
 'An already mapped sidewalk must never receive a second overlapping strip');
const extraJunction=makeRoad(north);
extraJunction.addRoad({id:2,kind:'residential',width:7.8,
 points:[{x:-16,y:0},{x:16,y:0}]});
const atIntersection=plan('left',north,extraJunction);
assert(atIntersection.meters<left.meters-4,
 'OSM junctions must interrupt the side strip, not cover asphalt');
guard.reset();
assert.equal(guard.summary().buildings,0);
assert(guard.isClear(-5,0,.8),'Full scene reload must discard stale buildings');
road.reset();
assert.equal(road.stats().segments,0,'Road safety index resets on city reload');

const projection=p=>({x:(p.lon-14.889)*111320*
 Math.cos(50.226*Math.PI/180),y:-(p.lat-50.226)*111320});
const routes=createRoadClearance(),buildings=makeSidewalkBuildingGuard();
const seen=new Set(),guardWayIds=new Set(),rendered=new Set();
const byRegion={},byWay={},perWaySign={};
for(const region of ['old','mlada','vrutice']){
 const path=region==='old'?'../data/milovice-osm.json':
  '../data/regions/'+region+'.json';
 const osm=JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
 const loaded=[];
 for(const el of osm.elements){
  if(!el.geometry?.length||seen.has(String(el.id)))continue;
  seen.add(String(el.id));loaded.push(el);
 }
 for(const el of loaded.filter(e=>e.tags?.building&&e.geometry?.length>=3)){
  buildings.add(el.id,el.geometry.map(projection));guardWayIds.add(String(el.id));
 }
 for(const el of loaded.filter(e=>e.tags?.highway)){
  const kind=el.tags.highway;
  const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
   kind==='footway'?1.8:kind==='pedestrian'?4:
   kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
   kind==='service'?4.5:kind==='track'?3.2:7.8;
  routes.addRoad({id:el.id,points:el.geometry.map(projection),width,kind});
 }
 const state=byRegion[region]={taggedRoads:0,segments:0,meters:0};
 for(const el of loaded.filter(e=>['left','right','both'].includes(e.tags?.sidewalk))){
  state.taggedRoads++;
  const p=planOSMTaggedSidewalk({
   tags:el.tags,points:el.geometry.map(projection),roadWidth:7.8,
   roads:routes,buildings});
  perWaySign[String(el.id)]=el.tags.sidewalk;
  byWay[String(el.id)]={region,sections:p.pieces.length,meters:p.meters};
  for(const piece of p.pieces){
   assert(isCarriageway('residential')&&piece.meters>=2.5);
   const key=pedestrianPieceKey(piece,piece.width);
   assert(!rendered.has(key),'No duplicate sidewalk rectangles');
   rendered.add(key);
   state.segments++;
   state.meters+=piece.meters;
   const x=(piece.a.x+piece.b.x)*.5,z=(piece.a.z+piece.b.z)*.5;
   assert(routes.isClear(x,z,piece.width*.5,.14),
    'No generated sidewalk covers any mapped road or existing footway');
   assert(buildings.isClear(x,z,piece.width*.5+.18),
    'No generated sidewalk intersects a mapped home');
  }
 }
}
assert.deepEqual(Object.keys(byWay).sort(),[
 '1395041608','1395041609','309581823'
].sort(),'Only three OSM-tagged ways must receive estimated curb infill');
assert(Object.values(byRegion).reduce((s,x)=>s+x.meters,0)>390);
assert(Object.values(byRegion).reduce((s,x)=>s+x.meters,0)<450);
assert(byRegion.mlada.taggedRoads===2&&byRegion.vrutice.taggedRoads===1);
assert(byRegion.mlada.segments<=10&&byRegion.vrutice.segments<=12,
 'Keep extra roadside draw batches tightly bounded');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const snippet of [
 'const taggedSidewalkBuildings=makeSidewalkBuildingGuard();',
 'taggedSidewalkBuildings.add(el.id,el.geometry.map(osmPoint));',
 'const planned=planOSMTaggedSidewalk({',
 "if(el.tags.sidewalk==='separate')taggedSidewalkAudit.ignoredSeparateTags++;",
 'taggedSidewalkBuildings.reset();',
 'osmRoadClearance.reset();osmCarriagewayClearance.reset();',
 'new THREE.Vector2(piece.b.x,piece.b.z),',
 'piece.width,osmSidewalkMat,.13);'
])assert(game.includes(snippet),'Missing game integration '+snippet);
assert(game.includes("const BUILD_ID='20261117-osm-tagged-sidewalk-59500'"));
console.log('PASS Milovice 5.95: '+JSON.stringify({byRegion,byWay,buildings:guardWayIds.size}));
