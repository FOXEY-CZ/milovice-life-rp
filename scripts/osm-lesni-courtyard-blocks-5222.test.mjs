// Milovice RP 5.222: two ORIGINAL Lesní RÚIAN blocks, existing
// shells/roofs/colliders retained; windows are clearly not photo verified.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 LESNI_COURTYARD_BLOCKS_5222 as C,
 planLesniCourtyardBlock5222 as plan
} from './osm-lesni-courtyard-blocks-5222.js';
import {renderVisnovaResidential5192 as render}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const buildings=C.buildings.map(c=>elements.filter(x=>String(x.id)===c.id));
assert(buildings.every(items=>items.length===1),'unique original OSM/RÚIAN IDs');
const original=JSON.stringify(buildings);
class BufferGeometry{
 setAttribute(key,attr){this[key]=attr;}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size;}}
class MeshStandardMaterial{constructor(options){this.options=options;}}
class Mesh{
 constructor(geometry,material){
  this.geometry=geometry;this.material=material;
  this.userData={};this.visible=true;this.parent=null;
 }
}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,
 Mesh,DoubleSide:2};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
let allWindows=0,allTriangles=0,allMeshes=0,allEdges=0;
for(let i=0;i<buildings.length;i++){
 const w=buildings[i][0],spec=C.buildings[i];
 const options={id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,
  modelFloors:spec.levels,modelHeight:spec.levels*3.05};
 const p=plan(options);
 assert(p,'source-locked original residential footprint '+spec.id);
 assert.equal(p.version,'5.192');
 assert.equal(p.facadeCompletionVersion,'5.222');
 assert.equal(p.sourceOSMId,spec.id);
 assert.equal(p.sourceRUIANId,spec.ruian);
 assert.equal(p.sourceHash,spec.hash);
 assert.equal(p.sourceNodes,spec.nodes);
 assert.equal(p.sourceReportedFloors,spec.levels);
 assert.equal(p.sourceReportedFlats,spec.flats);
 assert(Math.abs(p.originalAreaSquareMetres-spec.area)<.8);
 assert.deepEqual(p.facades.map(f=>[f.edgeIndex,f.bays]),spec.modelFacades);
 const estimated=spec.id==='53866101'?38:68;
 const triangles=estimated*14+2*(spec.nodes-1);
 assert.equal(p.estimatedWindows,estimated);
 assert.equal(p.suppressedGenericFacadeEdges,spec.nodes-1);
 assert.deepEqual(p.sourceGeometry,w.geometry);
 for(const key of ['exactWindowPositionsVerified','windowCountsPhotoVerified',
  'facadeColorsPhotoVerified','facadeShapesPhotoVerified'])
  assert.equal(p[key],false,key);
 for(const key of ['inventedEntrances','inventedBalconies',
  'newBuildingVolumes','newRoads','newFootways','newColliders',
  'changedRoofForm','changedFloorCounts','changedOriginalOSMWays'])
  assert.equal(p[key],0,key);
 for(const [why,change] of [
  ['wrong region',{regionId:'other'}],
  ['wrong id',{id:9001}],
  ['wrong floors',{modelFloors:spec.levels+1}],
  ['wrong height',{modelHeight:99}],
  ['approved photo',{photoReviewed:true}],
  ['approved architecture',{approvedArchitecture:true}],
  ['different RÚIAN',{tags:{...w.tags,'ref:ruian:building':'fake'}}],
  ['different flat count',{tags:{...w.tags,'building:flats':'99'}}],
  ['different level tag',{tags:{...w.tags,'building:levels':'9'}}],
  ['different date',{tags:{...w.tags,start_date:'2010-01-01'}}],
  ['extra tag',{tags:{...w.tags,roof:'flat'}}],
  ['moved vertex',{geometry:w.geometry.map((p,j)=>
   j===2?{...p,lon:p.lon+.0000001}:p)}],
  ['unclosed outline',{geometry:w.geometry.slice(0,-1)}],
  ['reversed map vertices',{geometry:[...w.geometry].reverse()}]
 ]){
  assert.equal(plan({...options,...change}),null,
   'fail closed on source change '+why+' '+spec.id);
 }
 const layer={children:[],visible:true,add(m){m.parent=this;this.children.push(m);}};
 const r=render(THREE,{plan:p,toWorld,baseHeight:112,layer});
 assert(r,'existing proven 5.192 renderer must accept polygon '+spec.id);
 assert.equal(r.sourceOSMId,spec.id);
 assert.equal(r.sourceRUIANId,spec.ruian);
 assert.equal(r.sourceReportedFloors,spec.levels);
 assert.equal(r.longFacadesRendered,5);
 assert.equal(r.estimatedWindowsRendered,estimated);
 assert.equal(r.plinthEdgesRendered,spec.nodes-1);
 assert.equal(r.meshCount,4);
 assert.equal(r.totalTriangles,triangles);
 assert.equal(r.allInScene(),true);
 assert.equal(r.visibleAfterLOD(),4);
 assert.equal(r.addedColliders,0);
 assert.equal(r.addedDoors,0);
 assert(layer.children.every(m=>
  m.userData.estimatedWindows===true&&m.userData.lodDetail===false&&
  m.geometry.position.array.every(Number.isFinite)));
 allWindows+=r.estimatedWindowsRendered;
 allTriangles+=r.totalTriangles;
 allMeshes+=r.meshCount;
 allEdges+=r.longFacadesRendered;
}
assert.equal(allWindows,106);
assert.equal(allTriangles,1564);
assert.equal(allMeshes,8);
assert.equal(allEdges,10);
assert.equal(JSON.stringify(buildings),original,'OSM data not modified');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-lesni-courtyard-blocks-5222.js?v=522200'",
 'const lesniCourtyardRenderCache5222=new Map();',
 'planLesniCourtyardBlock5222({',
 'lesniCourtyardRenderCache5222.set(String(osmId)',
 'lesniCourtyardRenderCache5222.clear();',
 'window.__miloviceLesniCourtyardRuntime5222=()=>',
 "'lesni-courtyard-north-5222':{",
 "'lesni-courtyard-south-5222':{",
 'href="?v=522200&streetAudit=lesni-courtyard-north-5222"',
 'href="?v=522200&streetAudit=lesni-courtyard-south-5222"'
])assert(html.includes(token),'missing game integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'all current build strings match');
console.log('PASS 5.222 two ORIGINAL RÚIAN Lesní courtyard blocks;',
 allWindows,'explicitly estimated model windows across',allEdges,
 'original faces,',allMeshes,'meshes and',allTriangles,
 'triangles; no added paths, geometry, roofs or colliders');
