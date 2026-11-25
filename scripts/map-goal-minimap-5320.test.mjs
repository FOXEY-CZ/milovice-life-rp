import assert from 'node:assert/strict';
import {mapGoalMarker5320 as pin,drawMapGoalMarker5320 as draw} from './map-goal-minimap-5320.js';
const p={x:0,z:0};
let a=pin(p,{x:0,z:-100},0);assert.equal(a.x,0);assert.equal(a.y,-30);assert.equal(a.clamped,false);
a=pin(p,{x:100,z:0},-Math.PI/2);assert(Math.abs(a.x)<1e-6);assert(Math.abs(a.y-30)<1e-6);
a=pin(p,{x:100,z:0},Math.PI/2);assert(Math.abs(a.x)<1e-6);assert(Math.abs(a.y+30)<1e-6);
a=pin(p,{x:1000,z:-1000},0);assert.equal(a.clamped,true);assert(Math.abs(Math.hypot(a.x,a.y)-66)<1e-6);
assert.equal(a.directPointNotRoute,true);assert.equal(a.newWorldObjects,0);
assert.equal(pin(p,{x:3,z:4},0).near,true);assert.equal(pin(p,{x:16,z:0},0).near,false);
for(const args of [[p,null,0],[p,p,NaN],[p,p,0,0],[p,p,0,.3,100]])assert.equal(pin(...args),null);
const calls=[];const ctx=new Proxy({}, {get:(o,k)=> (...args)=>calls.push([k,...args]),set:()=>true});
assert.equal(draw(ctx,null),false);
for(const marker of [pin(p,{x:0,z:-100},0),pin(p,{x:1000,z:0},0),pin(p,p,0)]){
 calls.length=0;assert(draw(ctx,marker));assert.equal(calls[0][0],'save');assert.equal(calls.at(-1)[0],'restore');
 assert(calls.some(c=>c[0]==='stroke'));
}
console.log('PASS 5.320 minimap rotation, radial clamp, near ring and canvas drawing');
