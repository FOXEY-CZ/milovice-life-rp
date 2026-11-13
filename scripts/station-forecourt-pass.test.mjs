import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {STATION_FORECOURT_SOURCE,STATION_STOP_PHOTOS,stationGpsToWorld,wayCentre,planStationForecourt} from './station-forecourt-pass.js';
const osm=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',import.meta.url),'utf8'));
const way=osm.elements.find(e=>e.id===53865956);
const bike=osm.elements.find(e=>e.id===1011197691);
assert.equal(STATION_FORECOURT_SOURCE.stationId,'53865956');
assert.equal(STATION_FORECOURT_SOURCE.bikeTowerId,'1011197691');
assert(way?.tags.building==='train_station');
assert(bike?.tags.name==='Cyklověž Milovice');
assert(STATION_FORECOURT_SOURCE.photo.includes('commons.wikimedia.org'));
assert.equal(STATION_FORECOURT_SOURCE.license,'CC BY 4.0');
assert.equal(STATION_FORECOURT_SOURCE.camera.lat,50.2289419);
assert.equal(STATION_FORECOURT_SOURCE.camera.lon,14.8823244);
assert(STATION_FORECOURT_SOURCE.observed.some(x=>x.includes('luminaire')));
assert(STATION_FORECOURT_SOURCE.precision.includes('approximate'));
const st=wayCentre(way),tower=wayCentre(bike),cam=stationGpsToWorld(STATION_FORECOURT_SOURCE.camera);
assert(Math.hypot(st.x-tower.x,st.z-tower.z)>15);
assert(Math.hypot(st.x-cam.x,st.z-cam.z)<45);
const clearance=createRoadClearance();
for(const el of osm.elements){
 if(!el.tags?.highway||!el.geometry?.length)continue;
 const kind=el.tags.highway;
 const width=kind==='primary'?11:kind==='secondary'?9:kind==='tertiary'?8:kind==='pedestrian'?4:
  kind==='footway'?1.8:kind==='path'?1.65:kind==='service'?4.5:7.8;
 clearance.addRoad({id:el.id,points:el.geometry.map(p=>{
  const {x,z}=stationGpsToWorld(p);return {x,y:z};
 }),width,kind});
}
const plan=planStationForecourt(osm.elements,clearance);
assert(plan,'Station and bike tower geometry must anchor the public forecourt scene');
assert.equal(plan.strictReality,true);
assert.equal(plan.accepted.length,2,JSON.stringify(plan));
assert.deepEqual(plan.accepted.map(p=>p.id),['bus-A','bus-B'],
 'Only separately geotagged 2024 stops may be added in strict mode');
assert.deepEqual(plan.deferred,['broadleaf','twin-lamp','flowerbed'],
 'Do not build foliage/lamps from invented station-centre offsets');
const names=plan.accepted.map(p=>p.id);
assert.equal(STATION_STOP_PHOTOS.length,2);
const A=plan.accepted.find(p=>p.id==='bus-A'),B=plan.accepted.find(p=>p.id==='bus-B');
assert.equal(A.street,'Nádražní');
assert.equal(B.street,'5. května');
assert.equal(STATION_STOP_PHOTOS[0].lat,50.2290750);
assert.equal(STATION_STOP_PHOTOS[1].lat,50.2288290);
assert(A.cameraDisplacement<=6&&B.cameraDisplacement<=6,
 'A/B pole positions cannot be inferred farther than 6m from photograph GPS');
assert(B.x>A.x+18&&B.z>A.z+12,
 'PID interchange map: B is southeast of A, on 5. května');
assert(Math.hypot(B.x-A.x,B.z-A.z)>25,
 'The two distinct bus stop stands cannot share the same station forecourt');
for(const p of plan.accepted){
 assert(clearance.isClear(p.x,p.z,p.radius,p.buffer),
  'Station furniture '+p.id+' crosses mapped carriageway or footway');
 assert(p.buildingClearance>p.radius+.7,
  'Station furniture '+p.id+' intersects a station building');
 assert(p.roadClearance>p.radius+p.buffer,
  'Station furniture '+p.id+' collides with public road');
}
assert.equal(planStationForecourt([],clearance),null);
console.log('5.23 photo-anchored station forecourt:',JSON.stringify({
 station:st,tower,accepted:names,rejected:plan.rejected.map(p=>p.id),
 minRoadClearance:Math.min(...plan.accepted.map(p=>p.roadClearance)).toFixed(2),
 stopCameraDisplacements:plan.accepted.map(p=>[p.id,p.cameraDisplacement])
}));
