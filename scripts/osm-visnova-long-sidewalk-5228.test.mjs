// 5.228 source OSM GPS and model-only long sidewalk locking.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_LONG_SIDEWALK_5228 as C,planVisnovaLongSidewalk5228 as plan}
 from './osm-visnova-long-sidewalk-5228.js';
const originalText=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(originalText).elements,ids=[C.main.id,C.westPaved.id,C.eastPaved.id];
const selected=ids.map(id=>ways.filter(w=>String(w.id)===id));
assert(selected.every(arr=>arr.length===1),'all three OSM ways unique');
const source=JSON.stringify(selected);
const p=plan('mlada',ways);
assert(p,'original 199m footway, two paved junctions and source hash validated');
assert.equal(p.version,'5.228');
assert.deepEqual(p.sourceWayIds,['1044078118','1005977571','1044078121']);
assert.deepEqual(p.sourceHashes,['26506719','263e12b3','4dc63734']);
assert.equal(p.neutralWayId,'1044078118');
assert.equal(p.neutralOriginalSegments,10);
assert.equal(p.neutralOriginalMeters,199.405);
assert.equal(p.originalNetworkSegments,19);
assert.equal(p.originalNetworkMeters,532.650);
assert.equal(p.neutralMaterial,'visnova-footway-model');
assert.deepEqual(p.pavedSourceWayIds,['1005977571','1044078121']);
assert.equal(p.pavedSourceSurface,'paving_stones');
assert.equal(p.westernExistingJunctionGPS,'50.2290044,14.8702188');
assert.equal(p.easternExistingJunctionGPS,'50.2289889,14.8692466');
assert.equal(p.easternMainNodeIndex,4);
for(const k of ['originalCentrelinePreserved','actualNeutralSurfaceUnknown',
 'pavingVisualEstimateOnly'])assert.equal(p[k],true);
for(const k of ['newFootways','newCrossings','newRoads','newZebras',
 'newBuildings','newColliders','newKerbs','newEntrances','newStreetFurniture'])
 assert.equal(p[k],0,k);
assert.equal(plan('elsewhere',ways),null);
assert.equal(plan('mlada',ways.filter(w=>String(w.id)!==ids[0])),null);
assert.equal(plan('mlada',[...ways,selected[0][0]]),null);
const change=(id,fn)=>ways.map(w=>String(w.id)===id?fn(w):w);
for(const id of ids){
 assert.equal(plan('mlada',change(id,w=>({...w,geometry:w.geometry.map((point,i)=>
  i===0?{...point,lat:point.lat+.0000001}:point)}))),null,'reject moved GPS '+id);
 assert.equal(plan('mlada',change(id,w=>({...w,tags:{...w.tags,surface:'asphalt'}}))),
 null,'reject changed or invented surface '+id);
 assert.equal(plan('mlada',change(id,w=>({...w,geometry:[...w.geometry].reverse()}))),
 null,'reject reversed GPS polyline '+id);
}
assert.equal(plan('mlada',change(ids[0],w=>({...w,tags:{...w.tags,lit:'no'}}))),
 null,'original lit sidewalk must be preserved');
assert.equal(plan('mlada',change(ids[1],w=>({...w,tags:{...w.tags,footway:'crossing'}}))),
 null,'pavers are not a crossing');
assert.equal(JSON.stringify(selected),source,'source elements preserved');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 originalText,'source map file never rewritten');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-long-sidewalk-5228.js?v=522800'",
 'const visnovaLongPlan5228=planVisnovaLongSidewalk5228(regionId,roadWays);',
 'const visnovaLongNeutral5228=visnovaLongPlan5228?.neutralWayId===String(el.id);',
 'material:visnovaLongPlan5228.neutralMaterial',
 'a.renderedOriginalSegments+=drawn;',
 'a.sourceEdgeSafetyAudit.push({',
 'a.processedSourceEdges++;',
 'window.__miloviceVisnovaLongRuntime5228=()=>',
 "'visnova-long-sidewalk-5228':{",
 'href="?v=522800&streetAudit=visnova-long-sidewalk-5228"',
 'window.__miloviceVisnovaLongAudit5228=null;'
])assert(html.includes(needle),'missing runtime integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const run=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===run&&run===hud,'HUD/meta/runtime version synchronized');
console.log('PASS 5.228: source-locked 199.405m/10 original sidewalk strips; 2 direct GPS joins with mapped paving stones; no invented geometry');
