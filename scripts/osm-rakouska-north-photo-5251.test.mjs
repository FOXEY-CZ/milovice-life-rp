// 5.251: newly geotagged public Rakouska photo expands actual source walls
// without constructing a single new building, road, sidewalk or collider.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as base,
 renderItalskaVojenskeZatisi5249 as render}
 from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as filter}
 from './osm-italska-photo-sightlines-5250.js';
import {RAKOUSKA_NORTH_PHOTO_5251 as source,
 extendRakouskaNorthPhoto5251 as extend}
 from './osm-rakouska-north-photo-5251.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const building=JSON.parse(raw).elements.find(e=>e.id===53865882);
assert(building);
const before=filter({plan:base({regionId:'mlada',building}),
 geometry:building.geometry});
assert.equal(before?.visibleEdges.length,12);
const plan=extend({plan:before,geometry:building.geometry});
assert(plan);
assert.equal(plan.version,'5.251');
assert.equal(plan.visibleEdges.length,18);
assert.equal(plan.rakouskaNorthAddedEdges5251,6);
assert.deepEqual(plan.rakouskaNorthVisibleEdgeIds5251,[0,1,2,3,5,27]);
assert.equal(plan.photoViews,3);
assert.equal(plan.photoSources.length,3);
assert.equal(plan.originalFootprintPreserved,true);
assert.equal(plan.sourceGeometryPreserved,true);
assert.equal(plan.newWindows,0);
assert.equal(plan.newEntrances,0);
assert.equal(plan.newColliders,0);
assert.equal(plan.newBuildings,0);
assert.equal(plan.newStreetFurniture,0);
assert.equal(plan.newlyDecoratedFacadesPhotoMeasured,false);
assert.equal(plan.newlyDecoratedFacadesModelEstimated,true);
assert.equal(source.camera.lat,50.226027);
assert.equal(source.camera.lon,14.874584);
assert.equal(source.license,'CC BY-SA 4.0');
assert.equal(extend({plan:{...before,sourceHash:'deadbeef'},
 geometry:building.geometry}),null);
const modified=structuredClone(building.geometry);
modified[1].lon+=.000001;
assert.equal(extend({plan:before,geometry:modified}),null);
assert.equal(extend({plan:{...before,visibleEdges:[
 ...before.visibleEdges,before.visibleEdges[0]]},geometry:building.geometry}),null);
class BufferGeometry{
 setAttribute(key,val){this[key]=val}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{
 constructor(array,size){this.array=array;this.size=size}
}
class MeshStandardMaterial{constructor(options){this.options=options}}
class Mesh{constructor(geometry,material){
 this.geometry=geometry;this.material=material;
 this.parent=null;this.visible=true;this.userData={};
}}
const layer={children:[],add(mesh){this.children.push(mesh);mesh.parent=this}};
const THREE={BufferGeometry,Float32BufferAttribute,
 MeshStandardMaterial,Mesh,DoubleSide:'both'};
const rendered=render(THREE,{plan,layer,baseHeight:4,roofHeight:6.1});
assert(rendered);
assert.equal(rendered.drawMeshes,2);
assert.equal(rendered.trimEdges,18);
assert.equal(rendered.wearPatches,16);
assert.equal(rendered.decorativeTriangles,100);
assert.equal(rendered.newColliders,0);
assert.equal(rendered.visibleAfterLOD(),2);
assert.equal(rendered.inScene(),true);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-rakouska-north-photo-5251.js?v=525100'",
 'extendRakouskaNorthPhoto5251({',
 "window.__miloviceRakouskaNorthPhotoRuntime5251=()=>",
 "'rakouska-vojen-zatisi-5251':{",
 'Verze 5.'
])assert(html.includes(token),'missing 5.251 game integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&hud===build);
console.log('PASS 5.251: third geotagged photo camera, 6 source-visible northern walls, 18 total trims, 16 model wear marks in 2 batches, zero new geography');
