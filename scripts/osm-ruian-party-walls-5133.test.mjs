// Milovice RP 5.133: only exactly coincident RUIAN residential edges.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planRUIANResidentialSharedWalls} from './osm-ruian-party-walls-5133.js';
const raw=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const cos=Math.cos(50.226*Math.PI/180);
const project=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const buildings=raw.filter(x=>x.tags?.building&&x.geometry).map(b=>({
 id:b.id,tags:b.tags,points:b.geometry.map(project)
}));
const snapshot=JSON.stringify(buildings);
const plan=planRUIANResidentialSharedWalls({regionId:'mlada',buildings});
assert(plan);
assert.equal(plan.version,'5.133');
assert.equal(plan.sourceSharedWallCount,28);
assert.equal(plan.internalFacadeEdgesToSkip,56);
assert.equal(plan.affectedBuildingCount,37);
assert.equal(plan.exactSourceEdgeMatch,true);
assert.equal(plan.photoValidatedAppearance,false);
assert.equal(plan.originalBuildingGeometryPreserved,true);
assert.equal(plan.originalSolidWallExtrusionsPreserved,true);
assert.equal(plan.originalTrafficAndFootwaysPreserved,true);
assert.equal(plan.additionalMeshes,0);
assert.equal(plan.additionalColliders,0);
const classic=['61979140','61979141','61979149','61979146','61979143'];
assert.deepEqual(classic.map(id=>plan.edgeMap[id]),[
 [0],[0,2],[0,2],[0,2],[2]]);
for(const join of plan.joins){
 assert(join.exactSharedEndpoints);
 assert(join.fullLengthMetres>=6&&join.fullLengthMetres<=21);
 assert.equal(join.buildingIds.length,2);
 assert.equal(join.originalSolidWallsUntouched,true);
}
assert.equal(JSON.stringify(buildings),snapshot,'Do not mutate the original OSM data');
assert.deepEqual(plan,planRUIANResidentialSharedWalls({regionId:'mlada',buildings}));
// Old city core is rendered BEFORE the Mladá regional extract.
// Its 4 RUIAN homes form 2 full shared walls, and Mladá's deduped
// list supplies the remaining 26. Verify the TOTAL still reaches 28.
const originalCore=JSON.parse(readFileSync(new URL(
 '../data/milovice-osm.json',import.meta.url),'utf8')).elements;
const toRows=els=>els.filter(x=>x.tags?.building&&x.geometry).map(b=>({
 id:b.id,tags:b.tags,points:b.geometry.map(project)
}));
const fromCore=planRUIANResidentialSharedWalls({
 regionId:'old',buildings:toRows(originalCore)
});
const earlierIds=new Set(originalCore.map(x=>String(x.id)));
const remaining=planRUIANResidentialSharedWalls({
 regionId:'mlada',buildings:buildings.filter(b=>!earlierIds.has(String(b.id)))
});
assert.equal(fromCore.sourceSharedWallCount,2);
assert.equal(remaining.sourceSharedWallCount,26);
assert.equal(fromCore.internalFacadeEdgesToSkip+
 remaining.internalFacadeEdgesToSkip,56);
assert.equal(new Set([...fromCore.sourceBuildingIds,...remaining.sourceBuildingIds]).size,37);

assert.equal(planRUIANResidentialSharedWalls({regionId:'fictional',buildings}),null);
const modified=buildings.map(b=>String(b.id)==='61979141'?
 {...b,tags:{...b.tags,'building:levels':'4'}}:b);
assert(planRUIANResidentialSharedWalls({regionId:'mlada',buildings:modified})
 .sourceSharedWallCount<plan.sourceSharedWallCount);
const shifted=buildings.map(b=>String(b.id)==='61979141'?
 {...b,points:b.points.map(p=>({x:p.x+.4,z:p.z}))}:b);
assert(planRUIANResidentialSharedWalls({regionId:'mlada',buildings:shifted})
 .sourceSharedWallCount<plan.sourceSharedWallCount);
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
for(const needle of [
 'sharedPartyEdges=null,onSharedPartyEdge=null',
 "if(sharedPartyEdges?.has(sideIndex)){",
 'wallGeometry(a,b,base,height,[],tone)',
 'state.sharedPartyWallFacesSuppressed++',
 'onSharedPartyEdge(sideIndex)'
])assert(hero.includes(needle),'Hero renderer missing party wall protection: '+needle);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-ruian-party-walls-5133.js?v=513300'",
 'const ruianPartyEdgesByBuilding=new Map();',
 'const ruianPlan=planRUIANResidentialSharedWalls({',
 'ruianPartyEdgesByBuilding.set(id,new Set(edges));',
 'window.__miloviceRUIANPartyWallRuntime=()=>{',
 "const BUILD_ID='20261118-ruian-residential-shared-walls-sportovni-513300'",
 'streetAudit=tyrsova-sportovni-5133',
  "sharedPartyEdges:ruianPartyEdgesByBuilding.get(String(osmId))||null",
  "onSharedPartyEdge:edge=>recordRUIANSharedEdge(osmId,edge,'hero')",
  "from './scripts/hero-architecture.js?v=513301'"
])assert(html.includes(marker),marker);
console.log('PASS 5.133: 28 exact mapped residential joins, 56 internal facades hidden without changing roofs, geometry or roads');
