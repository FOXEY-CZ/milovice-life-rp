// 5.225 fail-closed source proof for existing Lesní pedestrian chain.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESNI_WALK_CHAIN_5225 as C,planLesniWalkChain5225 as plan}
 from './osm-lesni-walk-chain-5225.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elems=JSON.parse(raw).elements;
const selected=[...C.walks,C.crossing,C.paved]
 .map(s=>elems.filter(w=>String(w.id)===s.id));
assert(selected.every(a=>a.length===1),'all four unique OSM footways');
const original=JSON.stringify(selected);
const p=plan({regionId:'mlada',ways:elems});
assert(p,'four existing ways have exact OSM junctions');
assert.equal(p.version,'5.225');
assert.deepEqual(p.sourceWayIds,['1460019797','1460019795','1460019796','1057549994']);
assert.deepEqual(p.sourceHashes,['820c13b1','3432210d','b29a84ad','02767378']);
assert.deepEqual(p.neutralFootwayIds,['1460019797','1460019795']);
assert.deepEqual(p.junctionGPS,[
 '50.2292780,14.8701521','50.2293448,14.8701535',
 '50.2294249,14.8701763']);
assert.equal(p.sourceSegments,11);
assert(Math.abs(p.originalMeters-165.489)<.01);
assert.equal(p.neutralOriginalSegments,4);
assert.equal(p.neutralOriginalMeters,85.961);
assert.equal(p.pavedOriginalSegments,5);
assert.equal(p.crossingOriginalSegments,2);
assert.equal(p.crossingSourceTag,'unmarked');
assert.equal(p.crossingMarkingsTag,'no');
assert.equal(p.neutralMaterial,'visnova-footway-model');
assert.equal(p.pavedMaterial,'visnova-tagged-paving-stones');
assert.equal(p.neutralSurfaceIsUntagged,true);
assert.equal(p.neutralSurfaceIsModelOnly,true);
assert.equal(p.pavedSourceTag,'paving_stones');
assert.equal(p.originalOSMConnectionsExist,true);
for(const k of ['sourcePedestrianGeometryUnchanged','originalCrossingUnchanged',
 'originalRoadWidthsUnchanged'])assert.equal(p[k],true,k);
for(const k of ['inventedZebraStripes','newFootways','newCrossings','newRoads',
 'newKerbs','newColliders','newStreetLights','newTrees','newBuildings'])
 assert.equal(p[k],0,k);
const change=(id,patch)=>elems.map(w=>String(w.id)===String(id)?{...w,...patch}:w);
const sourceWay=id=>selected.flat().find(w=>String(w.id)===id);
const long=sourceWay('1460019797'),short=sourceWay('1460019795'),
 crossing=sourceWay('1460019796'),paved=sourceWay('1057549994');
for(const [why,options] of [
 ['region',{regionId:'old',ways:elems}],
 ['missing member',{regionId:'mlada',ways:elems.filter(w=>w.id!==long.id)}],
 ['duplicated member',{regionId:'mlada',ways:[...elems,paved]}],
 ['model guess made literal',{regionId:'mlada',ways:change(long.id,{tags:{...long.tags,surface:'concrete'}})}],
 ['paint forbidden zebra',{regionId:'mlada',ways:change(crossing.id,{tags:{...crossing.tags,'crossing:markings':'yes'}})}],
 ['wrong crossing kind',{regionId:'mlada',ways:change(crossing.id,{tags:{...crossing.tags,crossing:'marked'}})}],
 ['wrong paved surface',{regionId:'mlada',ways:change(paved.id,{tags:{...paved.tags,surface:'asphalt'}})}],
 ['change end of long',{regionId:'mlada',ways:change(long.id,{geometry:long.geometry.map((p,i)=>i===0?{...p,lat:p.lat+.0000001}:p)})}],
 ['change short start',{regionId:'mlada',ways:change(short.id,{geometry:short.geometry.map((p,i)=>i===0?{...p,lon:p.lon+.0000001}:p)})}],
 ['change crossing GPS',{regionId:'mlada',ways:change(crossing.id,{geometry:crossing.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.0000001}:p)})}],
 ['reverse path',{regionId:'mlada',ways:change(paved.id,{geometry:[...paved.geometry].reverse()})}],
 ['add tags',{regionId:'mlada',ways:change(short.id,{tags:{...short.tags,lit:'yes'}})}]
 ])assert.equal(plan(options),null,'strict fail closed '+why);
assert.equal(JSON.stringify(selected),original,'do not alter original OSM');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-lesni-walk-chain-5225.js?v=522500'",
 'const lesniWalkChainPlan5225=planLesniWalkChain5225({',
 'const lesniWalkNeutral5225=lesniWalkChainPlan5225?.neutralFootwayIds.includes(String(el.id));',
 "material:lesniWalkChainPlan5225.neutralMaterial",
 'const lesniWalkDrawBefore5225=',
 'osmSurfaceAudit.drawnSegments-lesniWalkDrawBefore5225',
 'window.__miloviceLesniWalkChainRuntime5225=()=>',
 "'lesni-walk-chain-5225':{",
 'href="?v=522500&streetAudit=lesni-walk-chain-5225"',
 'window.__miloviceLesniWalkChainAudit5225=null;'
])assert(html.includes(marker),'missing game integration '+marker);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'build numbers in sync');
console.log('PASS 5.225 exact 165.489 m connected OSM walk chain;',
 'two untagged model-neutral sidewalks 85.961m,',
 'original UNMARKED crossing with no invented stripes,',
 'and already-paved 5.220 footway; 11 source segments preserved');
