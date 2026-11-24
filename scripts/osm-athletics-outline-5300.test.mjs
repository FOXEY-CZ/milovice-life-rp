import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectAthleticsOutline5300 as inspect} from './osm-athletics-outline-5300.js';
for(const region of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const matched=ways.map(inspect).filter(Boolean);
 assert.deepEqual(matched.map(x=>x.id).sort(),['1472419115','1472419120']);
 for(const id of [1472419115,1472419120]){
  const way=ways.find(w=>w.id===id);
  assert(inspect(way).sourceGeometryPreserved);
  assert.equal(inspect({...way,tags:{...way.tags,athletics:'other'}}),null);
  const geometry=way.geometry.map(p=>({...p}));geometry[0].lat+=.00001;
  assert.equal(inspect({...way,geometry}),null);
  assert.equal(inspect({...way,id:123}),null);
 }
}
const src=readFileSync(new URL('./landscapes.js',import.meta.url),'utf8');
assert(src.includes('else for(let i=0;i<pts.length;i++)'));
assert(src.includes('suppressedAthleticsOutlines5300.push(entry.athleticsOutline5300)'));
assert(src.includes("kind==='pitch'&&!inspectAthleticsOutline5300(el)"));
console.log('PASS 5.300: two exact athletics source polygons in both overlapping regions, suppress only unverified outlines');
