import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exteriorFacadeFrame,selectExteriorFacadeToward,splitFacadeStripForOpening,
 facadePoint,facadeGap,flushBoxOffset,FACE_PLANE,RECESSED_GLAZING,WINDOW_FRAME_DEPTH,WINDOW_SILL_DEPTH} from './facade-anchors.js';
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
  const a=outline[i],b=outline[(i+1)%outline.length];
  const segmentLength=Math.hypot(a.x-b.x,a.z-b.z);
  const f=exteriorFacadeFrame(outline,i);
  if(segmentLength<.08||segmentLength>140){
   // An imported CUZK cadastral polygon contains a real 7.9cm micro-edge.
   // Its wall is intentionally not modelled (sub-8cm geometry threshold),
   // so it must not be misreported as a 40cm floating window.
   assert.equal(f,null,name+' invalid micro-edge should be rejected');
   continue;
  }
  assert(f,name+' exterior wall edge '+i);
  length+=f.len;
  assert(near(Math.hypot(f.nx,f.nz),1));
  assert(near(f.nx*f.ux+f.nz*f.uz,0));
  assert(near(f.mx,(f.a.x+f.b.x)*.5));
  assert(near(f.mz,(f.a.z+f.b.z)*.5));
  // Compare the same segment traversed in the opposite winding.
  const reverse=[...outline].reverse();
  const matching=exteriorFacadeFrame(reverse,(outline.length*2-2-i)%outline.length);
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
  // Hero architecture intentionally skips ornaments on 70m+ industrial
  // walls, but the common physical facade normal still applies.
  if(f.len<=70){
   const band=planFacadePerimeterTrims(f.a,f.b,centroid,{
    base:5,height:4,frame:f});
   assert(band&&near(band.nx,f.nx)&&near(band.nz,f.nz),
    name+' plinth normal differs from its windows');
   const sill=facadeGap(f,band.upper,.28);
   const plinth=facadeGap(f,band.base,.16);
   assert(plinth<.035&&plinth>-.03&&sill<.035&&sill>-.03);
  }
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
assert(near(exteriorFacadeFrame(rect,1).nz,0));
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
// Regression 5.39: the photo-based main entrance of the Blue Star may
// never be occluded by the continuous 50 cm stone foundation band.
// Short chamfer edges (3.7 m) need a split band, not a missing whole plinth.
const star=osm.elements.find(b=>b.id===202367194);
assert(star,'Known photo-referenced corner hotel missing from source map');
const starOutline=star.geometry.slice(0,-1).map(q=>p(
 (q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 -(q.lat-50.226)*111320));
const camera=p((14.8840981-14.889)*111320*Math.cos(50.226*Math.PI/180),
 -(50.2280572-50.226)*111320);
const entrance=selectExteriorFacadeToward(starOutline,camera,{
 minLength:2.8,maxLength:7.2});
assert(entrance&&entrance.len>3.5&&entrance.len<4,
 'Corner entry must be attached to real short chamfer');
const pieces=splitFacadeStripForOpening(entrance,{
 along:0,width:1.48,padding:.045});
assert.equal(pieces.length,2,'A 50cm plinth must remain on either side of the entrance');
const clearWidth=1.48+2*.045,outer=entrance.len/2;
assert(near(pieces.reduce((sum,x)=>sum+x.width,0),
 entrance.len-clearWidth,1e-6));
for(const part of pieces){
 assert(part.width>.8&&part.width<1.3);
 const lo=part.along-part.width*.5,hi=part.along+part.width*.5;
 assert(hi<=-clearWidth*.5+1e-8||lo>=clearWidth*.5-1e-8,
  'Stone plinth still crosses the actual opening, hiding lower door');
 const pos=facadePoint(entrance,part.along,flushBoxOffset(.17));
 assert(near(facadeGap(entrance,pos,.17),.008));
 assert(lo>=-outer-1e-8&&hi<=outer+1e-8);
}
assert.deepEqual(splitFacadeStripForOpening(entrance,{
 along:0,width:20}),[],
 'A full-width doorway should not leave ghost plinth segments');
const flipped=selectExteriorFacadeToward([...starOutline].reverse(),camera,
 {minLength:2.8,maxLength:7.2});
assert(flipped&&Math.hypot(flipped.mx-entrance.mx,flipped.mz-entrance.mz)<1e-8);
const flippedBands=splitFacadeStripForOpening(flipped,{width:1.48,padding:.045});
assert(near(flippedBands.reduce((sum,x)=>sum+x.width,0),
 pieces.reduce((sum,x)=>sum+x.width,0)),
 'Reversed footprint must leave the same real doorway open');
const hero=readFileSync(new URL('./hero-architecture.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(hero.includes('exteriorFacadeFrame(pts,sideIndex)'));
assert(hero.includes('RECESSED_GLAZING'));
assert(hero.includes('flushBoxOffset(WINDOW_FRAME_DEPTH)'));
assert(hero.includes('flushBoxOffset(WINDOW_SILL_DEPTH)'));
assert(hero.includes("w+.28,.11,WINDOW_SILL_DEPTH,yaw"));
assert(html.includes('new THREE.BoxGeometry(1.92,.13,WINDOW_SILL_DEPTH)'));
assert(html.includes('flushBoxOffset(WINDOW_SILL_DEPTH)'));
assert(!hero.includes('const frame=front(flushBoxOffset(.18))'),
 'Old oversized 18cm window trim depth should never return');
assert(!html.includes('new THREE.BoxGeometry(1.92,.13,.30)'),
 'Ordinary windows cannot keep double-depth sills');
for(const depth of [WINDOW_FRAME_DEPTH,WINDOW_SILL_DEPTH]){
 assert(depth<=.16&&depth>.03);
 const face=exteriorFacadeFrame(rect,0);
 const placed=facadePoint(face,0,flushBoxOffset(depth));
 assert(near(facadeGap(face,placed,depth),.008),
  'Face-mounted trim must touch the actual OSM wall backplane');
}
assert(hero.includes('flushBoxOffset(.32)'));
assert(hero.includes('anchoredOpenings++'));
assert(html.includes('exteriorFacadeFrame(pts,i)'));
assert(html.includes('exteriorFacadeFrame(pts,longest.i)'));
assert(html.includes('exteriorFacadeFrame(pts,front.i)'));
assert(html.includes('addFacadePart(0,wx,y,wz,rotation,baseHeight)'));
assert(!html.includes('addFacadePart(0,px+nx*.38'));
assert(!html.includes('const doorx=mx+nx*.60'));
assert(html.includes('blueStarPlinth(facade);')&&
 html.includes('splitFacadeStripForOpening(face,{along:0,width:1.48,padding:.045})')&&
 html.includes('Math.min(base+.035,approachY+.025)')&&
 html.includes('doorTop-floorY')&&
 html.includes('jambTop-floorY')&&
 html.includes('blueStarEntryRaisedSillRemoved=true')&&
 html.includes('blueStarPlinthOpeningCount++'),
 'The physical entrance must start at local ground and the stone plinth must be split');
assert(!html.includes("archPart('foundationBand',mx+nx*flushBoxOffset(.17),baseHeight+.25"),
 'No remaining full-length Blue Star stone band may cover the door');
console.log('Facade attachment 5.40 PASS',JSON.stringify({
 buildings:valid,edges,shortEdges:processedShort,
 maxExteriorFloatingGapMetres:largestGap,framePlane:'OSM winding',
 defaultWindows:'flush overlay',heroWindows:'physical wall cutouts'
}));
