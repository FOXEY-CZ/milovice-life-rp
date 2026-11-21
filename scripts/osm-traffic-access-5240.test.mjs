// Milovice RP 5.240 — ambient NPC routing respects original OSM restrictions.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ITALSKA_EMERGENCY_ACCESS_5240 as C,
 inspectItalskaEmergencyAccess5240 as inspect,
 classifyPublicNpcRoad5240 as classify} from './osm-traffic-access-5240.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements.filter(w=>String(w.id)===C.id);
assert.equal(ways.length,1,'one original Italska fire access road');
const way=ways[0],verified=inspect(way);
assert(verified,'accept only original 9 GPS points and OSM access tags');
assert.equal(verified.sourceHash,'01f91763');
assert.equal(verified.sourceNodes,9);
assert.equal(verified.sourceLengthMetres,86.464);
assert.equal(verified.newRoads,0);
assert.equal(verified.newColliders,0);
assert.equal(verified.geometryChanged,false);
for(const changed of [
 {...way,id:0},
 {...way,tags:{...way.tags,motor_vehicle:'yes'}},
 {...way,tags:{...way.tags,service:'driveway'}},
 {...way,tags:{...way.tags,emergency:'no'}},
 {...way,tags:{...way.tags,surface:'gravel'}},
 {...way,tags:{...way.tags,extra:'a'}},
 {...way,geometry:way.geometry.slice(1)},
 {...way,geometry:way.geometry.map((p,i)=>i===2?{...p,lon:p.lon+.0000001}:p)}
])assert.equal(inspect(changed),null,'must reject modified source');
assert.equal(classify({osmId:C.id,kind:'service'}).allowed,false,
 'the original fire lane must stay blocked even if metadata is missing');
assert.equal(classify({...way,osmId:way.id}).allowed,false);
for(const [prop,value] of [
 ['motorVehicle','no'],['motorVehicle','permit'],
 ['motorVehicle','destination'],['motorVehicle','private'],
 ['vehicleAccess','destination'],['access','no'],['access','private'],
 ['access','permit'],['serviceTag','emergency_access']
 ]){
 const rule=classify({osmId:123,kind:'service',[prop]:value});
 assert.equal(rule.allowed,false,prop+' '+value);
}
assert.equal(classify({osmId:21,kind:'residential',access:'yes'}).allowed,true);
assert.equal(classify({osmId:22,kind:'living_street',motorVehicle:'yes'}).allowed,true);
assert.equal(classify({osmId:23,kind:'service',serviceTag:'driveway'}).allowed,true,
 'no invented restrictions on untagged driveways');
assert.equal(classify({osmId:24,kind:'service',tags:{motor_vehicle:'no'}}).allowed,false);
assert.equal(classify({osmId:25,kind:'service',access:'yes',motorVehicle:'no'}).allowed,false);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-traffic-access-5240.js?v=524000'",
 'sourceVerifiedEmergency5240:Boolean(inspectItalskaEmergencyAccess5240(el))',
 'const rule=classifyPublicNpcRoad5240(road);',
 'if(!rule.allowed){',
 'window.__miloviceTrafficAccessRuntime5240=()=>',
 "Verze 5.240"
])assert(html.includes(token),'missing in-game routing integration '+token);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
console.log('PASS 5.240: original Italska fire road retained, public NPC cars excluded from restricted OSM roads');
