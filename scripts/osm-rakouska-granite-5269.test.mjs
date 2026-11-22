import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RAKOUSKA_GRANITE_5269 as S,
 planRakouskaGranite5269 as plan,
 splitRakouskaGranite5269 as split} from './osm-rakouska-granite-5269.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const E=JSON.parse(raw).elements;
const original=JSON.stringify(E);
const p=plan({regionId:'mlada',ways:E});
assert(p);
assert.equal(p.version,'5.269');
assert.deepEqual(p.sourceIDs,['8590288','8590287']);
assert.deepEqual(p.sourceHashes,['7486fd8b','2da4a507']);
assert.equal(p.junctionGPS.lat,50.2244708);
assert.equal(p.junctionGPS.lon,14.8721468);
assert.equal(p.originalRoadEdges,4);
assert.equal(p.patchMetresPerArm,12);
assert.equal(p.totalModelSettMetres,48);
assert.equal(p.exactStoneExtentSurveyed,false);
assert.equal(p.originalOSMHasSurfaceTag,false);
assert(p.councilEvidenceForGraniteAtSite&&p.reusesExistingTexture);
assert(p.originalGPSUnchanged&&p.roadWidthsUnchanged);
assert(p.carriagewayHeightUnchanged&&p.originalNavigationUnchanged);
for(const k of ['newRoads','newFootways','newKerbs','newZebras',
 'newCrossings','newColliders','newMaterials','newTextures'])
 assert.equal(p[k],0,k);
assert.equal(plan({regionId:'old',ways:E}),null);
for(const id of p.sourceIDs){
 assert.equal(plan({regionId:'mlada',ways:E.filter(w=>String(w.id)!==id)}),null);
 const e=E.find(w=>String(w.id)===id);
 assert.equal(e.tags.surface,undefined);
 const changed=E.map(w=>String(w.id)===id?{
  ...w,geometry:w.geometry.map((pt,i)=>
   i===1?{...pt,lon:pt.lon+.000001}:pt)}:w);
 assert.equal(plan({regionId:'mlada',ways:changed}),null);
 const retagged=E.map(w=>String(w.id)===id?{
  ...w,tags:{...w.tags,surface:'asphalt'}}:w);
 assert.equal(plan({regionId:'mlada',ways:retagged}),null);
}
const world=q=>({x:(q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(q.lat-50.226)*111320});
for(const e of p.edges){
 const way=E.find(w=>String(w.id)===e.sourceWayId);
 const a=world(way.geometry[e.edgeEndIndex-1]),
  b=world(way.geometry[e.edgeEndIndex]);
 const original=Math.hypot(b.x-a.x,b.y-a.y);
 const pieces=split({plan:p,wayId:e.sourceWayId,
  edgeEndIndex:e.edgeEndIndex,a,b});
 assert.equal(pieces.length,2);
 assert.equal(pieces.filter(c=>c.granite).length,1);
 assert.deepEqual(pieces[0].a,a);
 assert.deepEqual(pieces[1].b,b);
 assert.deepEqual(pieces[0].b,pieces[1].a);
 const lengths=pieces.map(z=>Math.hypot(z.b.x-z.a.x,z.b.y-z.a.y));
 assert(Math.abs(lengths.reduce((x,y)=>x+y,0)-original)<1e-8);
 assert(Math.abs(lengths[pieces[0].granite?0:1]-12)<1e-8);
 assert.equal(e.graniteAt==='start',pieces[0].granite);
}
assert.equal(split({plan:p,wayId:'8590288',edgeEndIndex:1,a:{x:0,y:0},b:{x:20,y:0}}),null);
assert.equal(split({plan:p,wayId:'8590288',edgeEndIndex:9,
 a:{x:0,y:0},b:{x:5,y:0}}),null);
assert.equal(JSON.stringify(E),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-rakouska-granite-5269.js?v=526900'",
 'planRakouskaGranite5269({',
 'splitRakouskaGranite5269({',
 'window.__miloviceRakouskaGraniteRuntime5269=()=>',
 "'rakouska-granite-5269':{",
 'const BUILD_ID=\'20261122-rakouska-granite-526900\''])
 assert(html.includes(token),'missing actual integration '+token);
console.log('PASS 5.269 official 2025 municipal granite paving + original OSM roads, four estimated 12m visual-only sections, no new road or curb');
