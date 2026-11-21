// Milovice RP 5.249 — photographed original Italská landmark in mobile WebGL.
// Source photographs: Stanislav Doronenko, 2025-08-20, CC BY-SA 4.0.
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
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error.stack||error)));
 await page.goto(
  'http://127.0.0.1:8080/?v=524900&streetAudit=italska-vojen-zatisi-5249',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceStreetAuditRendered?.view==='italska-vojen-zatisi-5249'&&
   window.__miloviceItalskaVojenskeZatisiRuntime5249?.()?.ready===true,
   null,{timeout:120000});
 }catch(err){
  throw Error('5.249 site did not initialize '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    facade:window.__miloviceItalskaVojenskeZatisiRuntime5249?.(),
    error:document.getElementById('err')?.textContent
   })))+' pageerrors='+JSON.stringify(errors)+' '+err);
 }
 await page.waitForTimeout(6600);
 const report=await page.evaluate(()=>({
  site:window.__miloviceItalskaVojenskeZatisiRuntime5249?.(),
  view:window.__miloviceStreetAuditRendered,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')
   ?.getAttribute('content')
 }));
 assert(report.site?.ready,'5.249 photo building must survive >6s mobile LOD');
 assert.equal(report.view?.view,'italska-vojen-zatisi-5249');
 assert.equal(report.site.sourceOSMId,'53865882');
 assert.equal(report.site.sourceRUIANId,'40057411');
 assert.equal(report.site.sourceGeometryHash,'7aec42bc');
 assert.equal(report.site.originalVertices,29);
 assert(Math.abs(report.site.originalAreaSquareMetres-913.64)<.03);
 assert.equal(report.site.modelFloorCount,2);
 assert.equal(report.site.osmFloorCountUnspecified,true);
 assert.equal(report.site.renderedPhotoFacingEdges,12);
 assert.equal(report.site.originalPhotoFacingCandidates,15);
 assert.equal(report.site.selfOccludedFacadeEdgesRemoved,3);
 assert.equal(report.site.photoSightlineModelApproximate,true);
 assert.equal((await page.evaluate(()=>window.__miloviceItalskaSightlineRuntime5250?.()))?.visibilityIsGeometricEstimate,true);
 assert.equal(report.site.estimatedWearPatches,11);
 assert.equal(report.site.drawMeshes,2);
 assert.equal(report.site.visibleAfterLOD,2);
 assert.equal(report.site.wallMaterialColor,'#eeeae4');
 assert.equal(report.site.roofMaterialColor,'#655e54');
 assert.equal(report.site.originalFootprintPreserved,true);
 assert.equal(report.site.originalRoofGeometryPreserved,true);
 assert.equal(report.site.actualWindowPositionsUnverified,true);
 assert.equal(report.site.newWindows,0);
 assert.equal(report.site.newEntrances,0);
 assert.equal(report.site.newColliders,0);
 assert.equal(report.site.newRoads,0);
 assert.equal(report.site.newFootways,0);
 assert.equal(report.site.newFences,0);
 assert.equal(report.build,report.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/italska-vojen-zatisi-5249-mobile.png'
 });
 console.log('PASS 5.249 actual 393px mobile WebGL photo style, 2 batches, '+
  '12 unoccluded original facades and 6.6s LOD');
}finally{await browser.close()}
