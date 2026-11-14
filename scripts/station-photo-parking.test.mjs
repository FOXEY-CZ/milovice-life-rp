// Milovice RP 5.66 — photograph GPS + mapped carriageway/footways + rail separation.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
import {STATION_PARKING_REFERENCE,planStationPhotoParking} from './station-photo-parking.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

const data=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const ways=data.elements;
const recorded=ways.find(e=>e.id===STATION_PARKING_REFERENCE.osmWayId);
assert.equal(recorded.id,675778842);
assert.equal(recorded.tags.highway,'service');
assert.equal(recorded.tags.oneway,'yes');
assert.equal(STATION_PARKING_REFERENCE.photos.length,2);
assert(STATION_PARKING_REFERENCE.photos.every(x=>x.date==='2024-05-30'&&
 x.url.startsWith('https://commons.wikimedia.org/wiki/File:')));
assert.equal(STATION_PARKING_REFERENCE.author,'ŠJů');
assert.equal(STATION_PARKING_REFERENCE.license,'CC BY 4.0');
assert(STATION_PARKING_REFERENCE.observed.includes('two-sided grass-grid parking bays'));
const occupied=createRoadClearance();
for(const e of ways){
 if(!e.tags?.highway||!e.geometry?.length)continue;
 const kind=e.tags.highway;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:
  kind==='pedestrian'?4:kind==='footway'?1.8:kind==='path'||kind==='steps'?1.65:
  kind==='cycleway'?2:kind==='service'?4.5:7.8;
 occupied.addRoad({id:e.id,points:e.geometry.map(p=>{
  const w=stationGpsToWorld(p);return {x:w.x,z:w.z};
 }),width,kind});
}
const plan=planStationPhotoParking(ways,occupied);
assert(plan,'2024 parking photographs must match the real service aisle');
assert.equal(plan.sourceId,675778842);
assert.equal(plan.sourcePhotos,2);
assert.equal(plan.photoInformed,true);
assert.equal(plan.exactParkingOutlineMeasured,false);
assert(plan.cameras.every(p=>p.distance<3));
assert(plan.bays.length>=16&&plan.bays.length<=28,JSON.stringify({
 bays:plan.bays.length,rejected:plan.rejected
}));
assert.deepEqual([...new Set(plan.bays.map(b=>b.side))].sort(),[-1,1],
 'The photographs show parking bays on BOTH sides of the access aisle');
assert(plan.bays.every(b=>b.osmWayId===675778842&&
 b.along>=10&&b.along<plan.frame.length*.71));
assert.equal(plan.protectedRoadsAndPaths,true);
assert.equal(plan.protectedBuildings,true);
assert.equal(plan.protectedRailways,true);
for(const bay of plan.bays){
 assert(isRoadFreeRect(occupied,{
  x:bay.x,z:bay.z,length:bay.length,depth:bay.depth,yaw:bay.yaw,
  buffer:.08,step:.52
 }), 'Parking pavement may not cross roads or OSM footways');
 assert(Number.isFinite(bay.x)&&Number.isFinite(bay.z));
}
// Reject an unrelated road ID or moved street map, rather than guessing.
assert.equal(planStationPhotoParking([],occupied),null);
assert.equal(planStationPhotoParking(ways.map(e=>e.id===675778842?{
 ...e,tags:{...e.tags,highway:'footway'}
}:e),occupied),null);
assert.equal(planStationPhotoParking(ways.map(e=>e.id===675778842?{
 ...e,geometry:e.geometry.map(p=>({...p,lon:p.lon+.001}))
}:e),occupied),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("from './scripts/station-photo-parking.js?v=5660'"));
assert(game.includes('stationPhotoParking.create(elements)'));
assert(game.includes('stationPhotoParking.reset()'));
assert(game.includes("const BUILD_ID='20261114-photo-station-parking-5660'"));
assert(game.includes("from './scripts/bike-tower-interior.js?v=5640'"),
 'Bike tower 5.64 steelwork must remain');
assert(game.includes("from './scripts/station-forecourt-pass.js?v=5650'"),
 'Bus stop A/B 5.65 must remain');
const code=readFileSync(new URL('./station-photo-parking.js',import.meta.url),'utf8');
assert(code.includes('new THREE.InstancedMesh('));
assert(code.includes('estimatedParkingPolygon=true'));
assert(!code.includes('new THREE.Mesh(new THREE.BoxGeometry('),
 'No 700 separate draw calls for individual cobblestones');
console.log('5.66 Milovice photo parking PASS',JSON.stringify({
 roadId:recorded.id,photoCameras:plan.cameras.map(c=>+c.distance.toFixed(2)),
 bays:plan.bays.length,rejected:plan.rejected.length,
 bySide:Object.fromEntries([-1,1].map(s=>[s,plan.bays.filter(b=>b.side===s).length])),
 drawnPaverCells:plan.bays.length*28,realParkingPolygonSurveyed:false
}));
