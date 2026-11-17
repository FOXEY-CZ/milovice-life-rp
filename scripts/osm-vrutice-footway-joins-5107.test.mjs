// Milovice RP 5.107: existing footway/path bend corners in Benátecká Vrutice.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
const cos=Math.cos(50.226*Math.PI/180);
const conv=p=>({x:(p.lon-14.889)*111320*cos,z:-(p.lat-50.226)*111320});
const elements=JSON.parse(readFileSync(new URL(
 '../data/regions/vrutice.json',import.meta.url),'utf8')).elements;
// Anchor is not a guessed location: exact centroid of four vertices of
// existing OSM public playground (way 1303773811) in the VRUTICE export.
const anchorWay=elements.find(e=>String(e.id)==='1303773811');
assert.equal(anchorWay?.tags?.leisure,'playground');
const ring=anchorWay.geometry.slice(0,-1).map(conv);
assert.equal(ring.length,4);
const anchor={x:ring.reduce((n,p)=>n+p.x,0)/ring.length,
 z:ring.reduce((n,p)=>n+p.z,0)/ring.length,sourceId:'1303773811'};
assert(Math.abs(anchor.x-(-2214.6330166277808))<.02);
assert(Math.abs(anchor.z-(-1601.0181550001014))<.02);
const roads=createRoadClearance(),buildings=makeSidewalkBuildingGuard(),ways=[];
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
   roads.addRoad({id:e.id,kind,width,points:pts});
  if(['footway','path'].includes(kind))
   ways.push({id:e.id,tags,points:pts});
 }
}
const input={anchor,roads,buildings};
const result=planMladaFootwayCorners(ways,input);
assert.equal(result.version,'5.107');
assert.equal(result.sourceAnchorId,'1303773811');
assert.equal(result.mappedEligibleWays,34);
assert.equal(result.sealedCorners,204);
assert.equal(result.triangles.length,204);
assert.equal(result.skippedCrossings,28);
assert.equal(result.skippedNearCarriageway,0);
assert.equal(result.skippedNearBuilding,0);
assert(result.sourceWayIds.includes('180279292'));
assert(result.triangles.some(t=>t.materialSource==='gravel'));
assert(result.triangles.some(t=>t.kind==='path'));
assert(result.triangles.every(t=>t.onlyFillsExistingPathBend&&
 t.area>0&&t.area<.5&&[1.8,1.65].includes(t.width)&&
 ['footway','path'].includes(t.kind)));
assert(result.triangles.every(t=>
 [t.a,t.b,t.c].every(p=>
  roads.isClear(p.x,p.z,.07,.06)&&buildings.isClear(p.x,p.z,.10))));
assert.deepEqual(result,planMladaFootwayCorners(
 ways.slice().reverse(),input),'OSM export order cannot change corner patches');
assert.deepEqual(result,planMladaFootwayCorners(
 [...ways,...ways],input),'Overlapping region exports must not duplicate corners');
assert.equal(planMladaFootwayCorners(ways,{...input,maxTriangles:8}).sealedCorners,8);
assert.equal(planMladaFootwayCorners(ways,{...input,maxTriangles:0}).sealedCorners,0);
assert.equal(planMladaFootwayCorners(ways,{...input,
 roads:{isClear:()=>false}}).sealedCorners,0);
assert.equal(planMladaFootwayCorners(ways,{...input,
 buildings:{isClear:()=>false}}).sealedCorners,0);
assert.equal(planMladaFootwayCorners(ways,{...input,
 anchor:{x:NaN,z:0,sourceId:'bad'}}).sealedCorners,0);
assert.equal(result.originalWayNodesUnchanged,true);
assert.equal(result.syntheticNewWalkways,0);
assert.equal(result.inventedZebraStripes,0);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "if(regionId==='mlada'||regionId==='vrutice')",
 "sourceId:'1303773811'",
 "mesh.name='Milovice_OSM_Vrutice_FootwayCornerJoin_5107'",
 'window.__miloviceVruticeFootwayJoinAudit=footwayAudit',
 'window.__miloviceVruticeFootwayJoinRuntime=liveFootwayCorners',
 "highway:tri.kind||'footway'",
 'originalPathSurfacesPreserved:true'
])assert(game.includes(token),'Missing real Vrutice renderer: '+token);
const meta=game.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1],
 js=game.match(/const BUILD_ID='([^']+)'/)?.[1],
 hud=game.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud);
console.log('PASS 5.107 Vrutice OSM footway corner repairs',
 {sourceWays:result.mappedEligibleWays,corners:result.sealedCorners,
  skippedUnmarkedCrossings:result.skippedCrossings,
  sourcePlayground:result.sourceAnchorId});
