// 5.144 mobile Chrome: EXIF-aligned street camera and two actual
// modeled photo-visible facade batches survive adaptive LOD 6+ seconds.
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
 await page.goto('http://127.0.0.1:8080/?v=514400&streetAudit=prubezna-public-photo-5144',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='prubezna-public-photo-5144'&&
  window.__milovicePrubeznaPhotoFacadeRuntime?.()?.ready,
  null,{timeout:105000})}
 catch(e){throw Error('5.144 photo facades not ready: '+
 JSON.stringify(await page.evaluate(()=>({
  loaded:window.__miloviceAreasLoaded,
  view:window.__miloviceStreetAuditRendered,
  facades:window.__milovicePrubeznaPhotoFacadeRuntime?.()
 })))+' errors '+JSON.stringify(errors)+' '+e)}
 await page.waitForTimeout(6200);
 const state=await page.evaluate(()=>({
  facade:window.__milovicePrubeznaPhotoFacadeRuntime?.(),
  camera:window.__miloviceStreetAuditRendered,
  gps:window.__miloviceAuditCameraGPS,
  residential:window.__miloviceSportovniResidentialRuntime?.(),
  entrance:window.__miloviceSportovniEntrancesRuntime?.(),
  basket:window.__miloviceSportovniBasketballRuntime?.(),
  menuHeight:document.querySelector('#street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(state.facade?.version,'5.144');
 assert.deepEqual(state.facade?.sourceFacadeIds?.slice().sort(),
  ['53865991','53865992']);
 assert.equal(state.facade?.renderedPhotoFrontages,2);
 assert.equal(state.facade?.unknownRearFacadesTreatedAsPhotoVerified,0);
 assert(state.facade?.visibleFacadeInstances>=2);
 assert.equal(state.camera.cameraMode,'documented-photo-gps-and-heading');
 assert(Math.abs(state.gps.latitude-50.230236)<.00001);
 assert(Math.abs(state.gps.longitude-14.864183)<.00001);
 assert(Math.abs(state.gps.bearingDegrees-272.09)<1);
 assert.equal(state.residential.mappedApartmentBuildings,9);
 assert(state.entrance.ready);
 assert.equal(state.basket.renderedHoops,2);
 assert(state.menuHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/prubezna-photo-facades-5144-mobile.png'});
 console.log('PASS 5.144: 2024 GPS+EXIF bearing, 2 documented visible model facades, nine towers and prior game details after mobile LOD');
 await page.close();
}finally{await browser.close()}
