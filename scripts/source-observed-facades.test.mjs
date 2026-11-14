import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame} from './facade-anchors.js';
import {planFaceOpenings} from './facade-model.js';
import {planSourceObservedFacade} from './source-observed-facades.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const polygon=osm.elements.find(e=>e.id===118487980).geometry.slice(0,-1).map(p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
}));
function inspect(points){
 const result=[];
 for(let i=0;i<points.length;i++){
  const f=exteriorFacadeFrame(points,i),obs=planSourceObservedFacade(118487980,f);
  if(!obs)continue;
  const openings=planFaceOpenings({length:f.len,height:3.75,levels:2,
   side:obs.side,autoEntrance:true});
  assert.equal(openings.door,null,'No fake door on photographed facade');
  assert.equal(openings.windows.length,obs.groundWindows);
  assert(openings.windows.every(v=>v.floor===0&&v.y+v.h<3.75));
  result.push({x:f.mx,z:f.mz,windows:openings.windows.length});
 }
 assert.equal(result.length,2);
 assert.deepEqual(result.map(x=>x.windows).sort(),[1,3]);
 return result;
}
const a=inspect(polygon),b=inspect([...polygon].reverse());
for(const f of a)assert(b.some(x=>Math.hypot(x.x-f.x,x.z-f.z)<.00001&&x.windows===f.windows));
assert.equal(planSourceObservedFacade(202367254,exteriorFacadeFrame(polygon,4)),null);
const fork=osm.elements.find(e=>e.id===202298939).geometry.slice(0,-1).map(p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
}));
for(const poly of [fork,[...fork].reverse()]){
 let blank=0;
 for(let i=0;i<poly.length;i++){
  const frame=exteriorFacadeFrame(poly,i),obs=planSourceObservedFacade(202298939,frame);
  if(!obs)continue;
  blank++;
  const op=planFaceOpenings({length:frame.len,height:3.75,levels:1,
   side:obs.side,autoEntrance:true});
  assert.equal(obs.groundWindows,0);
  assert.equal(op.door,null,'Photographed grey gable cannot have imaginary entrance');
  assert.equal(op.windows.length,0,'Photographed blank gable must stay blank');
 }
 assert.equal(blank,1,'Only ONE face photo-verified; no false 360 coverage');
}
const html=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
assert(html.includes('planSourceObservedFacade(String(identity),edgeFrame)'));
assert(html.includes('const actualSide=sideLayout||observed?.side||null;'));
assert(html.includes("String(identity)!=='202298939'")&&
 html.includes('sideIndex===entrySide'),
 'No photo-confirmed fork entry may be invented on an unseen wall');
console.log('5.52 photographed street facades, 4 front windows, zero fake street doors PASS');
