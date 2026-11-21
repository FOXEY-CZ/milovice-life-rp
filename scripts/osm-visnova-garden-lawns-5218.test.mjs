// Milovice RP 5.218 — ONLY three original OSM polygons beside Višňová.
// Model blades = estimates; mapped lawn outlines and nearby roads unaffected.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 VISNOVA_GARDEN_LAWNS_5218 as C,planVisnovaGardenLawns5218 as plan,
 lawnPolygonContains5218 as inside,lawnBoundaryDistance5218 as edgeDist
} from './osm-visnova-garden-lawns-5218.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elems=JSON.parse(raw).elements;
const ways=C.polygons.map(spec=>elems.find(e=>String(e.id)===spec.id));
assert(ways.every(Boolean),'all three original grass polygons must exist');
const original=JSON.stringify(ways);
const cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*111320*cos,
 y:-(p.lat-50.226)*111320});
const safe={isClear:()=>true};
const opts={regionId:'mlada',toWorld:world,roads:safe,
 buildings:safe,water:safe,
 excludedLawnIds:['1460019772','1460019799','1460019806','1460019807']};
const v=plan(ways,opts);
assert(v,'source polygons have unchanged ID, geometry, tags and hashes');
assert.equal(v.version,'5.218');
assert.deepEqual(v.sourceLawnIds,['1460019798','1460019800','1460019801']);
assert.equal(v.skippedPreviouslyDetailed.length,0);
assert.equal(v.mappedPolygonsPreserved,true);
assert.equal(v.polygonGeometryChanged,false);
assert(v.tufts.length>=40,'real OSM lawn polygons must permit visible turf');
assert(v.tufts.length<=C.polygons.length*C.maxTuftsPerPolygon,
 'strict mobile GPU instance count cap');
assert.deepEqual(v,plan(ways,opts),'procedural placement must be deterministic');
for(const spec of C.polygons)assert(v.byPolygon[spec.id]>=1,
 'each of the three mapped grass polygons must have visible detail '+spec.id);
for(const t of v.tufts){
 assert([t.x,t.z,t.height,t.spread,t.yaw].every(Number.isFinite));
 assert(t.height>=.18&&t.height<=.33);
 assert.equal(t.positionEstimated,true);
 const source=ways.find(x=>String(x.id)===t.sourceOSMId);
 assert(source,'no arbitrary lawn outside exactly three original IDs');
 const poly=source.geometry.slice(0,-1).map(world)
  .map(p=>({x:p.x,z:p.y}));
 assert(inside(t.x,t.z,poly),'all turf must be INSIDE original lawn');
 assert(edgeDist(t.x,t.z,poly)>=C.insetMetres-.000001,
  'all turf must remain away from mapped lawn edges');
}
for(const k of ['newLawnPolygons','newShrubs','newTrees',
 'newRoads','newFootways','newColliders','newParkingPlaces',
 'newStreetFurniture'])assert.equal(v[k],0,k);
assert.equal(v.individualPlantsPhotoVerified,false);
assert.equal(v.modelSpeciesUnverified,true);
assert.deepEqual(plan(ways,{...opts,excludedLawnIds:v.sourceLawnIds}).tufts,[],
 'previously detailed lawns must not double-populate');
for(const key of ['roads','buildings','water']){
 const blocked=plan(ways,{...opts,[key]:{isClear:()=>false}});
 assert(blocked,'the map source itself is still valid');
 assert.equal(blocked.tufts.length,0,
  'do not populate through mapped '+key);
}
for(const invalid of [
 ways.slice(0,2),
 [...ways,ways[0]],
 ways.map((w,i)=>i===1?{...w,tags:{landuse:'residential'}}:w),
 ways.map((w,i)=>i===2?{...w,geometry:w.geometry.map((p,j)=>
  j===1?{...p,lat:p.lat+.0000001}:p)}:w),
 ways.map((w,i)=>i===0?{...w,geometry:w.geometry.slice(0,-1)}:w)
])assert.equal(plan(invalid,opts),null,'fail closed on source drift');
assert.equal(plan(ways,{...opts,regionId:'vrutice'}),null);
assert.equal(JSON.stringify(ways),original,'input OSM elements immutable');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'region dataset immutable');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const n of [
 "from './scripts/osm-visnova-garden-lawns-5218.js?v=521800'",
 'const visnovaGardenGrassSource5218=[];',
 'visnovaGardenGrassSource5218.push(el);',
 'visnovaGardenGrassSource5218.length=0;',
 'planVisnovaGardenLawns5218(visnovaGardenGrassSource5218,{',
 'gardenTufts5218.map(t=>',
 'gardenMeshRefs5218.push(mesh)',
 'window.__miloviceVisnovaGardenLawnsRuntime5218=()=>',
 "'visnova-garden-lawns-5218':{",
 'href="?v=521800&streetAudit=visnova-garden-lawns-5218"',
 "const BUILD_ID='"
])assert(html.includes(n),'missing real game integration '+n);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'meta/runtime/HUD build IDs match');
console.log('PASS 5.218 source-locked three NEW real Višňová grass polygons',
 v.tufts.length,'planned instances; per polygon',JSON.stringify(v.byPolygon),
 'no invented lawns, paths, vegetation kinds or colliders');
