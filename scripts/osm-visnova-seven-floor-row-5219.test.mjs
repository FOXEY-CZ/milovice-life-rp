// Milovice RP 5.219: three original RÚIAN 7-storey residential
// OSM footprints, 48 apartments each; model glazing NOT photo-surveyed.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 VISNOVA_SEVEN_FLOOR_ROW_5219 as C,
 planVisnovaSevenFloorRow5219 as plan
} from './osm-visnova-seven-floor-row-5219.js';
import {renderVisnovaResidential5192 as render}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ways=C.buildings.map(c=>elements.find(x=>String(x.id)===c.id));
assert(ways.every(Boolean),'all 3 original 7-floor residential RÚIAN buildings must exist');
const original=JSON.stringify(ways);
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
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
});
let totalWindows=0,totalTriangles=0,totalMeshes=0;
for(let i=0;i<ways.length;i++){
 const w=ways[i],spec=C.buildings[i],options={
  id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,
  modelFloors:7,modelHeight:21.35
 };
 const p=plan(options);
 assert(p,'locked original OSM/RÚIAN outline '+w.id);
 assert.equal(p.version,'5.192','reuse tested four-mesh renderer');
 assert.equal(p.facadeCompletionVersion,'5.219');
 assert.equal(p.sourceOSMId,spec.id);
 assert.equal(p.sourceRUIANId,spec.ruian);
 assert.equal(p.sourceHash,spec.hash);
 assert.equal(p.sourceReportedFloors,7);
 assert.equal(p.modelHeightMeters,21.35);
 assert.equal(p.estimatedWindows,168);
 assert.deepEqual(p.facades.map(f=>f.edgeIndex),[0,1,2,3]);
 assert.deepEqual(p.facades.map(f=>f.bays),[3,9,3,9]);
 assert.equal(p.facades.length,4);
 assert.equal(p.suppressedGenericFacadeEdges,4);
 assert.equal(p.exactWindowPositionsVerified,false);
 assert.equal(p.windowCountsPhotoVerified,false);
 assert.equal(p.facadeShapesPhotoVerified,false);
 assert.equal(p.facadeColorsPhotoVerified,false);
 assert.equal(p.sourceOSMGeometryUntouched,true);
 assert(p.footprintSquareMetres>406&&p.footprintSquareMetres<423);
 assert.deepEqual(p.sourceGeometry,w.geometry);
 for(const key of ['balconiesModelled','entrancesModelled',
  'newBuildingVolumes','newRoads','newFootways','newColliders',
  'changedRoofForm','changedFloorCounts','changedOriginalOSMWays'])
  assert.equal(p[key],0,key);
 for(const [why,changes] of [
  ['wrong region',{regionId:'old'}],['changed id',{id:53865705}],
  ['not original floor count',{modelFloors:8}],['wrong height',{modelHeight:24.4}],
  ['approved card',{approvedArchitecture:true}],
  ['photo reviewed',{photoReviewed:true}],
  ['different RÚIAN',{tags:{...w.tags,'ref:ruian:building':'fake'}}],
  ['different levels',{tags:{...w.tags,'building:levels':'6'}}],
  ['changed flats',{tags:{...w.tags,'building:flats':'49'}}],
  ['new height',{tags:{...w.tags,height:'25'}}],
  ['different footprint',{geometry:w.geometry.map((v,j)=>
   j===2?{...v,lat:v.lat+.0000001}:v)}],
  ['unclosed footprint',{geometry:w.geometry.slice(0,-1)}]
 ]){
  assert.equal(plan({...options,...changes}),null,
   'source drift must fail closed: '+why+' '+w.id);
 }
 const layer={children:[],visible:true,add(m){m.parent=this;this.children.push(m)}};
 const actual=render(THREE,{plan:p,toWorld,baseHeight:112,layer});
 assert(actual,'tested original source-facade renderer should accept plan');
 assert.equal(actual.sourceOSMId,spec.id);
 assert.equal(actual.sourceRUIANId,spec.ruian);
 assert.equal(actual.sourceReportedFloors,7);
 assert.equal(actual.longFacadesRendered,4);
 assert.equal(actual.estimatedWindowsRendered,168);
 assert.equal(actual.plinthEdgesRendered,4);
 assert.equal(actual.genericFacadeEdgesSuppressed,4);
 assert.equal(actual.meshCount,4);
 assert.equal(actual.totalTriangles,2360);
 assert.equal(actual.addedColliders,0);
 assert.equal(actual.addedDoors,0);
 assert.equal(actual.allInScene(),true);
 assert.equal(actual.visibleAfterLOD(),4);
 assert.equal(layer.children.length,4);
 assert(layer.children.every(m=>m.geometry.position.array.every(Number.isFinite)));
 assert(layer.children.every(m=>m.userData.estimatedWindows===true));
 assert(layer.children.every(m=>m.userData.lodDetail===false));
 assert.equal(layer.children.reduce((n,m)=>n+m.geometry.position.array.length/9,0),2360);
 totalWindows+=actual.estimatedWindowsRendered;
 totalMeshes+=actual.meshCount;
 totalTriangles+=actual.totalTriangles;
}
assert.equal(totalWindows,504);
assert.equal(totalMeshes,12);
assert.equal(totalTriangles,7080);
assert.equal(JSON.stringify(ways),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-seven-floor-row-5219.js?v=521900'",
 'const visnovaSevenFloorRenderCache5219=new Map();',
 'planVisnovaSevenFloorRow5219({',
 'renderVisnovaResidential5192(THREE,{',
 'visnovaSevenFloorRenderCache5219.set(String(osmId)',
 'visnovaSevenFloorRenderCache5219.clear();',
 'window.__miloviceVisnovaSevenFloorRuntime5219=()=>',
 "'visnova-seven-floor-row-5219':{",
 'href="?v=521900&streetAudit=visnova-seven-floor-row-5219"',
 "const BUILD_ID='20261121-visnova-seven-floor-row-521900'"
])assert(html.includes(needle),'missing game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'all build strings match');
console.log('PASS 5.219 three original 7-floor/48-flat RÚIAN Višňová blocks;',
 totalWindows,'explicitly MODEL estimated windows,',totalMeshes,
 'rendered facade meshes,',totalTriangles,'triangles; original roofs/collisions untouched');
