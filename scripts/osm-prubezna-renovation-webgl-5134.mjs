// Milovice RP 5.134 — mobile Chromium confirms city-sourced 2025
// Průběžná pavers actually render along TWO OSM walking ways, while
// parking and streetlights remain unplaced without plan coordinates.
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
 await page.goto('http://127.0.0.1:8080/?v=513400&streetAudit=prubezna-renovation-5134',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='prubezna-renovation-5134'&&
   window.__milovicePrubezna2025Runtime?.()?.ready===true,
   null,{timeout:100000});
 }catch(e){
  throw Error('5.134 loading: '+JSON.stringify(await page.evaluate(()=>({
   region:window.__miloviceAreasLoaded,
   cam:window.__miloviceStreetAuditRendered,
   paving:window.__milovicePrubezna2025Runtime?.(),
   materials:window.__miloviceOSMSurfaceAudit?.byMaterial
  })))+' errors:'+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6300);
 const s=await page.evaluate(()=>({
  audit:window.__milovicePrubezna2025Runtime?.(),
  material:window.__miloviceOSMSurfaceAudit?.byMaterial,
  camera:window.__miloviceStreetAuditRendered,
  menuHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
  links:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(s.camera.view,'prubezna-renovation-5134');
 assert.equal(s.audit.version,'5.134');
 assert.equal(s.audit.updatedSurfaceWayCount,2);
 assert(s.audit.appliedVisualSegments>=2);
 assert.equal(s.material['prubezna-concrete'],4);
 assert.equal(s.audit.originalOSMFootwayLengthMeters,301);
 assert.equal(s.audit.existingOSMGeometryPreserved,true);
 assert.equal(s.audit.actualParkingPositionsSurveyed,false);
 assert.equal(s.audit.actualLuminairePositionsSurveyed,false);
 assert.equal(s.audit.newParkingBays,0);
 assert.equal(s.audit.newLightPoles,0);
 assert.equal(s.audit.newFootways,0);
 assert.equal(s.audit.newColliders,0);
 assert(s.links>=47);
 assert(s.menuHeight<150,'Street camera drawer must stay compact on mobile');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-prubezna-2025-concrete-sidewalk-5134-mobile.png'});
 console.log('PASS 5.134 Průběžná public works: 2 existing OSM paths / 301m city-modelled pavers; zero fabricated parking or lights');
 await page.close();
}finally{await browser.close()}
