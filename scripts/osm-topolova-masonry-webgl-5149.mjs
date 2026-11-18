import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true});
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=514900&streetAudit=topolova-masonry-5149',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-masonry-5149'&&
   window.__miloviceTopolovaResidentialRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.149 scene not ready: '+JSON.stringify(
   await page.evaluate(()=>({
    regions:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    masonry:window.__miloviceTopolovaResidentialRuntime?.()
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>({
  masonry:window.__miloviceTopolovaResidentialRuntime?.(),
  estate:window.__miloviceSportovniResidentialRuntime?.(),
  entrance:window.__miloviceSportovniEntrancesRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  walk:window.__miloviceSportovniNorthWalkRuntime?.(),
  roads:window.__miloviceSidewalkDebug,
  view:window.__miloviceStreetAuditRendered
 }));
 assert.equal(r.masonry.version,'5.149');
 assert.equal(r.masonry.mappedApartmentBuildings,1);
 assert.equal(r.masonry.mappedLevelsByBuilding['53866045'],6);
 assert.equal(r.masonry.mappedFlatsByBuilding['53866045'],60);
 assert.equal(r.masonry.csuMasonryVerified,true);
 assert.equal(r.masonry.wallMaterialFromCSU,true);
 assert(r.masonry.suppressedUnverifiedPanelEdges>=8);
 assert.equal(r.masonry.horizontalFloorJoints,0);
 assert.equal(r.masonry.verticalBayJoints,0);
 assert.equal(r.masonry.doorPlinthOpenings,1);
 assert.equal(r.masonry.doorPlinthPieces,2);
 assert.equal(r.masonry.unverifiedEntryCanopiesSuppressed,1);
 assert.equal(r.estate.mappedApartmentBuildings,9);
 assert(r.hall?.ready&&r.walk?.ready);
 assert(r.roads.mappedMarkedCrossingOSMIds.includes('1316882853'));
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-official-masonry-5149-mobile.png'});
 console.log('PASS 5.149 mobile: Topolova 647 6-floor masonry, unsupported panel seams gone, nine neighbours and roads preserved after LOD');
}finally{await browser.close()}
