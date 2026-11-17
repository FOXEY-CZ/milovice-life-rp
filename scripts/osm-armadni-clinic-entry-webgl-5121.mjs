// 5.121: actual mobile Chromium/WebGL clinic photo entrance after LOD tick.
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
 const errors=[];page.on('pageerror',err=>errors.push(String(err.stack||err)));
 await page.goto(
  'http://127.0.0.1:8080/?v=512400&streetAudit=armadni-clinic-5118',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceClinicEntranceAudit?.renderedEntryBays===1&&
   window.__miloviceStreetAuditRendered?.view==='armadni-clinic-5118'&&
   window.__miloviceClinicEntranceRuntime?.()?.ready===true
  ),null,{timeout:110000});
 }catch(e){
  const debug=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   entrance:window.__miloviceClinicEntranceAudit,
   clinic:window.__miloviceArmLandmarksAudit,
   runtime:window.__miloviceClinicEntranceRuntime?.(),
   camera:window.__miloviceStreetAuditRendered
  }));
  throw Error('Grounded clinic photo entrance not in scene '+JSON.stringify(debug)+
   ' errors: '+JSON.stringify(errors)+' '+e);
 }
 // Verify actual Three.js instanced meshes AFTER the original 5 s
 // delayed visibility bug, not only a source planner and queued counts.
 await page.waitForTimeout(6800);
 const x=await page.evaluate(()=>({
  audit:window.__miloviceClinicEntranceAudit,
  runtime:window.__miloviceClinicEntranceRuntime?.(),
  main:window.__miloviceArmLandmarksRuntime?.(),
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  label:document.getElementById('build-label')?.textContent,
  panelHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert(/^20\d{6}-[a-z0-9-]+$/.test(x.meta));
 assert.equal(x.label,x.meta);
 assert.equal(x.audit.sourceWayId,'1057548624');
 assert.equal(x.audit.sourceStreetWayId,'246652750');
 assert.equal(x.audit.frontEdgeIndex,2);
 assert.equal(x.audit.modelledBayIndex,4);
 assert.equal(x.audit.exactEntranceBayVerified,false);
 assert.equal(x.audit.renderedEntryBays,1);
 assert.equal(x.audit.walkingPortalCreated,false);
 assert.equal(x.audit.inventedParkingSpaces,0);
 assert.equal(x.audit.newFootpaths,0);
 assert(x.audit.roadDistanceMeters>17&&x.audit.roadDistanceMeters<20);
 assert(x.audit.entranceAboveGroundMeters>=0&&
  x.audit.entranceAboveGroundMeters<=.081);
 assert.equal(x.runtime.allVisible,true,'Door and canopy must survive mobile LOD');
 for(const m of x.runtime.materials){
  assert(m.protectedFromDetailLOD,m.kind+' must be protected');
  assert(m.visibleInstances>0,m.kind+' must be visible');
 }
 assert.equal(x.runtime.materials.find(m=>m.kind==='clinicEntryGlass')
  ?.sceneInstances,1);
 assert.equal(x.runtime.materials.find(m=>m.kind==='clinicEntryFrame')
  ?.sceneInstances,5);
 assert.equal(x.runtime.materials.find(m=>m.kind==='clinicEntryCanopy')
  ?.sceneInstances,1);
 assert(x.main.ready,'Both photo-grounded BILLA and clinic must still exist');
 assert.equal(x.main.photoFacade.windowRows,4);
 assert.equal(x.main.photoFacade.bays,8);
 assert.equal(x.main.photoFacade.plannedWindows,24,
  'Upper floors keep three photo-modelled rows of 8 windows');
 assert.equal(x.main.photoFacade.groundGlazedBays,7,
  'Old hovering ground windows replaced with photo-based shop glazing');
 assert.equal(x.main.photoFacade.plannedTealPanels,24);
 assert(x.panelHeight<150,'Phone menu must remain compact');
 assert.deepEqual(errors,[],'No JavaScript page errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-clinic-entrance-5121-mobile.png'
 });
 console.log('PASS clinic 5.121 real WebGL photo entrance after 6.8s LOD',
  JSON.stringify({materials:x.runtime.materials,
   roadDistanceMeters:x.audit.roadDistanceMeters,
   floorAboveGround:x.audit.entranceAboveGroundMeters,
   photoFacade:x.main.photoFacade,menuHeight:x.panelHeight}));
 await page.close();
}finally{await browser.close()}
