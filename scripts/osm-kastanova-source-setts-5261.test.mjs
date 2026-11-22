// 5.261 — exact OSM sett source material is not a guessed city paving.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyMappedRoadSurface} from './osm-road-surfaces.js';
import {KASTANOVA_SOURCE_SETTS_5261 as S,
 planKastanovaSourceSetts5261 as plan} from './osm-kastanova-source-setts-5261.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ids=['8878402','1107814416'];
const ways=ids.map(id=>elements.find(e=>String(e.id)===id));
assert(ways.every(Boolean));
const unchanged=JSON.stringify(ways);
const p=ways.map(way=>plan({regionId:'mlada',way}));
assert(p.every(x=>x?.version==='5.261'));
assert.deepEqual(p.map(x=>x.sourceWayId),ids);
assert.deepEqual(p.map(x=>x.originalNodes),[2,13]);
assert.deepEqual(p.map(x=>x.sourceGeometryHash),['c200434c','c2f5c3c7']);
assert.deepEqual(p.map(x=>x.material),[S.material,S.material]);
assert(Math.abs(p.reduce((n,x)=>n+x.originalLengthMetres,0)-478.586)<.001);
assert.equal(classifyMappedRoadSurface(ways[0].tags).material,'paving',
 '5.94 generic sett currently looks like regular footway paving');
assert.equal(S.textureTileMetres,2.8);
assert.equal(p[0].modelStoneSizeEstimated,true);
assert.equal(p[0].photoVerified,false);
assert(p.every(x=>x.originalGPSUnchanged&&x.modelRoadWidthUnchanged&&
 x.modelRoadCollidersUnchanged&&x.originalVehicleGraphUnchanged));
for(const id of ids){
 const way=ways.find(w=>String(w.id)===id);
 assert.equal(plan({regionId:'old',way}),null);
 assert.equal(plan({regionId:'vrutice',way}),null);
 const spoof={...way,tags:{...way.tags,surface:'paving_stones'}};
 assert.equal(plan({regionId:'mlada',way:spoof}),null);
 const wrongName={...way,tags:{...way.tags,name:'Rakouská'}};
 assert.equal(plan({regionId:'mlada',way:wrongName}),null);
 const moved=structuredClone(way);moved.geometry[0].lat+=.0000001;
 assert.equal(plan({regionId:'mlada',way:moved}),null);
}
const rakouska=elements.find(e=>e.id===8590288);
assert.equal(rakouska.tags.name,'Rakouská');
assert.equal(rakouska.tags.surface,undefined);
assert.equal(plan({regionId:'mlada',way:rakouska}),null,
 'Do not infer the surface of untagged Rakouská');
assert.deepEqual(ways[0].geometry.at(-1),ways[1].geometry[0],
 'Both sett-tagged ways share their original OSM node');
assert.equal(JSON.stringify(ways),unchanged,'OSM geometry must remain byte-identical');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-kastanova-source-setts-5261.js?v=526100'",
 "const kastanovaSetts5261=planKastanovaSourceSetts5261({",
 "'kastanova-source-setts-5261':cityMatte(",
 "uvs[uvs.length-2]=xx/settledTile5261;",
 "'kastanova-setts-5261':{",
 "window.__miloviceKastanovaSettRuntime5261=()=>",
 "const BUILD_ID='20261122-rakouska-cross-frontage-526700'"
])assert(html.includes(token),'Missing real game integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const hud=html.match(/<strong id="build-label">([^<]+)<\/strong>/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
assert(meta&&meta===hud&&hud===runtime);
console.log('PASS 5.261 478.586m source-tagged Kaštanová sett roads, original OSM untouched, no invented Rakouská pavement');
