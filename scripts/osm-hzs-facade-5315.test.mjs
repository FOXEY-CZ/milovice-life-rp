import assert from 'node:assert/strict';
import {HZS_FACADE_5315 as F,makeHZSCladding5315 as make} from './osm-hzs-facade-5315.js';
const a=make();assert.equal(a.width,1);assert.equal(a.height,64);assert.equal(a.data.byteLength,256);
assert.deepEqual([...a.data.slice(0,4)],[99,115,122,255]);
assert.deepEqual([...a.data.slice(4,8)],[169,183,188,255]);
assert.deepEqual([...a.data.slice(0,32)],[...a.data.slice(32,64)]);
assert.equal(a.photoPixels,0);assert.equal(a.newMeshes,0);
assert.equal(F.sourceLevelCount,2);assert.equal(F.sourceBuildingId,'985224523');
for(const k of ['facadeOrientationVerified','doorCountVerified','towerDimensionsVerified','colorsSurveyed','readyForGeometry'])assert.equal(F[k],false);
for(const n of [0,15,17,257,NaN,64.5])assert.equal(make(n),null);
assert.equal(make(256).data.length,1024);
console.log('PASS 5.315 original HZS cladding palette and unverified geometry guards');

import {readFileSync} from 'node:fs';
import {planHZSShell5315 as plan,makeHZSShellPalette5315 as palette} from './osm-hzs-facade-5315.js';
const p=palette();assert.equal(p.data.byteLength,512);assert.equal(p.plasterRows,64);
assert.deepEqual([...p.data.slice(0,4)],[228,226,221,255]);assert.deepEqual([...p.data.slice(256,260)],[99,115,122,255]);
for(const regionId of ['mlada','westlink']){
 const {elements}=JSON.parse(readFileSync(new URL('../data/regions/'+regionId+'.json',import.meta.url),'utf8'));
 const building=elements.find(e=>e.id===985224523),input={...building,regionId};
 assert.equal(plan(input).sourceHash,'10a34d4b');assert.equal(plan(input).newColliders,0);
 assert.equal(plan({...input,approvedArchitecture:true}),null);assert.equal(plan({...input,photoReviewed:true}),null);
 assert.equal(plan({...input,geometry:input.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.00001}:p)}),null);
 assert.equal(plan({...input,id:1468803952}),null);
}
console.log('PASS 5.315 exact HZS shell palette and override guards');
