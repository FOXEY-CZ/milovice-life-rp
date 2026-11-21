// 5.213: one simulated pedestrian only on a source-locked safe Višňová sidewalk.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_SIDEWALK_WALKER_5213 as C,
 planVisnovaSidewalkWalker5213 as plan,
 makeVisnovaSidewalkSegment5213 as segment}
 from './osm-visnova-sidewalk-walker-5213.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ways=elements.filter(e=>e.tags?.highway&&e.geometry);
const buildings=elements.filter(e=>e.tags?.building&&e.geometry);
const opts={regionId:'mlada',ways,buildings};
const original=JSON.stringify([ways,buildings]);
const walker=plan(opts);
assert(walker,'verified mapped sidewalk segment must pass roads/buildings clearance');
assert.equal(walker.sourceFootwayId,'1044078124');
assert.equal(walker.sourceGeometryHash,'63d3e54d');
assert.equal(walker.sourceNodes,9);
assert.equal(walker.sourceSegmentIndex,1);
assert.equal(walker.modelWalkerCount,1);
assert(walker.originalSegmentMetres>52&&walker.originalSegmentMetres<53);
assert(walker.minMappedRoadDistanceMetres>6.5);
assert(walker.minMappedBuildingDistanceMetres>3.5);
assert.equal(walker.neverCrossesRoad,true);
assert.equal(walker.modelWalkerIsSimulation,true);
assert.equal(walker.sourceFootwayUntouched,true);
const from=ways.find(w=>String(w.id)===C.id);
assert.deepEqual(walker.routeOriginalGPS,
 [from.geometry[1],from.geometry[2]]);
const world=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const s=segment(walker,world);
assert(s&&s.roadClearanceVerified&&s.neverCrossesRoad);
assert(s.len>44&&s.len<45);
assert.equal(s.wayId,C.id);
const p=world(from.geometry[1]),q=world(from.geometry[2]);
for(const end of [s.a,s.b]){
 const dx=q.x-p.x,dz=q.y-p.y,l=Math.hypot(dx,dz);
 const along=((end.x-p.x)*dx+(end.y-p.y)*dz)/l;
 assert(along>=3.99&&along<=l-3.99,'both actor endpoints trimmed');
}
const midway={x:(s.a.x+s.b.x)/2,y:(s.a.y+s.b.y)/2};
const sourceMid={x:(p.x+q.x)/2,y:(p.y+q.y)/2};
assert(Math.hypot(midway.x-sourceMid.x,midway.y-sourceMid.y)<.01,
 'simulated walker never shifted off original OSM centerline');
for(const key of ['newPedestrianLinks','newCrossings','newRoads',
 'newSidewalkMeshes','newColliders'])assert.equal(walker[key],0,key);
// Fail closed on unverified source position, material or geographic scope.
const invalid=[
 {...opts,regionId:'vrutice'},
 {...opts,ways:ways.filter(w=>String(w.id)!==C.id)},
 {...opts,ways:[...ways,from]},
 {...opts,ways:ways.map(w=>String(w.id)===C.id?
  {...w,tags:{...w.tags,footway:'crossing'}}:w)},
 {...opts,ways:ways.map(w=>String(w.id)===C.id?
  {...w,geometry:w.geometry.map((p,i)=>
   i===2?{...p,lon:p.lon+.0000001}:p)}:w)},
 {...opts,buildings:[]},
 {...opts,ways:[...ways,{id:-5213,tags:{highway:'service'},
  geometry:[{...from.geometry[1]},{...from.geometry[2]}]}]}
];
for(const [i,args] of invalid.entries())
 assert.equal(plan(args),null,'unexpected path/road/source drift '+i);
assert.equal(JSON.stringify([ways,buildings]),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 raw,'OSM city source is immutable');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-sidewalk-walker-5213.js?v=521300'",
 'planVisnovaSidewalkWalker5213({',
 'rpSpawnVisnovaSidewalkWalker5213();',
 'trafficPeople.push({g,rig,seg,progress,direction,',
 'window.__miloviceVisnovaSidewalkWalkerRuntime5213=()=>',
 'obj.visnovaWalker5213===true',
 "'visnova-sidewalk-walker-5213':{",
 'href="?v=521300&streetAudit=visnova-sidewalk-walker-5213"',
 "const BUILD_ID='20261121-visnova-sidewalk-walker-521300'"
])assert(html.includes(needle),'missing actual game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,
 'meta/runtime/HUD version IDs must match');
console.log('PASS 5.213: one GPS-mapped paved walker, 44m original safely clipped route, road and building clearance, no invented geometry',JSON.stringify({
 roadMetres:walker.minMappedRoadDistanceMetres,
 buildingMetres:walker.minMappedBuildingDistanceMetres
}));
