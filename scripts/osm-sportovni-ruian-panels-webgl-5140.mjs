// Mobile WebGL 5.140: mapped Sportovní 8–9 floor buildings physically
// receive one floor course per RÚIAN building:levels (not one fake band).
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
 await page.goto('http://127.0.0.1:8080/?v=514000&streetAudit=sportovni-panel-houses-5140',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-panel-houses-5140'&&
   window.__miloviceSportovniResidentialRuntime?.()?.ready===true,
   null,{timeout:100000});
 }catch(e){
  const snapshot=await page.evaluate(()=>({
   regions:window.__miloviceAreasLoaded,
   street:window.__miloviceStreetAuditRendered,
   panel:window.__miloviceSportovniResidentialRuntime?.(),
   legacy:window.__miloviceMladaResidentialAudit
  }));
  throw Error('5.140 mapped panels failed '+JSON.stringify(snapshot)+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6200);
 const state=await page.evaluate(()=>({
  street:window.__miloviceStreetAuditRendered,
  audit:window.__miloviceSportovniResidentialRuntime?.(),
  other:window.__miloviceMladaResidentialAudit,
  asphalt:window.__milovicePrubeznaRoadRuntime?.(),
  path:window.__miloviceSportovniSidewalkRuntime?.(),
  cameras:document.querySelectorAll('#street-audit-nav a').length,
  panelHeight:document.querySelector('#street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(state.street.view,'sportovni-panel-houses-5140');
 assert.equal(state.audit.version,'5.140');
 assert.equal(state.audit.mappedApartmentBuildings,9);
 assert.equal(state.audit.mappedFloorsTotal,75);
 assert.equal(state.audit.mappedFlatsTotal,416);
 assert(state.audit.horizontalFloorJoints>=180);
 assert(state.audit.verticalBayJoints>0);
 assert(state.audit.duplicateVerticalJointsRemoved>0);
 assert(state.audit.sceneSeamMeshes>0);
 assert(state.audit.visibleSeamMeshes>0);
 assert(state.audit.visibleSeamInstances>0);
 assert(state.audit.verifiedFullParentChain);
 assert.equal(state.audit.structuralFootprintsChanged,0);
 assert.equal(state.audit.roofShapesChanged,0);
 assert.equal(state.audit.extraNewBuildings,0);
 assert.equal(state.other.mappedApartmentBuildings,22,
  'Previous Mladá 4–5-floor estate must remain separate');
 assert.equal(state.asphalt.renderedExistingSegments,12);
 assert.equal(state.path.sourceOSMMeters,162.9);
 assert(state.cameras>=53);
 assert(state.panelHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-sportovni-nine-ruian-tower-panels-5140-mobile.png'});
 console.log('PASS 5.140 live Sportovní 9 source-locked RÚIAN blocks, 75 real mapped floors, separate 22-block playground district and 0 changed footprints');
 await page.close();
}finally{await browser.close()}
