import assert from 'node:assert/strict';
import {auditRoofStreetVisibility} from './roof-street-visibility.js';
const p=(x,y,z)=>({x,y,z});
const wall=[{x:0,z:0},{x:12,z:0},{x:12,z:20},{x:0,z:20}];
const cam={x:6,z:-30,y:1.7};
const roof=height=>({eaveY:10,rise:height-10,faces:[
 [p(2,10,2),p(6,height,8),p(10,10,2)],
 [p(2,10,2),p(10,10,2),p(8,height,8)],
 [p(2,10,2),p(8,height,8),p(6,height,8)]
]});
const low=auditRoofStreetVisibility({roof:roof(10.5),outline:wall,camera:cam,minVisible:.1});
const high=auditRoofStreetVisibility({roof:roof(17),outline:wall,camera:cam,minVisible:.1});
assert(low&&!low.pass,'Hidden roof must fail');
assert(high?.pass&&high.visibleFraction>.1,'Visible roof must pass');
assert(!auditRoofStreetVisibility({roof:{...roof(17),rise:12},
 outline:wall,camera:cam,minVisible:0}).pass,'Requested rise must exist in mesh');
assert.equal(auditRoofStreetVisibility({roof:roof(17),outline:wall,
 camera:{...cam,y:NaN}}),null);
console.log('5.49 reusable roof visibility acceptance PASS');
