import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPlaygroundSlideFrame5298 as plan} from './playground-slide-frame-5298.js';
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,a+' != '+b);
for(const yaw of [0,Math.PI/2,-1.25,Math.PI])for(const terrain of [()=>100,(x,z)=>100+.035*x-.025*z]){
 const p={type:'slide',x:10,z:20,yaw},q=plan(p,terrain);assert(q);
 assert.equal(q.frame.length,6);assert.equal(q.seat.length,4);assert.equal(q.plastic.length,4);assert.equal(q.slide.length,1);assert.equal(q.partCount,15);
 const a=q.slide[0],y=terrain(a[0],a[2])+a[1],dy=Math.sin(a[8])*a[3]/2;
 close(y-dy,q.startY);close(y+dy,q.endY);
 close(q.startY+.055,q.deckTop);
 for(const f of q.frame.slice(0,4)){const y=terrain(f[0],f[2])+f[1];close(y-f[4]/2,terrain(f[0],f[2]));close(y+f[4]/2,q.deckTop-.15);}
 for(const f of q.frame.slice(4)){const y=terrain(f[0],f[2])+f[1];close(y+Math.cos(f[8])*f[4]/2,q.deckTop);}
 for(const lip of q.plastic.slice(2)){close(lip[3],a[3]);close(lip[8],a[8]);}
}
assert.equal(plan({type:'swing',x:0,z:0,yaw:0},()=>0),null);
assert.equal(plan({type:'slide',x:0,z:0,yaw:0},()=>NaN),null);
assert.equal(plan({type:'slide',x:0,z:0,yaw:0},(x)=>x),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of ['planPlaygroundSlideFrame5298(p,terrainAt)','playSlide.push(...slide.slide)','slideFrame5298'])assert(html.includes(marker));
console.log('PASS 5.298: 15 existing parts, grounded supports, common slide slope, eight terrain/yaw cases');
