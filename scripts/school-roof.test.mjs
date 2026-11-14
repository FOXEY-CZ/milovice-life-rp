import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planCityBuildingRoof} from './city-roof-geometry.js';
import {planSchoolPhotographedRoof,schoolPhotoCameraWorld,SCHOOL_PHOTO_WAY_ID} from './school-street-pass.js';
import {planPerimeterConstrainedRoof} from './perimeter-roof-envelope.js';
import {auditRoofStreetVisibility} from './roof-street-visibility.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const school=osm.elements.find(el=>el.id===SCHOOL_PHOTO_WAY_ID);
assert(school&&school.tags['building:levels']==='3');
const mx=111320*Math.cos(50.226*Math.PI/180);
const outline=school.geometry.map(p=>({x:(p.lon-14.889)*mx,z:-(p.lat-50.226)*111320}));
if(Math.hypot(outline[0].x-outline.at(-1).x,outline[0].z-outline.at(-1).z)<.05)outline.pop();
assert.equal(outline.length,22,'Do not flatten the real 22-wall school footprint');
const signed=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
function triangulate(input){
 const ids=input.map((_,i)=>i);
 const sum=input.reduce((n,p,i)=>{const q=input[(i+1)%input.length];return n+p.x*q.z-p.z*q.x},0);
 const sign=Math.sign(sum);
 if(!sign)throw Error('Degenerate OSM polygon');
 const faces=[];
 function inside(p,a,b,c){
  const c1=signed(a,b,p)*sign,c2=signed(b,c,p)*sign,c3=signed(c,a,p)*sign;
  return c1>=-1e-8&&c2>=-1e-8&&c3>=-1e-8;
 }
 let safety=0;
 while(ids.length>3&&safety++<input.length**2){
  let removed=false;
  for(let i=0;i<ids.length;i++){
   const a=ids[(i-1+ids.length)%ids.length],
    b=ids[i],c=ids[(i+1)%ids.length];
   if(signed(input[a],input[b],input[c])*sign<1e-7)continue;
   if(ids.some(j=>j!==a&&j!==b&&j!==c&&inside(input[j],input[a],input[b],input[c])))continue;
   faces.push([input[a],input[b],input[c]]);
   ids.splice(i,1);removed=true;break;
  }
  if(!removed)throw Error('22-edge school polygon could not be safely triangulated');
 }
 if(ids.length!==3)throw Error('Incoherent ear clip');
 faces.push(ids.map(i=>input[i]));
 return faces;
}
const projected=t=>Math.abs(signed(...t))/2;
const polyArea=Math.abs(outline.reduce((sum,p,i)=>{
 const q=outline[(i+1)%outline.length];return sum+p.x*q.z-p.z*q.x;
},0))/2;
const photo=planSchoolPhotographedRoof(outline);
assert(photo&&photo.rise>=2.5&&photo.kind==='hip');
assert(photo.photographicPitch&&!photo.preciseRoofRidgeSurveyed);
assert(photo.reference.includes('zsmilovice.cz'));
const validate=(shape,tag)=>{
 const ts=triangulate(shape),area=ts.reduce((n,t)=>n+projected(t),0);
 assert(Math.abs(area-polyArea)<.001,tag+' changed OSM footprint area');
 const model=planCityBuildingRoof({
  footprint:shape,triangles:ts,baseY:11.3,rise:photo.rise,kind:'hip'
 });
 assert(model,tag+' must not revert to a FLAT cap');
 assert(model.faces.length>=ts.length);
 assert(model.relativeAreaError<1e-4);
 if(model.roofModel==='perimeter-constrained')
  assert(!model.slopeClamped&&model.actualRise>=photo.rise*.98,
   tag+' does not actually reach the requested photo-backed roof height');
 assert(!model.faces.some(f=>f.some(v=>!Number.isFinite(v.y))));
 const ys=model.faces.flatMap(f=>f.map(v=>v.y));
 assert(Math.max(...ys)-Math.min(...ys)>.4,'School roof must have an actual visibly inclined surface');
 assert(model.roofModel==='perimeter-constrained'||
  (model.roofBoundaryGapBefore||0)<=.10,'Complex roof must have safe joined eaves');
 for(const tri of model.faces)for(const vertex of tri){
  assert(vertex.y>=11.2999&&vertex.y<=11.3+photo.rise+.0001);
 }
 return model;
};
const primary=validate(outline,'normal');
const reversed=validate(outline.slice().reverse(),'reverse winding');
assert.equal(reversed.faces.length,primary.faces.length);
const photoCamera=schoolPhotoCameraWorld();
const visible=auditRoofStreetVisibility({roof:primary,outline,
 camera:{...photoCamera,y:1.7},minVisible:.06});
assert(visible?.pass&&visible.visibleFraction>.06,
 'Photographed school roof hidden behind own wall: '+JSON.stringify(visible));
const fallback=planPerimeterConstrainedRoof({
 footprint:outline,triangles:triangulate(outline),
 baseY:11.3,rise:photo.rise,kind:'hip'
});
assert(fallback&&fallback.maxEaveError<.025,
 '22-edged school needs source-independent bounded OSM perimeter safety');
assert.equal(fallback.roofModel,'perimeter-constrained');
assert.equal(planSchoolPhotographedRoof([{x:0,z:0}]),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('const schoolRoofPhoto=isSchool?planSchoolPhotographedRoof(pts):null;'));
assert(html.includes('isSchool?schoolRoofPhoto.rise:'));
assert(html.includes('const schoolRoofMetal=new THREE.MeshStandardMaterial'));
assert(html.includes('window.__miloviceSchoolRoofAudit='));
assert(html.includes("version:'5.49'"));
assert(html.includes('pitchedRendered:Boolean(pitchedSurface&&surface&&span>.4)'));
const roofSource=readFileSync(new URL('./city-roof-geometry.js',import.meta.url),'utf8');
assert(roofSource.includes("return safeHip('invalid-affine-plan')"));
assert(roofSource.includes("return safeHip('eave-does-not-follow-OSM-wall',gap)"));
console.log('5.46 school photo-backed pitched roof:',JSON.stringify({
 osmId:SCHOOL_PHOTO_WAY_ID,vertices:outline.length,
 area:+polyArea.toFixed(2),triangles:primary.faces.length,
 model:primary.roofModel||'affine',rise:photo.rise,
 maxEaveGap:primary.maxEaveError||primary.roofBoundaryGapBefore
}));
