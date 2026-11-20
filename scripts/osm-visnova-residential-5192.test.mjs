import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_RESIDENTIAL_5192 as S,planVisnovaResidential5192,
 renderVisnovaResidential5192} from './osm-visnova-residential-5192.js';

const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const a=elements.find(w=>String(w.id)==='53865847');
const b=elements.find(w=>String(w.id)==='53865848');
assert(a&&b,'two actual RUIAN/OSM ways must exist');
assert.equal(S.buildings.length,2);
assert.deepEqual(S.buildings.map(w=>w.originalHash),['750bac6c','ff594686']);
const original=JSON.stringify([a,b]);
const cases=[
 {way:a,levels:11,windows:330,faces:4,facesByIndex:[0,5,9,15],
  edges:23,triangles:4666,ruian:'25442970'},
 {way:b,levels:5,windows:190,faces:2,facesByIndex:[2,4],
  edges:5,triangles:2670,ruian:'25789759'}
];
class BufferGeometry {
 setAttribute(key,value){this[key]=value}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute {
 constructor(array,itemSize){this.array=array;this.itemSize=itemSize}
}
class MeshStandardMaterial {
 constructor(options){this.options=options}
}
class Mesh {
 constructor(geometry,material){
  this.geometry=geometry;this.material=material;
  this.userData={};this.visible=true;
 }
}
const THREE={Mesh,MeshStandardMaterial,BufferGeometry,Float32BufferAttribute,DoubleSide:2};
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
});
let totalWindows=0,totalMeshes=0,totalTriangles=0;
for(const c of cases){
 const args={
  id:c.way.id,regionId:'mlada',tags:c.way.tags,
  geometry:c.way.geometry,
  modelFloors:c.levels,modelHeight:c.levels*3.05
 };
 const plan=planVisnovaResidential5192(args);
 assert(plan,'RUIAN source-locked plan '+c.way.id);
 assert.equal(plan.sourceRUIANId,c.ruian);
 assert.equal(plan.sourceReportedFloors,c.levels);
 assert.equal(plan.facades.length,c.faces);
 assert.deepEqual(plan.facades.map(f=>f.edgeIndex),c.facesByIndex);
 assert.equal(plan.estimatedWindows,c.windows);
 assert.equal(plan.suppressedGenericFacadeEdges,c.edges);
 assert.equal(plan.modelUsesOriginalRUIANFootprint,true);
 assert.equal(plan.exactWindowPositionsVerified,false);
 assert.equal(plan.inventedEntrances,0);
 assert.equal(plan.inventedBalconies,0);
 for(const key of ['newBuildingVolumes','newFootways','newRoads','newColliders'])
  assert.equal(plan[key],0);
 for(const changed of [
  {id:53865846},{regionId:'old'},
  {photoReviewed:true},{approvedArchitecture:true},
  {modelFloors:c.levels+1},{modelHeight:100},
  {tags:{...c.way.tags,'ref:ruian:building':'incorrect'}},
  {tags:{...c.way.tags,'building:levels':'2'}},
  {tags:{...c.way.tags,height:'20'}},
  {geometry:c.way.geometry.slice(0,-1)},
  {geometry:c.way.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.0000001}:p)}
 ])assert.equal(planVisnovaResidential5192({...args,...changed}),null,
  'must not render changed or guessed source building');
 const layer={visible:true,children:[],
  add(obj){obj.parent=this;this.children.push(obj)}
 };
 const result=renderVisnovaResidential5192(THREE,{
  plan,toWorld,baseHeight:100,layer
 });
 assert(result,'must create physical details on 3D source wall');
 assert.equal(result.estimatedWindowsRendered,c.windows);
 assert.equal(result.longFacadesRendered,c.faces);
 assert.equal(result.plinthEdgesRendered,c.edges);
 assert.equal(result.genericFacadeEdgesSuppressed,c.edges);
 assert.equal(result.sourceReportedFloors,c.levels);
 assert.equal(result.totalTriangles,c.triangles);
 assert.equal(result.meshCount,4);
 assert.equal(result.allInScene(),true);
 assert.equal(result.visibleAfterLOD(),4);
 assert.equal(result.estimatedWindowPositions,true);
 assert.equal(result.originalFootprintUnmodified,true);
 assert.equal(result.addedColliders,0);
 assert.equal(result.addedDoors,0);
 assert.equal(layer.children.length,4);
 const triangles=layer.children.reduce((sum,m)=>sum+
  m.geometry.position.array.length/9,0);
 assert.equal(triangles,c.triangles);
 for(const mesh of layer.children){
  assert.equal(mesh.userData.sourceOSMId,String(c.way.id));
  assert.equal(mesh.userData.lodDetail,false);
  assert.equal(mesh.userData.estimatedWindows,true);
  assert.equal(mesh.geometry.position.array.length%9,0);
  assert(mesh.geometry.position.array.every(Number.isFinite));
 }
 const ys=layer.children.flatMap(m=>m.geometry.position.array.filter((_,i)=>i%3===1));
 assert(Math.min(...ys)>=100.01);
 assert(Math.max(...ys)<=100+c.levels*3.05);
 layer.visible=false;
 assert.equal(result.visibleAfterLOD(),0);
 const before=layer.children.length;
 assert.equal(renderVisnovaResidential5192(THREE,{
  plan,toWorld,baseHeight:NaN,layer
 }),null);
 assert.equal(layer.children.length,before);
 totalWindows+=c.windows;totalMeshes+=4;totalTriangles+=c.triangles;
}
assert.deepEqual([totalWindows,totalMeshes,totalTriangles],[520,8,7336]);
assert.equal(JSON.stringify([a,b]),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-visnova-residential-5192.js?v=519200'",
 'const visnovaResidentialPlan5192=planVisnovaResidential5192({',
 'renderVisnovaResidential5192(THREE,{',
 'if(visnovaResidentialRendered5192){',
 'window.__miloviceVisnovaResidentialRuntime5192=()=>',
 'visnovaResidentialRenderCache5192.clear();',
 '!visnovaResidentialRendered5192&&!slepaUtility',
 "'visnova-572-5192':{",
 "'visnova-573-5192':{",
 'href="?v=519300&streetAudit=visnova-572-5192"',
 'href="?v=519300&streetAudit=visnova-573-5192"'
 ])assert(html.includes(term),'missing visible source-locked facade integration '+term);
console.log('PASS 5.192: 11/5 source-mapped Višňová 572/573, 520 model windows, 8 meshes, 7336 triangles; OSM unchanged');
