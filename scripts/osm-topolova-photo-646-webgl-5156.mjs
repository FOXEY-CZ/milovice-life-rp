import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=515600&streetAudit=topolova-646-photo-5156',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-646-photo-5156'&&
   window.__miloviceTopolova646PhotoRuntime?.()?.ready,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.156 model not ready '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    cam:window.__miloviceStreetAuditRendered,
    now:window.__miloviceTopolova646PhotoRuntime?.(),
    old:window.__miloviceTopolovaRowRuntime?.()
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const r=await page.evaluate(()=>({
  p:window.__miloviceTopolova646PhotoRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  school:window.__miloviceSlunickoWestRuntime?.(),
  masonry:window.__miloviceTopolovaResidentialRuntime?.(),
  zebra:window.__miloviceZebraV7Runtime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(r.p?.sourceOSMId,'53866048');
 assert.equal(r.p?.sourceOriginalLevels,1);
 assert.equal(r.p?.actualFloors,3);
 assert.equal(r.p?.actualWallHeight,9.15);
 assert(Math.abs(r.p?.extrudedWallHeight-9.15)<.001,
  'GPU Float32 world mesh height must be within 1mm of the photo-derived model');
 assert.equal(r.p?.pitchedRoofCreated,true);
 assert.equal(r.p?.renderedMeshes,4);
 assert.equal(r.p?.modelGables,16);
 assert.equal(r.p?.bothPhotoPlan?.version,'5.157');
 assert.equal(r.p?.modelMainWindows,96);
 assert.equal(r.p?.modelAtticWindows,32);
 assert.equal(r.p?.visibleAfterLOD,4);
 assert.equal(r.p?.suppressedUnverifiedEntrance,true);
 assert(r.row?.ready&&r.school?.ready&&r.masonry?.ready&&r.zebra?.ready);
 assert(r.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-photo-646-5156-mobile.png'});
 console.log('PASS photo 646 wall+red gabled roof+4 merged material meshes after mobile 6.8-second LOD');
}finally{await browser.close()}
