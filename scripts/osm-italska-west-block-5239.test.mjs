// Milovice 5.239 — source-locked 2-storey residential block near Italska.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_WEST_BLOCK_5239 as C,planItalskaWestBlock5239 as plan}
 from './osm-italska-west-block-5239.js';
import {renderVisnovaResidential5192 as render}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const matching=JSON.parse(raw).elements.filter(e=>String(e.id)===C.id);
assert.equal(matching.length,1,'original RUIAN outline must exist exactly once');
const building=matching[0];
const args={id:building.id,regionId:'mlada',tags:building.tags,
 geometry:building.geometry,modelFloors:2,modelHeight:6.10};
const p=plan(args);
assert(p,'must accept unchanged original outline and tags');
assert.equal(p.sourceHash,'f43298dc');
assert.equal(p.sourceNodes,17);
assert.equal(p.sourceReportedFloors,2);
assert.equal(p.sourceReportedFlats,38);
assert.equal(p.estimatedWindows,68);
assert.deepEqual(p.facades.map(f=>f.edgeIndex),[1,5,9,11,15]);
assert.equal(p.suppressedGenericFacadeEdges,16);
assert.equal(p.exactWindowsPhotoVerified,false);
assert.equal(p.sourceGeometryUnchanged,true);
for(const key of ['inventedEntrances','inventedBalconies',
 'newRoofs','newBuildingVolumes','newColliders','newRoads','newFootways'])
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
const toWorld=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320});
const layer={children:[],visible:true,add(m){m.parent=this;this.children.push(m)}};
const r=render(THREE,{plan:p,toWorld,baseHeight:120,layer});
assert(r,'must render original two-storey building');
assert.equal(r.estimatedWindowsRendered,68);
assert.equal(r.longFacadesRendered,5);
assert.equal(r.plinthEdgesRendered,16);
assert.equal(r.meshCount,4);
assert.equal(r.totalTriangles,68*14+2*16);
assert.equal(r.visibleAfterLOD(),4);
assert(layer.children.every(m=>m.geometry.position.array.every(Number.isFinite)));
for(const change of [
 {id:'0'},{regionId:'old'},{photoReviewed:true},
 {approvedArchitecture:true},{modelFloors:3},{modelHeight:9.15},
 {tags:{...building.tags,'building:levels':'3'}},
 {tags:{...building.tags,'building:flats':'39'}},
 {tags:{...building.tags,'ref:ruian:building':'0'}},
 {geometry:building.geometry.map((pt,i)=>i===1?{...pt,lon:pt.lon+.0000001}:pt)},
 {geometry:building.geometry.slice(0,-1)},
 {geometry:[...building.geometry].reverse()}
])assert.equal(plan({...args,...change}),null,
 'reject changed source or manual architecture');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-west-block-5239.js?v=523900'",
 'const italskaWestBlockRenderCache5239=new Map();',
 'const italskaWestBlockPlan5239=planItalskaWestBlock5239({',
 'italskaWestBlockRenderCache5239.set(String(osmId)',
 'italskaWestBlockRenderCache5239.clear();',
 'italskaWestBlockRendered5239||',
 'italskaWestResidenceRendered5242||',
 'visnovaParkingHouseRendered5202',
 'window.__miloviceItalskaWestBlockRuntime5239=()=>',
 "'italska-west-block-5239':{",
 'href="?v=523900&streetAudit=italska-west-block-5239"'
])assert(html.includes(token),'missing in-game integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud);
assert(Number(html.match(/Verze 5[.]([0-9]+)/)?.[1])>=239,
 'future game versions must keep the original 5.239 facade');
console.log('PASS 5.239: RUIAN 2-floor / 38 flats original shell, 68 unsurveyed model windows, zero new roads/volumes');
