import assert from 'node:assert/strict';
import {calculateMapGuidance5319 as guide} from './map-guidance-5319.js';
const p={x:0,z:0};
for(const [x,z,yaw,arrow] of [[0,-100,0,'↑'],[100,0,0,'→'],[0,100,0,'↓'],[-100,0,0,'←'],[100,-100,0,'↗'],[100,0,-Math.PI/2,'↑'],[0,-100,Math.PI/2,'→']]){
 const g=guide(p,{x,z},yaw);assert.equal(g.arrow,arrow);assert.equal(g.straightLine,true);assert.equal(g.entranceVerified,false);
}
assert.equal(guide(p,{x:3,z:4},0).roundedMetres,5);
assert.equal(guide(p,{x:15,z:0},0).near,true);
assert.equal(guide(p,{x:16,z:0},0).near,false);
assert.equal(guide(p,p,0).arrow,'●');
assert.equal(guide(p,{x:Infinity,z:0},0),null);assert.equal(guide(p,p,NaN),null);
console.log('PASS 5.319 cardinal/diagonal relative directions, distance and proximity');
