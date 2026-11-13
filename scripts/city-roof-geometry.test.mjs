import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dominantRoofAxis,planCityBuildingRoof} from './city-roof-geometry.js';
import {planDormerRoofSlopes} from './street-photo-block.js';

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
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("import {planCityBuildingRoof} from './scripts/city-roof-geometry.js"));
assert(html.includes('return miloviceRoofOfKind(pts,base,h,material,rise,\'hip\')'));
assert(html.includes('const data=planCityBuildingRoof({footprint:pts,triangles,'));
assert(!html.includes('vertices.push(a.x,base+h+.07,a.y,b.x,base+h+.07,b.y,cx,base+h+rise,cz)'));
const blocks=readFileSync(new URL('./street-photo-block.js',import.meta.url),'utf8');
assert(!blocks.includes('sign*w*.25,1.90,0,0,0,sign*.63'));
console.log('City roof regression: rectangle, reverse, rotated, concave, dormer slopes PASS');
