// 5.124 — final real mobile Chromium/WebGL check of clinic photo-glazing,
// the LEMON/SPADIA info panel and old ground/road/photo details after LOD.
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
  'http://127.0.0.1:8080/?v=513000&streetAudit=armadni-clinic-5118',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='armadni-clinic-5118'&&
   window.__miloviceClinicShopfrontAudit?.groundGlassRendered===7&&
   window.__miloviceClinicShopfrontRuntime?.()?.ready===true&&
   window.__miloviceClinicForecourtRuntime?.()?.ready===true
  ),null,{timeout:110000});
 }catch(error){
  const diagnostic=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   storefront:window.__miloviceClinicShopfrontAudit,
   storefrontRuntime:window.__miloviceClinicShopfrontRuntime?.(),
   entry:window.__miloviceClinicEntranceAudit,
   paving:window.__miloviceClinicForecourtAudit,
   clinic:window.__miloviceArmLandmarksAudit,
   camera:window.__miloviceStreetAuditRendered
  }));
  throw Error('Ground clinic shop glazing missing '+JSON.stringify(diagnostic)+
   ' page errors: '+JSON.stringify(errors)+' '+error);
 }
 // Verify actual THREE instanced meshes after mobile's 5s detail LOD.
 await page.waitForTimeout(6800);
 const x=await page.evaluate(()=>({
  audit:window.__miloviceClinicShopfrontAudit,
  live:window.__miloviceClinicShopfrontRuntime?.(),
  clinic:window.__miloviceArmLandmarksRuntime?.(),
  entrance:window.__miloviceClinicEntranceRuntime?.(),
  pavement:window.__miloviceClinicForecourtRuntime?.(),
  version:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent,
  tenantPanelHidden:document.getElementById('street-audit-clinic-tenants')?.hidden,
  pharmacyText:document.getElementById('street-audit-clinic-tenants')?.textContent,
  menuHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(x.version,'20261118-spojovaci-complete-photo-street-context-513000');
 assert.equal(x.hud,x.version);
 assert.equal(x.audit.sourceBuildingId,'1057548624');
 assert.equal(x.audit.bays,8);
 assert.equal(x.audit.groundGlassRendered,7);
 assert.equal(x.audit.groundFramePiecesRendered,49);
 assert.equal(x.audit.groundGlassAnchoredToDEM,7);
 assert.equal(x.audit.missingGroundGrades,0);
 assert.equal(x.audit.pharmacyPlacementOnFacadeVerified,false);
 // 5.126: newer RE/MAX photography confirms generic green LÉKÁRNA letters.
 // Keep the old 5.124 tenant-bay uncertainty; the new text is not a verified
 // branded LEMON unit or an extra lease/entrance.
 assert.equal(x.audit.physicalPharmacySignAdded,true);
 assert.equal(x.audit.pharmacySignPhysicallyObserved,true);
 assert.equal(x.audit.newBusinessSignMeshes,0);
 assert.equal(x.audit.newAssumedShopDoorHoles,0);
 assert.equal(x.audit.newParkingBays,0);
 assert.equal(x.audit.newRoads,0);
 assert.equal(x.audit.newFootways,0);
 assert.equal(x.audit.actualLabInBuilding,true);
 assert.equal(x.audit.actualPharmacyInBuilding,true);
 assert.equal(x.live.glassInstances,7);
 assert.equal(x.live.frameInstances,49);
 assert.equal(x.live.allVisible,true,'Ground-height glass must survive 5s LOD');
 assert(x.live.materials.every(m=>m.protectedFromDetailLOD&&
  m.visibleInstances===m.sceneInstances&&m.sceneInstances>0));
 assert.equal(x.live.pharmacyExactBayVerified,false);
 assert.equal(x.clinic.ready,true);
 assert.equal(x.clinic.photoFacade.windowRows,4);
 assert.equal(x.clinic.photoFacade.bays,8);
 assert.equal(x.clinic.photoFacade.groundGlazedBays,7);
 assert.equal(x.clinic.photoFacade.plannedWindows,24,
  'Keep three original 8-bay upper floors, replace 7 lower floaters');
 assert.equal(x.clinic.photoFacade.plannedTealPanels,24);
 assert.equal(x.entrance.allVisible,true,
  'Retain previous source-gated teal canopy + glass entrance');
 assert.equal(x.pavement.visibleInScene,true,
  'Retain 5.123 photographed forecourt through LOD');
 assert.equal(x.tenantPanelHidden,false);
 assert(x.pharmacyText.includes('Lékárna LEMON'));
 assert(x.pharmacyText.includes('SPADIA'));
 assert(x.pharmacyText.includes('Přesné umístění'));
 assert(x.menuHeight<150,'Unopened tenant info must not bloat mobile UI');
 assert.deepEqual(errors,[],'No JavaScript startup or LOD errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-clinic-full-height-shops-5124-mobile.png'
 });
 console.log('PASS clinic 5.124 real mobile WebGL after 6.8s LOD',
  JSON.stringify({
   groundGlazing:x.audit.groundGlassRendered,
   frames:x.audit.groundFramePiecesRendered,
   renderGlass:x.live.glassInstances,
   renderFrames:x.live.frameInstances,
   visibleAfterLOD:x.live.allVisible,
   actualPharmacy:true,tenantBayConfirmed:false,
   upperWindows:x.clinic.photoFacade.plannedWindows,
   previousCanopyStillVisible:x.entrance.allVisible,
   previousForecourtStillVisible:x.pavement.visibleInScene,
   menuHeight:x.menuHeight
  }));
 await page.close();
}finally{await browser.close();}
