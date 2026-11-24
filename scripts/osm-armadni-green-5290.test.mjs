import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {makeSidewalkBuildingGuard} from './osm-tagged-sidewalk.js';
import {ARMADNI_GREEN_5290 as C,
 planArmadniGreen5290 as plan,
 renderArmadniGreen5290 as render} from './osm-armadni-green-5290.js';
const original=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(original).elements;
const cos=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*111320*cos,z:-(p.lat-50.226)*111320});
const roads=createRoadClearance(),buildings=makeSidewalkBuildingGuard();
for(const w of ways){
 const tags=w.tags||{},points=(w.geometry||[]).map(world);
 if(tags.building&&tags.building!=='roof'&&points.length>=3)
  buildings.add(w.id,points);
 if(tags.highway&&points.length>=2){
  const kind=tags.highway;
  const width=kind==='footway'?1.8:kind==='path'?1.65:
   kind==='cycleway'?2:kind==='service'?4.5:
   kind==='primary'?11:kind==='secondary'?9:
   kind==='tertiary'?8:7.8;
  roads.addRoad({id:w.id,points,width,kind});
 }
}
assert.deepEqual(C.polygons.map(p=>p.id),[
 '1468803911','1468803935','1468803941','1468803951']);
const args={regionId:'mlada',ways,toWorld:world,roads,buildings};
const p=plan(args);
assert(p,'exact four source grass patches');
assert.equal(p.version,'5.290');
assert.equal(p.originalGrassPolygonVerticesUntouched,true);
assert.equal(p.modelBladePositionEstimated,true);
assert.equal(p.polygons.length,4);
assert(p.totalTufts>8&&p.totalTufts<=39,
 'small clusters in verified OSM grass polygons only');
for(const piece of p.polygons){
 const e=ways.find(w=>String(w.id)===piece.sourceOSMId);
 assert.equal(e.tags.landuse,'grass');
 assert.equal(piece.sourceNodes,e.geometry.length);
 assert(piece.tufts.length<=piece.maxTufts);
 assert(piece.areaSquareMetres>7);
 for(const q of piece.tufts){
  assert(roads.isClear(q.x,q.z,.24,.05));
  assert(buildings.isClear(q.x,q.z,.33));
  assert.equal(q.positionIsEstimate,true);
  assert.equal(q.sourceOSMId,piece.sourceOSMId);
 }
}
assert.deepEqual(plan({...args,ways:[...ways].reverse()}),p);
for(const bad of C.polygons){
 const copy=ways.map(w=>String(w.id)===bad.id?{
  ...w,geometry:w.geometry.map((q,i)=>i===1?
  {...q,lon:q.lon+.0000001}:q)}:w);
 assert.equal(plan({...args,ways:copy}),null,'reject changed OSM grass '+bad.id);
}
assert.equal(plan({...args,regionId:'old'}),null);
assert.equal(plan({...args,roads:{isClear:()=>false}}).totalTufts,0);
assert.equal(plan({...args,buildings:{isClear:()=>false}}).totalTufts,0);
class BufferGeometry{setAttribute(key,val){this[key]=val}computeVertexNormals(){}computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(array,itemSize){this.array=array;this.itemSize=itemSize}}
let materials=0;
class MeshLambertMaterial{constructor(o){this.o=o;materials++}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.parent=null;this.visible=true}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshLambertMaterial,Mesh,DoubleSide:2};
const layer={visible:true,children:[],add(x){x.parent=this;this.children.push(x)}};
const r=render(THREE,{plan:p,terrainAt:()=>109.7,layer});
assert(r);
assert.equal(r.sourceLanduseVerified,true);
assert.equal(r.positionsEstimated,true);
assert.equal(r.tuftCount,p.totalTufts);
assert.equal(r.triangleCount,p.totalTufts*2);
assert.equal(r.meshCount,1);
assert.equal(materials,1);
assert.equal(layer.children.length,1);
assert.equal(r.allInScene(),true);
assert.equal(r.visibleAfterLOD(),1);
const mesh=layer.children[0];
assert.equal(mesh.userData.lodDetail,false);
assert.equal(mesh.userData.neverBlockFootways,true);
assert.equal(mesh.geometry.position.array.length,p.totalTufts*18);
assert(mesh.geometry.position.array.every(Number.isFinite));
assert(mesh.geometry.position.array.every((v,i)=>i%3!==1||
 v>109.7&&v<110.2));
layer.visible=false;assert.equal(r.visibleAfterLOD(),0);
assert.equal(render(THREE,{plan:p,terrainAt:()=>NaN,layer}),null);
assert.equal(layer.children.length,1);
for(const key of ['newLawnPolygons','newFootways','newRoads',
 'newParkedCars','newColliders','newTrees'])assert.equal(r[key],0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),original);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const term of [
 "from './scripts/osm-armadni-green-5290.js?v=529000'",
 'planArmadniGreen5290({',
 'renderArmadniGreen5290(THREE,{',
 'window.__miloviceArmadniGreenRuntime5290=()=>',
 "const BUILD_ID='20261124-armadni-green-529000'"
])assert(html.includes(term),term);
console.log('PASS 5.290 Armádní mapped OSM grass pockets: guarded deterministic low-poly vegetation, 1 mesh, no paths, roads or parking invented');
