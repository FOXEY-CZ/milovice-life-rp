// Milovice RP 5.81: independent real Chromium/WebGL 2024 forecourt review.
// A passing test proves loaded 3D anchors and camera framing, not physical
// geosurvey of the large tree, Y-lamp, BUS paint or garden furniture.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
  '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
  '--enable-unsafe-swiftshader']
});
try{
 await mkdir('browser-artifacts',{recursive:true});
 for(const cfg of [
  {view:'wide',mobile:false,width:1280,height:760,
   expectedVisible:['station','tower']},
  {view:'tower',mobile:true,width:393,height:852,
   expectedVisible:['tower']},
  {view:'tower',flat:true,mobile:true,width:393,height:852,
   expectedVisible:['tower']},
  {view:'bus',mobile:false,width:1280,height:760,
   expectedVisible:[]}
 ]){
  const page=await browser.newPage({
   viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:1,
   isMobile:cfg.mobile,hasTouch:cfg.mobile});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=5812&forecourtAudit='+cfg.view+
   (cfg.flat?'&roadSurfaceFlat=1':''),
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__miloviceForecourtAuditRendered?.active===true,
   null,{timeout:120000});
  const state=await page.evaluate(()=>({
   review:window.__miloviceForecourtAuditRendered,
   towerMaterials:window.__miloviceBikeTowerInterior,
   roadDiagnostic:window.__miloviceRoadTextureDiagnostic,
   joystickHidden:getComputedStyle(document.getElementById('rp-joystick')).display==='none',
   liveLoadingPopupHidden:getComputedStyle(document.getElementById('osmnotice-live')).display==='none',
   mapSwitchHidden:getComputedStyle(document.getElementById('osm3d')).display==='none',
   diagnosticLink:document.getElementById('forecourt-audit-surface')?.href,
   statusLabel:document.getElementById('forecourt-audit-status')?.textContent,
   build:document.getElementById('build-label')?.textContent,
   panelVisible:!!document.getElementById('forecourt-photo-audit')?.offsetWidth,
   spawnHidden:getComputedStyle(document.getElementById('rp-spawn')).display==='none',
   normalTicketPanelHidden:getComputedStyle(
    document.getElementById('ticket-photo-audit')).display==='none',
   visibleCanvas:!!document.querySelector('canvas')?.clientWidth,
   sourceLink:document.getElementById('forecourt-audit-source')?.href,
   fov:(()=>window.__miloviceForecourtAuditRendered?.active?1:null)()
  }));
  const v=state.review;
  assert.equal(state.build,'20261115-forecourt-surface-diagnostic-5812');
  assert.equal(state.panelVisible,true);
  assert.equal(state.spawnHidden,true);
  assert.equal(state.joystickHidden,true,'Analog mobile joystick cannot obscure photo audit');
  assert.equal(state.liveLoadingPopupHidden,true);
  assert.equal(state.mapSwitchHidden,true);
  assert.equal(state.roadDiagnostic?.active,true);
  assert.equal(state.roadDiagnostic?.flat,Boolean(cfg.flat));
  assert.equal(state.roadDiagnostic?.roadMaterialHasTexture,!cfg.flat);
  assert.equal(state.roadDiagnostic?.geometryModified,false);
  assert.equal(state.roadDiagnostic?.roadMaterialOnly,true);
  assert.equal(v.roadTextureDiagnostic?.flat,Boolean(cfg.flat));
  assert(state.diagnosticLink.includes(cfg.flat?'forecourtAudit=tower':'roadSurfaceFlat=1')
   ||cfg.view!=='tower');
  assert(state.statusLabel?.includes('Mapa načtena'));

  assert.equal(state.normalTicketPanelHidden,true);
  assert.equal(state.visibleCanvas,true);
  assert.equal(v.view,cfg.view);
  assert.equal(state.towerMaterials?.glassAppearancePass,
   '5811-silver-2022-2024-photo');
  assert.equal(state.towerMaterials?.towerGlazingOpacity,.20);
  assert.equal(state.towerMaterials?.photoGeometryUnchanged,true);
  assert.equal(state.towerMaterials?.externalFootprintUnchanged,true);
  assert.equal(state.towerMaterials?.addedStreetFurniture,0);
  assert.equal(v.photoDate,'2024-05-30');
  assert.equal(v.landmarks.length,2);
  assert.equal(v.stopCount,2);
  assert.equal(v.existingBikeTowerUpperSign?.active,true);
  assert.equal(v.existingBikeTowerUpperSign.drawCalls,1);
  assert.equal(v.existingBikeTowerUpperSign.wayId,1011197691);
  assert.equal(v.existingBikeTowerUpperSign.noAddedStreetFurniture,true);
  assert.equal(v.existingBikeTowerUpperSign.photoPixelsUsed,false);
  assert.equal(v.worldGeometryMoved,false);
  assert.equal(v.surveyedPositions,false);
  assert.equal(v.photosCopied,false);
  assert(v.deferred.includes('broadleaf'));
  assert(v.deferred.includes('twin-lamp'));
  assert(v.deferred.includes('BUS-road-paint'));
  for(const id of cfg.expectedVisible)assert(v.visibleLandmarks.includes(id),
   cfg.view+': mapped '+id+' must be in real camera frame');
  assert.equal(state.sourceLink,v.source);
  assert.deepEqual(errors,[]);
  const path='browser-artifacts/milovice-forecourt-5812-'+cfg.view+
   (cfg.flat?'-flat':'')+(cfg.mobile?'-mobile':'')+'.png';
  await page.screenshot({path});
  console.log('5.81 FORECOURT WebGL PASS',JSON.stringify({
   view:cfg.view,visibleLandmarks:v.visibleLandmarks,
   sourceHeading:v.cameraGps.heading,existingStops:v.stopCount,
   newRoadObjects:0,upperSignDrawCalls:1,
   flatRoadMaterial:state.roadDiagnostic.flat,
   joystickHidden:state.joystickHidden,
   errors:errors.length
  }));
  await page.close();
 }
}finally{
 await browser.close();
}
