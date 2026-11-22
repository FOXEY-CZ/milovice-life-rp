import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmadniHouses5282} from './osm-armadni-houses-5282.js';
import {ARMADNI_891_PHOTO_5284 as C,
 planArmadni891Photo5284 as plan,
 renderArmadni891Photo5284 as render} from './osm-armadni-891-photo-wall-5284.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const get=house=>{
 const w=ways.find(w=>String(w.id)===house);
 assert(w);
 return planArmadniHouses5282({id:w.id,regionId:'mlada',
  tags:w.tags,geometry:w.geometry,modelFloors:4,modelHeight:12.2});
};
assert.equal(C.url,'https://jirisimon.cz/milovice/');
assert.equal(C.house,'891');
assert.equal(C.observedBalconiesButUnlocated,true);
const original=get(C.osmId);
assert(original,'original locked source house');
const p=plan(original);
assert(p);
assert.equal(p.sourceOSMId,'1047406190');
assert.equal(p.sourceRUIANId,'107125749');
assert.equal(p.sourceObservedTwoTone,true);
assert.equal(p.allWallSidesPhotoVerified,false);
assert.equal(p.exactColorsPhotoVerified,false);
for(const k of ['newBalconies','newBuildings','newDoors','newRoofs',
 'newFootways','newRoads','newColliders'])assert.equal(p[k],0);
assert.equal(plan(get('1047406191')),null,'890 may not inherit photo');
assert.equal(plan(get('1164238465')),null,'886 may not inherit photo');
assert.equal(plan(get('1164238466')),null,'887 may not inherit photo');
assert.equal(plan({...original,sourceHash:'wrong'}),null);
assert.equal(plan({...original,sourceReportedFloors:5}),null);
assert.equal(plan({...original,modelHeightMeters:18}),null);
assert.equal(plan({...original,sourceGeometry:original.sourceGeometry.map(
 (q,i)=>i===1?{...q,lat:q.lat+.000001}:q)}),null);
class BufferGeometry{setAttribute(k,v){this[k]=v;}computeVertexNormals(){}computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(a,s){this.array=a;this.size=s;}}
let mats=0;
class MeshStandardMaterial{constructor(props){this.props=props;mats++;}}
class Mesh{constructor(geometry,material){
 this.geometry=geometry;this.material=material;this.userData={};
 this.parent=null;this.visible=true;
}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const toWorld=p=>({x:(p.lon-14.857)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.23)*111320});
const layer={children:[],visible:true,add(x){x.parent=this;this.children.push(x)}};
const r=render(THREE,{plan:p,toWorld,baseHeight:110,layer});
assert(r);
assert.equal(r.wallEdges,10);
assert.equal(r.meshCount,2);
assert.equal(r.triangles,60,'ground+upper+light transition, 10 source edges');
assert.equal(r.allInScene(),true);
assert.equal(r.visibleAfterLOD(),2);
assert.equal(r.addedBalconies,0);
assert.equal(mats,2);
for(const m of layer.children){
 assert.equal(m.userData.sourceOSMId,C.osmId);
 assert.equal(m.userData.estimatedColorAndUnseenWalls,true);
 assert.equal(m.userData.lodDetail,false);
 assert(m.geometry.position.array.every(Number.isFinite));
}
const [ground,upper]=layer.children;
assert.equal(Math.min(...ground.geometry.position.array.filter((_,i)=>i%3===1)),
 110+.70);
assert(Math.max(...ground.geometry.position.array.filter((_,i)=>i%3===1))<113);
assert(Math.max(...upper.geometry.position.array.filter((_,i)=>i%3===1))<122.2);
layer.visible=false;assert.equal(r.visibleAfterLOD(),0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-armadni-891-photo-wall-5284.js?v=528400'",
 'planArmadni891Photo5284(armadniHousesPlan5282)',
 'renderArmadni891Photo5284(THREE,{',
 'armadni891PhotoRenderCache5284.clear();',
 'window.__miloviceArmadni891PhotoRuntime5284=()=>',
 'armadni891PhotoRenderCache5284.set(String(osmId)',
 "const BUILD_ID='20261122-armadni-891-photo-tone-528400'"
])assert(html.includes(token),token);
console.log('PASS 5.284 Armádní 891 authentic address exterior two-tone, 60 triangles/2 batches, no guessed balconies or building changes');
