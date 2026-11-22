// 5.262 — strictly photo-scoped faded red facade on ORIGINAL OSM walls.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as base}
 from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as filter}
 from './osm-italska-photo-sightlines-5250.js';
import {extendRakouskaNorthPhoto5251 as extend}
 from './osm-rakouska-north-photo-5251.js';
import {ITALSKA_PHOTO_RED_PLINTH_5262 as C,
 planItalskaPhotoRedPlinth5262 as plan,
 renderItalskaPhotoRedPlinth5262 as render}
 from './osm-italska-photo-red-plinth-5262.js';

const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const building=JSON.parse(raw).elements.find(e=>e.id===53865882);
assert(building);
const original=base({regionId:'mlada',building});
const photoFiltered=filter({plan:original,geometry:building.geometry});
const expanded=extend({plan:photoFiltered,geometry:building.geometry});
assert.equal(expanded?.version,'5.251');
const good=plan({regionId:'mlada',building,plan:expanded});
assert(good,'The true 2025 camera and original polygon must match');
assert.equal(good.version,'5.262');
assert.deepEqual(good.selectedOriginalEdges,[11,12,13,14,16]);
assert.equal(good.walls.length,5);
assert.equal(good.photo,C.photo);
assert.equal(good.sourceOSMId,'53865882');
assert.equal(good.sourceRUIANId,'40057411');
assert.equal(good.sourceHash,'7aec42bc');
assert.equal(good.estimatedPaintBoundaries,true);
assert.equal(good.measuredFacadeHeight,false);
assert.equal(good.originalRoofPreserved,true);
assert.equal(good.newEntrances,0);
assert.equal(good.newWindows,0);
assert.equal(good.newBuildings,0);
assert.equal(good.newColliders,0);
assert(good.walls.every(w=>w.lengthMetres>2.5&&w.cameraVisibilityEstimated));
assert(good.walls.every(w=>expanded.visibleEdges.some(e=>e.edge===w.edge&&
 e.sightlineUnobstructed5250)));
assert.equal(C.camera.lat,50.225548);
assert.equal(C.camera.lon,14.875192);
assert.equal(C.licence,'CC BY-SA 4.0');
assert.equal(plan({regionId:'old',building,plan:expanded}),null);
assert.equal(plan({regionId:'mlada',building,plan:photoFiltered}),null);
assert.equal(plan({regionId:'mlada',building,plan:{...expanded,sourceHash:'tampered'}}),null);
const withoutOne={...expanded,visibleEdges:expanded.visibleEdges.filter(e=>e.edge!==12)};
assert.equal(plan({regionId:'mlada',building,plan:withoutOne}),null);
const modified=structuredClone(building);modified.geometry[11].lon+=.000001;
assert.equal(plan({regionId:'mlada',building:modified,plan:expanded}),null);
assert.equal(plan({regionId:'mlada',building:{...building,id:53865877},plan:expanded}),null);

class BufferGeometry{
 setAttribute(key,val){this[key]=val}
 computeVertexNormals(){this.normalsComputed=true}
 computeBoundingSphere(){this.boundsComputed=true}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(options){this.options=options}}
class Mesh{constructor(geometry,material){
 this.geometry=geometry;this.material=material;this.userData={};
 this.visible=true;this.parent=null;
}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,
 DoubleSide:'DoubleSide'};
const layer={children:[],add(mesh){mesh.parent=this;this.children.push(mesh)}};
const drawn=render(THREE,{plan:good,layer,baseHeight:4,roofHeight:6.1});
assert(drawn);
assert.equal(drawn.drawMeshes,2);
assert.equal(drawn.renderedOriginalWallEdges,5);
assert.deepEqual(drawn.selectedOriginalEdges,[11,12,13,14,16]);
assert.equal(drawn.paintBandTriangles,10);
assert(drawn.wornAreaTriangles>=8&&drawn.wornAreaTriangles<=24);
assert.equal(drawn.visibleAfterLOD(),2);
assert.equal(drawn.inScene(),true);
assert.equal(drawn.newColliders,0);
assert(layer.children.every(x=>x.geometry.position.array.length>0&&
 x.geometry.position.array.every(Number.isFinite)&&
 x.geometry.boundsComputed&&x.geometry.normalsComputed));
assert(layer.children.every(x=>x.userData.lodDetail===true));
for(const mesh of layer.children){
 for(let i=1;i<mesh.geometry.position.array.length;i+=3)
  assert(mesh.geometry.position.array[i]>=4.11&&
   mesh.geometry.position.array[i]<=4.85,
   'Never overpaint the first-floor model window bays or upper facade');
 mesh.visible=false;
}
assert.equal(drawn.visibleAfterLOD(),0);
assert.equal(render(THREE,{plan:good,layer,baseHeight:4,roofHeight:2}),null);
assert.equal(JSON.stringify(building),JSON.stringify(JSON.parse(raw).elements.find(e=>e.id===53865882)));
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-photo-red-plinth-5262.js?v=526200'",
 'planItalskaPhotoRedPlinth5262({',
 'renderItalskaPhotoRedPlinth5262(THREE,{',
 'window.__miloviceItalskaPhotoRedPlinthRuntime5262=()=>',
 "'italska-photo-red-plinth-5262':{",
 "const BUILD_ID='20261122-italska-photo-red-plinth-526200'"
])assert(html.includes(token),'Missing 5.262 3D integration '+token);
console.log('PASS 5.262: genuine 2025 photo red-base evidence, exactly 5 original visible façades, 2 decorative batches, untouched OSM, no invented doors');
