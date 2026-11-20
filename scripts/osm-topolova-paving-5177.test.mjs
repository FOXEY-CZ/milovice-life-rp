import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPaving5177,TOPOLOVA_PAVING_5177} from './osm-topolova-paving-5177.js';
import {planTopolovaZebraPaint5187,makeTopolovaZebraPaintPixels5187,TOPOLOVA_ZEBRA_PAINT_5187} from './osm-topolova-zebra-paint-5187.js';
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
// 5.187: two original Topolova zebras get shared model-paint artwork,
// strictly source-locked (not a claim of photographed wear).
const crossingIds=Object.keys(TOPOLOVA_ZEBRA_PAINT_5187.sourceWayHashes);
assert.deepEqual(crossingIds,['1316882853','1316882854']);
for(const id of crossingIds){
 const way=elements.find(e=>String(e.id)===id);
 assert(way,'OSM crossing missing '+id);
 const plan=planTopolovaZebraPaint5187('mlada',way);
 assert(plan,'verified original crossing '+id);
 assert.equal(plan.sourceWayId,id);
 assert.equal(plan.newStripePieces,0);
 assert.equal(plan.wearPhotoVerified,false);
 for(const patch of [
  {id:'9999999'},
  {tags:{...way.tags,crossing:'unmarked'}},
  {tags:{...way.tags,surface:'paving_stones'}},
  {geometry:way.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}
 ])assert.equal(planTopolovaZebraPaint5187('mlada',{...way,...patch}),null);
 assert.equal(planTopolovaZebraPaint5187('other',way),null);
}
const zebraPixels=makeTopolovaZebraPaintPixels5187();
assert.equal(zebraPixels.byteCount,64*64*4);
assert.equal(zebraPixels.visualVariationPhotoVerified,false);
assert.equal(makeTopolovaZebraPaintPixels5187(128),null);
assert.deepEqual(zebraPixels.data,makeTopolovaZebraPaintPixels5187().data);
assert(new Set(zebraPixels.data.filter((v,i)=>i%4===0)).size>10,
 'the lightweight paint texture should have deterministic microvariation');
assert(Array.from({length:64*64},(_,i)=>zebraPixels.data[i*4+3])
 .every(alpha=>alpha===255));
for(const token of [
 "from './scripts/osm-topolova-zebra-paint-5187.js?v=518700'",
 'const topolovaZebraPaint5187=planTopolovaZebraPaint5187(regionId,el)',
 'topolovaZebraPaint5187?topolovaZebraMat5187:osmStripeMaterial',
 'window.__miloviceTopolovaZebraPaint5187',

])assert(html.includes(token),'missing 5.187 crossing integration: '+token);
console.log('PASS 5.187: 2 source-locked Topolova zebra ways; one shared 64px texture, no new crossing geometry');
console.log('PASS 5.177: three original Topolova footways get OSM-locked paving tint without new geometry');
