// Milovice 5.235 actual mobile WebGL/LOD on two original RUIAN houses.
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
 await page.goto('http://127.0.0.1:8080/?v=523500&streetAudit=italska-apartments-three-5235',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='italska-apartments-three-5235'&&
   window.__miloviceItalskaApartmentsRuntime5235?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.235 original building facades failed '+JSON.stringify(
   await page.evaluate(()=>({
    area:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    test:window.__miloviceItalskaApartmentsRuntime5235?.(),
    error:document.getElementById('err')?.textContent
   })))+' pageerrors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const a=await page.evaluate(()=>window.__miloviceItalskaApartmentsRuntime5235());
 assert(a.ready,'both actual 3D facades ready '+JSON.stringify(a));
 assert.equal(a.buildings.length,2);
 assert.deepEqual(a.buildings.map(b=>b.sourceOSMId),['61979295','53865838']);
 assert.deepEqual(a.buildings.map(b=>b.sourceReportedFloors),[6,3]);
 assert.deepEqual(a.buildings.map(b=>b.sourceReportedFlats),[56,33]);
 assert.deepEqual(a.buildings.map(b=>b.estimatedWindowsRendered),[198,90]);
 assert(a.buildings.every(b=>b.inScene&&b.visibleAfterLOD===4&&b.meshCount===4));
 assert.equal(a.totalModeledWindows,288);
 assert.equal(a.totalMeshes,8);
 assert.equal(a.modelWindowLocationsNotPhotographed,true);
 assert.equal(a.originalBuildingGeometryUnchanged,true);
 for(const k of ['newRoads','newFootways','newColliders','newBuildingVolumes',
  'newRoofs','inventedDoors','inventedBalconies'])assert.equal(a[k],0,k);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-apartments-5235-mobile.png'});
 console.log('PASS 5.235 mobile WebGL 6+3 story Italska original 2 shells, 288 estimated windows visible after LOD');
}finally{await browser.close()}
