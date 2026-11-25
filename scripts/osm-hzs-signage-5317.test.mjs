import assert from 'node:assert/strict';
import {HZS_SIGNAGE_5317 as S,makeHZSSign5317 as make} from './osm-hzs-signage-5317.js';
assert.equal(S.facadeText,'STANICE HZS MILOVICE');assert.equal(S.towerText,'112');
const a=make('facade'),b=make('tower');
assert.equal(a.width,(S.facadeText.length*6+1)*2);assert.equal(a.height,18);
assert.equal(b.width,18);assert.equal(b.height,38);
for(const p of [a,b]){
 assert.equal(p.data.length,p.width*p.height*4);
 let opaque=0,transparent=0;
 for(let i=0;i<p.data.length;i+=4){
  if(p.data[i+3]===255){opaque++;assert.deepEqual([...p.data.slice(i,i+3)],[181,43,45]);}
  else{assert.equal(p.data[i+3],0);transparent++;}
 }
 assert(opaque>0&&transparent>0);assert.equal(p.photoPixels,0);assert.equal(p.placementVerified,false);
}
assert.equal(b.rotationDegrees,90);assert.equal(a.rotationDegrees,0);
for(const args of [['unknown',2],['tower',0],['tower',5],['facade',1.5]])assert.equal(make(...args),null);
assert.equal(S.towerDimensionsVerified,false);assert.equal(S.newGeometry,0);assert.equal(S.newColliders,0);
console.log('PASS 5.317 original transparent HZS signage and unverified placement gates');
