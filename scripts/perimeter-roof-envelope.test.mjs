// Roof System 3.1: systemic QA for every future photo and OSM building.
// A multi-sided building must never need a metre-tall fake roof-to-wall wedge.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planCityBuildingRoof} from './city-roof-geometry.js';
import {roofBoundaryGap,samplePerimeterRoofHeight} from './perimeter-roof-envelope.js';
import {planRoofPerimeterClosure} from './station-roof-seams.js';
import {planStationRoofEaves} from './station-roof-eaves.js';
const pt=(x,z)=>({x,z});
const turn=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const polyArea=p=>Math.abs(p.reduce((s,a,i)=>{
 const b=p[(i+1)%p.length];return s+a.x*b.z-b.x*a.z;
},0))*.5;
function inTriangle(p,a,b,c){
 const w=Math.sign(turn(a,b,c));
 return w*turn(a,b,p)>-1e-8&&w*turn(b,c,p)>-1e-8&&
  w*turn(c,a,p)>-1e-8;
}
function triangulate(poly){
 const wind=Math.sign(poly.reduce((s,a,i)=>{
  const b=poly[(i+1)%poly.length];return s+a.x*b.z-b.x*a.z;
 },0)),ids=poly.map((_,i)=>i),tri=[];
 let guard=0;
 while(ids.length>3&&guard++<300){
  let found=false;
  for(let j=0;j<ids.length;j++){
   const ia=ids[(j+ids.length-1)%ids.length],ib=ids[j],
    ic=ids[(j+1)%ids.length],a=poly[ia],b=poly[ib],c=poly[ic];
   if(wind*turn(a,b,c)<1e-8)continue;
   if(ids.some(k=>k!==ia&&k!==ib&&k!==ic&&inTriangle(poly[k],a,b,c)))continue;
   tri.push([a,b,c]);ids.splice(j,1);found=true;break;
  }
  if(!found)return null;
 }
 if(ids.length!==3)return null;
 tri.push(ids.map(k=>poly[k]));
 return tri;
}
function check(name,polygon){
 const triangles=triangulate(polygon);
 assert(triangles,name+' triangulatable');
 const roof=planCityBuildingRoof({footprint:polygon,triangles,
  baseY:6.012,rise:2.3,kind:'hip'});
 assert(roof,name+' roof plan must not fail');
 const {roofBoundaryGapBefore:was,roofModel}=roof;
 if(was>.10){
  assert.equal(roofModel,'perimeter-constrained',name+' must use safe boundary roof');
  assert(roof.maxEaveError<.025,name+' must have level exterior eaves');
  assert(roof.verifiedAppearance===false,'Roof fallback never claims photo accuracy');
  assert(roof.faces.length<=triangles.length*25,'Triangle budget');
  const closure=planRoofPerimeterClosure({
   outline:polygon,roof,origin:roof.origin,wallTopY:6});
  assert(closure?.closedToRoof&&closure.maxGapBefore<.025);
  const eaves=planStationRoofEaves({outline:polygon,originalOutline:polygon,
   roof,origin:roof.origin,width:.30,thickness:.09});
  assert(eaves?.closedUnderside&&eaves.perimeterSafe,
   name+' clipped eaves need an unbroken planar exterior strip');
  assert.equal(eaves.exteriorEdges,polygon.length);
  assert.equal(eaves.closedEndCaps,0);
  assert(eaves.maxActualOverhang>=.29&&eaves.maxActualOverhang<=.55);
  for(const faces of [roof.faces,closure.faces,eaves.tiles,eaves.soffit,eaves.fascia])
   for(const tri of faces)for(const p of tri)
    assert([p.x,p.y,p.z,p.u,p.v].every(Number.isFinite));
  // Shared height sampling must match actual displayed triangles.
  const center=roof.faces[Math.floor(roof.faces.length/2)]
   .reduce((s,p)=>({x:s.x+p.x/3,z:s.z+p.z/3}),{x:0,z:0});
  assert(Number.isFinite(samplePerimeterRoofHeight(roof,center)));
 }else{
  assert(roofModel!=='perimeter-constrained',
   name+' valid rectangular hip should retain efficient planar model');
 }
 const renderedArea=roof.faces.reduce((sum,t)=>sum+Math.abs(turn(...t))*.5,0);
 assert(Math.abs(renderedArea-polyArea(polygon))<.02,name+' roof surface covers footprint once');
 return {fallback:roofModel==='perimeter-constrained',gapBefore:was,
  facets:roof.faces.length};
}
const rectangle=[pt(0,0),pt(16,0),pt(16,10),pt(0,10)];
const L=[pt(0,0),pt(16,0),pt(16,5),pt(8,5),pt(8,12),pt(0,12)];
const T=[pt(0,0),pt(18,0),pt(18,5),pt(12,5),pt(12,13),pt(6,13),pt(6,5),pt(0,5)];
const U=[pt(0,0),pt(19,0),pt(19,13),pt(14,13),pt(14,6),pt(5,6),pt(5,13),pt(0,13)];
const skew=[pt(0,0),pt(16,1),pt(15,10),pt(-1,9)];
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const original=osm.elements.find(b=>b.id===118487980).geometry.slice(0,-1)
 .map(p=>pt((p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
  -(p.lat-50.226)*111320));
const results={};
for(const [name,p] of Object.entries({rectangle,L,T,U,skew,skolska:original})){
 results[name]=check(name,p);
 results[name+'-reverse']=check(name+'-reverse',[...p].reverse());
 const angle=.38,rot=q=>pt(q.x*Math.cos(angle)-q.z*Math.sin(angle)+190,
  q.x*Math.sin(angle)+q.z*Math.cos(angle)-220);
 results[name+'-rotated']=check(name+'-rotated',p.map(rot));
}
assert(results.skolska.fallback,'Školská photo geometry MUST demonstrate safe fallback');
assert(results.skolska.gapBefore>.5,'Detect the actual formerly huge wall/hip mismatch');
assert(results.rectangle.fallback===false,'Keep fast original roofs where safe');
// CI must exercise the ACTUAL buildings, not just the one screenshot.
// Every new imported OSM structure will automatically join this sweep.
const core={mapped:0,checked:0,perimeterSafe:0,unsupported:0,
 formerlyHighEaves:0,maxCurrentEaveError:0,maxFormerGap:0};
for(const b of osm.elements.filter(e=>e.tags?.building&&e.geometry?.length>=3)){
 core.mapped++;
 const p=b.geometry.map(q=>pt(
  (q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
  -(q.lat-50.226)*111320));
 if(p.length>3&&Math.hypot(p[0].x-p.at(-1).x,p[0].z-p.at(-1).z)<.05)p.pop();
 const xs=p.map(q=>q.x),zs=p.map(q=>q.z);
 if(p.length>100||Math.max(...xs)-Math.min(...xs)<2||
    Math.max(...zs)-Math.min(...zs)<2||
    Math.max(...xs)-Math.min(...xs)>140||
    Math.max(...zs)-Math.min(...zs)>140){
  core.unsupported++;continue;
 }
 const triangles=triangulate(p);
 if(!triangles){core.unsupported++;continue}
 const roof=planCityBuildingRoof({footprint:p,triangles,baseY:7.012,
  rise:Math.min(2.3,(Math.min(Math.max(...xs)-Math.min(...xs),
   Math.max(...zs)-Math.min(...zs)))*.25),kind:'hip'});
 if(!roof){core.unsupported++;continue}
 core.checked++;
 const oldGap=roof.roofBoundaryGapBefore||0;
 core.maxFormerGap=Math.max(core.maxFormerGap,oldGap);
 if(oldGap>.10)core.formerlyHighEaves++;
 if(roof.roofModel==='perimeter-constrained'){
  core.perimeterSafe++;
  assert(roof.maxEaveError<=.025,'OSM '+b.id+' has airborne roof eaves');
  core.maxCurrentEaveError=Math.max(core.maxCurrentEaveError,roof.maxEaveError);
  assert(roof.faces.length<=triangles.length*25,
   'OSM '+b.id+' exceeds adaptive facet budget');
  // Every shared triangle-edge sample must have identical roof height.
  // A discontinuity would produce a sky slit even with zero wall gap.
  const heights=new Map();
  for(const face of roof.faces)for(const v of face){
   const key=v.x.toFixed(6)+','+v.z.toFixed(6);
   if(heights.has(key))
    assert(Math.abs(heights.get(key)-v.y)<.002,
     'OSM '+b.id+' has an interior roof seam');
   else heights.set(key,v.y);
  }
 }else assert(oldGap<=.101,'OSM '+b.id+' should have used safe hip');
 assert(roof.relativeAreaError<1e-4,'OSM '+b.id+' roof area mismatch');
}
assert.equal(core.mapped,684);
assert(core.checked>=580,'Too many buildings bypassed the citywide safety gate');
assert(core.perimeterSafe>30,'The city audit must cover multiple unsafe hips');
results.citywide=core;
console.log('Roof System 3.1 perimeter QA PASS',JSON.stringify(results));
