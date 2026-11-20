import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaResidential5192,renderVisnovaResidential5192}
 from './osm-visnova-residential-5192.js';
import {VISNOVA_END_FACADES_5193 as SOURCE,
 completeVisnovaEndFacades5193} from './osm-visnova-end-facades-5193.js';

const file=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(file).elements;
const specifications=[
 {id:53865847,ruian:'25442970',floors:11,before:330,
  windows:418,added:88,faces:[0,5,9,12,15,20],
  ends:[12,20],triangles:5898,edges:23},
 {id:53865848,ruian:'25789759',floors:5,before:190,
  windows:240,added:50,faces:[0,2,3,4],
  ends:[0,3],triangles:3370,edges:5}
];
assert.equal(SOURCE.targets.length,2);
const Three={
 DoubleSide:2,
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{
  constructor(array,size){this.array=array;this.itemSize=size}
 },
 MeshStandardMaterial:class{
  constructor(options){this.options=options}
 },
 Mesh:class{
  constructor(geometry,material){
   this.geometry=geometry;this.material=material;
   this.visible=true;this.userData={};
  }
 }
};
const toWorld=g=>({
 x:(g.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(g.lat-50.226)*111320
});
let windowCount=0,addedCount=0,faceCount=0,triangleCount=0,meshCount=0;
for(const expected of specifications){
 const way=es.find(w=>w.id===expected.id);
 assert(way,expected.id+' source must be in the original file');
 const base=planVisnovaResidential5192({
  id:way.id,tags:way.tags,geometry:way.geometry,regionId:'mlada',
  modelFloors:expected.floors,modelHeight:expected.floors*3.05
 });
 assert(base);
 assert.equal(base.estimatedWindows,expected.before);
 const full=completeVisnovaEndFacades5193({basePlan:base});
 assert(full,'full source-locked block envelope must be planned');
 assert.equal(full.version,'5.192','original renderer compatibility');
 assert.equal(full.facadeCompletionVersion,'5.193');
 assert.equal(full.sourceRUIANId,expected.ruian);
 assert.deepEqual(full.endFaceEdges,expected.ends);
 assert.deepEqual(full.facades.map(f=>f.edgeIndex),expected.faces);
 assert.equal(full.endFacesAdded,2);
 assert.equal(full.expectedLongFacadeCount,expected.faces.length);
 assert.equal(full.originalModelWindowsBeforeCompletion,expected.before);
 assert.equal(full.endFaceModelWindowsAdded,expected.added);
 assert.equal(full.estimatedWindows,expected.windows);
 assert.equal(full.fullBlockLongExteriorsNowModeled,true);
 assert.equal(full.originalSourceGeometryUntouched,true);
 assert.equal(full.photoVerifiedWindows,false);
 assert.equal(full.inventedEntrances,0);
 assert.equal(full.inventedBalconies,0);
 for(const key of ['newBuildingVolumes','newFootways','newRoads','newColliders'])
  assert.equal(full[key],0);
 for(const edit of [
  {version:'5.181'},{sourceHash:'incorrect'},
  {sourceReportedFloors:9},{estimatedWindows:4},
  {sourceWallGeometryUntouched:false},
  {facades:base.facades.slice(1)},
  {sourceGeometry:base.sourceGeometry.map((p,i)=>
   i===1?{...p,lon:p.lon+.0000001}:p)}
 ])assert.equal(completeVisnovaEndFacades5193({
  basePlan:{...base,...edit}
 }),null,'modified OSM polygon or old model must refuse custom decoration');
 const layer={visible:true,children:[],add(mesh){
  mesh.parent=this;this.children.push(mesh);
 }};
 const result=renderVisnovaResidential5192(Three,{
  plan:full,toWorld,baseHeight:100,layer
 });
 assert(result);
 assert.equal(result.estimatedWindowsRendered,expected.windows);
 assert.equal(result.longFacadesRendered,expected.faces.length);
 assert.equal(result.plinthEdgesRendered,expected.edges);
 assert.equal(result.genericFacadeEdgesSuppressed,expected.edges);
 assert.equal(result.totalTriangles,expected.triangles);
 assert.equal(result.meshCount,4);
 // 5.194: check actual rendered coordinates, not just the declared offsets.
 // The OSM CCW edge outward normal is (dz/length, -dx/length).
 const world=full.sourceGeometry.map(toWorld);
 const firstEdge=full.facades[0].edgeIndex;
 const wa=world[firstEdge],wb=world[firstEdge+1];
 const dx=wb.x-wa.x,dz=wb.y-wa.y,edgeLength=Math.hypot(dx,dz);
 const normalX=dz/edgeLength,normalZ=-dx/edgeLength;
 const depth=mesh=>{
  const p=mesh.geometry.position.array;
  return (p[0]-wa.x)*normalX+(p[2]-wa.y)*normalZ;
 };
 const frameDepth=depth(layer.children[0]);
 const glassDepth=depth(layer.children[1]);
 assert(Math.abs(frameDepth-.068)<.0001,'frames retain outward offset');
 assert(Math.abs(glassDepth-.044)<.0001,'glass is recessed behind frames');
 assert(glassDepth<frameDepth,'glass must not float ahead of the frames');
 assert.equal(result.allInScene(),true);
 assert.equal(result.visibleAfterLOD(),4);
 for(const mesh of layer.children){
  assert.equal(mesh.userData.sourceOSMId,String(expected.id));
  assert.equal(mesh.userData.lodDetail,false);
  assert.equal(mesh.userData.estimatedWindows,true);
 }
 layer.visible=false;
 assert.equal(result.visibleAfterLOD(),0);
 windowCount+=result.estimatedWindowsRendered;
 addedCount+=full.endFaceModelWindowsAdded;
 faceCount+=full.endFacesAdded;
 triangleCount+=result.totalTriangles;
 meshCount+=result.meshCount;
}
assert.deepEqual([windowCount,addedCount,faceCount,triangleCount,meshCount],
 [658,138,4,9268,8]);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),file);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const integration of [
 "from './scripts/osm-visnova-end-facades-5193.js?v=519300'",
 'const visnovaCompletePlan5193=visnovaResidentialPlan5192?',
 'completeVisnovaEndFacades5193({basePlan:visnovaResidentialPlan5192})',
 'plan:visnovaCompletePlan5193,',
 'window.__miloviceVisnovaFullEnvelopeRuntime5193=()=>',
 'const BUILD_ID=',
 'href="?v=519300&streetAudit=visnova-572-5192"',
 'href="?v=519300&streetAudit=visnova-573-5192"'
])assert(html.includes(integration),'missing real game integration: '+integration);
console.log('PASS 5.193/5.194: 4 additional source wall ends, 138 modeled windows, total 658 windows in 8 batches, 9268 triangles, OSM untouched');
