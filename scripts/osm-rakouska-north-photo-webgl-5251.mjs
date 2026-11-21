// 5.251: real mobile 3D view north of the source-locked former
// Vojenske zatisi, from Rakouska 2025 photo GPS (not heading calibration).
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
  'http://127.0.0.1:8080/?v=525100&streetAudit=rakouska-vojen-zatisi-5251',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceStreetAuditRendered?.view==='rakouska-vojen-zatisi-5251'&&
   window.__miloviceRakouskaNorthPhotoRuntime5251?.()?.ready===true,
   null,{timeout:120000});
 }catch(err){
  throw Error('5.251 Rakouska photo view not initialized '+
   JSON.stringify(await page.evaluate(()=>({
    regions:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    north:window.__miloviceRakouskaNorthPhotoRuntime5251?.(),
    error:document.getElementById('err')?.textContent
   })))+' pageerrors='+JSON.stringify(errors)+' '+err);
 }
 await page.waitForTimeout(6700);
 const report=await page.evaluate(()=>({
  north:window.__miloviceRakouskaNorthPhotoRuntime5251?.(),
  view:window.__miloviceStreetAuditRendered,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')
   ?.getAttribute('content')
 }));
 assert(report.north?.ready,'5.251 north view must persist after mobile LOD');
 assert.equal(report.view?.view,'rakouska-vojen-zatisi-5251');
 assert.equal(report.north.sourceOSMId,'53865882');
 assert.equal(report.north.sourceRUIANId,'40057411');
 assert.equal(report.north.sourceGeometryHash,'7aec42bc');
 assert.equal(report.north.renderedPhotoFacingEdges,18);
 assert.equal(report.north.rakouskaNewNorthVisibleEdges,6);
 assert.deepEqual(report.north.northEdgeIndices,[0,1,2,3,5,27]);
 assert.equal(report.north.estimatedWearPatches,16);
 assert.equal(report.north.photoViewCount,3);
 assert.equal(report.north.drawMeshes,2);
 assert.equal(report.north.visibleAfterLOD,2);
 assert.equal(report.north.newEntrances,0);
 assert.equal(report.north.newColliders,0);
 assert.equal(report.north.newRoads,0);
 assert.equal(report.north.newFootways,0);
 assert.equal(report.north.photoDetailsMeasured,false);
 assert.equal(report.build,report.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/rakouska-vojen-zatisi-5251-mobile.png'
 });
 console.log('PASS 5.251 real north-facing photo GPS camera, 18 original facade edges, 16 approximate plaster marks, mobile LOD 6.7s');
}finally{await browser.close()}
