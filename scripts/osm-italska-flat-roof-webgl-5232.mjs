// Milovice RP 5.232 — real mobile WebGL / SwiftShader, mapped flat roof.
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
 const page=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=523200&streetAudit=italska-flat-roof-5232',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-flat-roof-5232'&&
   window.__miloviceItalskaFlatRoofRuntime5232?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.232 original flat roof did not render '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    mapped:window.__miloviceItalskaFlatRoofRuntime5232?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const a=await page.evaluate(()=>window.__miloviceItalskaFlatRoofRuntime5232?.());
 assert(a?.ready,'flat roof/LOD '+JSON.stringify(a));
 assert.equal(a.sourceBuildingId,'1112779894');
 assert.equal(a.mappedRoofShape,'flat');
 assert.equal(a.originalMappedLevels,2);
 assert.equal(a.actualModelFloors,2);
 assert.equal(a.originalOSMNodes,5);
 assert.equal(a.roofGeometryType,'ShapeGeometry');
 assert.equal(a.noPitchedRoofMesh,true);
 assert.equal(a.roofAttached,true);
 assert.equal(a.roofVisibleAfterLOD,true);
 assert.equal(a.existingShellRetained,true);
 assert.equal(a.originalBuildingShellReused,true);
 assert.equal(a.sourceGPSUnchanged,true);
 for(const k of ['newBuildings','newRoads','newFootways','newRoofGeometry',
  'newColliders','newFacades','newLandscaping'])assert.equal(a[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-flat-roof-5232-mobile.png'});
 console.log('PASS 5.232 mobile WebGL actual source-tagged flat roof, LOD 6.5s');
}finally{await browser.close()}
