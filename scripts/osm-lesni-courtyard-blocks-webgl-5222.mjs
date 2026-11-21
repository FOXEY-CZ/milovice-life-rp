// Milovice RP 5.222 real mobile Chromium/SwiftShader WebGL regression.
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
 await page.goto('http://127.0.0.1:8080/?v=522200&streetAudit=lesni-courtyard-north-5222',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-courtyard-north-5222'&&
   window.__miloviceLesniCourtyardRuntime5222?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.222 both RÚIAN/OSM residential buildings not ready: '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    buildings:window.__miloviceLesniCourtyardRuntime5222?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceLesniCourtyardRuntime5222());
 assert(x?.ready,'RÚIAN details must survive LOD');
 assert.equal(x.version,'5.222');
 assert.deepEqual(x.sourceBuildingIds,['53866101','194679566']);
 assert.deepEqual(x.originalFloors,[2,4]);
 assert.deepEqual(x.originalFlats,[12,26]);
 assert.equal(x.estimatedWindows,106);
 assert.equal(x.facadeEdges,10);
 assert.equal(x.originalPlinthEdges,40);
 assert.equal(x.meshCount,8);
 assert.equal(x.triangles,1564);
 for(const [i,b] of x.buildings.entries()){
  assert.equal(b.modelWindows,i===0?38:68);
  assert.equal(b.plinthEdges,i===0?12:28);
  assert.equal(b.facadeEdges,5);
  assert.equal(b.meshCount,4);
  assert.equal(b.inScene,true);
  assert.equal(b.visibleAfterLOD,4);
  assert.equal(b.photoVerified,false);
 }
 for(const name of ['newBuildings','newRoads','newFootways',
  'newColliders','newEntrances','newBalconies','changedRoofShapes',
  'changedBuildingFootprints'])assert.equal(x[name],0,name);
 assert.deepEqual(errors,[],'no browser JavaScript errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-courtyard-5222-mobile.png'});
 // Second direct technical camera should also initialize correctly.
 await page.goto('http://127.0.0.1:8080/?v=522200&streetAudit=lesni-courtyard-south-5222',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
   window.__miloviceStreetAuditRendered?.view==='lesni-courtyard-south-5222'&&
   window.__miloviceLesniCourtyardRuntime5222?.()?.ready===true,
   null,{timeout:115000});
 assert.deepEqual(errors,[],'no JavaScript errors after camera switch');
 console.log('PASS 5.222 two actual RÚIAN 2+4-floor homes, 106 model windows,',
 '8 WebGL meshes / 1564 triangles attached & visible after LOD,',
 'two original mapped street audit cameras, unchanged source GIS');
}finally{await browser.close()}
