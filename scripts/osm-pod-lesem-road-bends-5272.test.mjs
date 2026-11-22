import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {POD_LESEM_BENDS_5272 as S,planPodLesemBends5272 as plan}
 from './osm-pod-lesem-road-bends-5272.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements,snapshot=JSON.stringify(E);
const widths=new Map([[S.roadId,6]]);
const opts={regionId:'mlada',ways:E,widths};
const p=plan(opts);
assert(p,'source-locked original connected Pod Lesem and Armadni ways');
assert.equal(p.version,'5.272');
assert.equal(p.sourceRoadId,'128087258');
assert.equal(p.approachRoadId,'83076185');
assert.equal(p.armadniRoadId,'1331897690');
assert.equal(p.roadHash,'6e14ec02');
assert.equal(p.wedgeCount,2);
assert.deepEqual(p.wedges.map(w=>w.sourceVertexIndex),[1,2]);
assert(p.modelWedgeAreaSquareMeters>1.2&&p.modelWedgeAreaSquareMeters<1.5);
const source=E.find(w=>String(w.id)===S.roadId);
const toWorld=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(q.lat-50.226)*111320});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
for(const w of p.wedges){
 const vertex=toWorld(source.geometry[w.sourceVertexIndex]);
 assert(dist(vertex,w.c)<.00001,'original OSM node is unchanged');
 assert(Math.abs(dist(w.a,w.c)-3)<.00001);
 assert(Math.abs(dist(w.b,w.c)-3)<.00001);
 assert(w.areaSquareMeters>.38&&w.areaSquareMeters<1.2);
}
for(const key of ['newRoads','newFootways','newKerbs','newColliders',
 'newMaterials','newCrossingMarks'])assert.equal(p[key],0,key);
assert(p.originalGPSUnchanged&&p.originalTrafficUnchanged&&
 p.originalRoadMaterialUnchanged);
assert.equal(plan({...opts,regionId:'old'}),null);
assert.equal(plan({...opts,widths:new Map([[S.roadId,7]])}),null);
for(const id of [S.roadId,S.approachId,S.armadniId]){
 assert.equal(plan({...opts,ways:E.filter(x=>String(x.id)!==id)}),null);
 assert.equal(plan({...opts,ways:E.map(x=>String(x.id)===id?
  {...x,geometry:x.geometry.map((q,i)=>i===1?
   {...q,lon:q.lon+.0000001}:q)}:x)}),null);
 assert.equal(plan({...opts,ways:E.map(x=>String(x.id)===id?
  {...x,tags:{...x.tags,extra:'not-in-source'}}:x)}),null);
}
assert.equal(plan({...opts,ways:[...E,source]}),null,'reject duplicate road import');
assert.equal(JSON.stringify(E),snapshot);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-pod-lesem-road-bends-5272.js?v=527200'",
 'planPodLesemBends5272({',
 'regionId,ways:roadWays,widths:roadWidths',
 'queueRoadStrip(geo,osmRoadMaterial,midX,midZ);',
 "window.__milovicePodLesemBendsRuntime5272=()=>({",
 "'pod-lesem-bends-5272':{",
 "const BUILD_ID='20261122-pod-lesem-sidewalk-chain-527600'"
])assert(html.includes(token),'missing 5.272 integration '+token);
console.log('PASS 5.272 Pod Lesem source-locked pair of existing asphalt bend seams; no new roads/kerbs/colliders');
