// Milovice 5.238 — actual mobile WebGL + 6.5s LOD on original 12-floor RUIAN shell.
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
 await page.goto('http://127.0.0.1:8080/?v=523800&streetAudit=italska-tower-5238',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-tower-5238'&&
   window.__miloviceItalskaTowerRuntime5238?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.238 source-locked twelve-floor building failed '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    tower:window.__miloviceItalskaTowerRuntime5238?.(),
    error:document.getElementById('err')?.textContent
   })))+' pageerrors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const tower=await page.evaluate(()=>window.__miloviceItalskaTowerRuntime5238());
 assert(tower.ready,'actual 3D tower must remain present after 6.5s LOD');
 assert.equal(tower.sourceOSMId,'53865925');
 assert.equal(tower.sourceRUIANId,'26650959');
 assert.equal(tower.sourceReportedFloors,12);
 assert.equal(tower.sourceReportedFlats,22);
 assert.equal(tower.estimatedWindowsRendered,408);
 assert.equal(tower.facadeEdges,4);
 assert.equal(tower.meshCount,4);
 assert.equal(tower.inScene,true);
 assert.equal(tower.visibleAfterLOD,4);
 assert.equal(tower.originalBuildingGeometryUnchanged,true);
 assert.equal(tower.windowLocationsPhotoVerified,false);
 assert.equal(tower.newColliders,0);
 assert.equal(tower.newEntrances,0);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-tower-5238-mobile.png'});
 console.log('PASS 5.238 actual mobile WebGL twelve-floor RUIAN source shell and 408 model windows after LOD');
}finally{await browser.close()}
