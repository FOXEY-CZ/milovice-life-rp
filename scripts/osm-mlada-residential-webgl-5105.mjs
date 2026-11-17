// 5.105: browser verifies the exact OSM-sourced camera and really-rendered
// panel facade grid on 22 existing Mladá apartment buildings.
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
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=510500&streetAudit=estate-mlada-5105',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceMladaEstateCameraAudit?.ready===true&&
   window.__miloviceMladaEstateCameraAudit?.targetInFrame===true&&
   window.__miloviceStreetAuditRendered?.view==='estate-mlada-5105',
  null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceMladaEstateCameraAudit,
   apartments:window.__miloviceMladaResidentialAudit,
   street:window.__miloviceStreetAuditRendered
  }));
  throw Error('Mapped 5.105 estate review not available: '+
   JSON.stringify(debug)+'; errors '+JSON.stringify(errors)+'; '+String(e));
 }
 const result=await page.evaluate(()=>({
  camera:window.__miloviceMladaEstateCameraAudit,
  apartments:window.__miloviceMladaResidentialAudit,
  street:window.__miloviceStreetAuditRendered,
  header:document.querySelector('#street-block-audit > strong')?.textContent,
  label:document.getElementById('street-audit-label')?.textContent,
  navLinks:document.querySelectorAll('#street-audit-nav a').length,
  navSections:document.querySelectorAll('#street-audit-nav details').length,
  chosen:document.querySelector('#street-audit-nav a.selected')?.dataset.auditId,
  compact:document.getElementById('street-block-audit')?.classList.contains('audit-compact'),
  canvasWidth:document.querySelector('canvas')?.clientWidth,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(result.camera.sourceBuildingId,'891874834');
 assert.equal(result.camera.sourceOSMFootwayId,'1468803907');
 assert.equal(result.camera.sourceLevels,5);
 assert.equal(result.camera.sourceFlats,20);
 assert.equal(result.camera.eyeFromMappedFootway,true);
 assert.equal(result.camera.notAPhoto,true);
 assert.equal(result.camera.exactFacadeNotPhotoVerified,true);
 assert(result.camera.targetInFrame&&Math.abs(result.camera.targetProjection.x)<.8);
 assert(Math.abs(result.camera.cameraHeightAboveTerrain-1.68)<.1);
 assert.equal(result.apartments.mappedApartmentBuildings,22);
 assert.equal(result.apartments.mappedLevelsByBuilding['891874834'],5);
 assert.equal(result.apartments.mappedFlatsByBuilding['891874834'],20);
 assert(result.apartments.horizontalFloorJoints>=65);
 assert(result.apartments.verticalBayJoints>=22);
 assert(result.apartments.duplicateVerticalJointsRemoved>0);
 assert.equal(result.apartments.roofShapesChanged,0);
 assert.equal(result.apartments.structuralFootprintsChanged,0);
 assert.equal(result.apartments.photocConfirmedFacades??0,0);
 assert.equal(result.street.view,'estate-mlada-5105');
 assert(result.header.includes('Bytové domy'));
 assert(result.label.includes('Mladá'));
 assert.equal(result.navLinks,31);
 assert.equal(result.navSections,7);
 assert.equal(result.chosen,'estate-mlada-5105');
 assert.equal(result.compact,true);
 assert(result.canvasWidth>0);
 assert(result.meta&&result.meta===result.hud);
 assert.deepEqual(errors,[],'No JS errors in WebGL estate mode');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-mlada-estate-5105-mobile.png'});
 console.log('PASS 5.105 3D Mladá apartment estate',JSON.stringify({
  mappedBuildings:result.apartments.mappedApartmentBuildings,
  floorJoints:result.apartments.horizontalFloorJoints,
  bayJoints:result.apartments.verticalBayJoints,
  suppressedDuplicatedSeams:result.apartments.duplicateVerticalJointsRemoved,
  targetProjection:result.camera.targetProjection
 }));
 await page.close();
}finally{await browser.close()}
