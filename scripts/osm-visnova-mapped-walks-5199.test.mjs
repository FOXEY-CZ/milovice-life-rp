import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_MAPPED_WALKS_5199 as S,planVisnovaMappedWalk5199 as plan}
 from './osm-visnova-mapped-walks-5199.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
let segments=0;
for(const spec of S.ways){
 const way=elements.find(w=>String(w.id)===spec.id);
 assert(way,'source footway '+spec.id);
 const copy=JSON.stringify(way);
 const result=plan('mlada',way);
 assert(result,'must accept exact OSM coordinates');
 assert.equal(result.sourceHash,spec.hash);
 assert.equal(result.material,'visnova-footway-model');
 assert.equal(result.sourceSegments,2);
 for(const prop of ['newFootways','newGeometry','newColliders','newParking'])
  assert.equal(result[prop],0);
 assert.equal(result.photoVerifiedSurface,false);
 assert.equal(plan('old',way),null);
 assert.equal(plan('mlada',{...way,tags:{...way.tags,surface:'paving_stones'}}),null);
 assert.equal(plan('mlada',{...way,geometry:way.geometry.map((p,i)=>
  i===1?{...p,lat:p.lat+.0000001}:p)}),null);
 assert.equal(plan('mlada',{...way,id:Number(way.id)+1}),null);
 assert.equal(JSON.stringify(way),copy);
 segments+=result.sourceSegments;
}
assert.equal(segments,4);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-visnova-mapped-walks-5199.js?v=519900'",
 "'visnova-footway-model':cityMatte(",
 'const visnovaWalk5199=planVisnovaMappedWalk5199(regionId,el);',
 'material:visnovaWalk5199.material,',
 'window.__miloviceVisnovaMappedWalkRuntime5199',
 'const BUILD_ID='
])assert(html.includes(marker),'missing scene integration '+marker);
console.log('PASS 5.199: 2 original OSM pedestrian paths / 4 segments, model material only, zero added geometry');
