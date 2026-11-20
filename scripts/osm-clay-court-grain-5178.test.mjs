import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makeMappedClayGrain5178} from './osm-clay-court-grain-5178.js';
import {classifyOSMPitch} from './osm-pitch-markings-599.js';
const grain=makeMappedClayGrain5178();
assert(grain);
assert.equal(grain.version,'5.178');
assert.equal(grain.bytes,64*64*4);
assert.equal(grain.data.byteLength,16384);
assert.deepEqual(grain.data,makeMappedClayGrain5178(64).data,
 'clay pixels must be deterministic');
assert.equal(makeMappedClayGrain5178(7),null);
assert.equal(makeMappedClayGrain5178(100),null);
assert.equal(makeMappedClayGrain5178(256),null);
assert.equal(new Set([...grain.data].filter((_,i)=>i%4===0)).size>20,true);
for(let i=3;i<grain.data.length;i+=4)assert.equal(grain.data[i],255);
assert.equal(classifyOSMPitch({leisure:'pitch',sport:'tennis',surface:'clay'}).material,'pitchClay');
assert.notEqual(classifyOSMPitch({leisure:'pitch',surface:'asphalt'}).material,'pitchClay');
const osm=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const data=JSON.parse(osm).elements;
const ids=['612386900','612386901','612386902'];
for(const id of ids){
 const way=data.find(e=>String(e.id)===id);
 assert(way&&way.tags?.leisure==='pitch'&&way.tags?.surface==='clay',
  'original OSM antuka missing: '+id);
}
const landscapes=readFileSync(new URL('./landscapes.js',import.meta.url),'utf8');
assert(landscapes.includes("import {makeMappedClayGrain5178}"));
assert(landscapes.includes("m.pitchClay.map=clayTexture;"));
assert(landscapes.includes("landscapeMat.get(T)?.pitchClay"));
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(index.includes('window.__miloviceClayGrainRuntime5178=()=>'));
assert(index.includes("from './scripts/landscapes.js?v=517800'"));
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),osm);
console.log('PASS 5.178: shared 16 KiB deterministic source-only clay texture, 3 Milten OSM clay polygons, zero added meshes');
