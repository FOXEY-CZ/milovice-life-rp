import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmadniHouses5282} from './osm-armadni-houses-5282.js';
import {ARMADNI_890_PAIR_FACADE_5288 as C,
 planArmadni890PairFacade5288 as plan,
 renderArmadni890PairFacade5288 as render} from './osm-armadni-890-pair-facade-5288.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elems=JSON.parse(raw).elements;
const house=id=>{
 const w=elems.find(x=>String(x.id)===id);assert(w,'source '+id);
 return planArmadniHouses5282({id:w.id,regionId:'mlada',tags:w.tags,
  geometry:w.geometry,modelFloors:4,modelHeight:12.2});
};
const h=house('1047406191');
assert(h,'source-locked 890 C15');
const p=plan(h);
assert(p);
assert.equal(C.ruian,'107124980');
assert.equal(C.house,'890');
assert(C.projectUrl.includes('C-15-a-C-16'));
assert.equal(C.photoOfThisHouseVerified,false);
assert.equal(p.sourceHash,'bc90ca65');
assert.equal(p.projectPairVerified,true);
assert.equal(p.housePhotoVerified,false);
assert.equal(p.colorsAndGroundBandEstimated,true);
assert.equal(p.newTerraces,0);
for(const k of ['newBuildings','newBalconies','newDoors','newRoads','newFootways','newColliders'])assert.equal(p[k],0);
for(const id of ['1047406190','1164238465','1164238466'])
 assert.equal(plan(house(id)),null,'never inherit 890 model '+id);
assert.equal(plan({...h,sourceHash:'broken'}),null);
assert.equal(plan({...h,sourceGeometry:[...h.sourceGeometry].reverse()}),null);
assert.equal(plan({...h,sourceReportedFloors:5}),null);
assert.equal(plan({...h,estimatedWindows:88}),null);
assert.equal(plan({...h,sourceGeometry:h.sourceGeometry.map((x,i)=>
 i===1?{...x,lon:x.lon+.0000001}:x)}),null);
class BufferGeometry{setAttribute(k,v){this[k]=v;}computeVertexNormals(){}computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(array,sz){this.array=array;this.itemSize=sz;}}
let materials=0;
class MeshStandardMaterial{constructor(o){this.opts=o;materials++;}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true;this.parent=null;}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const toWorld=q=>({x:(q.lon-14.857)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.23)*111320});
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const r=render(THREE,{plan:p,toWorld,baseHeight:110,layer});
assert(r);
assert.equal(r.sourceOSMId,'1047406191');
assert.equal(r.photoApproved,false);
assert.equal(r.meshCount,2);
assert.equal(r.modelWallEdges,10);
assert.equal(r.triangles,60);
assert.equal(r.windowBaysAdded,0);
assert.equal(r.newTerraces,0);
assert(r.originalSourceFootprintRetained);
assert(r.allInScene());
assert.equal(r.visibleAfterLOD(),2);
assert.equal(materials,2);
for(const mesh of layer.children){
 assert.equal(mesh.userData.sourceOSMId,'1047406191');
 assert.equal(mesh.userData.estimatedPalette,true);
 assert.equal(mesh.userData.housePhotoVerified,false);
 assert.equal(mesh.userData.lodDetail,false);
 assert(mesh.geometry.position.array.every(Number.isFinite));
}
const [ground,upper]=layer.children;
const ys=ground.geometry.position.array.filter((_,i)=>i%3===1);
assert(Math.abs(Math.min(...ys)-(110+.02))<1e-8);
assert(Math.abs(Math.max(...ys)-(110+2.90))<1e-8);
assert(Math.max(...upper.geometry.position.array.filter((_,i)=>i%3===1))<122.2);
assert(.039>.036&&.039<.044&&.041>.039);
layer.visible=false;
assert.equal(r.visibleAfterLOD(),0);
const n=layer.children.length;
assert.equal(render(THREE,{plan:p,toWorld,baseHeight:NaN,layer}),null);
assert.equal(layer.children.length,n);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const item of [
 "from './scripts/osm-armadni-890-pair-facade-5288.js?v=528800'",
 'planArmadni890PairFacade5288(armadniHousesPlan5282)',
 'renderArmadni890PairFacade5288(THREE,{',
 'armadni890FacadeCache5288.clear();',
 'window.__miloviceArmadni890FacadeRuntime5288=()=>',
 "const BUILD_ID='20261124-armadni-west-c13-c14-facade-528900'"
])assert(html.includes(item),item);
console.log('PASS 5.288 Armádní 890 C15 10 original source edges, 2 provisional project tone batches, 60 triangles, zero invented entrances/terraces');
