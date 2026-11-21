import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VISNOVA_LAWNS_5200 as S,planVisnovaLawnDetail5200 as plan}
 from './osm-visnova-lawn-detail-5200.js';
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const es=JSON.parse(raw).elements;
const ways=S.polygons.map(c=>es.find(w=>String(w.id)===c.id));
assert(ways.every(Boolean));
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 y:-(p.lat-50.226)*111320
});
const safe={isClear:()=>true};
const args={regionId:'mlada',toWorld,roads:safe,buildings:safe,water:safe};
const original=JSON.stringify(ways);
const full=plan(ways,args);
assert(full,'two untouched real OSM polygons');
assert.deepEqual(full.sourcePolygons,['1460019807','1460019806']);
assert.deepEqual(full.sourceLawnIds,['1460019807','1460019806']);
assert(full.tufts.length>5,'mapped source lawns should yield visible geometry');
assert(full.tufts.length<=220,'strict GPU/LOD budget');
assert(full.tufts.every(t=>Number.isFinite(t.x)&&Number.isFinite(t.z)&&
 t.height>.15&&S.polygons.some(p=>p.id===t.sourceOSMId)));
assert.equal(full.newGrassAreas,0);
assert.equal(full.newRoads,0);
assert.equal(full.newFootways,0);
assert.equal(full.newColliders,0);
assert.equal(full.photoVerifiedIndividualPlants,false);
assert.equal(full.sourcePolygonsUnchanged,true);
assert.deepEqual(plan(ways,{...args,excludedLawnIds:['1460019807','1460019806']}).tufts,[]);
const denied=plan(ways,{...args,roads:{isClear:()=>false}});
assert.equal(denied.tufts.length,0,'never paint blades into a mapped way clearance');
const blockedBuildings=plan(ways,{...args,buildings:{isClear:()=>false}});
assert.equal(blockedBuildings.tufts.length,0);
const blockedWater=plan(ways,{...args,water:{isClear:()=>false}});
assert.equal(blockedWater.tufts.length,0);
for(const edited of [
 ways.slice(1),
 [...ways,ways[0]],
 ways.map((w,i)=>i?{...w,tags:{...w.tags,landuse:'residential'}}:w),
 ways.map((w,i)=>i?{...w,geometry:w.geometry.map((p,j)=>j===3?{...p,lat:p.lat+.0000001}:p)}:w)
])assert.equal(plan(edited,args),null,'changed source must fail closed');
assert.equal(plan(ways,{...args,regionId:'old'}),null);
assert.equal(JSON.stringify(ways),original);
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const marker of [
 "from './scripts/osm-visnova-lawn-detail-5200.js?v=520000'",
 "const visnovaGrassSource5200=[];",
 'visnovaGrassSource5200.push(el);',
 'planVisnovaLawnDetail5200(visnovaGrassSource5200,{',
 'excludedLawnIds:lawnPlan.sourceLawnIds',
 'visnovaTufts5200.map(t=>',
 'window.__miloviceVisnovaLawnRuntime5200=()=>',
 'visnovaGrassSource5200.length=0;',
 'const BUILD_ID='
])assert(html.includes(marker),'missing actual gameplay hook '+marker);
console.log('PASS 5.200: 2 original OSM grass polygons, safely clipped turf, deterministic and deduplicated, no new lawns');
