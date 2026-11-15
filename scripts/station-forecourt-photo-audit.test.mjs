// Milovice RP 5.81 — geotagged 2024 photograph viewpoints, OSM anchors,
// and strict no-invented-lamp/tree/road-line contract.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STATION_FORECOURT_AUDIT_VIEWS,STATION_FORECOURT_PENDING,
 planStationForecourtAudit} from './station-forecourt-photo-audit.js';
import {STATION_FORECOURT_SOURCE,planStationForecourt}
 from './station-forecourt-pass.js';
import {UPPER_BIKETOWER_SIGN_SOURCE,planUpperBiketowerSign}
 from './bike-tower-photo-sign.js';
import {createRoadClearance} from './road-clearance.js';
const elements=JSON.parse(readFileSync(new URL('../data/milovice-osm.json',
 import.meta.url),'utf8')).elements;
const views=['wide','tower','bus'];
assert.deepEqual(Object.keys(STATION_FORECOURT_AUDIT_VIEWS),views);
assert.equal(STATION_FORECOURT_SOURCE.stationId,'53865956');
for(const id of views){
 const plan=planStationForecourtAudit(elements,id);
 assert(plan, 'Photo camera '+id+' must resolve both actual OSM objects');
 assert.equal(plan.id,id);
 assert.equal(plan.date,'2024-05-30');
 assert.equal(plan.sourceLicense,'CC BY 4.0');
 assert.equal(plan.sourcePhotographer,'ŠJů');
 assert.equal(plan.landmarks.length,2);
 assert.deepEqual(plan.landmarks.map(l=>l.wayId),[53865956,1011197691]);
 assert(plan.landmarks.every(l=>l.distanceMeters>2&&l.distanceMeters<150));
 assert.equal(plan.treeLampAndGardenStillUnlocated,true);
 assert.equal(plan.copiedSourcePixels,false);
 assert.equal(plan.surveyedPositions,false);
 assert.deepEqual(plan.deferred,STATION_FORECOURT_PENDING);
 assert(plan.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
}
assert.equal(STATION_FORECOURT_AUDIT_VIEWS.wide.camera.lat,50.2289419);
assert.equal(STATION_FORECOURT_AUDIT_VIEWS.wide.camera.heading,335);
assert.equal(STATION_FORECOURT_AUDIT_VIEWS.tower.camera.lat,50.2290656);
assert.equal(STATION_FORECOURT_AUDIT_VIEWS.tower.camera.heading,5);
assert.equal(STATION_FORECOURT_AUDIT_VIEWS.bus.camera.heading,175);
assert.equal(planStationForecourtAudit(elements,'invented'),null);
assert.equal(planStationForecourtAudit([], 'wide'),null);
assert.equal(planStationForecourtAudit(elements.filter(e=>e.id!==1011197691),'wide'),null);
assert.deepEqual(STATION_FORECOURT_PENDING,[
 'broadleaf','twin-lamp','flowerbed','BUS-road-paint','opposite-shelter'
]);
const w=planStationForecourtAudit(elements,'wide');
assert(w.landmarks.find(l=>l.id==='station').relativeHeadingDegrees<-20);
assert(w.landmarks.find(l=>l.id==='tower').relativeHeadingDegrees>10);
const t=planStationForecourtAudit(elements,'tower');
assert(Math.abs(t.landmarks.find(l=>l.id==='tower').relativeHeadingDegrees)<25);
const sign=planUpperBiketowerSign({radius:3.8,height:11.4,nx:1,nz:0});
assert(sign&&sign.drawCalls===1);
assert(sign.height===1.15&&sign.y>9&&sign.y<11);
assert(sign.x>3.8&&sign.x<4.0);
assert.equal(sign.photoPixelsUsed,false);
assert.equal(sign.physicalRoadFurniture,0);
assert.equal(sign.wayId,1011197691);
assert.equal(UPPER_BIKETOWER_SIGN_SOURCE.exactHeightSurveyed,false);
assert.equal(planUpperBiketowerSign({radius:9,nx:1,nz:0}),null);
assert.equal(planUpperBiketowerSign({radius:3.8,nx:0,nz:0}),null);
assert.equal(planUpperBiketowerSign({wayId:53865956,radius:3.8,nx:1,nz:0}),null);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert(html.includes("const BUILD_ID='20261115-osm-safe-parking-contour-58118'"));
assert(html.includes("new URLSearchParams(location.search).get('parkingOverview')==='1'"));
assert(html.includes("const parkingPlan=rpForecourtParkingOverview?stationPhotoParking.plan():null;"));
assert(html.includes("camera.up.set(f.ux,0,f.uz);"));
assert(html.includes("parkingOverview:{"));
assert(html.includes("cameraBasedOnMappedRoad:technicalParkingCamera"));
assert(html.includes('noGeometryChanges:true'));
assert(html.includes('?v=58118&forecourtAudit=wide&parkingOverview=1'));
assert(html.includes("from './scripts/station-forecourt-photo-audit.js?v=5810'"));
assert(html.includes("from './scripts/bike-tower-photo-sign.js?v=5810'"));
assert(html.includes("new URLSearchParams(location.search).get('forecourtAudit')"));
assert(html.includes('rpForecourtAuditPlan=rpForecourtAuditView?'));
assert(html.includes('camera.fov=rpForecourtParkingOverview?64:rpForecourtEntryInspection?76:105;'));
assert(html.includes('camera.position.set(viewX,ground+Math.max(74,f.length*.94),viewZ);'));
assert(html.includes("if(rpAuditCameraWorld)camera.fov=innerWidth<innerHeight?"));
assert(html.includes("const cx=rpAuditCameraWorld?.x??(walking?px:x)"));
assert(html.includes("const cz=rpAuditCameraWorld?.z??(walking?pz:z)"));
assert(html.includes('window.__miloviceForecourtAuditRendered='));
assert(html.includes('worldGeometryMoved:false'));
assert(html.includes("if(active&&osmReady&&!rpAuditCameraWorld)rpShowSpawnPicker()"));
assert(html.includes("window.__miloviceBikeTowerUpperSign="));
assert(html.includes("createUpperBiketowerSign(THREE,g,upperSignPlan)"));
assert(html.includes("stationPhotoForecourt.create(elements)"));
assert(html.includes("stationPhotoParking.create(elements,{sidewalkMaterial:osmSidewalkMat})"));
assert(html.includes("stationTicketMachines.create(elements)"));
assert(html.includes('stationPhotoForecourt.reset()'));
assert(html.includes("stationTicketMachines.reset()"));
const render=readFileSync(new URL('./bike-tower-photo-sign.js',import.meta.url),'utf8');
assert(render.includes("new THREE.CanvasTexture(canvas)"));
assert(render.includes("parent.add(mesh)"));
assert(render.includes("geometry.dispose();material.dispose();texture.dispose()"));
assert(!render.includes("new THREE.TextureLoader("));
assert(!render.includes("fetch("));
// 5.81.2: visual evidence from the user showed the analog joystick and a
// loading toast still visible over the photo review, plus a warped asphalt
// pattern. Audit-only no-texture mode isolates MATERIAL from geometry causes.
for(const id of ['#rp-joystick','#osmnotice-live','#osm3d'])
 assert(html.includes('html.rp-ticket-photo-audit '+id),
  'Audit must hide '+id+' independently of the mobile analog control CSS');
assert(html.includes("const rpRoadSurfaceFlatAudit=Boolean(rpForecourtAuditView)"));
assert(html.includes("new URLSearchParams(location.search).get('roadSurfaceFlat')==='1'"));
assert(html.includes("if(rpRoadSurfaceFlatAudit){"));
assert(html.includes('osmRoadMaterial.map=null;'));
assert(html.includes('roadMaterialHasTexture:Boolean(osmRoadMaterial.map)'));
assert(html.includes('roadMaterialOnly:true'));
assert(html.includes('geometryModified:false'));
assert(html.includes("if(status&&osmReady&&osmActive)status.textContent="));
assert(html.includes("id=\"forecourt-audit-surface\""));
assert(html.includes("id=\"forecourt-audit-status\""));
assert(html.includes("osmNotice.id='osmnotice-live'"));
assert(html.includes("osmBtn.id='osm3d'"));
assert(!html.includes("osmBtn.id='osm-map-button-live'"));
assert(html.includes("const cx=rpAuditCameraWorld?.x??(walking?px:x)"));
assert(html.includes("const BUILD_ID='20261115-osm-safe-parking-contour-58118'"));
console.log('5.81 anchored forecourt camera + existing upper Bike Tower sign PASS',JSON.stringify({
 views:views.map(id=>({id,heading:STATION_FORECOURT_AUDIT_VIEWS[id].camera.heading})),
 unmappedObjects:STATION_FORECOURT_PENDING,
 newStreetObjects:0,oneExtraSignDrawCall:true
}));
