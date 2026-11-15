// Milovice RP 5.79 — photo-observed station door → orange → yellow → window.
// Detect real physical projections and reject the former generic windows that
// passed tests despite the user's 2026-11-15 screenshot overlap.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stationGpsToWorld} from './station-forecourt-pass.js';
import {planStationPhotographedFacade,STATION_PHOTO_FACADE}
 from './station-photo-facade.js';
import {planStationTicketMachines,STATION_TICKET_MACHINE_LAYOUT}
 from './station-ticket-machines.js';
const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const station=elements.find(e=>e.id===53865956);
assert(station?.tags?.building==='train_station');
const pts=station.geometry.map(g=>{const w=stationGpsToWorld(g);return {x:w.x,y:w.z};});
const plan=planStationPhotographedFacade(pts);
const pair=planStationTicketMachines(elements);
assert(plan&&pair,'Photo and station OSM wall must both resolve');
assert.equal(plan.wallSegmentIndex,5);
assert(plan.wall.length>6.2&&plan.wall.length<7);
assert.deepEqual(plan.fixtures.map(f=>f.kind),['door','window']);
assert.deepEqual(plan.observedOrder,['door','orange','yellow','window']);
assert(plan.minFixtureMachineGap>.16,'All pieces must remain visibly separated');
assert.equal(plan.photosCopied,false);
assert.equal(plan.positionsSurveyed,false);
assert.equal(plan.facesPhotographer,true);
assert.equal(STATION_PHOTO_FACADE.photoDate,'2024-05-30');
assert.equal(STATION_PHOTO_FACADE.source,pair.source.source);
assert.equal(pair.machines.length,2);
for(const f of plan.fixtures){
 const maxWidth=Math.max(f.width,f.sillWidth||0);
 const fA=f.t*plan.wall.length-maxWidth/2;
 const fB=f.t*plan.wall.length+maxWidth/2;
 for(const m of STATION_TICKET_MACHINE_LAYOUT){
  const mA=m.t*plan.wall.length-m.bodyWidth/2;
  const mB=m.t*plan.wall.length+m.bodyWidth/2;
  const gap=Math.max(fA-mB,mA-fB);
  assert(gap>.16,`${f.kind} collides with ${m.kind} after photo facade layout`);
 }
}
assert.equal(planStationPhotographedFacade([]),null);
assert.equal(planStationPhotographedFacade(pts.map(p=>({x:p.x+15,y:p.y+15}))),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes('photoFixtureWall=false'));
assert(html.includes('if(photoFixtureWall)return;'));
assert(html.includes('photoFacade=planStationPhotographedFacade(pts)'));
assert(html.includes('stationPhotographedDoorAndWindow(photoFacade,base)'));
assert(html.includes('window.__miloviceStationPhotoFacade='));
assert(html.includes('removedInventedArchedWindowsOnPhotoWall:true'));
assert(html.includes("from './scripts/station-photo-facade.js?v=5790'"));
assert(html.includes("from './scripts/station-ticket-machines.js?v=5800'"));
assert(html.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes("const BUILD_ID='20261115-station-detail-5800'"));
console.log('5.79 station photo-façade clean intervals and real source wall PASS',
 JSON.stringify({observedOrder:plan.observedOrder,
  minimumGap:+plan.minFixtureMachineGap.toFixed(3),
  wallLength:+plan.wall.length.toFixed(3),windowArchRemoved:true}));
