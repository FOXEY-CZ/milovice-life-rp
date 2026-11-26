import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planVisnovaNeighbor5197,VISNOVA_NEIGHBOR_5197 as S}
 from './osm-visnova-neighbor-5197.js';
import {renderVisnovaResidential5192}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(raw).elements;
const way=es.find(w=>String(w.id)===S.id);
assert(way,'exact neighbouring building exists in regional OSM');
assert.equal(S.hash,'22bf1447');
const args={id:way.id,regionId:'mlada',tags:way.tags,
 geometry:way.geometry,modelFloors:11,modelHeight:11*3.05};
const plan=planVisnovaNeighbor5197(args);
assert(plan,'original 11-floor source polygon must plan');
assert.equal(plan.sourceOSMId,'202399859');
assert.equal(plan.sourceRUIANId,'25013360');
assert.equal(plan.estimatedWindows,385);
assert.deepEqual(plan.facades.map(f=>f.edgeIndex),[0,2,3,4,5,10,11,12]);
assert.equal(plan.suppressedGenericFacadeEdges,14);
assert.equal(plan.inventedEntrances,0);
assert.equal(plan.inventedBalconies,0);
for(const k of ['newFootways','newRoads','newColliders','newBuildingVolumes'])
 assert.equal(plan[k],0);
for(const edit of [
 {regionId:'old'}, {modelFloors:10},{modelHeight:10},
 {photoReviewed:true},{approvedArchitecture:true},
 {tags:{...way.tags,'building:flats':'56'}},
 {tags:{...way.tags,'ref:ruian:building':'wrong'}},
 {geometry:way.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.0000001}:p)},
 {geometry:way.geometry.slice(1)}
])assert.equal(planVisnovaNeighbor5197({...args,...edit}),null,
 'source tampering or photo override must suppress estimated details');
const THREE={
 DoubleSide:2,
 BufferGeometry:class{
  setAttribute(k,v){this[k]=v}
  computeVertexNormals(){}
  computeBoundingSphere(){}
 },
 Float32BufferAttribute:class{constructor(array,itemSize){this.array=array;this.itemSize=itemSize}},
 MeshStandardMaterial:class{constructor(options){this.options=options}},
 Mesh:class{constructor(geometry,material){
  this.geometry=geometry;this.material=material;this.userData={};this.visible=true
 }}
};
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const rendered=renderVisnovaResidential5192(THREE,{
 plan,toWorld,baseHeight:100,layer
});
assert(rendered,'render must create 3D geometry from original polygon');
assert.equal(rendered.estimatedWindowsRendered,385);
assert.equal(rendered.longFacadesRendered,8);
assert.equal(rendered.plinthEdgesRendered,14);
assert.equal(rendered.meshCount,4);
assert.equal(rendered.totalTriangles,5418);
assert.equal(rendered.allInScene(),true);
assert.equal(rendered.visibleAfterLOD(),4);
assert.equal(layer.children.length,4);
assert(layer.children.every(m=>m.userData.sourceOSMId==='202399859'));
layer.visible=false;assert.equal(rendered.visibleAfterLOD(),0);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const part of [
 "from './scripts/osm-visnova-neighbor-5197.js?v=519700'",
 'const visnovaNeighborPlan5197=planVisnovaNeighbor5197({',
 'const visnovaNeighborRendered5197=visnovaNeighborPlan5197?',
 'visnovaNeighborRenderCache5197.set(String(osmId)',
 'window.__miloviceVisnovaNeighborRuntime5197=()=>',
 'if(visnovaResidentialRendered5192||visnovaNeighborRendered5197',
 '!visnovaNeighborRendered5197&&!visnovaEightFloorRendered5198&&!visnovaParkingHouseRendered5202&&!slepaUtility',
 'visnovaNeighborRenderCache5197.clear();',
 "'visnova-neighbor-5197':{",
 'href="?v=519700&streetAudit=visnova-neighbor-5197"',
 "const BUILD_ID="
])assert(html.includes(part),'missing in-game rendering: '+part);
console.log('PASS 5.197: 1 existing 11-floor RUIAN home, 385 estimated model windows, 4 meshes, 5418 tris, OSM unchanged');
