import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
const cos=Math.cos(50.226*Math.PI/180);
const conv=p=>({x:(p.lon-14.889)*111320*cos,
 z:-(p.lat-50.226)*111320});
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const carriageways=createRoadClearance(),buildings=makeSidewalkBuildingGuard(),
 ways=[];
for(const e of elements){
 const tags=e.tags||{},pts=(e.geometry||[]).map(conv);
 if(tags.building&&tags.building!=='roof'&&pts.length>=3)
  buildings.add(e.id,pts);
 if(tags.highway&&pts.length>=2){
  const kind=tags.highway,width=kind==='primary'?11:
   kind==='secondary'?9:kind==='tertiary'?8:
   kind==='pedestrian'?4:kind==='footway'?1.8:
   kind==='path'||kind==='steps'?1.65:kind==='cycleway'?2:
   kind==='service'?4.5:7.8;
  if(!['footway','path','pedestrian','steps','cycleway'].includes(kind))
   carriageways.addRoad({id:e.id,kind,width,points:pts});
  if(['footway','path'].includes(kind))
   ways.push({id:e.id,tags,points:pts});
 }
}
const input={roads:carriageways,buildings};
const result=planMladaFootwayCorners(ways,input);
assert.equal(result.mappedEligibleWays,10);
assert.equal(result.sealedCorners,18);
assert.equal(result.triangles.length,18);
assert.equal(result.skippedCrossings,78);
assert.equal(result.skippedNearCarriageway,3);
assert.deepEqual(result.sourceWayIds,[
 '1046197807','1264219640','1316882861','1468803902',
 '1468803903','1468803914','1468803921','1468803938',
 '1468803946','1468803947'
]);
assert(result.triangles.every(t=>
 carriageways.isClear(t.a.x,t.a.z,.07,.06)&&
 carriageways.isClear(t.b.x,t.b.z,.07,.06)&&
 carriageways.isClear(t.c.x,t.c.z,.07,.06)&&
 buildings.isClear(t.a.x,t.a.z,.1)&&
 buildings.isClear(t.b.x,t.b.z,.1)&&
 buildings.isClear(t.c.x,t.c.z,.1)
));
assert(result.triangles.every(t=>t.onlyFillsExistingPathBend&&
 t.area>0&&t.area<.5&&[1.8,1.65].includes(t.width)));
assert(result.triangles.every(t=>ways.find(w=>
 String(w.id)===t.sourceWayId).tags.footway!=='crossing'));
assert.deepEqual(result,planMladaFootwayCorners(
 ways.slice().reverse(),input),'Source loading order must never alter joins');
assert.deepEqual(result,planMladaFootwayCorners(
 [...ways,...ways],input),'Duplicate regional ways must not duplicate patches');
assert.equal(planMladaFootwayCorners(ways,{
 roads:{isClear:()=>false},buildings}).sealedCorners,0);
assert.equal(planMladaFootwayCorners(ways,{
 roads:carriageways,buildings:{isClear:()=>false}}).sealedCorners,0);
const full=planMladaFootwayCorners(ways,{...input,maxTriangles:6});
assert.equal(full.sealedCorners,6);
assert.equal(full.syntheticNewWalkways,0);
assert.equal(full.inventedZebraStripes,0);
assert.equal(full.originalWayNodesUnchanged,true);

// Synthetic 90-degree footway: a single INSIDE wedge, not a
// Minecraft-like square dumped over a road or a new parallel sidewalk.
const c={x:-2252.6848978163475,z:-508.2592900001275};
const fake=[{x:c.x-10,z:c.z},{x:c.x,z:c.z},{x:c.x,z:c.z+10}];
const p=planMladaFootwayCorners([{id:'right-angle',tags:{highway:'footway'},
 points:fake}],{roads:{isClear:()=>true},buildings:{isClear:()=>true}});
assert.equal(p.sealedCorners,1);
const a=p.triangles[0],mid=a.c;
assert.equal(mid.x,c.x);
assert.equal(mid.z,c.z);
assert(a.a.z<c.z&&a.b.x>c.x,'A left turn closes the exposed right-side wedge');
assert.equal(planMladaFootwayCorners([{id:'right-angle',
 tags:{highway:'footway',footway:'crossing'},points:fake}],{
 roads:{isClear:()=>true},buildings:{isClear:()=>true}}).sealedCorners,0);

const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-mlada-footway-joins-5106.js?v=511200'",
 'const joins=planMladaFootwayCorners(sourceFootways,{',
 "mesh.name='Milovice_OSM_Mlada_FootwayCornerJoin_5106'",
 'window.__miloviceMladaFootwayJoinAudit=footwayAudit',
 'onlyMissingMiterWedges:true,estimatedPathWidths:true'
])assert(game.includes(token),'Missing actual render pass: '+token);
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 js=game.match(/const BUILD_ID='([^']+)'/)?.[1],
 hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
console.log('PASS Milovice 5.106 genuine OSM footway joint surfaces',{
 sourceWays:result.mappedEligibleWays,triangleFaces:result.sealedCorners,
 avoidedCarriageway:result.skippedNearCarriageway,
 unpaintedCrossings:result.skippedCrossings
});
