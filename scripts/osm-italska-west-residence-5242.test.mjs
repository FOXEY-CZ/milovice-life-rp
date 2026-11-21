// Milovice RP 5.242: original 2-floor / 10-flat source-locked residence.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_WEST_RESIDENCE_5242 as C,
 planItalskaWestResidence5242 as plan}
 from './osm-italska-west-residence-5242.js';
import {renderVisnovaResidential5192 as render}
 from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const match=JSON.parse(raw).elements.filter(e=>String(e.id)===C.id);
assert.equal(match.length,1,'original building exists exactly once');
const building=match[0],args={
 id:building.id,regionId:'mlada',tags:building.tags,
 geometry:building.geometry,modelFloors:2,modelHeight:6.1
};
const p=plan(args);
assert(p,'original OSM footprint and complete tags must pass');
assert.equal(p.sourceHash,'a07f4ddc');
assert.equal(p.sourceNodes,13);
assert.equal(p.sourceReportedFloors,2);
assert.equal(p.sourceReportedFlats,10);
assert.equal(p.sourceRUIANId,'25610473');
assert.equal(p.estimatedWindows,32);
assert.deepEqual(p.facades.map(f=>f.edgeIndex),[1,7]);
assert.equal(p.suppressedGenericFacadeEdges,12);
assert.equal(p.exactWindowsPhotoVerified,false);
assert.equal(p.originalWallGeometryUnchanged,true);
for(const key of [
 'inventedEntrances','inventedBalconies','newRoofs',
 'newBuildingVolumes','newColliders','newRoads','newFootways'
])assert.equal(p[key],0,key);
class BufferGeometry {
 setAttribute(n,v){this[n]=v}
 computeVertexNormals(){}
 computeBoundingSphere(){}
}
class Float32BufferAttribute {
 constructor(array,size){this.array=array;this.size=size}
}
let allocations=0;
class MeshStandardMaterial{
 constructor(options){this.options=options;allocations++}
}
class Mesh{
 constructor(geometry,material){this.geometry=geometry;
  this.material=material;this.visible=true;this.userData={}}
}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,
 Mesh,DoubleSide:2};
const toWorld=q=>({
 x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320
});
const layer={visible:true,children:[],add(m){m.parent=this;this.children.push(m)}};
const r=render(THREE,{plan:p,toWorld,baseHeight:120,layer});
assert(r,'render on original wall');
assert.equal(r.estimatedWindowsRendered,32);
assert.equal(r.longFacadesRendered,2);
assert.equal(r.plinthEdgesRendered,12);
assert.equal(r.meshCount,4);
assert.equal(r.totalTriangles,32*14+2*12);
assert.equal(allocations,4);
assert.equal(r.visibleAfterLOD(),4);
assert(r.allInScene());
assert(layer.children.every(m=>m.geometry.position.array.every(Number.isFinite)));
for(const update of [
 {id:'0'},{regionId:'old'},{photoReviewed:true},{approvedArchitecture:true},
 {modelFloors:3},{modelHeight:9.15},
 {tags:{...building.tags,'building:levels':'3'}},
 {tags:{...building.tags,'building:flats':'11'}},
 {tags:{...building.tags,'ref:ruian:building':'0'}},
 {tags:{...building.tags,start_date:'2000-01-01'}},
 {tags:{...building.tags,'building:colour':'white'}},
 {geometry:building.geometry.map((pt,i)=>i===1?{...pt,lon:pt.lon+.0000001}:pt)},
 {geometry:building.geometry.slice(0,-1)},
 {geometry:[...building.geometry].reverse()}
])assert.equal(plan({...args,...update}),null,
 'changed source/approved architecture must reject model');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-west-residence-5242.js?v=524200'",
 'const italskaWestResidenceRenderCache5242=new Map();',
 'window.__miloviceItalskaWestResidenceRuntime5242=()=>',
 'const italskaWestResidencePlan5242=planItalskaWestResidence5242({',
 'italskaWestResidenceRenderCache5242.set(String(osmId)',
 'italskaWestResidenceRenderCache5242.clear();',
 'italskaWestResidenceRendered5242||visnovaParkingHouseRendered5202',
 "'italska-west-residence-5242':{",
 'href="?v=524200&streetAudit=italska-west-residence-5242"'
])assert(html.includes(token),'missing actual game integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&runtime&&meta===runtime&&runtime===hud);
assert(Number(html.match(/Verze 5[.]([0-9]+)/)?.[1])>=242);
console.log('PASS 5.242 original 2-floor 10-flat residence; 32 model windows, zero new infrastructure');
