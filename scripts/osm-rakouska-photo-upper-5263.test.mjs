import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaVojenskeZatisi5249 as basic} from './osm-italska-vojen-zatisi-5249.js';
import {filterItalskaPhotoSightlines5250 as filter} from './osm-italska-photo-sightlines-5250.js';
import {extendRakouskaNorthPhoto5251 as extend} from './osm-rakouska-north-photo-5251.js';
import {planRakouskaUpper5263 as plan,renderRakouskaUpper5263 as render}
 from './osm-rakouska-photo-upper-5263.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const building=JSON.parse(raw).elements.find(e=>e.id===53865882);
const basicPlan=basic({regionId:'mlada',building});
const sight=filter({plan:basicPlan,geometry:building.geometry});
const north=extend({plan:sight,geometry:building.geometry});
const p=plan({regionId:'mlada',building,basePlan:north});
assert(p);
assert.equal(p.roof.length,7);
assert.deepEqual(p.vertices,[0,1,2,3,4,5,6,7,8]);
assert(p.areaSquareMetres>55&&p.areaSquareMetres<58);
assert.equal(p.newBuildings,0);
assert.equal(p.newWindows,0);
assert.equal(p.newEntrances,0);
assert.equal(p.modelHeightNotSurveyed,true);
assert.equal(plan({regionId:'old',building,basePlan:north}),null);
assert.equal(plan({regionId:'mlada',building:{...building,id:53865877},basePlan:north}),null);
const bad=structuredClone(building);bad.geometry[3].lon+=.000001;
assert.equal(plan({regionId:'mlada',building:bad,basePlan:north}),null);
class BufferGeometry{
 setAttribute(k,v){this[k]=v}computeVertexNormals(){}computeBoundingSphere(){}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class MeshStandardMaterial{constructor(o){this.options=o}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};
 this.parent=null;this.visible=true;}}
const layer={children:[],add(m){m.parent=this;this.children.push(m)}};
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const r=render(THREE,{plan:p,layer,baseHeight:3,roofHeight:6.1});
assert(r);
assert.equal(r.drawMeshes,2);
assert.equal(r.wallTriangles,18);
assert.equal(r.roofTriangles,7);
assert(r.newRoofLevel>r.oldRoofLevel+2);
assert.equal(r.inScene(),true);
assert.equal(r.visibleAfterLOD(),2);
assert(layer.children.every(m=>m.geometry.position.array.every(Number.isFinite)));
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-rakouska-photo-upper-5263.js?v=526300'",
 'planRakouskaUpper5263({',
 'renderRakouskaUpper5263(THREE,{',
 'window.__miloviceRakouskaUpperRuntime5263=()=>',
 "'rakouska-photo-upper-5263':{",
 "const BUILD_ID='20261122-rakouska-cross-frontage-526700'"
])assert(html.includes(token),'Missing 5.263 game integration '+token);
console.log('PASS 5.263 original-RUIAN upper corner and triangulation, 2 actual 3D meshes; no invented entrances');
