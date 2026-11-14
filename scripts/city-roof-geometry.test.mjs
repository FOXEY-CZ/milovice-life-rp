import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dominantRoofAxis,planCityBuildingRoof,analyzeGableFootprint} from './city-roof-geometry.js';
import {planDormerRoofSlopes} from './street-photo-block.js';
import {planRoofPerimeterClosure} from './station-roof-seams.js';

const p=(x,z)=>({x,z});
function rectangle(w,d){
 const outline=[p(0,0),p(w,0),p(w,d),p(0,d)];
 return {outline,triangles:[[outline[0],outline[1],outline[2]],
  [outline[0],outline[2],outline[3]]]};
}
const area=(a,b,c)=>Math.abs((b.x-a.x)*(c.z-a.z)-
 (b.z-a.z)*(c.x-a.x))*.5;
function inside(pt,a,b,c){
 return Math.abs(area(pt,a,b)+area(pt,b,c)+area(pt,c,a)-area(a,b,c))<1e-5;
}
function check(input,kind){
 const plan=planCityBuildingRoof({footprint:input.outline,
  triangles:input.triangles,baseY:7.2,rise:2.1,kind});
 assert(plan,kind+' roof should be generated');
 assert(plan.faces.length>=input.triangles.length);
 assert(plan.relativeAreaError<1e-5,'Must conserve footprint area');
 const original=input.triangles.reduce((n,t)=>n+area(...t),0);
 const drawn=plan.faces.reduce((n,t)=>n+area(...t),0);
 assert(Math.abs(original-drawn)<1e-4);
 for(const face of plan.faces)for(const v of face){
  assert(Number.isFinite(v.x)&&Number.isFinite(v.y)&&Number.isFinite(v.z));
  assert(v.y>=7.2-1e-5&&v.y<=9.3+1e-5);
  assert(input.triangles.some(t=>inside(v,...t)),
    'Roof must never extend beyond actual OSM footprint');
 }
 return plan;
}
const rect=rectangle(18,8),norm=dominantRoofAxis(rect.outline);
assert.equal(analyzeGableFootprint(rect.outline).endIndices.length,2);
assert.equal(analyzeGableFootprint(rect.outline).width,8);
assert.equal(analyzeGableFootprint([...rect.outline,rect.outline[0]]).length,18);
assert.equal(analyzeGableFootprint(rect.outline.slice().reverse()).endIndices.length,2);
assert.equal(analyzeGableFootprint([p(0,0),p(14,0),p(16,8),p(2,8)]),null);
assert.equal(analyzeGableFootprint([p(0,0),p(14,0),p(11,8),p(1,8)]),null);
assert.equal(analyzeGableFootprint(rectangle(9,8).outline),null);
assert.equal(analyzeGableFootprint(rectangle(9,8).outline,{allowSquare:true}).endIndices.length,2);
assert.equal(analyzeGableFootprint([p(0,0),p(12,0),p(12,4),p(6,4),p(6,9),p(0,9)]),null);
assert(Math.abs(norm.ax-1)<1e-6&&Math.abs(norm.az)<1e-6);
check(rect,'gable');check(rect,'hip');
const reverse={outline:rect.outline.slice().reverse(),
 triangles:rect.triangles.map(t=>t.slice().reverse())};
const reAxis=dominantRoofAxis(reverse.outline);
assert(Math.abs(reAxis.ax-1)<1e-6);
check(reverse,'gable');check(reverse,'hip');
const angle=Math.PI*.38,rot=p=>({
 x:p.x*Math.cos(angle)-p.z*Math.sin(angle)+130,
 z:p.x*Math.sin(angle)+p.z*Math.cos(angle)-47});
const diagonal={outline:rect.outline.map(rot),triangles:rect.triangles.map(t=>t.map(rot))};
const diaAxis=dominantRoofAxis(diagonal.outline);
assert(Math.abs(diaAxis.ax-Math.cos(angle))<.001);
assert.equal(analyzeGableFootprint(diagonal.outline).endIndices.length,2);
assert(Math.abs(Math.abs(diaAxis.az)-Math.sin(angle))<.001);
check(diagonal,'gable');check(diagonal,'hip');
const concave={
 outline:[p(0,0),p(13,0),p(13,3),p(5,3),p(5,9),p(0,9)],
 triangles:[
  [p(0,0),p(13,0),p(13,3)],
  [p(0,0),p(13,3),p(0,3)],
  [p(0,3),p(5,3),p(5,9)],
  [p(0,3),p(5,9),p(0,9)]
 ]};
for(const kind of ['gable','hip']){
 const plan=check(concave,kind);
 for(const face of plan.faces)for(const v of face)
  assert(!(v.x>5.01&&v.z>3.01),'No imaginary roof across L-shape notch');
}
for(const width of [2.12,2.35,2.65]){
 const slopes=planDormerRoofSlopes(width,.94);
 assert.equal(slopes.length,2);
 const [left,right]=slopes;
 assert(left.rotationZ>0&&right.rotationZ<0,
  'Dormer slopes must rise TOWARD common ridge, never fly outward');
 const yAt=(s,x)=>s.y+(x-s.x)*Math.tan(s.rotationZ);
 assert(Math.abs(yAt(left,0)-left.ridgeY)<1e-7);
 assert(Math.abs(yAt(right,0)-right.ridgeY)<1e-7);
 assert(Math.abs(yAt(left,-width/2)-left.eaveY)<1e-7);
 assert(Math.abs(yAt(right,width/2)-right.eaveY)<1e-7);
}
// Shared perimeter infill uses the ORIGINAL footprint and affine roof planes.
// Regression: it cannot span the hole in an L or float past a reversed edge.
for(const input of [rect,reverse,diagonal,concave]){
 for(const kind of ['gable','hip']){
  const roof=check(input,kind);
  const closure=planRoofPerimeterClosure({
   outline:input.outline,roof,origin:roof.origin,wallTopY:7.188
  });
  assert(closure?.closedToRoof);
  assert(closure.maxGapBefore>=.012-1e-5);
  assert(closure.faces.length<Math.max(50,input.outline.length*20),
   'Prevent dozens of individual draw triangles on normal houses');
  for(const face of closure.faces)for(const v of face){
   assert([v.x,v.y,v.z,v.u,v.v].every(Number.isFinite));
   assert(v.y>=7.188-1e-5&&v.y<=9.3+1e-5);
   assert(input.outline.some((a,i)=>{
    const b=input.outline[(i+1)%input.outline.length];
    const cross=Math.abs((b.x-a.x)*(v.z-a.z)-(b.z-a.z)*(v.x-a.x));
    const dot=(v.x-a.x)*(v.x-b.x)+(v.z-a.z)*(v.z-b.z);
    return cross<.0001&&dot<.0001;
   }),'Infill must touch a real OSM facade edge');
  }
 }
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("import {planCityBuildingRoof,analyzeGableFootprint} from './scripts/city-roof-geometry.js"));
assert(html.includes('return miloviceRoofOfKind(pts,base,h,material,rise,\'hip\')'));
assert(html.includes('const data=planCityBuildingRoof({footprint:pts,triangles,'));
assert(html.includes('baseY:base+h+.012,rise,kind}'));
assert(html.includes("const fallbackFromGable=roofPreference==='gable'&&!pitched;"));
assert(!html.includes('vertices.push(a.x,base+h+.07,a.y,b.x,base+h+.07,b.y,cx,base+h+rise,cz)'));
const blocks=readFileSync(new URL('./street-photo-block.js',import.meta.url),'utf8');
assert(!blocks.includes('sign*w*.25,1.90,0,0,0,sign*.63'));
// v5.31.1: no double roofs (the biggest source of dark/inverted roof faces).
assert(html.includes('const pitchedSurface=pitched||hip;'));
assert(html.includes('else if(!pitchedSurface){'));
assert(html.includes('delete pitchedSurface.userData.roofRuntimePlan;'));
assert(html.includes('queueCityWall(geo,wallSeam,centerX,0,centerZ)'));
assert(html.includes('roofPlan&&!isSkolskaRoof&&(!(heroFacade&&pitched)||isForkPhotoGable)'),
 'Do not double-cap generic hero gables; source-backed irregular fork gable needs physical end-wall infill');
assert(html.includes("miloviceRoofOfKind(pts,baseHeight,h,roofMat,2.20,'gable')"),
 'Only independently photographed nonrectangular gables may bypass the generic rectangle-only gate');
assert(!html.includes('if(pitched||hip)osmLayer.add(pitched||hip);'),
 'The old branch overlaid a flat roof on every pitched house');
console.log('City roof regression: rectangle, reverse, rotated, concave, dormer slopes PASS');
