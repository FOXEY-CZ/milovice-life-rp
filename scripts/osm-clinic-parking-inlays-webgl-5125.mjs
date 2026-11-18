// Milovice RP 5.125 live mobile Chromium/WebGL, after the 5-second LOD.
// Validates photo-observed red paving inlays are real triangles ON the
// existing photo pavement, not fictitious new parking or traffic geometry.
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
 await page.goto(
  'http://127.0.0.1:8080/?v=512500&streetAudit=armadni-clinic-5118',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='armadni-clinic-5118'&&
   window.__miloviceClinicParkingInlaysAudit?.renderedMeshes===1&&
   window.__miloviceClinicParkingInlaysRuntime?.()?.ready===true
  ),null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   inlay:window.__miloviceClinicParkingInlaysAudit,
   inlayLive:window.__miloviceClinicParkingInlaysRuntime?.(),
   clinic:window.__miloviceArmLandmarksAudit,
   paving:window.__miloviceClinicForecourtAudit,
   auditCamera:window.__miloviceStreetAuditRendered
  }));
  throw Error('Photo parking inlays not built '+JSON.stringify(debug)+
   ' script errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const s=await page.evaluate(()=>({
  version:document.querySelector('meta[name="milovice-build"]')?.content,
  label:document.getElementById('build-label')?.textContent,
  audit:window.__miloviceClinicParkingInlaysAudit,
  live:window.__miloviceClinicParkingInlaysRuntime?.(),
  forecourt:window.__miloviceClinicForecourtRuntime?.(),
  storefront:window.__miloviceClinicShopfrontRuntime?.(),
  entrance:window.__miloviceClinicEntranceRuntime?.(),
  menuHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert.equal(s.version,'20261118-spojovaci-photo-parking-inlays-512500');
 assert.equal(s.label,s.version);
 assert.equal(s.audit.osmClinicId,'1057548624');
 assert.equal(s.audit.streetWayId,'246652750');
 assert.equal(s.audit.footwayId,'1339091016');
 assert(s.audit.modelledSeparatorCount>=5);
 assert.equal(s.audit.drawMeshes,1);
 assert.equal(s.audit.renderedMeshes,1);
 assert.equal(s.audit.renderedTriangles,s.audit.triangleCount);
 assert.equal(s.audit.exactStallCountKnown,false);
 assert.equal(s.audit.actualParkingBayCountClaimed,0);
 assert.equal(s.audit.spacingMetresApproximate,true);
 assert.equal(s.audit.newParkingLotPolygons,0);
 assert.equal(s.audit.newParkingRoads,0);
 assert.equal(s.audit.newRoads,0);
 assert.equal(s.audit.newFootways,0);
 assert.equal(s.audit.newZebraCrossings,0);
 assert.equal(s.audit.newParkingSigns,0);
 assert.equal(s.audit.originalOSMDataPreserved,true);
 assert.equal(s.audit.pedestrianCollisionChanged,false);
 assert.equal(s.live.visibleAfterLOD,true,
  'Photo parking separators must stay visible after 6.8s mobile LOD');
 assert.equal(s.live.actualDrawMeshCount,1);
 assert.equal(s.live.activeTriangles,s.audit.triangleCount);
 assert.equal(s.live.addedSyntheticParkingStalls,0);
 assert.equal(s.forecourt.visibleInScene,true,
  'Photo paver inlays must not remove the whole 5.123 square');
 assert.equal(s.storefront.allVisible,true,
  'All 5.124 clinic shop glass must remain visible');
 assert.equal(s.entrance.allVisible,true,
  'Photo teal clinic canopy must remain visible');
 assert(s.menuHeight<150,'Keep mobile camera tools compact');
 assert.deepEqual(errors,[],'No browser startup/LOD JS errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-spojovaci-clinic-photo-red-pavers-5125-mobile.png'
 });
 console.log('PASS 5.125 Spojovaci red paver photo details real mobile WebGL after 6.8s LOD',
  JSON.stringify({inlayCount:s.audit.modelledSeparatorCount,
   triangles:s.audit.renderedTriangles,meshCount:s.audit.renderedMeshes,
   visibleAfterLOD:s.live.visibleAfterLOD,
   legalParkingSlotCountUnknown:!s.audit.exactStallCountKnown,
   oldClinicGlassVisible:s.storefront.allVisible,
   oldForecourtVisible:s.forecourt.visibleInScene,
   menuHeight:s.menuHeight}));
 await page.close();
}finally{await browser.close()}
