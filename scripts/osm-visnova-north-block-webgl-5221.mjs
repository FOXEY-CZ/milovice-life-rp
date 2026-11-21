// Milovice RP 5.221 actual mobile Chromium/SwiftShader WebGL.
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
 await page.goto('http://127.0.0.1:8080/?v=522100&streetAudit=visnova-north-block-5221',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-north-block-5221'&&
   window.__miloviceVisnovaNorthBlockRuntime5221?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.221 real 7-floor RÚIAN block not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    audit:window.__miloviceVisnovaNorthBlockRuntime5221?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceVisnovaNorthBlockRuntime5221());
 assert(x?.ready,'original 3D façade survives LOD');
 assert.equal(x.version,'5.221');
 assert.equal(x.sourceOSMId,'53866112');
 assert.equal(x.sourceRUIANId,'27246191');
 assert.equal(x.originalFloors,7);
 assert.equal(x.originalFlats,69);
 assert.equal(x.modelWindows,336);
 assert.equal(x.facadeEdges,4);
 assert.equal(x.plinthEdges,4);
 assert.equal(x.meshCount,4);
 assert.equal(x.triangles,4712);
 assert.equal(x.inScene,true);
 assert.equal(x.visibleAfterLOD,4);
 assert.equal(x.photoVerified,false);
 for(const name of ['addedBuildings','addedRoads','addedFootways',
  'addedDoors','addedBalconies','addedColliders','changedRoof',
  'changedFootprint'])assert.equal(x[name],0,name);
 assert.deepEqual(errors,[],'no JavaScript errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-north-block-5221-mobile.png'});
 console.log('PASS 5.221 actual mobile WebGL 7-floor RÚIAN building; 336 model',
 'windows, 4 meshes, 4712 triangles attached and LOD visible 6.5s later');
}finally{await browser.close()}
