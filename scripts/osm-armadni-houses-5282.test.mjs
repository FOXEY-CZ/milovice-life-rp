import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARMADNI_HOUSES_5282 as C,planArmadniHouses5282 as plan} from './osm-armadni-houses-5282.js';
import {renderVisnovaResidential5192 as render} from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
class BufferGeometry{setAttribute(k,v){this[k]=v;}computeVertexNormals(){}computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(a,s){this.array=a;this.size=s;}}
let matCreated=0;
class MeshStandardMaterial{constructor(x){this.opts=x;matCreated++;}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.visible=true;this.parent=null;}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,DoubleSide:2};
const toWorld=p=>({x:(p.lon-14.857)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.23)*111320});
let windows=0,faces=0,triangles=0,meshes=0;
for(const s of C.buildings){
 const found=elements.filter(w=>String(w.id)===s.id);
 assert.equal(found.length,1,s.house);
 const w=found[0],o={id:w.id,regionId:'mlada',tags:w.tags,
  geometry:w.geometry,modelFloors:4,modelHeight:12.2};
 const p=plan(o);assert(p,'source validation '+s.house);
 assert.equal(p.sourceOSMId,s.id);
 assert.equal(p.sourceRUIANId,s.ruian);
 assert.equal(p.sourceHash,s.hash);
 assert.equal(p.sourceReportedFlats,25);
 assert.equal(p.sourceReportedFloors,4);
 assert(Math.abs(p.originalAreaSquareMetres-s.area)<.85);
 assert.equal(p.estimatedWindows,s.nodes===15?88:92);
 assert.deepEqual(p.facades.map(f=>f.edgeIndex),s.edges.map(f=>f[0]));
 for(const k of ['exactWindowPositionsVerified','windowCountsPhotoVerified',
  'facadeColorsPhotoVerified','balconiesPhotoVerified'])assert.equal(p[k],false);
 for(const k of ['newBuildings','newDoors','newBalconies','newRoofs',
  'newFootways','newRoads','newColliders'])assert.equal(p[k],0);
 const layer={children:[],visible:true,add(m){m.parent=this;this.children.push(m);}};
 const r=render(THREE,{plan:p,toWorld,baseHeight:110,layer});
 assert(r,'render original shell '+s.house);
 assert.equal(r.estimatedWindowsRendered,p.estimatedWindows);
 assert.equal(r.plinthEdgesRendered,s.nodes-1);
 assert.equal(r.longFacadesRendered,s.edges.length);
 assert.equal(r.totalTriangles,14*p.estimatedWindows+2*(s.nodes-1));
 assert.equal(r.meshCount,4);
 assert.equal(r.visibleAfterLOD(),4);
 assert(r.allInScene());
 assert(layer.children.every(m=>m.userData.lodDetail===false&&
  m.geometry.position.array.every(Number.isFinite)));
 windows+=r.estimatedWindowsRendered;faces+=r.longFacadesRendered;
 triangles+=r.totalTriangles;meshes+=r.meshCount;
 for(const changes of [{id:123},{regionId:'centerlink'},
  {photoReviewed:true},{approvedArchitecture:true},{modelFloors:3},
  {modelHeight:18},{tags:{...w.tags,'building:levels':'5'}},
  {tags:{...w.tags,'building:flats':'24'}},
  {tags:{...w.tags,'roof:shape':'flat'}},
  {geometry:w.geometry.map((p,i)=>i===1?{...p,lon:p.lon+.0000001}:p)},
  {geometry:[...w.geometry].reverse()}]){
  assert.equal(plan({...o,...changes}),null,'reject altered source '+s.house);
 }
 for(const region of ['vrutice','westlink'])
  assert(plan({...o,regionId:region}),'source also available in '+region);
}
assert.equal(matCreated,4,'shared mesh materials');
assert.equal(windows,360);
assert.equal(faces,26);
assert.equal(triangles,5136);
assert.equal(meshes,16);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of ["from './scripts/osm-armadni-houses-5282.js?v=528200'",
 'planArmadniHouses5282({','armadniHousesRenderCache5282.set(String(osmId)',
 'armadniHousesRenderCache5282.clear();',
 'window.__miloviceArmadniHousesRuntime5282=()=>',
 "'armadni-houses-east-5282':{","'armadni-houses-west-5282':{",
 'armadniHousesRendered5282||visnovaParkingHouseRendered5202',
 "const BUILD_ID='20261122-armadni-evidence-528300'"])
 assert(html.includes(token),'game integration '+token);
const build=html.match(/meta name="milovice-build" content="([^"]+)"/)?.[1];
assert.equal(build,'20261122-armadni-evidence-528300');
console.log('PASS 5.282 Armádní 886/887/890/891 original RÚIAN 4x25 flats; 360 model windows, 16 meshes and no invented buildings');
