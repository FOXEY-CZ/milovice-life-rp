import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_EIGHT_FLOOR_5198 as S,planVisnovaEightFloor5198}
 from './osm-visnova-eight-floor-5198.js';
import {renderVisnovaResidential5192}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(raw).elements;
const way=es.find(w=>String(w.id)===S.id);
assert(way);
const args={id:way.id,regionId:'mlada',tags:way.tags,
 geometry:way.geometry,modelFloors:8,modelHeight:8*3.05};
const plan=planVisnovaEightFloor5198(args);
assert(plan,'original 8-floor RUIAN geometry must plan');
assert.equal(plan.sourceHash,'8d9f363f');
assert.equal(plan.sourceRUIANId,'25442961');
assert.deepEqual(plan.facades.map(f=>f.edgeIndex),[3,13,14,15]);
assert.equal(plan.estimatedWindows,224);
assert.equal(plan.sourceReportedFloors,8);
assert.equal(plan.suppressedGenericFacadeEdges,16);
assert.equal(plan.exactWindowPositionsVerified,false);
assert.equal(plan.inventedEntrances,0);
assert.equal(plan.inventedBalconies,0);
for(const k of ['newFootways','newRoads','newColliders','newBuildingVolumes'])
 assert.equal(plan[k],0);
for(const edit of [
 {regionId:'other'},{modelFloors:9},{modelHeight:22},
 {photoReviewed:true},{approvedArchitecture:true},
 {tags:{...way.tags,'ref:ruian:building':'invalid'}},
 {tags:{...way.tags,'building:flats':'56'}},
 {geometry:way.geometry.slice(1)},
 {geometry:way.geometry.map((p,i)=>i===2?{...p,lon:p.lon+.0000001}:p)}
])assert.equal(planVisnovaEightFloor5198({...args,...edit}),null);
const THREE={
 DoubleSide:2,
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{constructor(array,size){this.array=array;this.itemSize=size}},
 MeshStandardMaterial:class{constructor(options){this.options=options}},
 Mesh:class{constructor(geometry,material){
  this.geometry=geometry;this.material=material;this.userData={};this.visible=true
 }}
};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const rendered=renderVisnovaResidential5192(THREE,{
 plan,toWorld,baseHeight:100,layer
});
assert(rendered);
assert.equal(rendered.estimatedWindowsRendered,224);
assert.equal(rendered.longFacadesRendered,4);
assert.equal(rendered.plinthEdgesRendered,16);
assert.equal(rendered.meshCount,4);
assert.equal(rendered.totalTriangles,3168);
assert.equal(rendered.allInScene(),true);
assert.equal(rendered.visibleAfterLOD(),4);
assert(layer.children.every(m=>m.userData.sourceOSMId==='53865850'));
layer.visible=false;assert.equal(rendered.visibleAfterLOD(),0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-visnova-eight-floor-5198.js?v=519800'",
 'const visnovaEightFloorPlan5198=planVisnovaEightFloor5198({',
 'const visnovaEightFloorRendered5198=visnovaEightFloorPlan5198?',
 'visnovaEightFloorRenderCache5198.set(String(osmId)',
 'window.__miloviceVisnovaEightFloorRuntime5198=()=>',
 '||visnovaEightFloorRendered5198){',
 '!visnovaEightFloorRendered5198&&!slepaUtility',
 'visnovaEightFloorRenderCache5198.clear();',
 "'visnova-eight-floor-5198':{",
 'href="?v=519800&streetAudit=visnova-eight-floor-5198"',
 'const BUILD_ID='
])assert(html.includes(part),'missing in-game 8-floor model: '+part);
console.log('PASS 5.198: RUIAN 8-floor neighbour 53865850, 224 model windows, 4 shared meshes, 3168 triangles');
