import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true});
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=515100&streetAudit=milten-court-corridor-5151',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='milten-court-corridor-5151'&&
   window.__miloviceMiltenCorridorRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.151 corridor not rendered '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    corridor:window.__miloviceMiltenCorridorRuntime?.()
   })))+' page errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>({
  corridor:window.__miloviceMiltenCorridorRuntime?.(),
  tennis:window.__miloviceMiltenTennisRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  zebra:window.__miloviceSidewalkDebug,
  basket:window.__miloviceSportovniBasketballRuntime?.(),
  topolova:window.__miloviceTopolovaResidentialRuntime?.(),
  menuHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(r.corridor.version,'5.151');
 assert.equal(r.corridor.sourceCourtId,'612386900');
 assert.equal(r.corridor.sourceHallId,'53866046');
 assert.equal(r.corridor.sceneDrawObjects,3);
 assert.equal(r.corridor.visibleSceneObjects,3);
 assert(r.corridor.visibleAfterLOD);
 assert.equal(r.corridor.modelFencePosts,11);
 assert(r.corridor.modelFenceWireSegments>200);
 assert(r.corridor.modelPavingTriangles>=32);
 assert.equal(r.corridor.photographicEdgeIdentification,false);
 assert.equal(r.corridor.realFootwaysAdded,0);
 assert.equal(r.corridor.newColliders,0);
 assert.equal(r.corridor.inventedGates,0);
 assert(r.tennis?.ready&&r.tennis?.renderedNets===7);
 assert(r.hall?.ready);
 assert(r.basket?.ready&&r.basket?.renderedHoops===2);
 assert(r.topolova?.ready);
 assert(r.zebra?.mappedMarkedCrossingOSMIds?.includes('1316882853'));
 assert(r.menuHeight<150);
 assert.deepEqual(errors,[],'No page errors under mobile WebGL');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milten-photo-corridor-fence-5151-mobile.png'});
 console.log('PASS 5.151 mobile WebGL: source-locked photo corridor + green fence remain after 6.5s LOD, seven nets, hall and older streets intact');
}finally{await browser.close()}
