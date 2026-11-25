import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GAME_TITLE,STREET_NAMES,LANDMARK_NAMES,REGION_NAMES,streetDisplayName,landmarkDisplayName,regionDisplayName} from './fictional-identity.js';
const paths=["data/milovice-osm.json","data/regions/mlada.json","data/regions/vrutice.json","data/regions/westlink.json","data/regions/centerlink.json","data/regions/bozidar.json"];
const names=new Set();
for(const path of paths){
 const source=JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
 for(const e of source.elements){const t=e.tags||{};if(t.highway&&t.name)names.add(t.name);if(t['addr:street'])names.add(t['addr:street']);}
}
assert.equal(names.size,Object.keys(STREET_NAMES).length);
for(const n of names){assert.ok(Object.hasOwn(STREET_NAMES,n),n);assert.ok(!names.has(streetDisplayName(n)),n);}
assert.equal(new Set(Object.values(STREET_NAMES)).size,names.size);
assert.equal(Object.keys(LANDMARK_NAMES).length,14);
assert.equal(new Set(Object.values(LANDMARK_NAMES)).size,14);
assert.equal(Object.keys(REGION_NAMES).length,6);
assert.equal(streetDisplayName('Topolová'),'Stříbrná alej');
assert.equal(landmarkDisplayName('🛒 Tesco'),'🛒 BrayMart');
assert.equal(regionDisplayName('mlada'),'Javorové sídliště');
for(const v of [null,undefined,'__proto__','constructor','neznámý název'])assert.equal(streetDisplayName(v),'Nepojmenovaná cesta');
assert.equal(GAME_TITLE,'Brayleston: City Life');
console.log('PASS fictional identity: all source street names, 14 landmarks and 6 regions');
