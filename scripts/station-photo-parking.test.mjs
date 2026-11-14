// Milovice RP 5.68 — prevent the old green wedge and 25 disconnected strips
// from recurring. Verify original OSM ways, full-stone-rectangle road checks,
// photo-camera correlation, no fake cars, and constant draw-call budget.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance,isRoadFreeRect} from './road-clearance.js';
import {STATION_PARKING_REFERENCE,planStationPhotoParking} from './station-photo-parking.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

const data=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const ways=data.elements;
const west=ways.find(e=>e.id===STATION_PARKING_REFERENCE.westAccessWayId);
const east=ways.find(e=>e.id===STATION_PARKING_REFERENCE.eastStreetWayId);
assert.equal(west?.id,675778842,'Mapped station one-way driveway');
assert.equal(east?.id,128308366,'Mapped eastern Nádražní road');
assert.equal(west.tags.highway,'service');
assert.equal(west.tags.oneway,'yes');
assert.equal(east.tags.highway,'residential');
assert.equal(STATION_PARKING_REFERENCE.photos.length,2);
assert(STATION_PARKING_REFERENCE.photos.every(x=>x.date==='2024-05-30'&&
 x.url.startsWith('https://commons.wikimedia.org/wiki/File:')));
assert(STATION_PARKING_REFERENCE.userReference.includes('2022-05-17'));
assert(STATION_PARKING_REFERENCE.observed.some(x=>x.includes('large pale paved parking island')));
assert.equal(STATION_PARKING_REFERENCE.license,'CC BY 4.0');
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
assert(plan,'The 2022/2024 photographs must still bind to both OSM roads');
assert.deepEqual(plan.sourceIds,[675778842,128308366]);
assert.equal(plan.sourcePhotos,2);
assert.equal(plan.photoInformed,true);
assert.equal(plan.exactParkingOutlineMeasured,false);
assert.equal(plan.groundType,'concrete-paving-island');
assert.equal(plan.legacyDetachedStripsRemoved,true);
assert.equal(plan.originalCarriagewaysUntouched,true);
assert.equal(plan.modelledRoundedNose,true);
assert(plan.cameras.every(p=>p.distance<3));
assert(plan.cells.length>340&&plan.cells.length<1000,
 'A few narrow isolated rows do not fix the missing giant paved island: '+plan.cells.length);
assert(plan.rowStats.filter(r=>r.accepted>0).length>=55,
 'The median must be a continuous length of forecourt, not tiny separated strips');
assert(plan.rowStats.slice(5,16).every(r=>r.accepted>=6),
 'Broad foreground must have several rows of continuous pale paving');
assert(plan.rowStats.at(-1).accepted<=3,
 'Photo-informed far-end taper must narrow to a rounded tip');
assert.equal(plan.protectedRoadsAndPaths,true);
assert.equal(plan.protectedBuildings,true);
assert.equal(plan.protectedRailways,true);
assert.deepEqual(plan.parkingBanks,['central-between-roads','opposite-rail-side'],
 'Both distinct parking banks must remain rendered');
assert(plan.railSideParking.length>=18&&plan.railSideParking.length<=24,
 'The other half of the car park cannot disappear again');
assert(plan.railSidewalk.length>=60,
 'Reserve and build a separate pedestrian band on the rail side');
assert(plan.pedestrianCorridorWidth>=1.5,
 'Minimum intended sidewalk width must not be traded away for parking');
assert(plan.pedestrianSeparation>=.45,
 'The rail-side parking stalls must leave clearance before the sidewalk');
assert.equal(plan.mappedFootwayIdPreserved,1165594426,
 'Existing OSM walkway must be untouched');
assert(plan.railSideParking.every(b=>b.offset<0),
 'The second parking half belongs across the western service lane, not over the central island');
assert(plan.railSidewalk.every(p=>p.offset<0),
 'The sidewalk must be outside the outer parking edge');
for(const bay of plan.railSideParking)
 assert(isRoadFreeRect(occupied,{x:bay.x,z:bay.z,length:bay.length,
  depth:bay.depth,yaw:bay.yaw,buffer:.12,step:.36}),
  'Rail-side parking bays may not occupy any OSM road or footpath');
for(const path of plan.railSidewalk)
 assert(isRoadFreeRect(occupied,{x:path.x,z:path.z,length:path.length,
  depth:path.depth,yaw:path.yaw,buffer:.08,step:.36}),
  'Rail-side pedestrian route must not overlap the OSM roadway');
for(const cell of plan.cells){
 assert(isRoadFreeRect(occupied,{
  x:cell.x,z:cell.z,length:cell.length,depth:cell.depth,yaw:cell.yaw,
  buffer:.025,step:.33
 }), 'Paving tile must never lie over roads/footways');
 assert(Number.isFinite(cell.x)&&Number.isFinite(cell.z));
 assert(cell.offset>2.4,'Paver must be to inside of western driveway');
}
// All changes must fail closed if the bounding OSM ways are unavailable.
assert.equal(planStationPhotoParking([],occupied),null);
assert.equal(planStationPhotoParking(ways.filter(e=>e.id!==128308366),occupied),null);
assert.equal(planStationPhotoParking(ways.map(e=>e.id===675778842?{
 ...e,tags:{...e.tags,highway:'footway'}
}:e),occupied),null);
assert.equal(planStationPhotoParking(ways.map(e=>e.id===675778842?{
 ...e,geometry:e.geometry.map(p=>({...p,lon:p.lon+.001}))
}:e),occupied),null);
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("from './scripts/station-photo-parking.js?v=5680'"));
assert(game.includes('stationPhotoParking.create(elements)'));
assert(game.includes('stationPhotoParking.reset()'));
assert(game.includes("const BUILD_ID='20261114-both-parking-sides-walkway-5680'"));
assert(game.includes("from './scripts/bike-tower-interior.js?v=5640'"));
assert(game.includes("from './scripts/station-forecourt-pass.js?v=5650'"));
const code=readFileSync(new URL('./station-photo-parking.js',import.meta.url),'utf8');
assert(code.includes('new THREE.InstancedMesh('));
assert(code.includes('estimatedParkingPolygon=true'));
assert(!code.includes('new THREE.Mesh(new THREE.BoxGeometry('));
assert(!code.includes('document.createElement'),'No Mapy.com screenshots may become textures');
console.log('5.68 both parking banks and pedestrian corridor regression PASS',JSON.stringify({
 roadIds:plan.sourceIds,photoCameras:plan.cameras.map(c=>+c.distance.toFixed(2)),
 pavingCells:plan.cells.length,coveredRows:plan.rowStats.filter(r=>r.accepted>0).length,
 curbs:plan.curbs.length,rejected:plan.rejected.length,
 oppositeParkingBays:plan.railSideParking.length,
 walkwayTiles:plan.railSidewalk.length,walkwayWidth:plan.pedestrianCorridorWidth,
 bankToWalkwayClearance:plan.pedestrianSeparation,
 nearWidth:+plan.rowStats[8].betweenRoadsMetres.toFixed(1),
 farWidth:+plan.rowStats.at(-1).betweenRoadsMetres.toFixed(1),
 measuredParkingPolygon:false,
 noInventedRoads:true
}));
