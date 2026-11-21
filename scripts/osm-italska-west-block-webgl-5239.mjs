// Milovice 5.239 — actual mobile WebGL + 6.5s LOD on original 2-floor RUIAN shell.
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
 await page.goto('http://127.0.0.1:8080/?v=523900&streetAudit=italska-west-block-5239',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-west-block-5239'&&
   window.__miloviceItalskaWestBlockRuntime5239?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.239 source-locked two-floor building failed '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    block:window.__miloviceItalskaWestBlockRuntime5239?.(),
    error:document.getElementById('err')?.textContent
   })))+' pageerrors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const block=await page.evaluate(()=>window.__miloviceItalskaWestBlockRuntime5239());
 assert(block.ready,'actual 3D block must remain present after 6.5s LOD');
 assert.equal(block.sourceOSMId,'53865932');
 assert.equal(block.sourceRUIANId,'25789767');
 assert.equal(block.sourceReportedFloors,2);
 assert.equal(block.sourceReportedFlats,38);
 assert.equal(block.estimatedWindowsRendered,68);
 assert.equal(block.facadeEdges,5);
 assert.equal(block.meshCount,4);
 assert.equal(block.inScene,true);
 assert.equal(block.visibleAfterLOD,4);
 assert.equal(block.originalBuildingGeometryUnchanged,true);
 assert.equal(block.windowLocationsPhotoVerified,false);
 assert.equal(block.newColliders,0);
 assert.equal(block.newEntrances,0);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-west-block-5239-mobile.png'});
 console.log('PASS 5.239 actual mobile WebGL two-floor RUIAN source shell and 68 model windows after LOD');
}finally{await browser.close()}
