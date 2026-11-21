// 5.212 — mobile WebGL guard for original Višňová east lawn footprints.
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
 await page.goto('http://127.0.0.1:8080/?v=521200&streetAudit=visnova-east-lawns-5212',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-east-lawns-5212'&&
   window.__miloviceVisnovaEastLawnsRuntime5212?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.212 real mapped lawns/camera not loaded '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    lawns:window.__miloviceVisnovaEastLawnsRuntime5212?.(),
    error:document.getElementById('err')?.textContent})))+
   ' JS errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6100);
 const a=await page.evaluate(()=>window.__miloviceVisnovaEastLawnsRuntime5212?.());
 assert(a?.ready,JSON.stringify(a));
 assert.deepEqual(a.sourcePolygonIds,['1460019772','1460019799']);
 assert(a.tuftInstances>0&&a.tuftInstances<=150,
  'Source-based lawn grass must actually render within mobile budget: '+JSON.stringify(a));
 assert(a.drawMeshes>=1,'Instanced blade mesh must be drawn');
 assert.equal(a.sourceGeometryUnchanged,true);
 assert.equal(a.individualBladesPhotoVerified,false);
 for(const key of ['newGrassAreas','newShrubs','newFootways',
  'newRoads','newColliders'])assert.equal(a[key],0,key);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-east-lawns-5212-mobile.png'});
 console.log('PASS 5.212 mobile Chromium/WebGL after 6.1s, two OSM lawns, ',
  a.tuftInstances,'source-contained blade instances,',
  a.drawMeshes,'batched meshes; zero new roads/footways');
}finally{await browser.close()}
