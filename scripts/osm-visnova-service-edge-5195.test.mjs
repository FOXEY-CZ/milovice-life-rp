import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaLaneEdges5195,renderVisnovaLaneEdges5195}
 from './osm-visnova-service-edge-5195.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements.filter(x=>[1201945276,202399861].includes(x.id));
const plan=planVisnovaLaneEdges5195({regionId:'mlada',ways});
assert(plan,'both exact original service ways must be present');
assert.deepEqual(plan.ways.map(w=>w.id),['1201945276','202399861']);
assert.equal(plan.sourceGeometryUntouched,true);
for(const k of ['newRoads','newFootways','newParkingBays','newColliders'])assert.equal(plan[k],0);
const copy=JSON.stringify(ways);
for(const broken of [
 {regionId:'other',ways},
 {regionId:'mlada',ways:ways.slice(1)},
 {regionId:'mlada',ways:[...ways,ways[0]]},
 {regionId:'mlada',ways:ways.map((w,i)=>i?{...w,tags:{...w.tags,service:'driveway'}}:w)},
 {regionId:'mlada',ways:ways.map((w,i)=>i?{...w,geometry:w.geometry.map((p,j)=>j===1?{...p,lat:p.lat+.0000001}:p)}:w)}
])assert.equal(planVisnovaLaneEdges5195(broken),null);
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
  this.geometry=geometry;this.material=material;this.visible=true;
 }}
};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const layer={visible:true,children:[],add(mesh){mesh.parent=this;this.children.push(mesh)}};
const result=renderVisnovaLaneEdges5195(THREE,{
 plan,toWorld,terrainAt:()=>100,layer
});
assert(result);
assert.equal(result.originalSegments,3);
assert.equal(result.edgeBands,6);
assert.equal(result.triangles,12);
assert.equal(result.meshCount,1);
assert.equal(result.rendered(),true);
assert.equal(result.visibleAfterLOD(),true);
assert.equal(layer.children.length,1);
assert.equal(layer.children[0].geometry.position.array.length,108);
assert.equal(result.sharedCornerJoins,1);
assert.equal(result.cornerJointMethod,'shared-miter');
const positions=layer.children[0].geometry.position.array;
// Second OSM way has two source segments. Both sides must share the exact
// same joint vertices, including their DEM-derived Y positions.
const point=k=>Array.from(positions.slice(k,k+3));
for(const side of [0,1]){
 const offset=side*18;
 assert.deepEqual(point(36+offset+3),point(72+offset),
  'the outer/inner edge must meet at the same mapped corner');
 assert.deepEqual(point(36+offset+15),point(72+offset+6),
  'the other edge of the strip must also join without a gap');
}
assert(layer.children[0].geometry.position.array.every(Number.isFinite));
layer.visible=false;
assert.equal(result.visibleAfterLOD(),false);
assert.equal(JSON.stringify(ways),copy);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-visnova-service-edge-5195.js?v=519600'",
 'planVisnovaLaneEdges5195({',
 'renderVisnovaLaneEdges5195(THREE,{',
 'window.__miloviceVisnovaServiceEdgesRuntime5195=()=>',
 "const BUILD_ID="
])assert(html.includes(term),'missing real scene integration '+term);
console.log('PASS 5.195: 2 OSM service lanes, 3 original segments, 6 edge strips, 12 triangles, one mesh, no new roads or parking');
