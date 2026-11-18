import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planTopolova646Photo5156}
 from './osm-topolova-photo-646-5156.js';
import {planTopolova646BothFacades5157,renderTopolova646BothFacades5157}
 from './osm-topolova-photo-646-5157.js';
const elements=JSON.parse(readFileSync(
 new URL('../data/regions/mlada.json',import.meta.url),'utf8')).elements;
const main=elements.find(x=>x.id===53866048);
const school=elements.find(x=>x.id===53865699);
const row=elements.find(x=>x.id===61979145);
assert(main&&school&&row);
const before=JSON.stringify([main,school,row]);
const oldPhotoPlan=planTopolova646Photo5156({
 id:main.id,regionId:'mlada',tags:main.tags,
 geometry:main.geometry,baseFloors:1
});
const plan=planTopolova646BothFacades5157({
 oldPhotoPlan,geometry:main.geometry
});
assert(plan);
assert.equal(plan.version,'5.157');
assert.deepEqual(plan.photoExteriorEdges,[5,7]);
assert.equal(plan.sourceOSMHash,'73d119b1');
assert.equal(plan.eastFaceMeters,43.046);
assert.equal(plan.westFaceMeters,43.021);
assert.equal(plan.sourceFacadeCount,2);
assert.equal(plan.modelDormersTotal,16);
assert.equal(plan.modelMainWindowsTotal,96);
assert.equal(plan.modelArchedAtticGlazing,32);
assert.equal(plan.modelArchedSegments,10);
assert.equal(plan.originalOSMLevels,'1');
assert(plan.photoBackedHalfRoundAtticWindowShape);
assert(plan.sideOrientationPhotoUnverified);
assert(plan.oppositeFacadeWindowSpacingEstimated);
for(const x of ['createdDoors','createdColliders','createdNewBuildings',
 'createdRoads','createdPaths','createdParking','createdTrees',
 'createdStreetLamps'])assert.equal(plan[x],0);
for(const patch of [
 {oldPhotoPlan:{...oldPhotoPlan,sourceOSMId:'53866045'}},
 {oldPhotoPlan:{...oldPhotoPlan,modelDormers:9}},
 {oldPhotoPlan:{...oldPhotoPlan,modelWallHeightMeters:11}},
 {geometry:main.geometry.slice(0,-1)},
 {geometry:main.geometry.map((p,i)=>i===7?{...p,lat:p.lat+.0000001}:p)}
])assert.equal(planTopolova646BothFacades5157({
 oldPhotoPlan,geometry:main.geometry,...patch
}),null);
const outline=main.geometry.slice(0,-1).map(p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
}));
class BufferAttr{
 constructor(array,n){this.array=array;this.itemSize=n}
}
class Geometry{
 setAttribute(k,a){this[k]=a}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Material{constructor(a){this.options=a}}
class Mesh{
 constructor(geometry,material){this.geometry=geometry;this.material=material;this.visible=true;this.userData={}}
}
const THREE={
 BufferGeometry:Geometry,Float32BufferAttribute:BufferAttr,
 MeshStandardMaterial:Material,Mesh,DoubleSide:2
};
const layer={children:[],add(mesh){mesh.parent=this;this.children.push(mesh)},visible:true};
const rendered=renderTopolova646BothFacades5157(THREE,{plan,outline,baseY:100,layer});
assert(rendered);
assert.equal(rendered.version,'5.157');
assert.equal(rendered.renderedMeshes,4);
assert.equal(rendered.modelMainWindows,96);
assert.equal(rendered.modelAtticWindows,32);
assert.equal(rendered.modelGables,16);
assert.equal(rendered.modeledArches,32);
assert.deepEqual(rendered.renderedFacadeEdges,[5,7]);
assert(rendered.renderedTriangleCount>550);
assert.equal(rendered.visibleAfterLOD(),4);
assert(rendered.allInScene());
for(const mesh of layer.children){
 assert.equal(mesh.geometry.position.array.length%9,0);
 assert(mesh.geometry.position.array.length>0);
 assert(mesh.userData.lodDetail===false);
 assert(mesh.name.includes('_5157'));
}
assert.equal(JSON.stringify([main,school,row]),before);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const q of [
 "from './scripts/osm-topolova-photo-646-5157.js?v=515700'",
 'const topolova646BothPlan=topolova646Photo?',
 'renderTopolova646BothFacades5157(THREE,{',
 'topolova646BothPlan.photoExteriorEdges.includes(i)',
 'window.__miloviceTopolovaBothFacadesRuntime=()=>{',
 "'topolova-646-both-5157':{"
])assert(html.includes(q),'Missing real 5.157 integration '+q);
console.log('PASS 5.157 2 photo-grounded 43m facades, 32 curved attic windows, 4 GPU batches; 0 invented roads/entries');
