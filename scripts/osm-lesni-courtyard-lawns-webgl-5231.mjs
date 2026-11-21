// 5.231 mobile Chromium/SwiftShader actual polygons + source-safe 3D.
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
 await page.goto('http://127.0.0.1:8080/?v=523100&streetAudit=lesni-courtyard-lawns-5231',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-courtyard-lawns-5231'&&
   window.__miloviceLesniCourtyardLawnsRuntime5231?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.231 courtyard lawn not ready '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    lawns:window.__miloviceLesniCourtyardLawnsRuntime5231?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceLesniCourtyardLawnsRuntime5231());
 assert.equal(x.ready,true);assert.equal(x.version,'5.231');
 assert.deepEqual(x.sourcePolygonIds,['1460019789','1460019790','1460019792']);
 assert.equal(x.sourceAreaM2,206.33);
 assert(x.tuftInstances>0&&x.tuftInstances<=168);
 assert(x.drawMeshes>0&&x.attachedMeshes===x.drawMeshes);
 assert(x.visibleAfterLOD,'new grass detail must survive view LOD');
 assert.equal(Object.values(x.byPolygon).reduce((a,b)=>a+b,0),x.tuftInstances);
 assert.equal(x.originalOSMPolygonsUnchanged,true);
 assert.equal(x.actualBladeLocationsUnknown,true);
 assert.equal(x.roadsAndFootwaysCleared,true);
 for(const k of ['newGrassPolygons','newTrees','newShrubs','newFootways','newRoads',
  'newCrossings','newColliders','newBuildings','newGardenFences',
  'newParkingPlaces','newStreetFurniture'])assert.equal(x[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-courtyard-lawns-5231-mobile.png'});
 console.log('PASS 5.231 mobile 3 authentic lawn polygons, 206.33m2, instanced grass, source guard and LOD visible');
}finally{await browser.close()}
