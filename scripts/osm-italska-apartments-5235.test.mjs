// Milovice RP 5.235: RUIAN-locked 6-floor/3-floor Italska apartments.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_APARTMENTS_5235 as C,
 planItalskaApartments5235 as plan} from './osm-italska-apartments-5235.js';
import {renderVisnovaResidential5192 as render} from './osm-visnova-residential-5192.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const bs=C.buildings.map(c=>E.filter(w=>String(w.id)===c.id));
assert(bs.every(list=>list.length===1),'must find two unique source RUIAN outlines');
const old=JSON.stringify(bs);
class BufferGeometry{setAttribute(n,v){this[n]=v;}
 computeVertexNormals(){} computeBoundingSphere(){}}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size;}}
let materialCreations=0;
class MeshStandardMaterial{constructor(options){this.options=options;materialCreations++;}}
class Mesh{constructor(geo,mat){this.geometry=geo;this.material=mat;this.userData={};
 this.visible=true;this.parent=null;}}
const THREE={BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,Mesh,
 DoubleSide:2};
const toWorld=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320});
let windows=0,faces=0,triangles=0;
let firstMaterials=null;
for(let i=0;i<bs.length;i++){
 const w=bs[i][0],spec=C.buildings[i],
  opts={id:w.id,regionId:'mlada',tags:w.tags,geometry:w.geometry,
   modelFloors:spec.levels,modelHeight:spec.levels*3.05};
 const p=plan(opts);
 assert(p,'source validation '+spec.id);
 assert.equal(p.version,'5.192');
 assert.equal(p.sourceFacadeVersion,'5.235');
 assert.equal(p.sourceOSMId,spec.id);
 assert.equal(p.sourceRUIANId,spec.ruian);
 assert.equal(p.sourceHash,spec.hash);
 assert.equal(p.sourceNodes,spec.nodes);
 assert.equal(p.sourceReportedFloors,spec.levels);
 assert.equal(p.sourceReportedFlats,spec.flats);
 assert(Math.abs(p.originalAreaSquareMetres-spec.area)<.8);
 assert.deepEqual(p.sourceGeometry,w.geometry);
 assert.deepEqual(p.facades.map(f=>f.edgeIndex),spec.facades.map(f=>f[0]));
 const modelWindows=i===0?198:90;
 assert.equal(p.estimatedWindows,modelWindows);
 assert.equal(p.suppressedGenericFacadeEdges,spec.nodes-1);
 for(const key of ['existingBuildingShellPreserved','sourceGeometryUnchanged'])
  assert.equal(p[key],true,key);
 for(const key of ['exactWindowLocationsVerified','exactWindowCountVerified',
  'actualMaterialsPhotoVerified','entrancesPhotographed'])
  assert.equal(p[key],false,key);
 for(const key of ['inventedEntrances','inventedBalconies',
  'newBuildingVolumes','newRoofs','newColliders','newRoads','newFootways'])
  assert.equal(p[key],0,key);
 const layer={children:[],visible:true,add(obj){obj.parent=this;this.children.push(obj);}};
 const r=render(THREE,{plan:p,toWorld,baseHeight:112,layer});
 assert(r,'existing batching/geometry renderer accepts both original polygons');
 assert.equal(r.sourceOSMId,spec.id);
 assert.equal(r.sourceReportedFloors,spec.levels);
 assert.equal(r.estimatedWindowsRendered,modelWindows);
 assert.equal(r.longFacadesRendered,spec.facades.length);
 assert.equal(r.plinthEdgesRendered,spec.nodes-1);
 assert.equal(r.meshCount,4);
 const currentMaterials=layer.children.map(m=>m.material);
 assert.equal(new Set(currentMaterials).size,4,'four distinct facade material types');
 if(firstMaterials){
  assert.deepEqual(currentMaterials,firstMaterials,
   'all houses share the same four material instances');
 }else firstMaterials=currentMaterials;
 assert.equal(materialCreations,4,'no duplicate material allocation across houses');
 assert.equal(r.totalTriangles,14*modelWindows+2*(spec.nodes-1));
 // Exterior-facing frame offsets: reversing the same closed polygon must
 // still place glazing/frames outside, never through the existing walls.
 const outside=(mesh,edgeA,edgeB)=>{
  const xyz=mesh.geometry.position.array;
  const p={x:xyz[0],y:xyz[2]};
  const dx=edgeB.x-edgeA.x,dz=edgeB.y-edgeA.y;
  const signed=(p.x-edgeA.x)*dz-(p.y-edgeA.y)*dx;
  const polygonArea=w.geometry.slice(0,-1).reduce((sum,g,j)=>{
   const q=w.geometry[j+1],a=toWorld(g),b=toWorld(q);
   return sum+a.x*b.y-a.y*b.x;
  },0);
  return signed*Math.sign(polygonArea)>0;
 };
 const firstPlinth=layer.children[3];
 const sideA=toWorld(w.geometry[0]),sideB=toWorld(w.geometry[1]);
 assert(outside(firstPlinth,sideA,sideB),
  'plinth must offset outside original polygon '+spec.id);
 const reversedPlan={...p,sourceGeometry:[...p.sourceGeometry].reverse(),
  facades:p.facades.map(f=>({...f,
   edgeIndex:p.sourceGeometry.length-2-f.edgeIndex}))};
 const reverseLayer={children:[],visible:true,add(m){m.parent=this;this.children.push(m);}};
 const reverseRender=render(THREE,{plan:reversedPlan,toWorld,baseHeight:112,
  layer:reverseLayer});
 assert(reverseRender,'reversed winding must render');
 assert.equal(reverseRender.estimatedWindowsRendered,modelWindows);
 assert.deepEqual(reverseLayer.children.map(m=>m.material),currentMaterials);
 assert.equal(materialCreations,4);
 const reverseStart=toWorld(reversedPlan.sourceGeometry[0]);
 const reverseNext=toWorld(reversedPlan.sourceGeometry[1]);
 const reverseFirst=reverseLayer.children[3].geometry.position.array;
 const reverseCross=(reverseFirst[0]-reverseStart.x)*
  (reverseNext.y-reverseStart.y)-
  (reverseFirst[2]-reverseStart.y)*(reverseNext.x-reverseStart.x);
 const firstCross=(firstPlinth.geometry.position.array[0]-sideA.x)*
  (sideB.y-sideA.y)-
  (firstPlinth.geometry.position.array[2]-sideA.y)*(sideB.x-sideA.x);
 assert(firstCross*reverseCross<0,
  'outward offset must flip consistently with polygon winding');
 assert(r.allInScene());
 assert.equal(r.visibleAfterLOD(),4);
 assert(layer.children.every(m=>m.userData.estimatedWindows&&
  m.userData.lodDetail===false&&
  m.geometry.position.array.every(Number.isFinite)));
 windows+=r.estimatedWindowsRendered;
 faces+=r.longFacadesRendered;
 triangles+=r.totalTriangles;
 for(const [why,changes] of [
  ['wrong id',{id:123}],
  ['wrong region',{regionId:'old'}],
  ['photo reviewed',{photoReviewed:true}],
  ['manual architecture',{approvedArchitecture:true}],
  ['wrong floor count',{modelFloors:spec.levels+1}],
  ['wrong floor height',{modelHeight:99}],
  ['wrong ruian',{tags:{...w.tags,'ref:ruian:building':'1'}}],
  ['wrong flats',{tags:{...w.tags,'building:flats':'1'}}],
  ['different source type',{tags:{...w.tags,building:'yes'}}],
  ['wrong date',{tags:{...w.tags,start_date:'1999-01-01'}}],
  ['extra tag',{tags:{...w.tags,'roof:shape':'hip'}}],
  ['GPS changed',{geometry:w.geometry.map((v,j)=>j===1?
   {...v,lon:v.lon+.0000001}:v)}],
  ['missing GPS node',{geometry:w.geometry.slice(0,-1)}],
  ['reversed coords',{geometry:[...w.geometry].reverse()}]
 ])assert.equal(plan({...opts,...changes}),null,why+' '+spec.id);
}
assert.equal(windows,288);
assert.equal(faces,11);
assert.equal(triangles,288*14+2*(24+18));
assert.equal(JSON.stringify(bs),old);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-italska-apartments-5235.js?v=523500'",
 'const italskaApartmentsRenderCache5235=new Map();',
 'planItalskaApartments5235({',
 'italskaApartmentsRenderCache5235.set(String(osmId)',
 'italskaApartmentsRenderCache5235.clear();',
 'window.__miloviceItalskaApartmentsRuntime5235=()=>',
 'if(visnovaResidentialRendered5192||visnovaNeighborRendered5197||',
 "'italska-apartments-six-5235':{",
 "'italska-apartments-three-5235':{",
 'href="?v=523500&streetAudit=italska-apartments-six-5235"',
 'href="?v=523500&streetAudit=italska-apartments-three-5235"'
])assert(html.includes(token),'missing actual game integration '+token);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud);
assert(html.includes('Verze 5.235'));
console.log('PASS 5.235 original Italska two RUIAN block shells, '+windows+
 ' explicitly unverified model windows / '+triangles+' triangles, no new building volumes');
