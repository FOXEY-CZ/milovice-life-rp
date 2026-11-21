// Milovice RP 5.245: full walking line vs ORIGINAL building polygon edges.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareMappedBuildingFootprints5245 as footprints,
 mappedFootwayAvoidsBuildings5245 as clear}
 from './osm-ambient-building-clearance-5245.js';
import {planMappedAmbientSegments5243 as paths}
 from './osm-mapped-ambient-walkers-5243.js';
import {createRoadClearance} from './road-clearance.js';
import {safePedestrianPieces,isCarriageway} from './reality-walkways.js';
const p=(x,y)=>({x,y});
const rectangle=(id,x0,y0,x1,y1)=>({
 id,tags:{building:'yes'},geometry:[
 {lon:x0,lat:y0},{lon:x1,lat:y0},
 {lon:x1,lat:y1},{lon:x0,lat:y1},{lon:x0,lat:y0}]
});
const toXY=q=>p(q.lon,q.lat);
const building=rectangle('narrow',7,-.8,8,.8);
const prepared=footprints([building],toXY);
assert.equal(prepared.length,1);
assert.equal(prepared[0].id,'narrow');
assert.equal(prepared[0].pts.length,4,'strip only repeated closing coordinate');
assert.equal(clear(p(0,0),p(40,0),prepared),false,
 'both endpoints outside, but full route intersects narrow footprint');
assert.equal(clear(p(0,2),p(40,2),prepared),true,
 'segment well outside building is safe');
assert.equal(clear(p(0,1.02),p(40,1.02),prepared),false,
 'keep at least .35m from wall even without geometric crossing');
assert.equal(clear(p(0,1.4),p(40,1.4),prepared),true);
assert.equal(clear(p(7.5,0),p(40,0),prepared),false,
 'one endpoint inside building must fail');
assert.equal(clear(p(7,-2),p(7,2),prepared),false,
 'route along the building boundary must fail');
assert.equal(clear(p(0,0),p(40,0),prepared,.04),false,
 'unsafe clearance parameter must fail closed');
assert.equal(clear(p(0,0),p(40,0),prepared,Infinity),false);
assert.deepEqual(footprints([{...building,tags:{building:'roof'}}],toXY),[],
 'OSM roof-only shape is not a wall volume');
const original={id:100,tags:{highway:'footway'},
 geometry:[{lat:0,lon:0},{lat:0,lon:40}]};
const clip=(a,b)=>[{a:{x:a.x,z:a.y},b:{x:b.x,z:b.y}}];
const params={ways:[original],buildings:[building],
 regionId:'mlada',widths:new Map([['100',1.8]]),
 toWorld:toXY,clip,carriageway:{isClear:()=>true}};
const old=paths(params);
assert.equal(old.length,1,
 'five sample points miss narrow 1-metre building at 7-8m');
const safeguarded=paths({...params,
 buildingClearance:(a,b)=>clear(a,b,prepared)});
assert.equal(safeguarded.length,0,
 'continuous 5.245 inspection must reject what five samples missed');
const safeRoute=paths({...params,buildings:[],
 buildingClearance:(a,b)=>clear(a,b,[])});
assert.equal(safeRoute.length,1);
assert.equal(safeRoute[0].fullBoundaryClearance5245,true);
assert.equal(paths({...params,buildingClearance:3}).length,0,
 'invalid continuous verifier must fail closed');
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
 buildingClearance:(a,b)=>clear(a,b,buildingsXY)});
assert(routes.length>100,'no regression: sufficient mapped safe walkways');
assert(routes.every(s=>s.fullBoundaryClearance5245===true));
assert(routes.some(s=>s.sourceOSMWayId==='1005977571'));
for(const route of routes){
 assert(clear(route.a,route.b,buildingsXY),
  'entire route must avoid every original building polygon');
 assert.equal(route.roadShoulder,false);
}
assert.equal(readFileSync(new URL('../data/regions/mlada.json',import.meta.url),'utf8'),raw);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const token of [
 "from './scripts/osm-ambient-building-clearance-5245.js?v=524500'",
 "from './scripts/osm-mapped-ambient-walkers-5243.js?v=524500'",
 'prepareMappedBuildingFootprints5245(buildingWays,osmPoint)',
 'buildingClearance:(a,b)=>mappedFootwayAvoidsBuildings5245(',
 'window.__miloviceMappedBuildingClearanceRuntime5245=()=>'
])assert(html.includes(token),'5.245 integration missing '+token);
assert(Number(html.match(/Verze 5[.](\d+)/)?.[1])>=245);
const meta=html.match(/<meta name="milovice-build" content="([^"]+)"/)?.[1];
const id=html.match(/const BUILD_ID='([^']+)'/)?.[1];
const hud=html.split('id="build-label">')[1]?.split('</strong>')[0];
assert(meta&&id&&meta===id&&id===hud);
console.log('PASS 5.245: whole-segment OSM building-edge clearance; '+routes.length+
 ' source routes, narrow buildings cannot be skipped by five samples');
