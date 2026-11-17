// 5.112: real mobile-Chromium check of Slepá's 12 RÚIAN family houses.
// Source house footprints/levels are mapped; facade openings are estimates.
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
 await page.goto(
  'http://127.0.0.1:8080/?v=511200&streetAudit=road-slepa-5108',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   (window.__miloviceAreasLoaded?.includes('mlada')||
    window.__miloviceAreasLoaded?.includes('vrutice'))&&
   window.__miloviceSlepaHouseAudit?.eligibleTwoStoreyHouses===12&&
   window.__miloviceStreetAuditRendered?.view==='road-slepa-5108',
   null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   houseAudit:window.__miloviceSlepaHouseAudit,
   camera:window.__miloviceStreetAuditRendered
  }));
  throw Error('Slepá source family houses missing in 3D: '+
   JSON.stringify(debug)+' browser errors: '+JSON.stringify(errors)+' '+e);
 }
 const state=await page.evaluate(()=>({
  house:window.__miloviceSlepaHouseAudit,
  menu:window.__miloviceStreetAuditMenu,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  menuPanelHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert.equal(state.house.eligibleTwoStoreyHouses,12);
 assert.deepEqual(state.house.sourceHouseIds.slice().sort(),[
  '61977976','61977982','61977989','61977993',
  '61977995','61978001','61978003','61978005',
  '61978010','61978012','61978013','61978015'
 ]);
 assert(state.house.frontageModelledByStreet>=1);
 assert.equal(state.house.newBuildingsAdded,0);
 assert.equal(state.house.unverifiedGardenFencesAdded,0);
 assert.equal(state.house.originalFootprintsUnchanged,true);
 assert.equal(state.house.existingRoofShapesUnchanged,true);
 assert.equal(state.house.realPhotoVerifiedDoors,0);
 assert.equal(state.house.realPhotoVerifiedWindows,0);
 assert(state.house.unverifiedGlassAwningsRemoved>=1);
 assert.equal(state.meta,state.build);
 assert(state.meta.endsWith('511200'));
 assert(state.menuPanelHeight<150,
  'Audit selection panel on mobile must stay collapsed by default');
 await page.waitForTimeout(6500);
 const runtime=await page.evaluate(()=>
  window.__miloviceSlepaHouseRuntime?.());
 assert(runtime?.ready&&runtime.checkedSceneParentChain);
 assert.equal(runtime.expectedMappedHouses,12);
 assert(runtime.realMeshDoors>=1,
  'At least one real batched house door must survive in Three scene');
 assert(runtime.visibleMeshDoors>=1,
  'At least one mapped house door must stay visible after mobile LOD');
 assert.deepEqual(errors,[],'No startup or delayed JS errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-slepa-family-house-5112-mobile.png'});
 console.log('PASS 5.112 Slepá RÚIAN family houses mobile scene',JSON.stringify({
  houses:state.house.eligibleTwoStoreyHouses,
  realDoors:runtime.realMeshDoors,visibleDoors:runtime.visibleMeshDoors,
  preventedWindowCollisions:state.house.groundFloorWindowsPreventedFromDoor,
  fakeAwningsRemoved:state.house.unverifiedGlassAwningsRemoved
 }));
 await page.close();
}finally{await browser.close()}
