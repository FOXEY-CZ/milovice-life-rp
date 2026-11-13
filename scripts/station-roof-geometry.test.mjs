import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planFootprintPitchedRoof} from './station-roof-geometry.js';

const eps=1e-5;
const v=(x,z)=>({x,z});
const rect=(xmin,zmin,xmax,zmax)=>[
 [v(xmin,zmin),v(xmax,zmin),v(xmax,zmax)],
 [v(xmin,zmin),v(xmax,zmax),v(xmin,zmax)]
];
const area=(a,b,c)=>Math.abs((b.x-a.x)*(c.z-a.z)-
 (b.z-a.z)*(c.x-a.x))*.5;
const within=(p,a,b,c)=>{
 const total=area(a,b,c);
 return Math.abs(area(p,a,b)+area(p,b,c)+area(p,c,a)-total)<1e-5;
};
const assertGeometry=(input,plan,range)=>{
 assert(plan,'Roof plan must exist');
 assert(plan.triangles>input.length,'Ridge/hip must be split at its true creases');
 assert(plan.relativeAreaError<eps,
  'No area may overlap or be lost between station roof planes');
 assert.equal(plan.maxPerimeterOvershoot,0);
 assert.equal(plan.faces.length,plan.triangles);
 const sourceArea=input.reduce((sum,t)=>sum+area(...t),0);
 const outputArea=plan.faces.reduce((sum,t)=>sum+area(...t),0);
 assert(Math.abs(sourceArea-outputArea)<eps*Math.max(1,sourceArea));
 for(const f of plan.faces)for(const p of f){
  assert([p.x,p.y,p.z,p.u,p.v].every(Number.isFinite));
  assert(p.y>=range[0]-eps&&p.y<=range[1]+eps);
  assert(input.some(t=>within(p,...t)),
   'Never extend eaves or beige end-caps outside OSM source polygon');
 }
};
const rectangle=rect(-8,-4,8,4);
const frame={origin:{x:0,z:0},axis:{ax:1,az:0}};
const wing=planFootprintPitchedRoof({triangles:rectangle,...frame,kind:'gable',
 eaveY:3.70,rise:1.45});
assertGeometry(rectangle,wing,[3.70,5.15]);
assert.equal(wing.sections>1,true);
assert.equal(wing.globalAxis.ax,1);
const tower=planFootprintPitchedRoof({triangles:rectangle,...frame,kind:'hip',
 eaveY:6.73,rise:2.25});
assertGeometry(rectangle,tower,[6.73,8.98]);
assert(tower.triangles>wing.triangles,'Four roof planes require more facets');
assert.equal(tower.kind,'hip');

// Real Milovice station has an irregular polygon with notches. A rectangular
// bounding roof is wrong even when its long axis is correct. Test an L-shape
// made of triangles: there must be NO roof in the missing upper-right sector.
const lShape=[
 ...rect(0,0,10,3),
 ...rect(0,3,4,8)
];
const rotatedAxis={ax:0.3961688794,az:-0.9181776620};
const transform=(p)=>({
 x:-499.44+p.x*rotatedAxis.ax-p.z*rotatedAxis.az,
 z:-345.41+p.x*rotatedAxis.az+p.z*rotatedAxis.ax
});
const translated=lShape.map(t=>t.map(transform));
for(const kind of ['gable','hip']){
 const p=planFootprintPitchedRoof({
  triangles:translated,origin:{x:-499.44,z:-345.41},
  axis:rotatedAxis,kind,eaveY:185.4,rise:kind==='hip'?2.25:1.45
 });
 assertGeometry(translated,p,[185.4,187.65]);
 assert(Math.abs(p.globalAxis.ax-rotatedAxis.ax)<eps);
 assert(Math.abs(p.globalAxis.az-rotatedAxis.az)<eps);
 const inversed=point=>({
  s:(point.x+499.44)*rotatedAxis.ax+(point.z+345.41)*rotatedAxis.az,
  t:-(point.x+499.44)*rotatedAxis.az+(point.z+345.41)*rotatedAxis.ax
 });
 for(const f of p.faces)for(const q of f){
  const c=inversed(q);
  assert(!(c.s>4.01&&c.t>3.01),
   'Roof cannot span the absent quadrant of an OSM concave footprint');
 }
}
assert.equal(planFootprintPitchedRoof({triangles:rectangle,...frame,
 kind:'mystery',eaveY:3,rise:1}),null);
assert.equal(planFootprintPitchedRoof({triangles:rectangle,...frame,
 kind:'hip',eaveY:3,rise:0}),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("planFootprintPitchedRoof({"));
assert(game.includes("kind:roofKind,eaveY:base+toHeight+.08,rise:roofRise"));
assert(game.includes("mode:'footprint-constrained',axisShared:true"));
assert(!game.includes('function stationGabledRoof('));
assert(!game.includes('function stationHippedTowerRoof('));
assert(!game.includes("new THREE.Mesh(gg,stationWalls)"));
assert(!game.includes('const half=.33,rt=(minT+maxT)*.5'));
console.log('Station pitched/hip geometry verified:',
 JSON.stringify({wingFaces:wing.triangles,hipFaces:tower.triangles,
  concaveFootprint:lShape.length}));
