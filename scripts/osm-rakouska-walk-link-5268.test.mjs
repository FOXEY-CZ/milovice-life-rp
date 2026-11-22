// 5.268: REAL OSM walking chain joins Rakouska by original side road;
// inspection guides must never become painted crossings or new kerbs.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planItalskaWalkChain5233} from './osm-italska-walk-chain-5233.js';
import {RAKOUSKA_WALK_LINK_5268 as S,
 planRakouskaWalkLink5268 as plan,
 renderRakouskaWalkLink5268 as draw}
 from './osm-rakouska-walk-link-5268.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements,chain=planItalskaWalkChain5233('mlada',E);
assert(chain);
const args={regionId:'mlada',ways:E,chainPlan:chain},p=plan(args);
assert(p);
assert.equal(p.version,'5.268');
assert.equal(p.mainRoadId,'8590288');
assert.equal(p.sideRoadId,'8590286');
assert.deepEqual(p.crossingIds,['1484073944','1484073946']);
assert.equal(p.originalFootwaySegments,14);
assert.equal(p.originalRoadSegments,2);
assert(p.sourceChainMetres>534.3&&p.sourceChainMetres<534.5);
assert(p.sideRoadMetres>73.0&&p.sideRoadMetres<73.2);
assert(p.originalGPSUnchanged&&p.unmarkedCrossingsPreserved);
assert(p.technicalOnly&&p.noPhysicalOverlayInNormalGame);
assert.equal(p.photoConfirmedKerbs,false);
for(const k of ['newFootways','newKerbs','newZebras','newCrossings',
 'newTrafficChanges','newColliders','newStreetFurniture'])
 assert.equal(p[k],0,k);
const key=x=>x.lat.toFixed(7)+','+x.lon.toFixed(7);
assert.equal(key(p.mapJoinAtCross),key(p.paths[1].geometry[1]));
assert.equal(key(p.paths[0].geometry.at(-1)),key(p.paths[1].geometry[0]));
assert.equal(key(p.paths[1].geometry.at(-1)),key(p.paths[2].geometry[0]));
assert.equal(key(p.paths[2].geometry.at(-1)),key(p.paths[3].geometry[0]));
assert.equal(key(p.paths[3].geometry.at(-1)),key(p.paths[4].geometry[0]));
for(const id of [S.main,S.side,S.crossing,...S.chainIds]){
 const removed=E.filter(w=>String(w.id)!==id);
 assert.equal(plan({...args,ways:removed}),null,'source missing '+id);
 const corrupt=E.map(w=>String(w.id)===id?{
  ...w,geometry:w.geometry.map((q,i)=>i===1?{...q,lon:q.lon+.000001}:q)}:w);
 assert.equal(plan({...args,ways:corrupt}),null,'GPS modified '+id);
}
assert.equal(plan({...args,regionId:'old'}),null);
assert.equal(plan({...args,chainPlan:{...chain,version:'5.232'}}),null);
class BufferGeometry{
 setAttribute(k,v){this.attr=v}
 computeBoundingSphere(){this.bounds=true}
}
class Float32BufferAttribute{constructor(array,size){this.array=array;this.size=size}}
class LineBasicMaterial{constructor(args){this.args=args}}
class LineSegments{constructor(g,m){this.geometry=g;this.material=m;this.userData={};this.parent=null;this.visible=true}}
const THREE={BufferGeometry,Float32BufferAttribute,LineBasicMaterial,LineSegments};
const layer={children:[],add(o){o.parent=this;this.children.push(o)}};
assert.equal(draw(THREE,{plan:p,layer,terrainAt:()=>0}),null,
 'normal gameplay must not draw a guide');
const display=draw(THREE,{plan:p,layer,
 terrainAt:(x,z)=>100+.001*x+.0005*z,inspection:true});
assert(display&&display.inScene());
assert.equal(display.drawMeshes,3);
assert.equal(display.visibleAfterLOD(),3);
assert.deepEqual(display.groups.map(g=>g.sourceSegments),[10,4,2]);
assert(display.geometryFinite);
assert(display.groups[0].sourceMetres>515);
assert(layer.children.every(o=>o.geometry.bounds&&o.userData.lodDetail));
assert(layer.children.every(o=>o.geometry.attr.array.every(Number.isFinite)));
layer.children[0].visible=false;
assert.equal(display.visibleAfterLOD(),2);
assert.equal(JSON.stringify(E),JSON.stringify(JSON.parse(raw).elements));
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const h=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-rakouska-walk-link-5268.js?v=526800'",
 'planRakouskaWalkLink5268({','renderRakouskaWalkLink5268(THREE,{',
 'window.__miloviceRakouskaWalkRuntime5268=()=>',
 "'rakouska-walk-link-5268':{",
 "const BUILD_ID='"])
 assert(h.includes(needle),'missing 5.268 integration: '+needle);
console.log('PASS 5.268 source-locked 534.368m pedestrian chain, 73m residential link and 3 inspection-only guide batches; no road, crossing or kerb invented');
