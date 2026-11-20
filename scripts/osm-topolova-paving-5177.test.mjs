import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPaving5177,TOPOLOVA_PAVING_5177} from './osm-topolova-paving-5177.js';
const source=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(source).elements;
const expected=Object.keys(TOPOLOVA_PAVING_5177.sourceWays);
assert.equal(expected.length,3);
for(const id of expected){
 const way=elements.find(e=>String(e.id)===id);
 assert(way,'source OSM footway '+id);
 const plan=planTopolovaPaving5177('mlada',way);
 assert(plan,'mapped paving stones geometry remains identical: '+id);
 assert.equal(plan.sourceWayId,id);
 assert.equal(plan.material,'topolova-paving-stones');
 assert.equal(plan.colorPhotoVerified,false);
 for(const key of ['newGeometry','newFootways','newRoads','newColliders'])
  assert.equal(plan[key],0);
 assert.equal(planTopolovaPaving5177('other',way),null);
 assert.equal(planTopolovaPaving5177('mlada',{
  ...way,tags:{...way.tags,surface:'asphalt'}}),null);
 assert.equal(planTopolovaPaving5177('mlada',{
  ...way,geometry:way.geometry.map((p,i)=>i===0?
   {...p,lon:p.lon+.0000001}:p)}),null);
}
assert.equal(planTopolovaPaving5177('mlada',{
 id:'unmapped',tags:{highway:'footway',surface:'paving_stones'},
 geometry:[{lat:50,lon:14},{lat:50.1,lon:14}]}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-topolova-paving-5177.js?v=517700'",
 "'topolova-paving-stones':cityMatte(",
 'planTopolovaPaving5177(regionId,el)',
 'material:topolovaPaving5177.material',
 'window.__miloviceTopolovaPaving5177'
])assert(html.includes(token),'missing game rendering integration '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),
 source);
console.log('PASS 5.177: three original Topolova footways get OSM-locked paving tint without new geometry');
