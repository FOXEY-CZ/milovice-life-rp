// 5.230 original Sportovní footway graph, 3 untagged paths, 3 actual roads.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SPORTOVNI_FOOTWAY_NETWORK_5230 as C,
 planSportovniFootwayNetwork5230 as plan} from './osm-sportovni-footway-network-5230.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements;
const specs=[C.main,C.northern,C.southern,C.sportovni,C.residential,C.service];
const selected=specs.map(c=>ways.filter(w=>String(w.id)===c.id));
assert(selected.every(a=>a.length===1),'all six mapped OSM ways unique');
const original=JSON.stringify(selected),p=plan('mlada',ways);
assert(p,'GPS and all five original links required');
assert.equal(p.version,'5.230');
assert.deepEqual(p.sourceWayIds,['1037952219','1352859039','1460019771']);
assert.deepEqual(p.sourceHashes,['f4a36b91','bba90a45','8859fb77']);
assert.deepEqual(p.sourceRoadIds,['1331897633','1037952217','1037952218']);
assert.deepEqual(p.sourceRoadHashes,['2aad369b','23bea099','509ff15f']);
assert.equal(p.sourceSegments,13);
assert.equal(p.sourceFootwayMeters,111.298);
assert.equal(p.neutralMaterial,'visnova-footway-model');
assert.equal(p.originalNorthToMainGPS,'50.2300450,14.8697026');
assert.equal(p.originalSouthToMainGPS,'50.2299933,14.8698498');
assert.equal(p.originalSportovniJoinGPS,'50.2303269,14.8692997');
assert.equal(p.originalResidentialJoinGPS,'50.2297501,14.8698445');
assert.equal(p.originalServiceJoinGPS,'50.2299444,14.8700203');
for(const k of ['originalGeometryPreserved','originalSurfaceUnknown','modelVisualOnly',
 'roadJunctionsAreNotMappedCrosswalks'])assert.equal(p[k],true);
assert.equal(p.photoSurfaceVerified,false);
for(const k of ['newFootways','newCrossings','newZebraStripes','newRoads',
 'newColliders','newBuildings','newKerbs','newEntrances','newStreetFurniture','newVehicleRules'])
 assert.equal(p[k],0,k);
const mutate=(id,fn)=>ways.map(w=>String(w.id)===id?fn(w):w);
assert.equal(plan('wrong',ways),null);
assert.equal(plan('mlada',ways.filter(w=>String(w.id)!==C.main.id)),null);
assert.equal(plan('mlada',[...ways,selected[0][0]]),null);
for(const spec of specs){
 assert.equal(plan('mlada',mutate(spec.id,w=>({...w,geometry:w.geometry.map((x,i)=>
  i===1?{...x,lon:x.lon+.0000001}:x)}))),null,'altered GPS '+spec.id);
 assert.equal(plan('mlada',mutate(spec.id,w=>({...w,tags:{...w.tags,surface:'concrete'}}))),
 null,'invented source material '+spec.id);
 assert.equal(plan('mlada',mutate(spec.id,w=>({...w,geometry:[...w.geometry].reverse()}))),
 null,'reversed source '+spec.id);
}
assert.equal(plan('mlada',mutate(C.sportovni.id,w=>({...w,tags:{...w.tags,name:'Lesní'}}))),
 null,'Sportovní street identity locked');
assert.equal(JSON.stringify(selected),original,'source OSM unmodified');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const needle of [
 "from './scripts/osm-sportovni-footway-network-5230.js?v=523000'",
 'const sportovniFootwayPlan5230=planSportovniFootwayNetwork5230(regionId,roadWays);',
 'const sportovniFootwayNeutral5230=sportovniFootwayPlan5230?.neutralFootwayIds.includes(String(el.id));',
 'material:sportovniFootwayPlan5230.neutralMaterial',
 'window.__miloviceSportovniFootwayRuntime5230=()=>',
 'sourceEdgeSafetyAudit.push({',
 "'sportovni-footway-network-5230':{",
 'href="?v=523000&streetAudit=sportovni-footway-network-5230"',
 'window.__miloviceSportovniFootwayAudit5230=null;'
])assert(html.includes(needle),'missing game integration '+needle);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud,'HUD/meta/build sync');
console.log('PASS 5.230: 111.298m / 13 source footway edges, 3 original road joins, 0 fictitious crossings');
