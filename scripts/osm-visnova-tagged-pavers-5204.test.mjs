import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_TAGGED_PAVERS_5204 as S,planVisnovaTaggedPavers5204 as plan}
 from './osm-visnova-tagged-pavers-5204.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
let segments=0;
for(const spec of S.ways){
 const way=elements.find(w=>String(w.id)===spec.id);
 assert(way,'actual OSM paving way '+spec.id);
 const original=JSON.stringify(way);
 const result=plan('mlada',way);
 assert(result,'source way must be accepted unchanged');
 assert.equal(result.sourceHash,spec.hash);
 assert.equal(result.sourceTag,'paving_stones');
 assert.equal(result.material,'visnova-tagged-paving-stones');
 assert.equal(result.sourceSegments,spec.nodes-1);
 assert.equal(result.exactPaverTonePhotoVerified,false);
 for(const prop of ['addedRoads','addedFootways','addedColliders','addedGeometry'])
  assert.equal(result[prop],0);
 assert.equal(plan('old',way),null);
 assert.equal(plan('mlada',{...way,tags:{...way.tags,surface:'asphalt'}}),null);
 assert.equal(plan('mlada',{...way,geometry:way.geometry.map((p,i)=>
  i===1?{...p,lon:p.lon+.0000001}:p)}),null);
 assert.equal(plan('mlada',{...way,geometry:way.geometry.slice(1)}),null);
 assert.equal(JSON.stringify(way),original);
 segments+=result.sourceSegments;
}
assert.equal(segments,29);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-visnova-tagged-pavers-5204.js?v=520400'",
 "'visnova-tagged-paving-stones':cityMatte(",
 'const visnovaPavers5204=planVisnovaTaggedPavers5204(regionId,el);',
 'material:visnovaPavers5204.material,',
 'window.__miloviceVisnovaTaggedPaversRuntime5204',
 'const BUILD_ID='
])assert(html.includes(part),'missing runtime integration '+part);
console.log('PASS 5.204: 4 mapped paving_stones paths, 29 source segments, only estimated tint; no added geometry');
