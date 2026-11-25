import assert from 'node:assert/strict';
import {routeRecalculation5326 as reason} from './map-route-recalculation-5326.js';
const goal={},pt=(x,y)=>({x,y}),leg=(a,b)=>({a,b});
const cache={goal,revision:3,time:100,x:0,z:15,result:{status:'ready',startOffset:15,legs:[leg(pt(-50,0),pt(100,0))]},audit:{valid:true,legCount:1}};
const at=(now,x,z,extra={})=>({now,x,z,goal,revision:3,...extra});
assert.equal(reason(null,at(100,0,15)),'changed');
assert.equal(reason(cache,at(100,0,15,{goal:{}})),'changed');
assert.equal(reason(cache,at(100,0,15,{revision:4})),'changed');
assert.equal(reason(cache,at(1099,0,40)),null);
assert.equal(reason(cache,at(1100,0,23)),null);
assert.equal(reason(cache,at(1100,0,24)),'deviation');
assert.equal(reason(cache,at(1100,20,15)),null);
assert.equal(reason(cache,at(2100,20,15)),null);
assert.equal(reason(cache,at(2101,20,15)),'movement');
assert.equal(reason(cache,at(9999,0,15)),null);
const nearby={...cache,result:{...cache.result,legs:[...cache.result.legs,leg(pt(-50,30),pt(100,30))]},audit:{valid:true,legCount:2}};
assert.equal(reason(nearby,at(1100,0,30)),null);
const failed={...cache,result:{status:'no-route',legs:[]},audit:null};
assert.equal(reason(failed,at(1100,0,40)),null);
assert.equal(reason(failed,at(2101,0,40)),'movement');
assert.equal(reason({...cache,audit:null},at(1100,0,40)),null);
assert.equal(reason({...cache,result:{...cache.result,legs:[leg(pt(0,0),pt(0,0))]}},at(1100,0,40)),null);
assert.equal(reason(cache,at(NaN,0,40)),null);
// Simulate successive minimap ticks and reset the cache on a recalculation.
let active={...cache},events=[];
for(const [now,x,z] of [[450,0,20],[800,0,26],[1150,0,26],[1500,4,26],[1850,8,26],[2200,12,26],[2550,20,26],[2900,30,26],[3251,40,26]]){
 const why=reason(active,at(now,x,z));
 if(why){events.push([now,why]);active={...active,time:now,x,z,result:{...active.result,startOffset:0,legs:[leg(pt(-50,z),pt(100,z))]}};}
}
assert.deepEqual(events,[[1150,'deviation'],[3251,'movement']]);
const short={...cache,x:0,z:0,result:{...cache.result,startOffset:0,legs:[leg(pt(0,0),pt(10,0))]}};
assert.equal(reason(short,at(1100,29,0)),'deviation'); // beyond end of finite leg
assert.equal(reason(short,at(1100,10,18)),null); // exact distance threshold
assert.equal(reason(short,at(1100,10,19)),'deviation');
console.log('PASS 5.326 route recalculation cooldown, movement, deviation and unavailable route');
