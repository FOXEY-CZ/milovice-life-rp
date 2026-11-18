// Milovice RP 5.132 — 100% original RUIAN shared party-wall data.
// Five actual contiguous Tyršova buildings must have NO rendered
// exterior doors/windows/plinths on their 4 internal paired wall planes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTyrsovaRUIANSharedWalls,
 TYRSOVA_PARTY_WALL_SOURCE} from './osm-tyrsova-party-walls-5132.js';
const raw=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const by=id=>raw.find(el=>String(el.id)===String(id));
const src=TYRSOVA_PARTY_WALL_SOURCE;
const k=111320,co=Math.cos(50.226*Math.PI/180),
 toWorld=p=>({x:(p.lon-14.889)*k*co,z:-(p.lat-50.226)*k});
const originals=[...src.buildingIds,src.streetSouthId,
 src.streetNorthId].map(by);
assert(originals.every(Boolean));
const input={
 regionId:'mlada',
 buildings:src.buildingIds.map(id=>{
  const b=by(id);
  return {id:b.id,tags:b.tags,points:b.geometry.map(toWorld)};
 }),
 southRoad:{id:src.streetSouthId,tags:by(src.streetSouthId).tags,
  points:by(src.streetSouthId).geometry.map(toWorld)},
 northRoad:{id:src.streetNorthId,tags:by(src.streetNorthId).tags,
  points:by(src.streetNorthId).geometry.map(toWorld)}
};
const originalString=JSON.stringify(originals);
const plan=planTyrsovaRUIANSharedWalls(input);
assert(plan);
assert.equal(plan.version,'5.132');
assert.equal(plan.sourceStreetName,'Tyršova');
assert.deepEqual(plan.sourceStreetWays,['8618265','1331897627']);
assert.deepEqual(plan.sourceBuildings,src.buildingIds);
assert.deepEqual(plan.sourceFloors,[5,5,5,5,5]);
assert.equal(plan.actualBuildingCount,5);
assert.equal(plan.abuttingPairCount,4);
assert.equal(plan.sharedUndirectedWalls,4);
assert.equal(plan.internalFacadeEdgesToSkip,8);
assert.equal(plan.originalFacadeEdges,20);
assert.equal(plan.exteriorFacadeEdgesRemaining,12);
assert.deepEqual(plan.expectedSkippedPerHouse,[1,2,2,2,1]);
assert.equal(plan.buildingGeometryAltered,false);
assert.equal(plan.originalSolidWallExtrusionsPreserved,true);
assert.equal(plan.noInventedWindowOrDoorOnPartyWalls,true);
assert.equal(plan.noExteriorDecorationOnPartyWalls,true);
assert.equal(plan.originalStreetRoadsUntouched,true);
assert.equal(plan.possiblePhotoVerifiedFacadeStyle,false);
assert.equal(plan.numberOfAdditionalRenderMeshes,0);
assert.deepEqual(src.buildingIds.map(id=>plan.edgeMap[id]),[
 [0],[0,2],[0,2],[0,2],[2]]);
for(let i=0;i<plan.joinPairs.length;i++){
 const j=plan.joinPairs[i];
 assert.equal(j.firstId,src.buildingIds[i]);
 assert.equal(j.secondId,src.buildingIds[i+1]);
 assert.equal(j.allEndpointsMapped,true);
 assert.equal(j.noNewGeometry,true);
 assert(j.fullSharedLength>11.5&&j.fullSharedLength<11.7);
 assert.deepEqual([j.firstEdge,j.secondEdge],[0,2]);
}
const edgeCounts=src.buildingIds.map(id=>{
 const b=input.buildings.find(b=>String(b.id)===id);
 const verts=b.points.slice(0,-1);
 return verts.length-plan.edgeMap[id].length;
});
assert.deepEqual(edgeCounts,[3,2,2,2,3]);
assert.deepEqual(plan,planTyrsovaRUIANSharedWalls(input));
assert.equal(JSON.stringify(originals),originalString,
 'All original OSM source points must remain unchanged');
const negatives=[
 {regionId:'vrutice'},
 {southRoad:{...input.southRoad,id:0}},
 {northRoad:{...input.northRoad,id:0}},
 {northRoad:{...input.northRoad,
  tags:{...input.northRoad.tags,name:'Sportovní'}}},
 {buildings:[]},
 {buildings:input.buildings.map((b,i)=>
  i===1?{...b,tags:{...b.tags,'building:levels':'3'}}:b)},
 {buildings:input.buildings.map((b,i)=>
  i===3?{...b,tags:{...b.tags,building:'garage'}}:b)},
 {buildings:input.buildings.map((b,i)=>
  i===2?{...b,points:b.points.map((p,j)=>j===1?
   {x:p.x+.75,z:p.z}:p)}:b)},
 {buildings:input.buildings.map((b,i)=>
  i===2?{...b,points:b.points.map((p,j)=>j===0?
   {x:p.x+1,z:p.z}:p)}:b)}
];
for(const bad of negatives)
 assert.equal(planTyrsovaRUIANSharedWalls({...input,...bad}),null,
  'Changed or unrelated OSM footprint must not erase exterior details');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-tyrsova-party-walls-5132.js?v=513200'",
 'const tyrsovaPartyEdgesByBuilding=new Map();',
 'const tyrsovaPartyPlan=planTyrsovaRUIANSharedWalls({',
 'tyrsovaPartyEdgesByBuilding.set(id,',
 'if(legacyShared?.has(i)||sharedEdges?.has(i)){',
 'audit.runtimeSkippedPartyFacadeEdges++;',
 'window.__miloviceTyrsovaPartyWallAudit={',
 'window.__miloviceTyrsovaPartyWallRuntime=()=>{',
 "const BUILD_ID='20261118-ruian-residential-shared-walls-sportovni-513300'",
 'href="?v=513200&streetAudit=tyrsova-terrace-5131"',
 'window.__miloviceTyrsovaArmadniJunctionRuntime=()=>{'
])assert(html.includes(token),
 'Actual building renderer must skip party wall decorations: '+token);
console.log('PASS 5.132 RUIAN Tyršova party walls; four physical joins, 8 internal faces skipped and 12 legitimate external facades preserved');
