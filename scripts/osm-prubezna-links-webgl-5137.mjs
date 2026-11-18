// Live mobile Chromium 5.137: the real pedestrian connections between
// Průběžná housing blocks get only a material change, never new geometry.
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
 await page.goto('http://127.0.0.1:8080/?v=513700&streetAudit=prubezna-links-5137',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='prubezna-links-5137'&&
   window.__milovicePrubeznaLinksRuntime?.()?.ready&&
   window.__milovicePrubezna2025Runtime?.()?.ready&&
   window.__milovicePrubeznaRoadRuntime?.()?.ready,
   null,{timeout:100000});
 }catch(e){
  const s=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   links:window.__milovicePrubeznaLinksRuntime?.(),
   base:window.__milovicePrubezna2025Runtime?.(),
   road:window.__milovicePrubeznaRoadRuntime?.()
  }));
  throw Error('5.137 live Průběžná links failed '+JSON.stringify(s)+
   ' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6400);
 const s=await page.evaluate(()=>({
  camera:window.__miloviceStreetAuditRendered,
  links:window.__milovicePrubeznaLinksRuntime?.(),
  older:window.__milovicePrubezna2025Runtime?.(),
  road:window.__milovicePrubeznaRoadRuntime?.(),
  materials:window.__miloviceOSMSurfaceAudit?.byMaterial,
  panelHeight:document.querySelector('#street-block-audit')?.getBoundingClientRect().height,
  totalCameras:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(s.camera.view,'prubezna-links-5137');
 assert.equal(s.links.version,'5.137');
 assert.deepEqual(s.links.sourceFootwayIds,['1282219855','1282219856']);
 assert.equal(s.links.originalFootwayMetres,48.8);
 assert.equal(s.links.renderedExistingSegments,2);
 assert.equal(s.links.addedFootways,0);
 assert.equal(s.links.addedColliders,0);
 assert.equal(s.links.addedLightingPoles,0);
 assert.equal(s.links.addedParkingSpots,0);
 assert.equal(s.links.actualRepavingOfTheseExactLinksPhotographed,false);
 assert.equal(s.older.updatedSurfaceWayCount,2);
 assert.equal(s.road.renderedExistingSegments,12);
 assert.equal(s.road.originalMapDrivenOneWay,true);
 assert.equal(s.materials['prubezna-concrete'],5);
 assert.equal(s.materials['prubezna-repaired-asphalt'],1);
 assert(s.totalCameras>=49);
 assert(s.panelHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-prubezna-two-footway-links-5137-mobile.png'});
 console.log('PASS 5.137 mobile WebGL: 2 original 48.8m mapped estate footpaths, 4 total paved ways, preserved one-way and 0 invented props');
 await page.close();
}finally{await browser.close()}
