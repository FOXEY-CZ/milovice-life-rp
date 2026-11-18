// Mobile Chromium 5.145: high modelled sports hall stays rendered after LOD.
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
 await page.goto('http://127.0.0.1:8080/?v=514500&streetAudit=sportovni-hall-5145',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='sportovni-hall-5145'&&
  window.__miloviceSportovniHallRuntime?.()?.ready,
  null,{timeout:105000});
 }catch(e){throw Error('5.145 sport hall unready: '+
  JSON.stringify(await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   hall:window.__miloviceSportovniHallRuntime?.()
  })))+' errors '+JSON.stringify(errors)+' '+e)}
 await page.waitForTimeout(6200);
 const s=await page.evaluate(()=>({
  hall:window.__miloviceSportovniHallRuntime?.(),
  gps:window.__miloviceAuditCameraGPS,
  camera:window.__miloviceStreetAuditRendered,
  panels:window.__miloviceSportovniResidentialRuntime?.(),
  basket:window.__miloviceSportovniBasketballRuntime?.(),
  menuHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(s.hall.version,'5.145');
 assert.equal(s.hall.sourceId,'53866046');
 assert.equal(s.hall.originalOSMLevels,1);
 assert.equal(s.hall.modelHeightMeters,9.6);
 assert.equal(s.hall.facadeMeshInstances,1);
 assert(s.hall.visibleFacadeMeshInstances>=1);
 assert(s.hall.ribMeshInstances>=35&&s.hall.ribMeshInstances<=49);
 assert(s.hall.visibleRibMeshInstances>=35);
 assert.equal(s.hall.blankObservedFaceHasGenericWindows,false);
 assert.equal(s.hall.addedColliders,0);
 assert.equal(s.hall.photographedHeightExact,false);
 assert.equal(s.camera.cameraMode,'documented-photo-gps-and-heading');
 assert(Math.abs(s.gps.latitude-50.230950)<.00001);
 assert(Math.abs(s.gps.longitude-14.866606)<.00001);
 assert(Math.abs(s.gps.bearingDegrees-277.50)<1);
 assert.equal(s.panels.mappedApartmentBuildings,9);
 assert.equal(s.basket.renderedHoops,2);
 assert(s.menuHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-hall-5145-mobile.png'});
 console.log('PASS 5.145 mobile WebGL: full height 1-level source hall with photographed wall cladding and LOD');
 await page.close();
}finally{await browser.close()}
