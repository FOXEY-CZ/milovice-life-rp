import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_TOWER_5238 as C,planItalskaTower5238 as plan}
 from './osm-italska-tower-5238.js';
import {renderVisnovaResidential5192 as render}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const matches=JSON.parse(raw).elements.filter(e=>String(e.id)===C.id);
assert.equal(matches.length,1);
const way=matches[0];
const args={id:way.id,regionId:C.region,tags:way.tags,
 geometry:way.geometry,modelFloors:12,modelHeight:36.6};
const p=plan(args);
assert(p,'must accept untouched original RUIAN 12-floor footprint');
assert.equal(p.sourceHash,'aa907fb0');
assert.equal(p.sourceRUIANId,'26650959');
assert.equal(p.estimatedWindows,408);
assert.equal(p.facades.length,4);
assert.equal(p.suppressedGenericFacadeEdges,4);
assert.equal(p.sourceGeometryUnchanged,true);
assert.equal(p.exactWindowsPhotoVerified,false);
for(const key of ['newRoofs','newBuildingVolumes','newColliders',
 'newRoads','newFootways','inventedEntrances','inventedBalconies'])
 assert.equal(p[key],0,key);
class BufferGeometry{
 setAttribute(n,v){this[n]=v}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(options){this.options=options}}
class Mesh{constructor(geometry,material){this.geometry=geometry;
 this.material=material;this.visible=true;this.userData={};}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const toWorld=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320});
const r=render(THREE,{plan:p,toWorld,baseHeight:120,layer});
assert(r,'render four source-locked sides on the existing building');
assert.equal(r.estimatedWindowsRendered,408);
assert.equal(r.longFacadesRendered,4);
assert.equal(r.meshCount,4);
assert.equal(r.plinthEdgesRendered,4);
assert.equal(r.totalTriangles,408*14+8);
assert.equal(r.visibleAfterLOD(),4);
assert(layer.children.every(m=>m.geometry.position.array.every(Number.isFinite)));
for(const change of [
 {id:'0'},{regionId:'old'},{photoReviewed:true},
 {approvedArchitecture:true},{modelFloors:11},{modelHeight:33.55},
 {tags:{...way.tags,'building:levels':'13'}},
 {tags:{...way.tags,'ref:ruian:building':'0'}},
 {geometry:way.geometry.map((pt,i)=>i===1?{...pt,lon:pt.lon+.0000001}:pt)},
 {geometry:way.geometry.slice(0,-1)},
 {geometry:[...way.geometry].reverse()}
]) assert.equal(plan({...args,...change}),null,'reject changed original source');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-italska-tower-5238.js?v=523800'",
 'const italskaTowerRenderCache5238=new Map();',
 'const italskaTowerPlan5238=planItalskaTower5238({',
 'italskaTowerRenderCache5238.set(String(osmId)',
 'italskaTowerRenderCache5238.clear();',
 'italskaApartmentsRendered5235||italskaTowerRendered5238||',
 'window.__miloviceItalskaTowerRuntime5238=()=>'
])assert(html.includes(marker),'missing in-game 5.238 integration '+marker);
console.log('PASS 5.238: original 12-floor RUIAN building, 408 modeled windows, no invented roads or volumes');
