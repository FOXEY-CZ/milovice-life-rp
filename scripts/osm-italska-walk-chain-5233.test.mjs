// 5.233 — all five genuine OSM Italská pedestrian ways and road anchors.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_WALK_CHAIN_5233 as C,
 planItalskaWalkChain5233 as plan} from './osm-italska-walk-chain-5233.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements, original=JSON.stringify(E);
const result=plan('mlada',E);
assert(result,'all original GPS hashes/tags/4 pedestrian joins/2 road links');
assert.equal(result.version,'5.233');
assert.deepEqual(result.sourceWayIds,
 ['1484073943','1484073944','1484073945','1484073946','1484073947']);
assert.deepEqual(result.sourceRoadIds,['295391355','8585601']);
assert.deepEqual(result.sourceHashes,
 ['7d8bc0e5','9c3463dd','bf9fe98e','10cfdc0b','ef34d41f']);
assert.deepEqual(result.originalNodes,[7,3,2,3,4]);
assert.equal(result.originalGPSJoins,4);
assert.equal(result.originalRoadGPSJoins,2);
assert.equal(result.sourceSegments,14);
assert(result.totalOriginalMetres>534.3&&result.totalOriginalMetres<534.5);
assert.deepEqual(result.neutralFootwayIds,['1484073943','1484073945']);
assert.equal(result.taggedPavedFootwayId,'1484073947');
assert.deepEqual(result.unmarkedCrossingIds,['1484073944','1484073946']);
assert.equal(result.asphaltTaggedCrossingId,'1484073946');
assert.deepEqual(result.sourceSurfaces,{
 '1484073943':null,'1484073944':null,'1484073945':null,
 '1484073946':'asphalt','1484073947':'paving_stones'
});
assert.equal(result.materialByWay['1484073943'],'visnova-footway-model');
assert.equal(result.materialByWay['1484073945'],'visnova-footway-model');
assert.equal(result.materialByWay['1484073947'],'visnova-tagged-paving-stones');
assert.equal(Object.keys(result.materialByWay).length,3,
 'never invent a crossing surface where OSM has none');
for(const t of ['originalGPSUnchanged','originalRoadTrafficUnchanged',
 'paverShadeNotPhotographed','neutralSurfaceNotPhotographed',
 'noInventedCrossingPaint'])assert.equal(result[t],true,t);
for(const t of ['newFootways','newRoads','newZebras','newCrossings',
 'newColliders','newBuildings','newKerbs','newParking'])
 assert.equal(result[t],0,t);
assert.equal(plan('old',E),null);
for(const spec of [...C.paths,...C.roads]){
 const id=spec.id;
 const altered=fn=>E.map(w=>String(w.id)===id?fn(w):w);
 assert.equal(plan('mlada',E.filter(w=>String(w.id)!==id)),null,
  'missing required source '+id);
 assert.equal(plan('mlada',[...E,E.find(w=>String(w.id)===id)]),
  null,'duplicate original source '+id);
 assert.equal(plan('mlada',altered(w=>({...w,tags:{
  ...w.tags,custom:'fake'}}))),null,'extra source tag '+id);
 assert.equal(plan('mlada',altered(w=>({...w,geometry:w.geometry.map((p,i)=>
  i===1?{...p,lon:p.lon+.0000001}:p)}))),null,'GPS tamper '+id);
}
const testIds=['1484073944','1484073946'];
for(const id of testIds){
 const modified=E.map(w=>String(w.id)===id?{...w,tags:{
  ...w.tags,crossing:'marked','crossing:markings':'yes'}}:w);
 assert.equal(plan('mlada',modified),null,'never fabricate zebra '+id);
}
assert.equal(JSON.stringify(E),original,'raw OSM input not mutated');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const t of [
 "from './scripts/osm-italska-walk-chain-5233.js?v=523300'",
 'const italskaWalkChainPlan5233=planItalskaWalkChain5233(regionId,roadWays);',
 'const italskaWalkMaterial5233=italskaWalkChainPlan5233?.materialByWay[String(el.id)];',
 'window.__miloviceItalskaWalkChainRuntime5233=()=>',
 "'italska-walk-chain-5233':{",
 'href="?v=523300&streetAudit=italska-walk-chain-5233"'
])assert(html.includes(t),'game integration '+t);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const js=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===js&&js===hud,'meta HUD runtime build');
assert(html.includes('Verze 5.233'));
console.log('PASS 5.233 OSM Italská 534.368m original connected footway graph, exact GPS and two unmarked crossings');
