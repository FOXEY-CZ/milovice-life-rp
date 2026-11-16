import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {CHURCH_STREET_PHOTO_PASS,planChurchStreetscape2022}
 from './church-street-photo-pass.js';

const {elements}=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const C=Math.cos(50.226*Math.PI/180),p=e=>({
 x:(e.lon-14.889)*111320*C,y:-(e.lat-50.226)*111320
});
const widths={primary:11,secondary:9,tertiary:8,pedestrian:4,
 footway:1.8,path:1.65,cycleway:2,service:4.5};
const roads=elements.filter(e=>e.tags?.highway&&e.geometry?.length>=2)
 .map(e=>({osmId:e.id,kind:e.tags.highway,
  width:widths[e.tags.highway]??7.8,points:e.geometry.map(p)}));
const clearance=createRoadClearance();
for(const road of roads)clearance.addRoad({id:road.osmId,
 kind:road.kind,width:road.width,points:road.points});
const polygons=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4)
 .map(e=>e.geometry.map(p));
const church=elements.find(e=>e.id===118487991).geometry.map(p);
const input={roadClearance:clearance,buildingFootprints:polygons,
 churchFootprint:church};
const plan=planChurchStreetscape2022(roads,input);
assert(plan);
assert.equal(CHURCH_STREET_PHOTO_PASS.sourceDate,'2022-05-09');
assert.equal(CHURCH_STREET_PHOTO_PASS.objectPlacementSurveyed,false);
assert.equal(plan.roadId,'219273174');
assert.equal(plan.churchwardDirection,1);
assert.equal(plan.photoPlacementSurveyed,false);
assert.equal(plan.currentYear2026Verified,false);
assert(plan.fenceCandidates>=8);
assert(plan.fenceSegments>=3,'Model several PHOTO-observed fences as a batch');
assert(plan.photoTrees>=2,'Photo shows mature trees on right side of street');
assert(plan.roadTonePatches>=18,'A full-road tone treatment, not a single prop');
assert.equal(plan.fenceSegments+plan.rejectedFence.length,plan.fenceCandidates);
assert.equal(plan.buildingFootprintsChanged,false);
assert.equal(plan.mappedRoadsChanged,false);
assert.equal(plan.footwaysChanged,false);
assert.equal(plan.inventedPrivateDriveways,0);
assert.equal(plan.paintedRoadLines,0);
assert.equal(plan.privatePropertyLinesVerified,false);
assert(plan.fence.every(f=>f.side<0&&f.length>=7));
assert(plan.trees.every(t=>t.side>0));
assert.equal(planChurchStreetscape2022(roads,{...input,churchFootprint:[]}),null);
assert.equal(planChurchStreetscape2022(roads,{...input,roadClearance:null}),null);
const flipped=roads.map(r=>String(r.osmId)==='219273174'?
 {...r,points:[...r.points].reverse()}:r);
const reversed=planChurchStreetscape2022(flipped,input);
assert(reversed);
assert.equal(reversed.churchwardDirection,-1);
assert.equal(reversed.fenceSegments,plan.fenceSegments);
assert.equal(reversed.photoTrees,plan.photoTrees);
for(let i=0;i<plan.fence.length;i++){
 assert(Math.hypot(plan.fence[i].x-reversed.fence[i].x,
  plan.fence[i].z-reversed.fence[i].z)<.01);
}
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("photoChurchStreet2022.create(osmDriveRoads"));
assert(game.includes("photoChurchStreet2022.reset()"));
assert(game.includes("makeChurchStreetscape2022"));
console.log('CHURCH_PHOTO_PASS_2022_OK',JSON.stringify({
 fenceSegments:plan.fenceSegments,rejectedFences:plan.rejectedFence.length,
 trees:plan.photoTrees,rejectedTrees:plan.rejectedTrees.length,
 tonePatches:plan.roadTonePatches,photoSurveyed:false}));
