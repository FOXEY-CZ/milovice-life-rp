import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planArmadniHouses5282} from './osm-armadni-houses-5282.js';
import {planArmadni891Photo5284} from './osm-armadni-891-photo-wall-5284.js';
import {ARMADNI_891_BALCONIES_5285 as C,
 planArmadni891Balconies5285 as plan,
 renderArmadni891Balconies5285 as render,
 planArmadni891WindowOmissions5286 as omitWindows} from './osm-armadni-891-balconies-5285.js';
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
// 5.286: the source-locked provisional first window bay is visually
// redundant beneath each modeled door. Other houses retain every model bay.
const house891=planArmadniHouses5282({id:elements.find(w=>String(w.id)==='1047406190').id,
 regionId:'mlada',tags:elements.find(w=>String(w.id)==='1047406190').tags,
 geometry:elements.find(w=>String(w.id)==='1047406190').geometry,
 modelFloors:4,modelHeight:12.2});
const omitted=omitWindows(house891,p);
assert.deepEqual(omitted.map(x=>[x.edgeIndex,x.floor,x.bay]),[[6,1,0],[6,2,0],[6,3,0]]);
assert.equal(omitWindows({...house891,sourceHash:'wrong'},p),null);
assert.equal(omitWindows(house891,{...p,centerFromEastMetres:4}),null);
assert.equal(omitWindows(house891,{...p,originalSouthEdgeIndex:9}),null);
assert.equal(omitWindows(house891,{...p,floors:[0,1,2]}),null);
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
assert.equal(r.meshCount,5);
assert.equal(r.totalTriangles,360);
assert.equal(r.photoOrientationInferred,true);
assert.equal(r.exactPlacementSurveyed,false);
assert.equal(r.visibleAfterLOD(),5);
assert(r.allInScene());
assert.equal(materialCount,5);
const glass=layer.children.find(m=>m.name.includes('GlassDoor'));
assert(glass,'glass-door mesh exists');
assert.equal(glass.material.p.transparent,true);
assert.equal(glass.material.p.opacity,.58);
assert.equal(glass.material.p.depthWrite,false);
const backing=layer.children.find(m=>m.name.includes('DoorBacking'));
assert(backing,'opaque backing screens provisional window mesh');
assert.equal(backing.material.p.transparent,undefined);
for(const solid of layer.children.filter(m=>m!==glass)){
 assert.equal(solid.material.p.transparent,undefined,'solid parts must remain opaque');
}
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
 "from './scripts/osm-armadni-891-balconies-5285.js?v=528600'",
 'planArmadni891Balconies5285(armadni891PhotoPlan5284)',
 'renderArmadni891Balconies5285(THREE,{',
 'armadni891BalconiesCache5285.clear();',
 'armadni891BalconiesCache5285.set(String(osmId)',
 'window.__miloviceArmadni891BalconiesRuntime5285=()=>',
 "'armadni-891-south-balconies-5285':{",
 "const BUILD_ID='20261123-armadni-891-window-overlays-528600'"
])assert(html.includes(token),token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
assert.equal(meta,'20261123-armadni-891-window-overlays-528600');
console.log('PASS 5.286 Armádní 891 three inferred balcony doors, three exact estimated window overlays omitted, unchanged original OSM');
