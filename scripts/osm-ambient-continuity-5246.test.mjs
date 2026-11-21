// Milovice RP 5.246: same original OSM way, verified vertices, no teleports.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planMappedAmbientConnections5246 as connect,
 advanceMappedAmbientWalker5246 as advance}
 from './osm-ambient-continuity-5246.js';
import {planMappedAmbientSegments5243 as paths}
 from './osm-mapped-ambient-walkers-5243.js';
import {prepareMappedBuildingFootprints5245 as footprints,
 mappedFootwayAvoidsBuildings5245 as clear}
 from './osm-ambient-building-clearance-5245.js';
import {createRoadClearance} from './road-clearance.js';
import {safePedestrianPieces,isCarriageway} from './reality-walkways.js';
import {mappedFootwayAvoidsRoads5247 as roadSafe} from './osm-ambient-road-clearance-5247.js';
const p=(x,y)=>({x,y});
const points=[p(0,0),p(40,0),p(40,25),p(63,25)];
const seg=(index,a,b)=>({kind:'mapped-footway',a,b,
 len:Math.hypot(b.x-a.x,b.y-a.y),sourceOSMWayId:'7',
 sourceEdgeIndex:index,sourceHighway:'footway',regionId:'mlada',
 fullBoundaryClearance5245:true,fullRoadCorridorClearance5247:true,
 clippedFromOriginalRoadSafePiece:true,
 noMappedBuildingOverlap:true,roadShoulder:false});
const first=seg(0,p(1.1,0),p(38.9,0)),
 second=seg(1,p(40,1.1),p(40,23.9)),
 third=seg(2,p(41.1,25),p(61.9,25));
const originalWays=[{id:7,tags:{highway:'footway'},geometry:points}];
const synthetic={segments:[first,second,third],ways:originalWays,
 toWorld:q=>q,carriageway:{isClear:()=>true},
 buildingClearance:()=>true,roadCorridorClearance:()=>true};
const connected=connect(synthetic);
assert.equal(connected.size,3);
assert.equal(connected.get(first).forward.segment,second);
assert.equal(connected.get(second).backward.segment,first);
assert.equal(connected.get(second).forward.segment,third);
const near=advance({segment:first,progress:1,direction:1,
 stepMetres:1.05,connections:connected});
assert.equal(near.segment,first);
const oldPos=p(first.a.x+(first.b.x-first.a.x)*near.progress,0);
assert(Math.abs(oldPos.x-39.95)<1e-5);
const across=advance({segment:near.segment,progress:near.progress,
 direction:1,stepMetres:.1,connections:connected});
assert.equal(across.segment,second);
assert.equal(across.transitioned,true);
const newPos=p(second.a.x+(second.b.x-second.a.x)*across.progress,
 second.a.y+(second.b.y-second.a.y)*across.progress);
assert(Math.abs(newPos.x-40)<1e-5);
assert(Math.abs(newPos.y-.05)<1e-5);
assert(Math.hypot(oldPos.x-newPos.x,oldPos.y-newPos.y)<.11,
 'forward corner does not cut diagonally or teleport');
const reverse=advance({segment:second,progress:0,direction:-1,
 stepMetres:1.15,connections:connected});
assert.equal(reverse.segment,first);
assert(Math.abs(first.a.x+
 (first.b.x-first.a.x)*reverse.progress-39.95)<1e-5);
assert.equal(connect({...synthetic,buildingClearance:()=>false}).size,0);
const roadBlocked=connect({...synthetic,
 carriageway:{isClear:(x,y)=>!(x>39.9&&y<.1)}});
assert.equal(roadBlocked.has(first),false);
assert.equal(roadBlocked.get(second).forward.segment,third);
assert.equal(connect({...synthetic,segments:[
 {...first,fullBoundaryClearance5245:false},second]}).size,0);
assert.equal(connect({...synthetic,segments:[
 {...first,b:p(36.5,0),len:35.4},second]}).size,0);
assert.equal(connect({...synthetic,segments:[first,second,{...second}]}).size,0);
assert.equal(connect({...synthetic,segments:[first,second],
 ways:[{...originalWays[0],id:9}]}).size,0);
assert.equal(advance({segment:first,progress:.2,direction:1,
 stepMetres:-1,connections:connected}),null);
const bounce=advance({segment:third,progress:1,direction:1,
 stepMetres:.1,connections:connected});
assert.equal(bounce.segment,third);
assert.equal(bounce.progress,1);
assert.equal(bounce.direction,-1);

// Original region Mlada, original OSM ways and buildings, not invented data.
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ways=elements.filter(e=>e.tags?.highway&&e.geometry?.length);
const buildings=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4);
const world=q=>p((q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 -(q.lat-50.226)*111320);
const widths=new Map(),road=createRoadClearance();
for(const way of ways){
 const k=way.tags.highway,width=k==='primary'?11:k==='secondary'?9:
 k==='tertiary'?8:k==='pedestrian'?4:k==='footway'?1.8:
 k==='path'||k==='steps'?1.65:k==='cycleway'?2:
 k==='service'?4.5:7.8;
 widths.set(String(way.id),width);
 if(isCarriageway(k))road.addRoad({
  id:way.id,points:way.geometry.map(world),width,kind:k
 });
}
const buildingsXY=footprints(buildings,world);
assert(buildingsXY.length>700,'real regional original buildings loaded');
const routes=paths({ways,buildings,regionId:'mlada',widths,
 toWorld:world,clip:safePedestrianPieces,carriageway:road,
 buildingClearance:(a,b)=>clear(a,b,buildingsXY),
 roadCorridorClearance:(a,b)=>roadSafe(a,b,road)});
assert(routes.length>100,'no regression: sufficient mapped safe walkways');
assert(routes.every(s=>s.fullBoundaryClearance5245===true));
assert(routes.some(s=>s.sourceOSMWayId==='1005977571'));
for(const route of routes){
 assert(clear(route.a,route.b,buildingsXY),
  'entire route must avoid every original building polygon');
 assert.equal(route.roadShoulder,false);
}
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const realLinks=connect({segments:routes,ways,toWorld:world,
 carriageway:road,buildingClearance:(a,b)=>clear(a,b,buildingsXY),
 roadCorridorClearance:(a,b)=>roadSafe(a,b,road)});
assert(realLinks.size>0,'at least one source-verified footway connection in Mlada');
for(const [s,directions] of realLinks){
 assert(s.fullBoundaryClearance5245===true);
 for(const dir of ['forward','backward']){
  const to=directions[dir];
  if(!to)continue;
  assert.equal(to.segment.sourceOSMWayId,s.sourceOSMWayId);
  assert.equal(to.segment.regionId,s.regionId);
  assert(to.distanceToNode>.95&&to.distanceToNode<1.25);
  assert(to.distanceFromNode>.95&&to.distanceFromNode<1.25);
 }
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-ambient-continuity-5246.js?v=524700'",
 'const osmAmbientFootwayLinks5246=new Map();',
 'planMappedAmbientConnections5246({',
 'advanceMappedAmbientWalker5246({',
 'window.__miloviceMappedAmbientContinuityRuntime5246=()=>',
])assert(html.includes(token),'5.246 integration missing '+token);
assert(Number(html.match(/Verze 5[.](\d+)/)?.[1])>=246);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&id&&meta===id&&id===hud);
console.log('PASS 5.246: '+realLinks.size+
 ' source-verified mapped route objects with same-OSM-way junctions, no fabricated sidewalks or teleports');
