import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRoadClearance} from './road-clearance.js';
import {STATION_FORECOURT_SOURCE,stationGpsToWorld,wayCentre,planStationForecourt} from './station-forecourt-pass.js';
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
assert(plan.accepted.length>=4,JSON.stringify(plan));
const names=plan.accepted.map(p=>p.id);
assert(names.includes('broadleaf'),'Photo-verified mature station tree must avoid walls and traffic');
assert(names.includes('twin-lamp'),'Photo-verified double-arm streetlamp must avoid walls and traffic');
assert(names.includes('flowerbed'),'Station flowers must be placed off all roads');
assert(names.some(x=>x==='bus-A'||x==='bus-B'),'Keep at least one source-backed stop marker');
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
 minRoadClearance:Math.min(...plan.accepted.map(p=>p.roadClearance)).toFixed(2)
}));
