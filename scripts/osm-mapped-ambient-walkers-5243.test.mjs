// Milovice RP 5.243 — generic NPC walkers must use mapped, road-clipped ways.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {canUseMappedAmbientWay5243 as eligible,
 planMappedAmbientSegments5243 as plan} from './osm-mapped-ambient-walkers-5243.js';
import {createRoadClearance} from './road-clearance.js';
import {safePedestrianPieces,isCarriageway} from './reality-walkways.js';
const p=(x,y)=>({x,y});
const way=(id,tags,geometry)=>({id,tags,geometry});
const geo=[{lat:50.228,lon:14.874},{lat:50.2282,lon:14.874}];
const projection=q=>p((q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 -(q.lat-50.226)*111320);
const free={isClear:()=>true};
const fullClip=(a,b)=>[{a:{x:a.x,z:a.y},b:{x:b.x,z:b.y}}];
const synthetic=plan({ways:[way(11,{highway:'footway'},geo)],
 regionId:'mlada',widths:new Map([['11',1.8]]),
 toWorld:projection,clip:fullClip,carriageway:free});
assert.equal(synthetic.length,1);
assert.equal(synthetic[0].kind,'mapped-footway');
assert.equal(synthetic[0].regionId,'mlada');
assert.equal(synthetic[0].sourceOSMWayId,'11');
assert.equal(synthetic[0].width,0,'the walker must never offset from mapped path');
assert.equal(synthetic[0].roadShoulder,false);
assert(synthetic[0].len>19);
for(const tags of [
 {highway:'service'},{highway:'residential'},
 {highway:'footway',footway:'crossing'},
 {highway:'footway',crossing:'unmarked'},
 {highway:'footway',access:'private'},
 {highway:'footway',foot:'no'},
 {highway:'footway',foot:'permit'},
 {highway:'footway',motor_vehicle:'destination'},
 {highway:'path',vehicle:'yes'},
 {highway:'path',tunnel:'yes'},
 {highway:'path',bridge:'yes'},
 {highway:'path',indoor:'yes'},
 {highway:'path',covered:'yes'}
])assert.equal(eligible(tags),false,'disallow questionable pedestrian way '+JSON.stringify(tags));
assert.equal(eligible({highway:'footway',foot:'designated'}),true);
assert.equal(eligible({highway:'path',motor_vehicle:'no'}),true);
assert.equal(plan({ways:[],regionId:'mlada',widths:new Map(),
 toWorld:projection,clip:fullClip,carriageway:free}).length,0);
assert.equal(plan({ways:[way(11,{highway:'footway'},geo)],
 regionId:'mlada',widths:new Map([['11',1.8]]),
 toWorld:projection,clip:()=>[],carriageway:free}).length,0);
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const ways=JSON.parse(raw).elements.filter(e=>e.tags?.highway&&e.geometry?.length);
const widths=new Map();
const carriageway=createRoadClearance();
for(const w of ways){
 const kind=w.tags.highway;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
 kind==='pedestrian'?4:kind==='footway'?1.8:kind==='path'?1.65:
 kind==='steps'?1.65:kind==='cycleway'?2:kind==='service'?4.5:7.8;
 widths.set(String(w.id),width);
 if(isCarriageway(kind))
  carriageway.addRoad({id:w.id,points:w.geometry.map(projection),width,kind});
}
const candidates=plan({ways,regionId:'mlada',widths,
 toWorld:projection,clip:safePedestrianPieces,carriageway});
assert(candidates.length>100,'original Mlada OSM should provide ample safe walking routes');
const ids=new Set(candidates.map(c=>c.sourceOSMWayId));
assert(ids.has('1005977571'),'original Italska sidewalk must be one mapped candidate');
const origins=new Map(ways.map(w=>[String(w.id),w]));
for(const segment of candidates){
 const origin=origins.get(segment.sourceOSMWayId);
 assert(origin&&eligible(origin.tags),'every walker derives from original allowed OSM footway');
 assert.equal(segment.roadShoulder,false);
 assert.equal(segment.width,0);
 assert(segment.len>=9.5&&Number.isFinite(segment.len));
 for(const t of [0,.25,.5,.75,1]){
  const x=segment.a.x+(segment.b.x-segment.a.x)*t;
  const z=segment.a.y+(segment.b.y-segment.a.y)*t;
  assert(carriageway.isClear(x,z,.25,.08),
   'all planned pedestrian sample points must clear real OSM carriageways');
 }
}
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-mapped-ambient-walkers-5243.js?v=524300'",
 'const osmAmbientPedestrianSegments5243=[];',
 'osmAmbientPedestrianSegments5243.push(...planMappedAmbientSegments5243({',
 'osmAmbientPedestrianSegments5243.length=0;',
 "rpSpawnMappedAmbientWalkers5243('old',30);",
 'rpSpawnMappedAmbientWalkers5243(area.id,8,center);',
 'window.__miloviceMappedAmbientWalkersRuntime5243=()=>',
 'mappedAmbient5243:true,mappedOSMWayId5243:seg.sourceOSMWayId'
])assert(html.includes(token),'missing 5.243 in-game integration '+token);
assert(!html.includes('const seg=segments[(i*23+7)%segments.length]'),
 'old generic pedestrian shoulder-spawner must be gone');
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const runtime=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&meta===runtime&&runtime===hud);
assert(Number(html.match(/Verze 5[.]([0-9]+)/)?.[1])>=243);
console.log('PASS 5.243 ambient pedestrians: '+candidates.length+
 ' source-clipped original Mlada segments, zero invented paths, no road-shoulder walkers');
