// Milovice RP 5.221 — source-locked, not photographically surveyed.
// Original OSM 53866112, RÚIAN 27246191, seven levels and 69 flats.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_NORTH_BLOCK_5221 as C,
 planVisnovaNorthBlock5221 as plan} from './osm-visnova-north-block-5221.js';
import {renderVisnovaResidential5192 as render}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements.filter(w=>String(w.id)===C.id);
assert.equal(ways.length,1,'unique original source OSM building');
const w=ways[0],original=JSON.stringify(w);
const options={id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,
 modelFloors:7,modelHeight:21.35};
const p=plan(options);
assert(p,'original RÚIAN/OSM seven-storey polygon must be valid');
assert.equal(p.version,'5.192','reuse already verified batch renderer');
assert.equal(p.facadeCompletionVersion,'5.221');
assert.equal(p.sourceOSMId,'53866112');
assert.equal(p.sourceRUIANId,'27246191');
assert.equal(p.sourceHash,'4328a486');
assert.equal(p.sourceNodes,5);
assert.equal(p.sourceReportedFloors,7);
assert.equal(p.sourceReportedFlats,69);
assert.equal(p.modelHeightMeters,21.35);
assert(Math.abs(p.originalAreaSquareMetres-1790.879)<.8);
assert.deepEqual(p.facades.map(f=>f.edgeIndex),[0,1,2,3]);
assert.deepEqual(p.facades.map(f=>f.bays),[12,12,12,12]);
assert.equal(p.estimatedWindows,336);
assert.equal(p.suppressedGenericFacadeEdges,4);
assert.deepEqual(p.sourceGeometry,w.geometry);
for(const key of ['exactWindowPositionsVerified','windowCountsPhotoVerified',
 'facadeShapesPhotoVerified','facadeColorsPhotoVerified'])
 assert.equal(p[key],false,key);
for(const key of ['inventedEntrances','inventedBalconies',
 'newBuildingVolumes','newRoads','newFootways','newColliders',
 'changedRoofForm','changedFloorCounts','changedOriginalOSMWays'])
 assert.equal(p[key],0,key);
for(const [why,change] of [
 ['wrong OSM',{id:'53866113'}],
 ['wrong region',{regionId:'elsewhere'}],
 ['wrong floors',{modelFloors:8}],
 ['wrong height',{modelHeight:24.4}],
 ['photographed',{photoReviewed:true}],
 ['approved model',{approvedArchitecture:true}],
 ['changed RÚIAN',{tags:{...w.tags,'ref:ruian:building':'fake'}}],
 ['changed flats',{tags:{...w.tags,'building:flats':'68'}}],
 ['changed floors tag',{tags:{...w.tags,'building:levels':'8'}}],
 ['changed source date',{tags:{...w.tags,start_date:'2008-03-25'}}],
 ['extra tags',{tags:{...w.tags,roof:'flat'}}],
 ['changed GPS',{geometry:w.geometry.map((p,i)=>
  i===2?{...p,lat:p.lat+.0000001}:p)}],
 ['open polygon',{geometry:w.geometry.slice(0,-1)}],
 ['reversed original polygon',{geometry:[...w.geometry].reverse()}]
])assert.equal(plan({...options,...change}),null,'fail closed: '+why);
class BufferGeometry{
 setAttribute(name,attr){this[name]=attr;}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size;}}
class MeshStandardMaterial{constructor(options){this.options=options;}}
class Mesh{
 constructor(geo,mat){this.geometry=geo;this.material=mat;
  this.visible=true;this.userData={};this.parent=null;}
}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
const layer={children:[],visible:true,add(m){m.parent=this;this.children.push(m);}};
const actual=render(THREE,{plan:p,toWorld,baseHeight:112,layer});
assert(actual,'original source façade should render');
assert.equal(actual.sourceOSMId,'53866112');
assert.equal(actual.sourceRUIANId,'27246191');
assert.equal(actual.sourceReportedFloors,7);
assert.equal(actual.longFacadesRendered,4);
assert.equal(actual.estimatedWindowsRendered,336);
assert.equal(actual.plinthEdgesRendered,4);
assert.equal(actual.meshCount,4);
assert.equal(actual.totalTriangles,4712);
assert.equal(actual.allInScene(),true);
assert.equal(actual.visibleAfterLOD(),4);
assert.equal(actual.addedColliders,0);
assert.equal(actual.addedDoors,0);
assert(layer.children.every(x=>x.userData.estimatedWindows===true&&
 x.userData.lodDetail===false&&x.geometry.position.array.every(Number.isFinite)));
assert.equal(JSON.stringify(w),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-visnova-north-block-5221.js?v=522100'",
 'const visnovaNorthBlockRenderCache5221=new Map();',
 'planVisnovaNorthBlock5221({',
 'visnovaNorthBlockRenderCache5221.set(String(osmId)',
 'visnovaNorthBlockRenderCache5221.clear();',
 'window.__miloviceVisnovaNorthBlockRuntime5221=()=>',
 "'visnova-north-block-5221':{",
 'href="?v=522100&streetAudit=visnova-north-block-5221"'
])assert(html.includes(needle),'game integration missing '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const build=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===build&&build===hud,'all build labels match');
console.log('PASS 5.221 exact RÚIAN 7-floor/69-flat north Višňová block;',
 336,'explicitly MODEL windows, 4 original facade edges, 4 GPU meshes,',
 4712,'triangles; no roof, road, geometry or collision changes');
