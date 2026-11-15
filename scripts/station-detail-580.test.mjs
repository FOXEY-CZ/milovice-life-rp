// Milovice RP 5.80 — details without moving photo-confirmed fixtures.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STATION_TICKET_MACHINE_LAYOUT,STATION_TICKET_MACHINE_PHOTO,
 planStationTicketMachines} from './station-ticket-machines.js';
import {STATION_PHOTO_FACADE,planStationPhotographedFacade}
 from './station-photo-facade.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';
const repoDir=new URL('../',import.meta.url);
const elements=JSON.parse(readFileSync(new URL('data/milovice-osm.json',repoDir),'utf8')).elements;
const station=elements.find(e=>e.id===STATION_TICKET_MACHINE_PHOTO.stationWayId);
const pts=station.geometry.map(p=>{const q=stationGpsToWorld(p);return {x:q.x,y:q.z};});
const plan=planStationTicketMachines(elements);
const facade=planStationPhotographedFacade(pts);
assert(plan&&facade);
assert.equal(plan.machines.length,2);
assert.deepEqual(STATION_TICKET_MACHINE_LAYOUT.map(m=>({
 kind:m.kind,t:m.t,width:m.bodyWidth,height:m.bodyHeight
})),[
 {kind:'orange',t:.49,width:.68,height:1.83},
 {kind:'yellow',t:.34,width:.68,height:1.88}
],'Do not change existing user-confirmed two machine locations, widths or heights');
assert.deepEqual(STATION_PHOTO_FACADE.fixtures.map(f=>({
 kind:f.kind,t:f.t,width:f.width
})),[
 {kind:'door',t:.66,width:1.05},
 {kind:'window',t:.14,width:1.37}
],'Keep 5.79 photographed white doorway and single window where they were');
assert.equal(facade.minFixtureMachineGap>.16,true);
assert.deepEqual(facade.observedOrder,['door','orange','yellow','window']);
const model=readFileSync(new URL('scripts/station-ticket-machines.js',repoDir),'utf8');
const game=readFileSync(new URL('index.html',repoDir),'utf8');
assert(model.includes("const c=document.createElement('canvas');c.width=320;c.height=768;"));
assert(model.includes("g.font='bold 21px system-ui,Arial'"));
assert(model.includes("JÍZDENKY/TICKETS"));
assert(model.includes("g.roundRect(x,y,w,h,r)"));
assert(model.includes("for(let i=0;i<28;i++)"));
assert(model.includes("new THREE.MeshStandardMaterial({"));
assert(model.includes("metalness:.16,roughness:.72"));
assert(model.includes("root.position.set(m.x,base+.008,m.z)"));
assert(model.includes("panelDetailRevision:580,panelCanvasSize:[320,768]"));
assert(model.includes("shellMaterial:'MeshStandardMaterial',groundOffsetMeters:.008"));
assert(model.includes("new THREE.CanvasTexture(c)"));
assert(model.includes("drawMeshes++"));
assert.equal((model.match(/drawMeshes\+\+/g)||[]).length,2,
 'Each machine must still have just its body and its single canvas front');
assert(model.includes("for(const geometry of geometries)geometry.dispose()"));
assert(model.includes("for(const mat of materials)mat.dispose()"));
assert(model.includes("for(const t of textures)t.dispose()"));
assert(!model.includes("new THREE.TextureLoader("));
assert(!model.includes("fetch("));
assert(game.includes("detailRevision:580,windowSillDepth:.22"));
assert(game.includes("unchangedFixtureAnchors:true"));
assert(game.includes("put('stationWindowSill',f,f.bottom-.030,f.sillWidth,.065,.22"));
assert(game.includes("if(rpAuditCameraWorld&&innerWidth<innerHeight)"));
assert(game.includes("camera.fov=rpForecourtParkingOverview?64:rpForecourtEntryInspection?76:105;"));
assert(game.includes("from './scripts/station-ticket-machines.js?v=5800'"));
assert(game.includes("from './scripts/station-photo-facade.js?v=5790'"));
assert(game.includes("const BUILD_ID='20261115-photo-2023-two-paved-parking-banks-58114'"));
assert(game.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(game.includes("stationTicketMachines.reset()"));
console.log('5.80 safe visual detail PASS',JSON.stringify({
 machines:plan.machines.map(m=>m.kind),
 wallSegment:5,
 minGap:+facade.minFixtureMachineGap.toFixed(3),
 unchangedFootprints:true,
 maxDrawCalls:4,
 canvasPerMachine:[320,768],newPhotoPixelImports:false
}));
