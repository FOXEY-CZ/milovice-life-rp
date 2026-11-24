import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planPlaygroundSwingFrame5297 as plan} from './playground-swing-frame-5297.js';
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,a+' != '+b);
for(const yaw of [0,Math.PI/2,-1.25,Math.PI]){
 for(const terrain of [()=>100,(x,z)=>100+.12*x-.08*z]){
  const p={type:'swing',x:10,z:20,yaw};
  const q=plan(p,terrain);assert(q);
  assert.equal(q.frame.length,5);assert.equal(q.seat.length,2);
  assert.equal(q.chain.length,4);assert.equal(q.partCount,11);
  const c=Math.cos(yaw),s=Math.sin(yaw);
  for(const [i,leg] of q.frame.slice(0,4).entries()){
   const [x,y,z,,length,,angle,pitch]=leg;
   const u=i<2?-1.4:1.4,v=i%2===0?-.72:.72;
   const dy=Math.cos(pitch)*length/2,dv=Math.sin(pitch)*length/2;
   const wy=terrain(x,z)+y;
   close(x+Math.sin(angle)*dv,p.x+u*c);
   close(z+Math.cos(angle)*dv,p.z-u*s);
   close(wy+dy,q.barHeight);
   const fx=x-Math.sin(angle)*dv,fz=z-Math.cos(angle)*dv;
   close(fx,p.x+u*c+v*s);close(fz,p.z-u*s+v*c);
   close(wy-dy,terrain(fx,fz));
  }
  for(const a of q.chain){
   const y=terrain(a[0],a[2])+a[1];
   assert(y+a[4]/2>=q.barHeight-.07);
   assert(y-a[4]/2<=q.barHeight-2.50+.98);
  }
  for(const a of q.seat)close(terrain(a[0],a[2])+a[1],q.barHeight-1.58);
 }
}
assert.equal(plan({type:'slide',x:0,z:0,yaw:0},()=>0),null);
assert.equal(plan({type:'swing',x:0,z:0,yaw:0},()=>NaN),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of ['planPlaygroundSwingFrame5297(p,terrainAt)',
 'playFrame.push(...swing.frame)','playSeat.push(...swing.seat)',
 'playChain.push(...swing.chain)','swingFrame5297'])
 assert(html.includes(marker),marker);
console.log('PASS 5.297: A-frame four grounded legs meet common bar, eight terrain/yaw combinations, same eleven original parts');
