import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmadniHouses5282} from './osm-armadni-houses-5282.js';
import {ARMADNI_WEST_PROJECT_5289 as C,
 planArmadniWestProject5289 as plan,
 renderArmadniWestProject5289 as render} from './osm-armadni-west-project-5289.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const get=id=>{
 const w=ways.find(x=>String(x.id)===id);assert(w);
 return planArmadniHouses5282({
  id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,
  modelFloors:4,modelHeight:12.2
 });
};
assert.deepEqual(C.houses.map(x=>x.project),['C14','C13']);
assert(C.projectUrl.includes('/filosofie/'));
assert.equal(C.gardensAndUpperBalconiesProjectDocumented,true);
assert.equal(C.exactBalconyLocationsVerified,false);
assert.equal(C.exactColorsVerified,false);
assert.equal(C.exactBandVerified,false);
class BufferGeometry{setAttribute(k,v){this[k]=v;}computeVertexNormals(){}computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(a,n){this.array=a;this.itemSize=n;}}
let mats=0;
class MeshStandardMaterial{constructor(o){this.opts=o;mats++;}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.parent=null;this.visible=true;}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const toWorld=p=>({x:(p.lon-14.857)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.23)*111320});
const all=[];
for(const b of C.houses){
 const src=get(b.osmId);assert(src);
 const p=plan(src);assert(p);
 assert.equal(p.project,b.project);
 assert.equal(p.sourceRUIANId,b.ruian);
 assert.equal(p.sourceHash,b.hash);
 assert.equal(p.balconyPositionsKnown,false);
 assert.equal(p.upperColorsExact,false);
 assert.equal(p.groundBandExact,false);
 assert.equal(p.upperFloorBalconiesProjectDocumented,true);
 for(const key of ['newBuildings','newBalconies','newDoors','newTerraces',
  'newFootways','newRoads','newColliders'])assert.equal(p[key],0);
 const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
 const r=render(THREE,{plan:p,toWorld,baseHeight:110,layer});
 assert(r);
 assert.equal(r.sourceOSMId,b.osmId);
 assert.equal(r.sourceRUIANId,b.ruian);
 assert.equal(r.originalWallEdges,14);
 assert.equal(r.meshCount,2);
 assert.equal(r.triangles,84);
 assert.equal(r.projectDocumented,true);
 assert.equal(r.photoVerified,false);
 assert.equal(r.balconyPositionVerified,false);
 assert.equal(r.estimatedPalette,true);
 assert.equal(r.originalSourceFootprintRetained,true);
 assert(r.allInScene());
 assert.equal(r.visibleAfterLOD(),2);
 const [ground,upper]=layer.children;
 assert.equal(ground.material.opts.color,C.estimatedColors.ground);
 assert.equal(upper.material.opts.color,C.estimatedColors.upper);
 assert.equal(Math.min(...ground.geometry.position.array.filter((_,i)=>i%3===1)),110+.02);
 assert(Math.max(...upper.geometry.position.array.filter((_,i)=>i%3===1))<122.2);
 for(const m of layer.children){
  assert.equal(m.userData.sourceOSMId,b.osmId);
  assert.equal(m.userData.photoVerified,false);
  assert.equal(m.userData.balconyPositionVerified,false);
  assert.equal(m.userData.lodDetail,false);
  assert(m.geometry.position.array.every(Number.isFinite));
 }
 layer.visible=false;assert.equal(r.visibleAfterLOD(),0);
 assert.equal(render(THREE,{plan:p,toWorld,baseHeight:NaN,layer}),null);
 assert.equal(layer.children.length,2);
 assert.equal(plan({...src,sourceHash:'wrong'}),null);
 assert.equal(plan({...src,sourceReportedFloors:5}),null);
 assert.equal(plan({...src,sourceGeometry:[...src.sourceGeometry].reverse()}),null);
 assert.equal(plan({...src,sourceGeometry:src.sourceGeometry.map((x,i)=>
  i===1?{...x,lat:x.lat+.0000001}:x)}),null);
 all.push(r);
}
assert.equal(mats,2,'shared material set for both source houses');
assert.equal(all.reduce((sum,x)=>sum+x.meshCount,0),4);
assert.equal(all.reduce((sum,x)=>sum+x.triangles,0),168);
for(const id of ['1047406190','1047406191'])assert.equal(plan(get(id)),null);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const s of [
 "from './scripts/osm-armadni-west-project-5289.js?v=528900'",
 'planArmadniWestProject5289(armadniHousesPlan5282)',
 'renderArmadniWestProject5289(THREE,{',
 'armadniWestRenderCache5289.clear();',
 'window.__miloviceArmadniWestRuntime5289=()=>',
 "const BUILD_ID='20261124-armadni-west-c13-c14-facade-528900'"
])assert(html.includes(s),s);
console.log('PASS 5.289: 886/C14 887/C13 original OSM facades, 2+2 shared batches, 168 triangles, no invented balcony coordinates');
