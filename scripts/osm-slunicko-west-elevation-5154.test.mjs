import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planSlunickoStoreys5153} from './osm-slunicko-storeys-5153.js';
import {planSlunickoWestElevation5154} from './osm-slunicko-west-elevation-5154.js';
import {planSlunickoWestWindows5189,renderSlunickoWestWindows5189} from './osm-slunicko-west-windows-5189.js';
const data=JSON.parse(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const main=data.find(x=>x.id===53865699),other=data.find(x=>x.id===53865700);
assert(main&&other);
const orig=JSON.stringify([main,other]);
const base=planSlunickoStoreys5153({id:main.id,regionId:'mlada',
 tags:main.tags,geometry:main.geometry,baseFloors:2});
assert(base);
const plan=planSlunickoWestElevation5154({basePlan:base,geometry:main.geometry});
assert(plan);
assert.equal(plan.westEdgeIndex,1);
assert(Math.abs(plan.westEdgeMeters-44.429)<.01);
assert(Math.abs(plan.eastEdgeMeters-44.299)<.01);
assert.equal(plan.modelHeightMeters,13.15);
assert.equal(plan.increaseMeters,.95);
assert.equal(plan.page,5);
assert.equal(plan.roofHeightNotSurveyed,true);
assert.equal(plan.originalOSMGeometryUntouched,true);
assert.equal(plan.originalOSMLevelsUntouched,true);
for(const key of ['newShades','newDoors','newBuildings','newRoads',
 'newFootways','newColliders','newTrees','newLamps','newParking'])
 assert.equal(plan[key],0);
for(const patch of [
 {basePlan:{...base,sourceOSMId:'53865700'}},
 {basePlan:{...base,originalOSMHash:'xx'}},
 {basePlan:{...base,modelHeightMeters:13.15}},
 {geometry:main.geometry.slice(0,-1)},
 {geometry:main.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.00001}:p)},
 {geometry:main.geometry.map((p,i)=>i===7?{...p,lon:p.lon+.00003}:p)}
])assert.equal(planSlunickoWestElevation5154({
 basePlan:base,geometry:main.geometry,...patch}),null);
assert.equal(JSON.stringify([main,other]),orig);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const key of [
 "from './scripts/osm-slunicko-west-elevation-5154.js?v=515400'",
 'const slunickoWestPlan=slunickoPlan?',
 'if(slunickoWestPlan)h=slunickoWestPlan.modelHeightMeters;',
 'wallSpanMeters:slunickoWallSpan',
 'window.__miloviceSlunickoWestRuntime=()=>{',
 "'topolova-slunicko-west-5154':{"
])assert(html.includes(key),'Missing 5.154 integration '+key);
// 5.189: actual triangle batches for the west side, with window widths
// grounded in the 2020 blind bill but positions strictly labelled as model.
const glazingPlan=planSlunickoWestWindows5189({westPlan:plan,geometry:main.geometry});
assert(glazingPlan);
assert.equal(glazingPlan.estimatedWindowBays,36);
assert.equal(glazingPlan.modelWindowWidthMeters,2.4);
assert.equal(glazingPlan.modelWindowHeightMeters,1.8);
assert.equal(glazingPlan.allWindowLocationsEstimated,true);
assert.equal(glazingPlan.westAssignmentOfTenderUnitsUnverified,true);
assert.equal(glazingPlan.changedOSMGeometry,false);
for(const variant of [
 {westPlan:{...plan,version:'5.152'}},
 {westPlan:{...plan,westEdgeIndex:2}},
 {geometry:main.geometry.map((p,i)=>i===2?{...p,lon:p.lon+.0000001}:p)},
 {geometry:main.geometry.slice(0,-1)}
])assert.equal(planSlunickoWestWindows5189({
 westPlan:plan,geometry:main.geometry,...variant
}),null);
const mock={
 DoubleSide:2,
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v;}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{
  constructor(arr,itemSize){this.array=arr;this.itemSize=itemSize;}
 },
 MeshStandardMaterial:class{constructor(options){this.options=options;}},
 Mesh:class{
  constructor(geometry,material){
   this.geometry=geometry;this.material=material;
   this.userData={};this.visible=true;
  }
 }
};
const layer={visible:true,children:[],add(o){o.parent=this;this.children.push(o);}};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const drawn=renderSlunickoWestWindows5189(mock,{
 plan:glazingPlan,toWorld,baseHeight:100,layer
});
assert(drawn);
assert.equal(drawn.renderedWestBays,36);
assert.equal(drawn.renderedMeshes,3);
assert.equal(drawn.gpuTriangles,36*14);
assert.equal(drawn.documentReportedWidthMeters,2.4);
assert.equal(drawn.windowPositionsEstimated,true);
assert.equal(drawn.newDoorPositions,0);
assert.equal(drawn.addedColliders,0);
assert.equal(drawn.inScene(),true);
assert.equal(drawn.visibleAfterLOD(),3);
assert.equal(layer.children.length,3);
for(const mesh of layer.children){
 assert(mesh.geometry.position.array.length>0);
 assert.equal(mesh.geometry.position.array.length%9,0);
 assert.equal(mesh.userData.lodDetail,false);
 assert.equal(mesh.userData.estimatedWindowPositions,true);
 assert.equal(mesh.userData.sourceOSMId,'53865699');
}
layer.visible=false;
assert.equal(drawn.visibleAfterLOD(),0);
assert.equal(renderSlunickoWestWindows5189(mock,{
 plan:glazingPlan,toWorld,baseHeight:NaN,layer
}),null);
assert.equal(JSON.stringify([main,other]),orig);
for(const token of [
 "from './scripts/osm-slunicko-west-windows-5189.js?v=518900'",
 "const slunickoWestWindowsPlan5189=slunickoWestPlan?",
 "renderSlunickoWestWindows5189(THREE,{",
 "window.__miloviceSlunickoWestWindowsRuntime5189=()=>",
 "genericWestEdgesSuppressed++",
 "20261120-slunicko-west-model-windows-518900"
])assert(html.includes(token),'Missing 5.189 rendering integration '+token);
console.log('PASS 5.189: 36 modeled west glazing bays in 3 meshes, tender width grounded, OSM unchanged');
console.log('PASS 5.154 source-locked west 44.429m wall and estimated 13.15m height, without invented furniture');
