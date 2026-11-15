// Milovice RP 5.78: real Chromium/WebGL rendering of opt-in 2024 photo review.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
  '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const page=await browser.newPage({viewport:{width:1280,height:760},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error.stack||error)));
 await page.goto('http://127.0.0.1:8080/?v=58116&ticketPhotoAudit=1',
  {waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceTicketPhotoAuditRendered?.active===true,
  null,{timeout:90000});
 const report=await page.evaluate(()=>({
  audit:window.__miloviceTicketPhotoAuditRendered,
  modelStatus:window.__miloviceStationTicketMachines,
  facade:window.__miloviceStationPhotoFacade,
  loading:document.getElementById('milovice-loading')?.textContent||null,
  panelVisible:!!document.getElementById('ticket-photo-audit')?.offsetWidth,
  spawnHidden:getComputedStyle(document.getElementById('rp-spawn')).display==='none',
  rendererActive:window.__miloviceStarted===true,
  build:document.getElementById('build-label')?.textContent
 }));
 console.log('5.80 photo WebGL view:',JSON.stringify(report,null,2));
 assert.equal(report.rendererActive,true);
 assert.equal(report.audit.machineCount,2);
 assert.equal(report.audit.projectionCount,2);
 assert.equal(report.audit.inFrameCount,2,
  'Both photo-observed machines must be visible inside real Chromium camera frame');
 assert.equal(report.audit.headingDegrees,110);
 assert.equal(report.audit.positionsSurveyed,false);
 assert.equal(report.audit.photosCopied,false);
 assert.equal(report.modelStatus.drawMeshes,4);
 assert.equal(report.modelStatus.panelDetailRevision,580);
 assert.deepEqual(report.modelStatus.panelCanvasSize,[320,768]);
 assert.equal(report.modelStatus.shellMaterial,'MeshStandardMaterial');
 assert.equal(report.modelStatus.groundOffsetMeters,.008);
 assert.equal(report.modelStatus.textureCount,2);
 assert(report.audit.roadClearanceMin>1);
 assert.equal(report.panelVisible,true);
 assert.equal(report.spawnHidden,true);
 assert.equal(report.build,'20261115-osm-safe-parking-contour-58118');
 assert.equal(report.facade?.active,true);
 assert.deepEqual(report.facade.generatedFixtureTypes,['door','window']);
 assert.deepEqual(report.facade.observedOrder,['door','orange','yellow','window']);
 assert.equal(report.facade.removedInventedArchedWindowsOnPhotoWall,true);
 assert(report.facade.minimumClearance>.16);
 assert.equal(report.facade.detailRevision,580);
 assert.equal(report.facade.windowSillDepth,.22);
 assert.equal(report.facade.unchangedFixtureAnchors,true);
 assert.deepEqual(errors,[],'No page-side JavaScript errors allowed');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-ticket-photo-58116.png'});
 // Two simultaneous SwiftShader 3D scenes exhaust GPU memory in CI.
 // Release desktop canvas before launching the separate portrait check.
 await page.close();
 // The user's reference is a portrait phone screenshot: verify the exact
 // same two machines are visible with the wider diagnostic portrait FOV.
 const phone=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true
 });
 const phoneErrors=[];
 phone.on('pageerror',e=>phoneErrors.push(String(e.stack||e)));
 await phone.goto('http://127.0.0.1:8080/?v=58116&ticketPhotoAudit=1',
  {waitUntil:'domcontentloaded',timeout:30000});
 await phone.waitForFunction(()=>window.__miloviceTicketPhotoAuditRendered?.active===true,
  null,{timeout:90000});
 const mobile=await phone.evaluate(()=>({
  audit:window.__miloviceTicketPhotoAuditRendered,
  status:window.__miloviceStationTicketMachines,
  panelVisible:!!document.getElementById('ticket-photo-audit')?.offsetWidth,
  canvasW:document.querySelector('canvas')?.clientWidth||0,
  build:document.getElementById('build-label')?.textContent
 }));
 assert.equal(mobile.audit.machineCount,2);
 assert.equal(mobile.audit.inFrameCount,2,
  'Portrait phone diagnostic camera must not crop either station machine');
 assert.equal(mobile.status.panelDetailRevision,580);
 assert.equal(mobile.panelVisible,true);
 assert.equal(mobile.build,'20261115-osm-safe-parking-contour-58118');
 assert.deepEqual(phoneErrors,[]);
 await phone.screenshot({path:'browser-artifacts/milovice-ticket-photo-58116-mobile.png'});
 console.log('5.80 portrait mobile photo audit PASS',JSON.stringify({
  projections:mobile.audit.machineProjections,
  canvasWidth:mobile.canvasW,
  panelDetailRevision:mobile.status.panelDetailRevision
 }));
 await phone.close();
 console.log('5.80 station ticket camera real WebGL smoke PASS');
}finally{
 await browser.close();
}
