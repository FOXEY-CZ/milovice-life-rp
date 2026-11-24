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
assert.equal(r.groundBandToGrade,true);
assert.equal(r.provisionalPlinthVisuallyCovered,true);
assert.equal(r.physicalPlinthRemoved,false);
assert.equal(r.groundLayerOffsetMetres,.039);
assert.equal(r.seamLayerOffsetMetres,.041);
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
assert(Math.abs(Math.min(...ground.geometry.position.array.filter((_,i)=>i%3===1))-
 (110+.02))<1e-8,'dark ground-storey color must cover the generic grey plinth');
const origin=toWorld(p.sourceGeometry[0]),next=toWorld(p.sourceGeometry[1]);
const polygon=p.sourceGeometry.map(toWorld);
const winding=Math.sign(polygon.slice(0,-1).reduce((sum,x,i)=>{
 const y=polygon[i+1];return sum+x.x*y.y-x.y*y.x;
},0));
const length=Math.hypot(next.x-origin.x,next.y-origin.y);
const outwardX=winding*(next.y-origin.y)/length;
const outwardZ=-winding*(next.x-origin.x)/length;
const offsetFromWall=(v)=>((v[0]-origin.x)*outwardX+(v[2]-origin.y)*outwardZ);
const groundVertex=ground.geometry.position.array.slice(0,3);
const seamVertex=upper.geometry.position.array.slice(18,21);
assert(Math.abs(offsetFromWall(groundVertex)-.039)<1e-6,
 'dark ground finish in front of grey provisional +.036m plinth');
assert(.039>.036&&.039<.044&&.044<.068,
 'ground finish must remain behind model glass and window frames');
assert(Math.abs(offsetFromWall(seamVertex)-.041)<1e-6,
 'light horizontal seam remains in front of ground finish');
assert(Math.max(...ground.geometry.position.array.filter((_,i)=>i%3===1))<113);
assert(Math.max(...upper.geometry.position.array.filter((_,i)=>i%3===1))<122.2);
layer.visible=false;assert.equal(r.visibleAfterLOD(),0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-armadni-891-photo-wall-5284.js?v=528700'",
 'planArmadni891Photo5284(armadniHousesPlan5282)',
 'renderArmadni891Photo5284(THREE,{',
 'armadni891PhotoRenderCache5284.clear();',
 'window.__miloviceArmadni891PhotoRuntime5284=()=>',
 'armadni891PhotoRenderCache5284.set(String(osmId)',
 "const BUILD_ID='20261124-armadni-green-529000'"
])assert(html.includes(token),token);
console.log('PASS 5.287 Armádní 891 dark photo ground floor covers false grey plinth to grade without extra geometry, 60 triangles, 2 batches');
