// Milovice RP 5.78 — opt-in photo camera; never invent positions or modify the street.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STATION_TICKET_MACHINE_PHOTO,planStationTicketMachines}
 from './station-ticket-machines.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const photo=STATION_TICKET_MACHINE_PHOTO;
const plan=planStationTicketMachines(elements);
assert(plan&&plan.machines.length===2);
assert.equal(photo.camera.heading,110);
assert.equal(photo.photoDate,'2024-05-30');
assert.equal(photo.stationWayId,53865956);
assert.equal(photo.surveyedMachinePositions,false);
assert(plan.cameraWallDistance>1.5&&plan.cameraWallDistance<2.6);
assert(plan.cameraBearingAgreement>.84);
const eye=stationGpsToWorld(photo.camera);
const direction={x:Math.sin(photo.camera.heading*Math.PI/180),
 z:-Math.cos(photo.camera.heading*Math.PI/180)};
assert(Number.isFinite(eye.x)&&Number.isFinite(eye.z));
for(const machine of plan.machines){
 const target={x:machine.x-eye.x,z:machine.z-eye.z};
 const dot=target.x*direction.x+target.z*direction.z;
 assert(dot>0,'Both machines must face forward from the photographed camera');
 const bearing=Math.atan2(target.x,-target.z)*180/Math.PI;
 const deviation=Math.abs(((bearing-photo.camera.heading+540)%360)-180);
 assert(deviation<35,'Machine must fit camera framing without invented position');
}
assert(html.includes("new URLSearchParams(location.search).has('ticketPhotoAudit')"));
assert(html.includes('rpStationTicketCameraWorld=rpStationTicketPhotoAudit?'));
assert(html.includes('stationGpsToWorld(STATION_TICKET_MACHINE_PHOTO.camera)'));
assert(html.includes('window.__miloviceTicketPhotoAuditRendered='));
assert(html.includes('machineProjections.filter(m=>m.inFrame).length'));
assert(html.includes('if(active&&osmReady&&!rpAuditCameraWorld)rpShowSpawnPicker()'));
assert(html.includes('const cx=rpAuditCameraWorld?.x??(walking?px:x)'));
assert(html.includes('const cz=rpAuditCameraWorld?.z??(walking?pz:z)'));
assert(html.includes('id="ticket-photo-audit" hidden'));
assert(html.includes('html.rp-ticket-photo-audit #rp-spawn'));
assert(html.includes('20261116-2022-lamp-osm-church-direction-58270'));
assert(html.includes("from './scripts/station-ticket-machines.js?v=5800'"));
assert(!html.includes('20261115-station-photo-ticket-machines-5770'));
assert(html.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes('stationTicketMachines.create(elements);'));
assert(html.includes('stationTicketMachines.reset();'));
console.log('5.78 camera-from-photograph opt-in audit PASS: 2 actual PID machine models, source heading 110°, original parking untouched');
