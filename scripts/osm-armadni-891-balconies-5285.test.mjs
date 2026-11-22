import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmadniHouses5282} from './osm-armadni-houses-5282.js';
import {planArmadni891Photo5284} from './osm-armadni-891-photo-wall-5284.js';
import {ARMADNI_891_BALCONIES_5285 as C,
 planArmadni891Balconies5285 as plan,
 renderArmadni891Balconies5285 as render} from './osm-armadni-891-balconies-5285.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const source=id=>{
 const w=elements.find(w=>String(w.id)===id);assert(w);
 const a=planArmadniHouses5282({id:w.id,regionId:'mlada',
  tags:w.tags,geometry:w.geometry,modelFloors:4,modelHeight:12.2});
 return planArmadni891Photo5284(a);
};
const p=plan(source('1047406190'));
assert(p,'original georeferenced Armádní 891 facade');
assert.equal(p.sourceOSMId,'1047406190');
assert.equal(p.sourceRUIANId,'107125749');
assert.equal(C.photoSourceUrl,'https://jirisimon.cz/milovice/');
assert.equal(C.exactFacadeSideSurveyed,false);
assert.equal(p.originalSouthEdgeIndex,6);
assert.equal(p.positionIsPhotoInferred,true);
assert.equal(p.exactPositionSurveyed,false);
assert.deepEqual(p.floors,[1,2,3]);
assert.equal(p.modelBalconyCount,3);
assert.equal(p.addedBalconies,3);
for(const k of ['addedBuildingShells','addedEntrances','addedRoofs',
 'addedRoads','addedFootways','addedColliders'])assert.equal(p[k],0);
assert.equal(plan(source('1047406191')),null,'890 must not inherit 891 balcony');
assert.equal(plan(source('1164238465')),null,'886 must not inherit 891 balcony');
assert.equal(plan(source('1164238466')),null,'887 must not inherit 891 balcony');
assert.equal(plan({...source('1047406190'),sourceHash:'wrong'}),null);
assert.equal(plan({...source('1047406190'),modelRooflineMetres:14}),null);
assert.equal(plan({...source('1047406190'),sourceGeometry:
 [...source('1047406190').sourceGeometry].reverse()}),null);
assert.equal(plan({...source('1047406190'),sourceGeometry:
 source('1047406190').sourceGeometry.map((q,i)=>i===6?
 {...q,lon:q.lon+.0000001}:q)}),null);
// The authentic mapped parking roadway is east of the original house;
// the third floor terrace faces a different height than the ground floor.
const road=elements.find(x=>String(x.id)===C.sourceParkingRoadOSMId);
assert.equal(road?.tags?.highway,'residential');
const eastEdge=Math.max(...p.sourceGeometry.map(q=>q.lon));
const eastRoadLon=Math.min(...road.geometry.map(q=>q.lon));
assert(eastRoadLon>eastEdge+.0001,'parking road east of photo house');
const a=p.sourceGeometry[6],b=p.sourceGeometry[7];
assert(b.lon<a.lon&&b.lat>a.lat,'OSM south facade trends west-northwest');
assert(Math.abs(p.originalSouthEdgeLengthMetres-C.sourceEdgeLengthMetres)<.18);
const font=()=>{};
class BufferGeometry{setAttribute(k,v){this[k]=v;}computeVertexNormals(){}computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(a,s){this.array=a;this.size=s;}}
let materialCount=0;
class MeshStandardMaterial{constructor(p){this.p=p;materialCount++;}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.parent=null;this.visible=true;}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const toWorld=pt=>({x:(pt.lon-14.857)*111320*Math.cos(50.226*Math.PI/180),
 y:-(pt.lat-50.23)*111320});
const layer={visible:true,children:[],add(mesh){mesh.parent=this;this.children.push(mesh)}};
const r=render(THREE,{plan:p,toWorld,baseHeight:110,layer});
assert(r,'three anchored geometry levels in existing render');
assert.equal(r.sourceFacadeEdge,6);
assert.equal(r.balconyCount,3);
assert.equal(r.meshCount,4);
assert.equal(r.totalTriangles,324);
assert.equal(r.photoOrientationInferred,true);
assert.equal(r.exactPlacementSurveyed,false);
assert.equal(r.visibleAfterLOD(),4);
assert(r.allInScene());
assert.equal(materialCount,4);
for(const mesh of layer.children){
 assert.equal(mesh.userData.sourceFacadeEdge,6);
 assert.equal(mesh.userData.exactPlacementSurveyed,false);
 assert.equal(mesh.userData.lodDetail,false);
 const vertices=mesh.geometry.position.array;
 assert(vertices.every(Number.isFinite));
 const ys=vertices.filter((_,i)=>i%3===1);
 assert(Math.min(...ys)>110+2.9,'all balconies clear pavement');
 assert(Math.max(...ys)<110+11.6,'all balconies clear roof');
}
layer.visible=false;assert.equal(r.visibleAfterLOD(),0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-armadni-891-balconies-5285.js?v=528500'",
 'planArmadni891Balconies5285(armadni891PhotoPlan5284)',
 'renderArmadni891Balconies5285(THREE,{',
 'armadni891BalconiesCache5285.clear();',
 'armadni891BalconiesCache5285.set(String(osmId)',
 'window.__miloviceArmadni891BalconiesRuntime5285=()=>',
 "'armadni-891-south-balconies-5285':{",
 "const BUILD_ID='20261122-armadni-891-balconies-528500'"
])assert(html.includes(token),token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
assert.equal(meta,'20261122-armadni-891-balconies-528500');
console.log('PASS 5.285 real Armádní 891 3 photograph-inferred southern balconies, 4 batches/324 triangles, no altered OSM or collisions');
