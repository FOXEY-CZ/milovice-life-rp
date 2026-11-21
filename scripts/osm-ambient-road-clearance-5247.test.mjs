// Milovice RP 5.247: prove EVERY point on mapped NPC footway
// avoids the original modelled OSM carriageway, including tiny crossings.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {safePedestrianPieces,isCarriageway} from './reality-walkways.js';
import {mappedFootwayAvoidsRoads5247 as fullRoad} from './osm-ambient-road-clearance-5247.js';
import {planMappedAmbientSegments5243 as paths} from './osm-mapped-ambient-walkers-5243.js';
import {prepareMappedBuildingFootprints5245 as footprints,
 mappedFootwayAvoidsBuildings5245 as fullBuilding}
 from './osm-ambient-building-clearance-5245.js';
import {planMappedAmbientConnections5246 as connect}
 from './osm-ambient-continuity-5246.js';
const p=(x,y)=>({x,y});
const empty={isClear:()=>true};
assert.equal(fullRoad(p(0,0),p(40,0),empty),true);
assert.equal(fullRoad(p(0,0),p(40,0),null),false);
assert.equal(fullRoad(p(0,0),p(40,0),empty,{resolution:20}),false);
assert.equal(fullRoad(p(0,0),p(40,0),empty,{radius:-1}),false);
assert.equal(fullRoad(p(0,0),p(40,0),empty,{buffer:0}),false);
assert.equal(fullRoad(p(1,1),p(1,1),empty),false);
const narrowRoad=createRoadClearance();
narrowRoad.addRoad({id:'synthetic-crossing',kind:'service',width:.6,
 points:[p(7.5,-2),p(7.5,2)]});
const original=p(0,0),end=p(40,0);
assert([0,.25,.5,.75,1].every(t=>
 narrowRoad.isClear(40*t,0,.25,.08)),
 'old five checks miss narrow roadway at x=7.5');
assert.equal(fullRoad(original,end,narrowRoad),false,
 'new conservative continuous cell guard blocks road in between samples');
assert.equal(fullRoad(p(0,4),p(40,4),narrowRoad),true,
 'unrelated distant footway stays walkable');
const fakeWay={id:77,tags:{highway:'footway'},
 geometry:[{lat:0,lon:0},{lat:0,lon:40}]};
const toXY=q=>p(q.lon,q.lat);
const entire=(a,b)=>[{a:{x:a.x,z:a.y},b:{x:b.x,z:b.y}}];
const inputs={ways:[fakeWay],buildings:[],regionId:'mlada',
 widths:new Map([['77',1.8]]),toWorld:toXY,clip:entire,
 carriageway:narrowRoad,buildingClearance:()=>true};
const old=paths(inputs);
assert.equal(old.length,1,'five-point 5.243 sample incorrectly accepts crossing');
const safeguarded=paths({...inputs,
 roadCorridorClearance:(a,b)=>fullRoad(a,b,narrowRoad)});
assert.equal(safeguarded.length,0,'5.247 planner rejects narrow crossing');
assert.equal(paths({...inputs,roadCorridorClearance:2}).length,0,
 'bad road verifier fails closed');

// Current ORIGINAL Mladá dataset: zero invented geospatial records.
const raw=readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8');
const elements=JSON.parse(raw).elements;
const ways=elements.filter(e=>e.tags?.highway&&e.geometry?.length);
const buildings=elements.filter(e=>e.tags?.building&&e.geometry?.length>=4);
const world=q=>p((q.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 -(q.lat-50.226)*111320);
const road=createRoadClearance(),widths=new Map();
for(const w of ways){
 const k=w.tags.highway,width=k==='primary'?11:k==='secondary'?9:
  k==='tertiary'?8:k==='pedestrian'?4:k==='footway'?1.8:
  k==='path'||k==='steps'?1.65:k==='cycleway'?2:
  k==='service'?4.5:7.8;
 widths.set(String(w.id),width);
 if(isCarriageway(k))road.addRoad({id:w.id,
  points:w.geometry.map(world),width,kind:k});
}
const sourcePolygons=footprints(buildings,world);
assert(sourcePolygons.length>700);
const common={ways,buildings,regionId:'mlada',widths,
 toWorld:world,clip:safePedestrianPieces,carriageway:road,
 buildingClearance:(a,b)=>fullBuilding(a,b,sourcePolygons)};
const prior=paths(common);
const guarded=paths({...common,
 roadCorridorClearance:(a,b)=>fullRoad(a,b,road)});
assert.equal(prior.length,648,'source OSM fixture changed; re-audit routes');
assert.equal(guarded.length,prior.length,
 'do not accidentally erase safe mapped walkways while hardening safety');
assert(guarded.every(s=>s.fullRoadCorridorClearance5247===true));
assert(guarded.every(s=>s.fullBoundaryClearance5245===true));
for(const s of guarded){
 assert(fullRoad(s.a,s.b,road));
 assert.equal(s.roadShoulder,false);
 assert.equal(s.newPavement,0);
}
const connections=connect({segments:guarded,ways,toWorld:world,
 carriageway:road,buildingClearance:(a,b)=>fullBuilding(a,b,sourcePolygons),
 roadCorridorClearance:(a,b)=>fullRoad(a,b,road)});
const joined=[...connections.values()].filter(v=>v.forward).length;
assert.equal(joined,288,'safely connected Mladá junction count preserved');
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-ambient-road-clearance-5247.js?v=524700'",
 "from './scripts/osm-mapped-ambient-walkers-5243.js?v=524700'",
 "from './scripts/osm-ambient-continuity-5246.js?v=524700'",
 'roadCorridorClearance:(a,b)=>mappedFootwayAvoidsRoads5247(',
 'window.__miloviceMappedRoadCorridorRuntime5247=()=>',
])assert(html.includes(token),'missing 5.247 integration '+token);
assert(Number(html.match(/Verze 5[.](\d+)/)?.[1])>=247,
 'Version must not regress below 5.247');
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(id&&id===meta&&meta===hud);
console.log('PASS 5.247: '+guarded.length+
 ' full-carriageway-clear walking fragments and '+joined+
 ' original OSM junctions; synthetic thin vehicle corridor rejected');
