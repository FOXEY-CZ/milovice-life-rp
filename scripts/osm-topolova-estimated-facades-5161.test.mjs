import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolovaPanelRow5155} from './osm-topolova-panel-row-5155.js';
import {planTopolovaContinuousHip5160} from './osm-topolova-continuous-hip-5160.js';
import {TOPOLOVA_FACADE_ESTIMATE_5161,planTopolovaEstimatedFacades5161,
 renderTopolovaEstimatedFacades5161} from './osm-topolova-estimated-facades-5161.js';
const els=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',
 import.meta.url),'utf8')).elements;
const buildings=els.filter(e=>e.tags?.building&&e.geometry);
const roads=els.filter(e=>e.tags?.highway&&e.geometry);
const before=JSON.stringify([buildings,roads]);
const row=planTopolovaPanelRow5155({regionId:'mlada',ways:buildings});
const hip=planTopolovaContinuousHip5160({regionId:'mlada',rowPlan:row,ways:buildings});
const opts={regionId:'mlada',rowPlan:row,hipPlan:hip,ways:buildings};
const plan=planTopolovaEstimatedFacades5161(opts);
assert(plan);
assert.deepEqual(plan.sourceAddresses,[616,617,618]);
assert.deepEqual(plan.sourceOSMIds,['61979144','61979139','61979145']);
assert.deepEqual(plan.facadeEdgesById,{
 '61979144':[1,3],'61979139':[1,3],'61979145':[1,3]
});
assert.equal(plan.faces.length,6);
assert.equal(plan.inferredBayPositionsNotGeoreferenced,true);
assert.equal(plan.addedDoors,0);
assert.equal(plan.addedPhysicalBalconyPlatforms,0);
const route=roads.find(x=>String(x.id)===TOPOLOVA_FACADE_ESTIMATE_5161.roadOSMId);
const walk=roads.find(x=>String(x.id)===TOPOLOVA_FACADE_ESTIMATE_5161.footwayOSMId);
assert(route?.tags?.highway==='service');
assert(walk?.tags?.highway==='footway');
assert.equal(walk.tags.surface,'paving_stones');
for(const patch of [
 {regionId:'old'},{rowPlan:{...row,contiguousExactSharedPartyWalls:3}},
 {hipPlan:{...hip,fiveEntrySharedRoof:false}},
 {ways:buildings.filter(x=>String(x.id)!=='61979145')},
 {ways:buildings.map(x=>String(x.id)==='61979144'?
   {...x,geometry:x.geometry.map((p,i)=>i===1?{...p,lat:p.lat+.0000001}:p)}:x)},
 {ways:buildings.map(x=>String(x.id)==='61979145'?
   {...x,tags:{...x.tags,'building:levels':'5'}}:x)}
])assert.equal(planTopolovaEstimatedFacades5161({...opts,...patch}),null);
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const mock={DoubleSide:2,
 BufferGeometry:class{setAttribute(k,v){this[k]=v}computeVertexNormals(){}computeBoundingSphere(){}},
 Float32BufferAttribute:class{constructor(a,n){this.array=a;this.itemSize=n}},
 MeshStandardMaterial:class{constructor(v){this.options=v}},
 Mesh:class{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true}}
};
const layer={children:[],visible:true,add(m){m.parent=this;this.children.push(m)}};
const baseById=id=>({base:100, height:15.25,id});
const rendered=renderTopolovaEstimatedFacades5161(mock,{plan,toWorld,baseById,layer});
assert(rendered);
for(const [key,value] of Object.entries({
 renderedFacades:6,renderedMeshes:3,normalWindows:72,
 balconyWindowDoorSets:48,stairWindows:24,
 createdBalconyPlatforms:0,createdEntranceDoors:0,addedColliders:0
}))assert.equal(rendered[key],value,key);
assert(rendered.gpuTriangles>300);
assert.equal(rendered.visibleAfterLOD(),3);
assert.equal(rendered.allInScene(),true);
assert.equal(layer.children.length,3);
for(const mesh of layer.children){
 assert.equal(mesh.geometry.position.array.length%9,0);
 assert(mesh.geometry.position.array.length>0);
 assert.equal(mesh.userData.lodDetail,false);
 assert.equal(mesh.userData.inferredFacadeNotPhotoVerified,true);
}
layer.visible=false;
assert.equal(rendered.visibleAfterLOD(),0);
assert.equal(JSON.stringify([buildings,roads]),before);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const str of [
 "from './scripts/osm-topolova-estimated-facades-5161.js?v=516100'",
 'const topolovaInferredPlan=planTopolovaEstimatedFacades5161({',
 'renderTopolovaEstimatedFacades5161(THREE,{',
 'if(window.__miloviceTopolovaInferredPlan?.facadeEdgesById[String(osmId)]?.includes(i)){',
 'window.__miloviceTopolovaInferredRuntime=()=>{',
 "'topolova-inferred-616618-5161':{"
])assert(html.includes(str),'Missing 5.161 integration '+str);
console.log('PASS 5.161: 3 source-locked houses, 6 provisional facades, 3 GPU meshes; mapped road and walkway preserved');
