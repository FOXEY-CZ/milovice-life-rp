// 5.120: live mobile Chromium/WebGL regression on the BILLA entrance.
// Specifically catches an old bug: fixtures spawned correctly, then
// disappeared after the first 5-second LOD update.
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
  viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto(
  'http://127.0.0.1:8080/?v=512400&streetAudit=armadni-billa-5118',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceBillaTrolleyAudit?.modelledCarts===6&&
   window.__miloviceStreetAuditRendered?.view==='armadni-billa-5118'&&
   window.__miloviceBillaTrolleyRuntime?.()?.roofInstances>=3
  ),null,{timeout:110000});
 }catch(error){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   rack:window.__miloviceBillaTrolleyAudit,
   runtime:window.__miloviceBillaTrolleyRuntime?.(),
   camera:window.__miloviceStreetAuditRendered,
   status:document.getElementById('status')?.textContent
  }));
  throw Error('Photo BILLA carts missing in mobile WebGL: '+
   JSON.stringify(debug)+' errors: '+JSON.stringify(errors)+' '+error);
 }
 // Test AFTER the first active LOD tick, not just a 3D model planner.
 await page.waitForTimeout(6500);
 const state=await page.evaluate(()=>({
  runtime:window.__miloviceBillaTrolleyRuntime?.(),
  audit:window.__miloviceBillaTrolleyAudit,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  panelHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert.equal(state.meta,state.build);
 assert(/^20\d{6}-[a-z0-9-]+$/.test(state.build),
  'BILLA carts must remain valid in later clinic release');
 assert.equal(state.audit.sourceWayId,'53865798');
 assert.equal(state.audit.accessWayId,'1057548615');
 assert.equal(state.audit.newRoads,0);
 assert.equal(state.audit.newFootpaths,0);
 assert.equal(state.audit.newParkingSpaces,0);
 assert(state.audit.mappedServiceRoadClearanceMeters>=.45);
 assert.equal(state.runtime.roofInstances,3);
 assert(state.runtime.visibleRoofInstances>=3);
 assert(state.runtime.allMaterialsVisible,
  'Every photo trolley fixture material must survive mobile LOD');
 assert(state.runtime.materials.every(m=>m.protectedFromDetailLOD));
 assert.equal(state.runtime.materials.find(m=>m.kind==='billaCartFrame')
  ?.sceneInstances,14,'2 posts + 2x6 steel cart parts');
 assert.equal(state.runtime.materials.find(m=>m.kind==='billaCartHandle')
  ?.sceneInstances,6);
 assert.equal(state.runtime.materials.find(m=>m.kind==='billaCartWheel')
  ?.sceneInstances,6);
 assert(state.panelHeight<150,'Keep mobile inspection menu compact');
 assert.deepEqual(errors,[],'Mobile WebGL startup and LOD must be error-free');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-billa-photo-trolleys-5120-mobile.png'
 });
 console.log('PASS BILLA 5.120 real WebGL photo carts after 6.5s LOD',
  JSON.stringify({materials:state.runtime.materials,
   roadClearance:state.audit.mappedServiceRoadClearanceMeters,
   UIHeight:state.panelHeight}));
 await page.close();
}finally{await browser.close()}
