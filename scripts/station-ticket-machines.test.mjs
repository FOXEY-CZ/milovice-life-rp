// Milovice RP 5.77 — evidence-backed actual PID ticket machine PAIR.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STATION_TICKET_MACHINE_PHOTO,planStationTicketMachines}
 from './station-ticket-machines.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';
const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const station=elements.find(e=>e.id===53865956);
assert(station?.tags?.building==='train_station');
assert.equal(STATION_TICKET_MACHINE_PHOTO.stationWayId,53865956);
assert.equal(STATION_TICKET_MACHINE_PHOTO.wallSegmentIndex,5);
assert(STATION_TICKET_MACHINE_PHOTO.source.includes('commons.wikimedia.org'));
assert.equal(STATION_TICKET_MACHINE_PHOTO.author,'ŠJů');
assert.equal(STATION_TICKET_MACHINE_PHOTO.license,'CC BY 4.0');
assert.equal(STATION_TICKET_MACHINE_PHOTO.photoDate,'2024-05-30');
assert.equal(STATION_TICKET_MACHINE_PHOTO.camera.heading,110);
const plan=planStationTicketMachines(elements);
assert(plan,'The camera heading and train-station OSM wall must locate the photo');
assert.equal(plan.stationWayId,53865956);
assert.equal(plan.wallSegmentIndex,5);
assert(plan.wallLength>6.2&&plan.wallLength<7);
assert(plan.cameraWallDistance>1.5&&plan.cameraWallDistance<2.6);
assert(plan.cameraBearingAgreement>.84);
assert.deepEqual(plan.machines.map(m=>m.id),['orange','yellow'],
 'Exactly the photographically observed orange and yellow machines');
assert.deepEqual(plan.machines.map(m=>m.kind),['orange','yellow']);
assert.equal(plan.machines.length,2);
assert.equal(plan.anchoredToStationWall,true);
assert.equal(plan.facadeEstimated,true);
assert.equal(plan.photosCopied,false);
assert.equal(plan.entranceMovementPreserved,true);
const a=stationGpsToWorld(station.geometry[4]);
const b=stationGpsToWorld(station.geometry[5]);
const direction={x:(b.x-a.x)/plan.wallLength,z:(b.z-a.z)/plan.wallLength};
const cam=stationGpsToWorld(STATION_TICKET_MACHINE_PHOTO.camera);
const dot=(p,q)=>p.x*q.x+p.z*q.z;
for(const machine of plan.machines){
 const local={x:machine.x-a.x,z:machine.z-a.z};
 const along=dot(local,direction);
 const perpendicular=Math.abs(local.x*direction.z-local.z*direction.x);
 assert(along>.25*plan.wallLength&&along<.55*plan.wallLength,
  'Machines must be mounted between the photographed station door and window');
 assert(perpendicular>.15&&perpendicular<.26,
  'Ticket machines must touch the actual exterior station wall');
 assert(machine.bodyHeight>1.7&&machine.bodyHeight<2);
 assert(machine.bodyWidth>.6&&machine.bodyWidth<.8);
 assert(machine.outwardClearance>.04&&machine.outwardClearance<.1);
 assert(machine.nearestRoadEdge>1.0,
  'Neither ticket machine may be placed on an OSM carriageway');
 const look={x:Math.sin(machine.yaw),z:Math.cos(machine.yaw)};
 const cameraLook={x:cam.x-machine.x,z:cam.z-machine.z};
 assert(dot(look,cameraLook)/Math.hypot(cameraLook.x,cameraLook.z)>.8,
  'Machine screen must face the photograph camera, not station wall');
}
assert(plan.machines[0].t>plan.machines[1].t,
 'Left-to-right order in photographed facade must be orange then yellow');
assert(Math.hypot(plan.machines[0].x-plan.machines[1].x,
 plan.machines[0].z-plan.machines[1].z)>.92);
assert.equal(planStationTicketMachines([]),null);
assert.equal(planStationTicketMachines(elements.filter(e=>e.id!==53865956)),null);
assert.equal(planStationTicketMachines(elements.map(e=>e.id===53865956?
 {...e,tags:{...e.tags,building:'house'}}:e)),null);
assert.equal(planStationTicketMachines(elements.map(e=>e.id===53865956?
 {...e,geometry:e.geometry.map(p=>({...p,lon:p.lon+.001}))}:e)),null);
const model=readFileSync(new URL('./station-ticket-machines.js',import.meta.url),'utf8');
assert(model.includes("m.kind==='orange'?0xe59a0b:0xe1d00b"));
assert(model.includes('JÍZDENKY/TICKETS'));
assert(!model.includes('new THREE.TextureLoader('),
 'Photo pixels may not be copied into the game as machine textures');
assert(!model.includes('fetch('),'Visual source photographs stay external');
const game=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(game.includes("from './scripts/station-ticket-machines.js?v=5800'"));
assert(game.includes("stationTicketMachines.create(elements);"));
assert(game.includes("stationTicketMachines.reset();"));
assert(game.includes("const BUILD_ID='20261115-biketower-connected-footway-5815'"));
assert(game.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"),
 'Do not remove or modify the user-confirmed road-aligned sidewalk or parking');
console.log('5.77 two photo-observed station ticket machines anchored to real wall PASS',
 JSON.stringify({machineCount:plan.machines.length,
 wallSegment:plan.wallSegmentIndex,
 photoCameraDistance:+plan.cameraWallDistance.toFixed(2),
 wallLength:+plan.wallLength.toFixed(2),
 clearance:Math.min(...plan.machines.map(m=>m.nearestRoadEdge)).toFixed(2),
 colors:plan.machines.map(m=>m.kind),
 photoDate:plan.source.photoDate,positionsSurveyed:false}));
