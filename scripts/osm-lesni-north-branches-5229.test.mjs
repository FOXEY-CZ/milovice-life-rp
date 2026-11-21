// 5.229 source GPS, two original untagged footways and crossing joins.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESNI_NORTH_BRANCHES_5229 as C,planLesniNorthBranches5229 as plan}
 from './osm-lesni-north-branches-5229.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const ids=[C.main.id,C.spur.id,C.crossing.id,C.continuation.id];
const selected=ids.map(id=>ways.filter(x=>String(x.id)===id));
assert(selected.every(z=>z.length===1),'four original OSM ways are unique');
const sourceJSON=JSON.stringify(selected);
const p=plan('mlada',ways);
assert(p,'exact source joins and original no-surface tags required');
assert.deepEqual(p.sourceWayIds,['1460019794','1460019793','1057549995','1057549996']);
assert.deepEqual(p.sourceHashes,['e14dd8e8','800597e1','5409dbf7','53198096']);
assert.deepEqual(p.neutralFootwayIds,['1460019794','1460019793']);
assert.equal(p.neutralSourceSegments,4);
assert.equal(p.neutralOriginalMeters,84.236);
assert.equal(p.connectedOriginalSegments,10);
assert.equal(p.connectedOriginalMeters,135.257);
assert.equal(p.neutralMaterial,'visnova-footway-model');
assert.equal(p.spurJoinGPS,'50.2294180,14.8700503');
assert.equal(p.pedestrianCrossingJoinGPS,'50.2292850,14.8700204');
assert.equal(p.crossingSourceId,'1057549995');
assert.equal(p.crossingSourceMarkings,'yes');
assert.equal(p.oldContinuationId,'1057549996');
for(const k of ['originalGPSPreserved','sourceSurfaceUntagged','modelAppearanceOnly',
 'realAppearanceNotPhotoVerified','sourceCrossingRetained'])assert.equal(p[k],true);
for(const k of ['newFootways','newCrossings','newZebras','newRoads','newColliders',
 'newBuildings','newKerbs','newEntrances','newStreetFurniture'])assert.equal(p[k],0);
const edit=(id,fn)=>ways.map(w=>String(w.id)===id?fn(w):w);
assert.equal(plan('elsewhere',ways),null);
assert.equal(plan('mlada',ways.filter(w=>String(w.id)!==ids[0])),null);
assert.equal(plan('mlada',[...ways,selected[1][0]]),null);
for(const id of ids){
 assert.equal(plan('mlada',edit(id,w=>({...w,geometry:w.geometry.map((p,i)=>
  i===0?{...p,lon:p.lon+.0000001}:p)}))),null,'reject moved GPS '+id);
 assert.equal(plan('mlada',edit(id,w=>({...w,tags:{...w.tags,surface:'concrete'}}))),
 null,'reject invented actual surface '+id);
 assert.equal(plan('mlada',edit(id,w=>({...w,geometry:[...w.geometry].reverse()}))),
 null,'reject reversed path '+id);
}
assert.equal(plan('mlada',edit(ids[2],w=>({...w,tags:{...w.tags,'crossing:markings':'zebra'}}))),
 null,'keep source-marked crossing distinct from explicit zebra');
assert.equal(JSON.stringify(selected),sourceJSON);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-lesni-north-branches-5229.js?v=522900'",
 'const lesniNorthPlan5229=planLesniNorthBranches5229(regionId,roadWays);',
 'const lesniNorthNeutral5229=lesniNorthPlan5229?.neutralFootwayIds.includes(String(el.id));',
 'material:lesniNorthPlan5229.neutralMaterial',
 'window.__miloviceLesniNorthRuntime5229=()=>',
 'window.__miloviceLesniNorthAudit5229=null;',
 "'lesni-north-branches-5229':{",
 'href="?v=522900&streetAudit=lesni-north-branches-5229"',
 'sourceEdgeSafetyAudit.push({',
])assert(html.includes(marker),'missing source-controlled game integration: '+marker);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const run=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===run&&run===hud,'meta/JS/HUD build must be synchronized');
console.log('PASS 5.229 original 84.236m/4 source edges, exact 135.257m network and unchanged marked crossing');
