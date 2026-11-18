import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=514600&streetAudit=sportovni-photo-northwalk-5146',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceSportovniNorthWalkRuntime?.()?.ready&&
  window.__miloviceStreetAuditRendered?.view==='sportovni-photo-northwalk-5146',
  null,{timeout:105000})}
 catch(e){throw Error('5.146 scene not ready: '+JSON.stringify(
  await page.evaluate(()=>({
   regions:window.__miloviceAreasLoaded,
   view:window.__miloviceStreetAuditRendered,
   walk:window.__miloviceSportovniNorthWalkRuntime?.()
  })))+' errors '+JSON.stringify(errors)+' '+e)}
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>({
  walk:window.__miloviceSportovniNorthWalkRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  houses:window.__miloviceSportovniResidentialRuntime?.(),
  basket:window.__miloviceSportovniBasketballRuntime?.()
 }));
 assert.equal(r.walk.version,'5.146');
 assert.equal(r.walk.meshCount,2);
 assert.equal(r.walk.visibleMeshCount,2);
 assert(r.walk.modelNorthLengthMeters>46);
 assert.equal(r.walk.addedRoutingEdges,0);
 assert.equal(r.walk.addedColliders,0);
 assert.equal(r.walk.exactPositionUnsurveyed,true);
 assert(r.hall.ready&&r.houses.mappedApartmentBuildings===9);
 assert.equal(r.basket.renderedHoops,2);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-north-photo-walk-5146-mobile.png'});
 console.log('PASS 5.146 mobile LOD: north photo pavement and curb visible, hall and nine houses intact');
}finally{await browser.close()}
