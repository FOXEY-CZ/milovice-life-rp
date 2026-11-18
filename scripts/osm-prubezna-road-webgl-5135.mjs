// Milovice RP 5.135: mobile Chromium confirms exactly 12 original
// Průběžná road segments get cleaner asphalt while one-way, real
// footways, nearby buildings and all safety guards remain untouched.
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
 await page.goto('http://127.0.0.1:8080/?v=513500&streetAudit=prubezna-road-asphalt-5135',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='prubezna-road-asphalt-5135'&&
   window.__milovicePrubeznaRoadRuntime?.()?.ready===true&&
   window.__milovicePrubezna2025Runtime?.()?.ready===true,
   null,{timeout:100000});
 }catch(e){
  throw Error('5.135 Průběžná source road failed '+JSON.stringify(await page.evaluate(()=>({
   regions:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   road:window.__milovicePrubeznaRoadRuntime?.(),
   paths:window.__milovicePrubezna2025Runtime?.(),
   materials:window.__miloviceOSMSurfaceAudit?.byMaterial
  })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const s=await page.evaluate(()=>({
  road:window.__milovicePrubeznaRoadRuntime?.(),
  pavedPaths:window.__milovicePrubezna2025Runtime?.(),
  materials:window.__miloviceOSMSurfaceAudit?.byMaterial,
  camera:window.__miloviceStreetAuditRendered,
  menuHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
  links:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(s.camera.view,'prubezna-road-asphalt-5135');
 assert.equal(s.road.version,'5.135');
 assert.equal(s.road.sourceRoadId,'83076189');
 assert.equal(s.road.sourceOSMSegments,12);
 assert.equal(s.road.renderedExistingSegments,12);
 assert.equal(s.road.originalMapDrivenOneWay,true);
 assert.equal(s.road.sourceOSMMetres,256.6);
 assert.equal(s.road.originalRoadWidthPreserved,true);
 assert.equal(s.road.originalTrafficGraphPreserved,true);
 assert.equal(s.road.originalVertexGeometryPreserved,true);
 assert.equal(s.road.preciseResurfacingBoundarySurveyed,false);
 assert.equal(s.road.addedColliders,0);
 assert.equal(s.road.newRoadSegments,0);
 assert.equal(s.road.newCurbs,0);
 assert.equal(s.road.inventedParkingSpaces,0);
 assert.equal(s.road.inventedStreetLights,0);
 assert.equal(s.road.inventedPaintedLines,0);
 assert.equal(s.materials['prubezna-repaired-asphalt'],1);
 assert.equal(s.materials['prubezna-concrete'],5);
 assert(s.pavedPaths.appliedVisualSegments>0);
 assert(s.links>=48);
 assert(s.menuHeight<150,'Street source audit must stay compact on phone');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-prubezna-asphalt-5135-mobile.png'});
 console.log('PASS 5.135 Průběžná: real 12 road segments, source 256.6m one-way, 2 original concrete sidewalks, no invented parking/lights/curbs');
 await page.close();
}finally{await browser.close()}
