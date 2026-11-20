import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaParkingHouse5202 as plan,
 renderVisnovaParkingHouse5202 as render,
 VISNOVA_PARKING_HOUSE_5202 as S}
 from './osm-visnova-parking-house-5202.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const e=JSON.parse(raw).elements.find(w=>String(w.id)===S.id);
assert(e,'mapped parking building');
const args={id:e.id,regionId:'mlada',tags:e.tags,
 geometry:e.geometry,modelFloors:2,modelHeight:6.1};
const p=plan(args);
assert(p,'real RUIAN two-floor parking house plan');
assert.equal(p.sourceRUIANId,'105243469');
assert.equal(p.sourceHash,'20bb417f');
assert.equal(p.facades.length,6);
assert.equal(p.newParkingSpaces,0);
assert.equal(p.newRamps,0);
assert.equal(p.newEntrances,0);
assert.equal(p.newColliders,0);
assert.equal(p.newBuildingVolumes,0);
assert.equal(p.exactFacadeAppearanceVerified,false);
for(const changed of [
 {regionId:'old'}, {modelFloors:3},{modelHeight:12},
 {photoReviewed:true},{approvedArchitecture:true},
 {tags:{...e.tags,parking:'surface'}},
 {tags:{...e.tags,'ref:ruian:building':'not-source'}},
 {geometry:e.geometry.slice(0,-1)},
 {geometry:e.geometry.map((q,i)=>i===2?{...q,lon:q.lon+.0000001}:q)}
])assert.equal(plan({...args,...changed}),null);
const THREE={
 DoubleSide:2,
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{constructor(array,size){this.array=array;this.itemSize=size}},
 MeshStandardMaterial:class{constructor(o){this.options=o}},
 Mesh:class{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true}}
};
const layer={visible:true,children:[],add(mesh){mesh.parent=this;this.children.push(mesh)}};
const toWorld=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320});
const model=render(THREE,{plan:p,toWorld,baseHeight:100,layer});
assert(model,'actual rendered wall screens');
assert.equal(model.screenPanels,6);
assert.equal(model.decorativeBands,18);
assert.equal(model.triangles,48);
assert.equal(model.meshCount,2);
assert.equal(model.inScene(),true);
assert.equal(model.visibleMeshes(),2);
assert(layer.children.every(m=>m.userData.sourceOSMId==='1025752710'));
assert(layer.children.every(m=>m.geometry.position.array.every(Number.isFinite)));
layer.visible=false;assert.equal(model.visibleMeshes(),0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const value of [
 "from './scripts/osm-visnova-parking-house-5202.js?v=520200'",
 'const visnovaParkingHousePlan5202=planVisnovaParkingHouse5202({',
 'const visnovaParkingHouseRendered5202=visnovaParkingHousePlan5202?',
 'visnovaParkingHouseCache5202.set(String(osmId)',
 'visnovaParkingHouseCache5202.clear();',
 'window.__miloviceVisnovaParkingHouseRuntime5202=()=>',
 '||visnovaParkingHouseRendered5202){',
 '!visnovaParkingHouseRendered5202&&!slepaUtility',
 "'visnova-parking-house-5202':{",
 'href="?v=520200&streetAudit=visnova-parking-house-5202"',
 '20261121-visnova-parking-house-520200'
])assert(html.includes(value),'scene integration missing: '+value);
console.log('PASS 5.202: RUIAN two-storey parking house, six source walls, 18 model bands, 48 triangles/2 meshes, no invented ramp or stalls');
