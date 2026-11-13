import assert from 'node:assert/strict';
import {planFootprintPitchedRoof} from './station-roof-geometry.js';
import {planRoofPerimeterClosure} from './station-roof-seams.js';
const v=(x,z)=>({x,z});
const rect=(x0,z0,x1,z1)=>[
 [v(x0,z0),v(x1,z0),v(x1,z1)],
 [v(x0,z0),v(x1,z1),v(x0,z1)]
];
const outline=[v(0,0),v(16,0),v(16,4),v(12,4),v(12,9),v(0,9)];
const triangles=[...rect(0,0,16,4),...rect(0,4,12,9)];
const origin=v(0,0),axis={ax:1,az:0};
const eps=1e-5;
function onPerimeter(p){
 return outline.some((a,i)=>{
  const b=outline[(i+1)%outline.length];
  const cross=(b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x);
  const dot=(p.x-a.x)*(p.x-b.x)+(p.z-a.z)*(p.z-b.z);
  return Math.abs(cross)<eps&&dot<eps;
 });
}
for(const kind of ['hip','gable']){
 const roof=planFootprintPitchedRoof({
  triangles,origin,axis,kind,eaveY:3.70,rise:2.2
 });
 assert(roof&&roof.relativeAreaError<eps);
 const closure=planRoofPerimeterClosure({
  outline,roof,origin,wallTopY:3.70
 });
 assert(closure?.closedToRoof);
 assert(closure.maxGapBefore>1.0,'Missing irregular edge high above wall: '+JSON.stringify({kind,maxGapBefore:closure.maxGapBefore,edgeSections:closure.edgeSections,faces:closure.faces.length,bounds:roof.bounds,axis:roof.globalAxis,eaveY:roof.eaveY,rise:roof.rise}));
 assert(closure.edgeSections>1&&closure.faces.length>1);
 assert(closure.faces.length<100,'Keep station meshes lightweight');
 for(const face of closure.faces)for(const p of face){
  assert([p.x,p.y,p.z,p.u,p.v].every(Number.isFinite));
  assert(p.y>=3.70-eps&&p.y<=5.90+eps);
  assert(onPerimeter(p),'Closure must not extend beyond surveyed OSM outline');
 }
 const back=planRoofPerimeterClosure({
  outline:outline.slice().reverse(),roof,origin,wallTopY:3.70
 });
 assert(back.closedToRoof);
 assert.equal(back.edgeSections,closure.edgeSections);
 assert(Math.abs(back.maxGapBefore-closure.maxGapBefore)<eps);
}
assert.equal(planRoofPerimeterClosure({outline:[],roof:{},origin,wallTopY:3}),null);
const game=await import('node:fs').then(m=>m.readFileSync(new URL('../index.html',import.meta.url),'utf8'));
assert(game.includes("import {planRoofPerimeterClosure} from './scripts/station-roof-seams.js"));
assert(game.includes('const closure=planRoofPerimeterClosure({'));
assert(game.includes("Milovice_station_exact_roof_perimeter_infill"));
console.log('5.28.6 station roof seams: irregular hip/gable, reversed outline, finite closed mesh PASS');
