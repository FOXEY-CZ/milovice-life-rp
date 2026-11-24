import assert from 'node:assert/strict';
import {planMiloviceParking as plan,mappedParkingEnvelopeClear5299 as clear} from './parking-layout.js';
const poly=(coords)=>coords.map(([x,y])=>({x,y}));
const rectangle=poly([[-20,-12],[20,-12],[20,12],[-20,12],[-20,-12]]);
const concave=poly([[-20,-12],[20,-12],[20,12],[2,12],[2,-2],[-2,-2],[-2,12],[-20,12],[-20,-12]]);
const lot=(points)=>({id:1,type:'surface',points});
assert(clear({x:0,z:0},rectangle));
assert(!clear({x:19,z:0},rectangle));
assert(!clear({x:0,z:0},concave));
assert(!clear({x:3,z:0},concave));
assert(clear({x:10,z:0},concave));
assert(!clear({x:0,z:0},poly([[-1,-20],[1,-20],[1,20],[-1,20]])));
assert(!clear({x:0,z:0},[{x:NaN,y:0}]));
for(const points of [rectangle,concave])for(let seed=1;seed<=30;seed++)for(const limit of [0,1,2,3,4,8,12]){
 const spots=plan([], [lot(points)],{limit,seed});
 assert(spots.length<=limit);
 assert(spots.every(p=>clear(p,points)));
 if(points===rectangle&&limit===1)assert.equal(spots.length,1);
 for(let i=0;i<spots.length;i++)for(let j=0;j<i;j++)assert(Math.hypot(spots[i].x-spots[j].x,spots[i].z-spots[j].z)>8.2);
}
const road={a:{x:0,y:0},b:{x:80,y:0},len:80,width:6,kind:'residential',osmId:2};
assert.equal(plan([road],[],{limit:1}).length,1);
assert.equal(plan([road],[],{limit:0}).length,0);
assert.equal(plan([road],[lot(rectangle)],{limit:1}).length,1);
console.log('PASS 5.299: hard slot cap, conservative 2.3m model envelope, concave polygons, existing roadside fallback');
