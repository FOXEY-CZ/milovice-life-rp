// Italská 5.234 original source-locked safe model walker trajectories.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaWalkChain5233} from './osm-italska-walk-chain-5233.js';
import {ITALSKA_WALKERS_5234 as C,
 planItalskaWalkers5234 as plan,
 makeItalskaWalkerSegment5234 as toSegment} from './osm-italska-walkers-5234.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const ways=E.filter(w=>w.tags?.highway),buildings=E.filter(w=>w.tags?.building);
const priorPlan=planItalskaWalkChain5233('mlada',ways);
assert(priorPlan,'prior original Italská network');
const opts={regionId:'mlada',ways,buildings,priorPlan},p=plan(opts);
assert(p,'both actual pedestrian corridors are clear of roads and buildings');
assert.equal(p.walkerCount,2);
assert.deepEqual(p.sourceRouteIds,['1484073945','1484073947']);
assert(p.totalWalkableMetres>202&&p.totalWalkableMetres<203);
assert.deepEqual(p.routes.map(r=>r.originalSegmentMetres),[135.468,87.055]);
assert.deepEqual(p.routes.map(r=>r.trimEachEndMetres),[6,4]);
assert.deepEqual(p.routes.map(r=>r.sourceSurface),[null,'paving_stones']);
assert(p.routes.every(r=>r.safetySamples>100&&
 r.minRoadAxisMetres>=r.requiredRoadMin&&
 r.minBuildingMetres>=r.requiredBuildingMin));
assert(p.noUnmarkedCrossingsEntered&&p.originalGPSUnchanged);
assert(p.simulatedPedestriansOnly&&p.existingRoadsAndBuildingsPreserved);
for(const k of ['newFootways','newCrossings','newZebras','newColliders',
 'newBuildings','newParking','newStreetFurniture'])assert.equal(p[k],0);
const toWorld=g=>({x:(g.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(g.lat-50.226)*111320});
for(const r of p.routes){
 const seg=toSegment(r,toWorld);
 assert(seg&&seg.noCrossing&&seg.roadAndBuildingSafe);
 assert(Math.abs(seg.len-r.walkableMetres)<.02);
 assert(seg.sourceGPSUnchanged);
}
assert.equal(plan({...opts,regionId:'old'}),null);
assert.equal(plan({...opts,priorPlan:null}),null);
assert.equal(plan({...opts,buildings:[]}),null);
for(const spec of C.routes){
 const w=ways.find(w=>String(w.id)===spec.id);
 assert.equal(plan({...opts,ways:ways.filter(x=>String(x.id)!==spec.id)}),null);
 assert.equal(plan({...opts,ways:[...ways,w]}),null);
 const mutate=fn=>ways.map(x=>String(x.id)===spec.id?fn(x):x);
 assert.equal(plan({...opts,ways:mutate(x=>({...x,tags:{
  ...x.tags,surface:'asphalt'}}))}),null);
 assert.equal(plan({...opts,ways:mutate(x=>({...x,geometry:x.geometry.map(
  (p,i)=>i===1?{...p,lon:p.lon+.0000001}:p)}))}),null);
}
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const t of [
 "from './scripts/osm-italska-walkers-5234.js?v=523400'",
 'const italskaWalkersPlan5234=planItalskaWalkers5234({',
 'rpSpawnItalskaWalkers5234();',
 'function rpSpawnItalskaWalkers5234(){',
 'window.__miloviceItalskaWalkersRuntime5234=()=>',
 'obj.italskaWalker5234===true',
 "'italska-walkers-5234':{",
 'href="?v=523400&streetAudit=italska-walkers-5234"'
])assert(html.includes(t),'game integration '+t);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud,'matching build labels');
const match=html.match(/Verze ([0-9]+)[.]([0-9]+) · build/);
assert(match&&Number(match[1])===5&&Number(match[2])>=234,
 'later game HUD versions must not break the 5.234 safety regression');
console.log('PASS 5.234 2 real mapped original sidewalk segments, 202.523m safe for simulated pedestrians');
