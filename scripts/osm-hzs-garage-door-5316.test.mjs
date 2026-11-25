import assert from 'node:assert/strict';
import {makeHZSGarageDoor5316 as make} from './osm-hzs-garage-door-5316.js';
const p=make();assert.equal(p.data.byteLength,8192);
const pixel=(x,y)=>[...p.data.slice((y*p.width+x)*4,(y*p.width+x)*4+4)];
assert.deepEqual(pixel(0,0),[139,36,38,255]);
assert.deepEqual(pixel(10,2),[181,43,45,255]);
assert.deepEqual(pixel(10,19),[67,86,93,255]);
assert.deepEqual(pixel(16,19),[181,43,45,255]);
assert.deepEqual(pixel(10,25),[181,43,45,255]);
assert.equal(p.data.filter((_,i)=>i%4===3).every(a=>a===255),true);
assert.equal(p.modelGlassRows,4);assert.equal(p.modelGlassColumns,2);
assert.equal(p.photoPixels,0);assert.equal(p.exactPanelCountVerified,false);
assert.equal(p.placementVerified,false);assert.equal(p.newColliders,0);
for(const args of [[0,64],[32,0],[129,64],[32,257],[NaN,64],[32,33.5]])assert.equal(make(...args),null);
console.log('PASS 5.316 original HZS garage door texture, opaque and no position claim');

import {readFileSync} from 'node:fs';
import {planHZSModelDoors5316 as plan,renderHZSModelDoors5316 as render} from './osm-hzs-garage-door-5316.js';
for(const regionId of ['mlada','westlink']){
 const {elements}=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8'));
 const input={...elements.find(e=>e.id===985224523),regionId};
 const world=p=>({x:(p.lon-14.8547)*71300,z:-(p.lat-50.23015)*111320});
 const a=plan(input,world);assert(a);assert.equal(a.edge,3);assert.equal(a.doors.length,3);
 assert(a.length>13&&a.length<15);assert(a.doors[0].from>0&&a.doors[2].to<a.length);
 assert.equal(a.facadeOrientationVerified,false);assert.equal(a.doorCountVerified,false);
 assert.equal(a.newColliders,0);assert.equal(plan({...input,approvedArchitecture:true},world),null);
 assert.equal(render(null,{enabled:false}),null);
}
console.log('PASS 5.316 model-only source shell door layout and opt-in guard');
