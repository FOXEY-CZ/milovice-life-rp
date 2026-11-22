// 5.262 — actual mobile WebGL rendering of photo-backed red building socle.
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
  isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
  'http://127.0.0.1:8080/?v=526200&streetAudit=italska-photo-red-plinth-5262',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceItalskaPhotoRedPlinthRuntime5262?.()?.ready===true&&
   window.__miloviceStreetAuditRendered?.view==='italska-photo-red-plinth-5262',
   null,{timeout:120000});
 }catch(e){
  const diag=await page.evaluate(()=>({
   red:window.__miloviceItalskaPhotoRedPlinthRuntime5262?.(),
   old:window.__miloviceItalskaVojenskeZatisiRuntime5249?.(),
   view:window.__miloviceStreetAuditRendered?.view,
   areas:window.__miloviceAreasLoaded,
   status:document.getElementById('status')?.textContent
  }));
  throw Error('5.262 original-photo facade did not initialize: '+
   JSON.stringify({diag,errors,original:String(e)}));
 }
 await page.waitForTimeout(6600);
 const report=await page.evaluate(()=>({
  photo:window.__miloviceItalskaPhotoRedPlinthRuntime5262?.(),
  old:window.__miloviceItalskaVojenskeZatisiRuntime5249?.(),
  view:window.__miloviceStreetAuditRendered,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')?.content
 }));
 const p=report.photo;
 assert.equal(p?.ready,true,JSON.stringify(report));
 assert.equal(p.sourceOSMId,'53865882');
 assert.equal(p.sourceRUIANId,'40057411');
 assert.equal(p.sourceHash,'7aec42bc');
 assert.deepEqual(p.selectedOriginalEdges,[11,12,13,14,16]);
 assert.equal(p.renderedOriginalWallEdges,5);
 assert.equal(p.drawMeshes,2);
 assert.equal(p.visibleAfterLOD,2);
 assert(p.paintBandTriangles>30&&p.paintBandTriangles<80,
  'The model red plinth must follow original terrain under each OSM facade');
 assert.equal(p.terrainDrapedLowerPaint,true);
 assert(p.groundSamples>=40);
 assert(p.minBottomGapMetres>.04&&p.maxBottomGapMetres<.07,
  'No hovering red lower plaster above model ground: '+JSON.stringify(p));
 assert(p.estimatedWornAreas>=4);
 assert.equal(p.heightPhotoMeasured,false);
 assert.equal(p.redColourPhotoMeasured,false);
 assert.equal(p.newEntrances,0);
 assert.equal(p.newWindows,0);
 assert.equal(p.newColliders,0);
 assert.equal(p.newRoads,0);
 assert.equal(p.newFootways,0);
 assert.equal(p.newFences,0);
 assert.equal(report.old?.ready,true,'Previous 5.251 source photo façade must survive');
 assert.equal(report.old.renderedPhotoFacingEdges,18);
 assert.equal(report.view?.view,'italska-photo-red-plinth-5262');
 assert.equal(report.view?.technicalStreetLevel,true);
 assert.equal(report.build,report.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/italska-photo-red-plinth-5262-mobile.png'
 });
 console.log('PASS 5.262 mobile original Vojenské zátiší: five exact OSM photo-visible red-lower-wall edges, two decorative draw meshes, source façade and 6.6s LOD intact; no new building / entrances / windows');
}finally{
 await browser.close();
}
