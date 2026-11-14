import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame,facadePoint,facadeGap,
 flushBoxOffset,FACE_PLANE,RECESSED_GLAZING} from './facade-anchors.js';
import {planFacadePerimeterTrims} from './facade-perimeter.js';
const near=(a,b,eps=1e-8)=>Math.abs(a-b)<eps;
const p=(x,z)=>({x,z});
const rect=[p(0,0),p(12,0),p(12,8),p(0,8)];
const concave=[p(0,0),p(14,0),p(14,3),p(4,3),p(4,13),p(0,13)];
function verify(name,outline){
 const centroid=outline.reduce((o,v)=>({x:o.x+v.x/outline.length,
  z:o.z+v.z/outline.length}),{x:0,z:0});
 let length=0,shortEdges=0;
 for(let i=0;i<outline.length;i++){
  const f=exteriorFacadeFrame(outline,i);
  assert(f,name+' exterior wall edge '+i);
  length+=f.len;
  assert(near(Math.hypot(f.nx,f.nz),1));
  assert(near(f.nx*f.ux+f.nz*f.uz,0));
  assert(near(f.mx,(f.a.x+f.b.x)*.5));
  assert(near(f.mz,(f.a.z+f.b.z)*.5));
  // Compare the same segment traversed in the opposite winding.
  const reverse=[...outline].reverse();
  const matching=exteriorFacadeFrame(reverse,outline.length-1-i);
  assert(matching&&near(matching.nx,f.nx)&&near(matching.nz,f.nz),
   name+' reversed polygon flips outward facade normal');
  const o=facadePoint(f,0,FACE_PLANE);
  assert(near(facadeGap(f,o),FACE_PLANE));
  assert(Math.hypot(o.x-f.mx,o.z-f.mz)<.04);
  const glass=facadePoint(f,0,RECESSED_GLAZING);
  assert(near(facadeGap(f,glass),RECESSED_GLAZING));
  for(const depth of [.065,.09,.12,.15,.18,.24,.30,.32,.82,2.45]){
   const q=facadePoint(f,0,flushBoxOffset(depth));
   assert(q);
   const gap=facadeGap(f,q,depth);
   assert(near(gap,.008),
    name+' boxed facade back face detached: '+depth+', gap='+gap);
   assert(gap<.04,'An architectural object is floating away from the wall');
  }
  const band=planFacadePerimeterTrims(f.a,f.b,centroid,{
   base:5,height:4,frame:f});
  assert(band&&near(band.nx,f.nx)&&near(band.nz,f.nz),
   name+' plinth normal differs from its windows');
  const sill=facadeGap(f,band.upper,.28);
  const plinth=facadeGap(f,band.base,.16);
  assert(plinth<.035&&plinth>-.03&&sill<.035&&sill>-.03);
  if(f.len<3)shortEdges++;
 }
 assert(length>0);
 return {length,shortEdges};
}
verify('rectangle',rect);
verify('rectangle CW',[...rect].reverse());
verify('concave L',concave);
verify('concave reversed',[...concave].reverse());
const angle=.43,c=Math.cos(angle),s=Math.sin(angle);
verify('concave rotated',concave.map(v=>p(v.x*c-v.z*s+330,v.x*s+v.z*c-155)));
assert.equal(exteriorFacadeFrame(rect,1).nx,1);
assert.equal(exteriorFacadeFrame(rect,1).nz,0);
assert.equal(exteriorFacadeFrame(rect,99),null);
assert.equal(exteriorFacadeFrame([p(0,0),p(0,0),p(0,0)],0),null);
assert.equal(flushBoxOffset(0),null);
assert.equal(flushBoxOffset(-1),null);
// This concave notch defeats the old "normal points away from centroid"
// heuristic: the polygon winding is authoritative on a re-entrant wall.
const insideNotch=exteriorFacadeFrame(concave,2);
assert(insideNotch.nz>0.999,'Reflex L segment must point into the open notch');
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const buildings=osm.elements.filter(e=>e.tags?.building&&Array.isArray(e.geometry));
let valid=0,edges=0,processedShort=0,largestGap=0;
for(const b of buildings){
 const polygon=b.geometry.slice(0,-1).map(q=>p(
  (q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
  -(q.lat-50.226)*111320));
 if(polygon.length<3)continue;
 const out=verify('OSM '+b.id,polygon);
 valid++;edges+=polygon.length;processedShort+=out.shortEdges;
 largestGap=Math.max(largestGap,.008);
}
assert.equal(buildings.length,684);
assert(valid>=680&&edges>2000&&processedShort>20,
 'Citywide geometry regression must cover every wall orientation');
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(hero.includes('exteriorFacadeFrame(pts,sideIndex)'));
assert(hero.includes('RECESSED_GLAZING'));
assert(hero.includes('flushBoxOffset(.18)'));
assert(hero.includes('flushBoxOffset(.32)'));
assert(hero.includes('anchoredOpenings++'));
assert(html.includes('exteriorFacadeFrame(pts,i)'));
assert(html.includes('exteriorFacadeFrame(pts,longest.i)'));
assert(html.includes('exteriorFacadeFrame(pts,front.i)'));
assert(html.includes('addFacadePart(0,wx,y,wz,rotation,baseHeight)'));
assert(!html.includes('addFacadePart(0,px+nx*.38'));
assert(!html.includes('const doorx=mx+nx*.60'));
console.log('Facade attachment 5.36 PASS',JSON.stringify({
 buildings:valid,edges,shortEdges:processedShort,
 maxExteriorFloatingGapMetres:largestGap,framePlane:'OSM winding',
 defaultWindows:'flush overlay',heroWindows:'physical wall cutouts'
}));
