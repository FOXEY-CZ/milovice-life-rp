import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inspectJuventaLongJump5302 as inspect} from './osm-juventa-long-jump-5302.js';
import {planCityLanduseBatches,selectLanduseRenderMaterial,makePitchSandGrain5303} from './landscapes.js';
for(const region of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+region+'.json',import.meta.url),'utf8')).elements;
 const matched=ways.map(inspect).filter(Boolean);
 assert.equal(matched.length,1);
 const way=ways.find(w=>String(w.id)==='1472419120');
 assert.equal(matched[0].sourceHash,'6f18862d');
 assert.equal(matched[0].currentSurfaceVerified,false);
 const convert=p=>({x:(p.lon-14.866674)*71180,y:(50.225972-p.lat)*111320});
 const entry=planCityLanduseBatches([way],convert).entries[0];
 assert.equal(entry.renderMaterial,'pitchSand');
 assert.equal(selectLanduseRenderMaterial(way,'pitch'),entry.renderMaterial);
 for(const [surface,material] of [['grass','pitch'],['sand','pitchSand'],['clay','pitchClay'],['asphalt','pitchAsphalt'],['artificial_turf','pitchTurf']]){
  const tagged={...way,tags:{...way.tags,surface}};
  assert.equal(inspect(tagged),null);
  assert.equal(selectLanduseRenderMaterial(tagged,'pitch'),material);
  assert.equal(planCityLanduseBatches([tagged],convert).entries[0].renderMaterial,material);
 }
 const turf=ways.find(w=>String(w.id)==='1472419116');
 assert.equal(selectLanduseRenderMaterial(turf,'pitch'),'pitchTurf');
 assert.equal(selectLanduseRenderMaterial({...turf,tags:{...turf.tags,surface:'clay'}},'pitch'),'pitchClay');
 assert.equal(selectLanduseRenderMaterial({tags:{landuse:'grass',surface:'sand'}},'grass'),'grass');
 assert.deepEqual(entry.pts,way.geometry.slice(0,-1).map(convert));
 assert.equal(inspect({...way,tags:{...way.tags,surface:'grass'}}),null);
 assert.equal(inspect({...way,id:1}),null);
 const geometry=way.geometry.map(p=>({...p}));geometry[0].lat+=.00001;
 assert.equal(inspect({...way,geometry}),null);
 assert.equal(inspect(ways.find(w=>String(w.id)==='1472419115')),null);
}
console.log('PASS 5.302: exact long-jump polygon, inferred sand surface, no new geometry');

const grain=makePitchSandGrain5303();
assert.equal(grain.width,32);
assert.equal(grain.height,32);
assert.equal(grain.bytes,4096);
assert.deepEqual(grain.data,makePitchSandGrain5303().data);
assert(new Set(grain.data.filter((_,i)=>i%4===0)).size>20);
for(let i=0;i<grain.data.length;i+=4){
 assert.equal(grain.data[i],grain.data[i+1]);
 assert.equal(grain.data[i],grain.data[i+2]);
 assert.equal(grain.data[i+3],255);
}
console.log('PASS 5.303: deterministic shared neutral sand grain, 4 KiB');

import {planJuventaAccess5304,permitJuventaParking5304} from './osm-juventa-access-5304.js';
const toWorld5304=p=>({x:(p.lon-14.866674)*71180,z:(50.225972-p.lat)*111320});
for(const regionId of ['mlada','westlink']){
 const ways=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8')).elements;
 const plan=planJuventaAccess5304({regionId,ways,toWorld:toWorld5304});
 assert(plan);
 assert.deepEqual(plan.protectedWayIds,['1472419124','1472419127','1472419128']);
 assert.equal(plan.segments.length,6);
 for(const {a,b} of plan.segments){
  assert.equal(permitJuventaParking5304(plan,a),false);
  assert.equal(permitJuventaParking5304(plan,{x:(a.x+b.x)/2,z:(a.z+b.z)/2}),false);
 }
 assert.equal(permitJuventaParking5304(plan,{x:1000,z:1000}),true);
 assert.equal(permitJuventaParking5304(plan,{x:NaN,z:0}),false);
 assert.equal(planJuventaAccess5304({regionId,ways:ways.filter(w=>String(w.id)!=='1472419127'),toWorld:toWorld5304}),null);
}
console.log('PASS 5.304: three exact original pedestrian approaches in both region copies');
