// Milovice RP 5.214: second source-locked and road-safe residential NPC.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_EAST_WALKER_5214 as C,
 planVisnovaEastWalker5214 as plan,
 makeVisnovaEastWalkSegment5214 as toSegment}
 from './osm-visnova-east-walker-5214.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(raw).elements;
const ways=es.filter(e=>e.tags?.highway&&e.geometry);
const buildings=es.filter(e=>e.tags?.building&&e.geometry);
const opts={regionId:'mlada',ways,buildings};
const source=ways.find(w=>String(w.id)===C.footwayId);
assert(source,'real mapped Višňová sidewalk must exist');
const orig=JSON.stringify([source,ways.length,buildings.length]);
const p=plan(opts);
assert(p,'source-hash-locked second mapped walk must pass');
assert.equal(p.sourceOSMWayId,'1044078118');
assert.equal(p.sourceHash,'26506719');
assert.equal(p.segmentIndex,1);
assert.equal(p.originalFootwayNodes,11);
assert(p.originalMetres>30&&p.originalMetres<31);
assert.equal(p.trimMetres,3.3);
assert(p.minRoadAxisDistanceMetres>8.7);
assert(p.minBuildingDistanceMetres>8.1);
assert.equal(p.modelWalkerCount,1);
assert.equal(p.routeUnchanged,true);
assert.equal(p.neverCrossesRoad,true);
assert.equal(p.npcIsSimulationNotPhotographed,true);
assert.equal(p.surfaceMaterialNotInferred,true);
assert.equal(source.tags.surface,undefined,
 'source sidewalk is untagged for materials; must NOT invent paving stones');
assert.deepEqual(p.sourceGPS,[source.geometry[1],source.geometry[2]]);
const toWorld=x=>({x:(x.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(x.lat-50.226)*111320});
const s=toSegment(p,toWorld);
assert(s&&s.roadClearanceVerified&&s.neverCrossesRoad);
assert(s.len>23&&s.len<24);
assert.equal(s.wayId,C.footwayId);
const worldA=toWorld(source.geometry[1]),worldB=toWorld(source.geometry[2]);
for(const [i,point] of [s.a,s.b].entries()){
 const dx=worldB.x-worldA.x,dy=worldB.y-worldA.y;
 const len=Math.hypot(dx,dy);
 const along=((point.x-worldA.x)*dx+(point.y-worldA.y)*dy)/len;
 assert(Math.abs(along-(i===0?3.3:len-3.3))<.02,
  'trim exactly 3.3m from each ORIGINAL OSM endpoint');
}
for(const k of ['newPaths','newZebras','newBuildings','newRoads',
 'newSidewalks','newColliders'])assert.equal(p[k],0,k);
for(const [i,invalid] of [
 {...opts,regionId:'vrutice'},
 {...opts,ways:ways.filter(w=>String(w.id)!==C.footwayId)},
 {...opts,ways:[...ways,source]},
 {...opts,ways:ways.map(w=>String(w.id)===C.footwayId?
  {...w,tags:{...w.tags,surface:'paving_stones'}}:w)},
 {...opts,ways:ways.map(w=>String(w.id)===C.footwayId?
  {...w,geometry:w.geometry.map((q,j)=>j===2?{...q,lat:q.lat+.0000001}:q)}:w)},
 {...opts,ways:[...ways,{id:-5214,tags:{highway:'service'},
  geometry:[source.geometry[1],source.geometry[2]]}]},
 {...opts,buildings:[]}
].entries())assert.equal(plan(invalid),null,'fail closed on source drift '+i);
assert.equal(JSON.stringify([source,ways.length,buildings.length]),orig);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-east-walker-5214.js?v=521400'",
 'planVisnovaEastWalker5214({',
 'makeVisnovaEastWalkSegment5214(p,osmPoint)',
 'rpSpawnVisnovaEastWalker5214();',
 'window.__miloviceVisnovaTwoWalkersRuntime5214=()=>',
 'obj.visnovaEastWalker5214===true',
 "'visnova-two-walkers-5214':{",
 'href="?v=521400&streetAudit=visnova-two-walkers-5214"',
 'const BUILD_ID='
])assert(html.includes(needle),'missing live game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'meta/runtime/HUD mismatch');
console.log('PASS 5.214 two real OSM sidewalk walkers; new original 30.22m segment, safe 23.62m walking section, road and building clearances',p.minRoadAxisDistanceMetres,p.minBuildingDistanceMetres);
