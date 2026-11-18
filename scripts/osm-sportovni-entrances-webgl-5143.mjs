// 5.143 mobile Chromium: entrance plinth physically clears model doors.
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
 await page.goto('http://127.0.0.1:8080/?v=514300&streetAudit=sportovni-entrances-5143',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-entrances-5143'&&
   window.__miloviceSportovniEntrancesRuntime?.()?.ready&&
   window.__miloviceSportovniResidentialRuntime?.()?.ready,
   null,{timeout:100000});
 }catch(e){
  throw Error('No 5.143 3D frontage '+JSON.stringify(await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   view:window.__miloviceStreetAuditRendered,
   entry:window.__miloviceSportovniEntrancesRuntime?.(),
   residential:window.__miloviceSportovniResidentialRuntime?.()
  })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6200);
 const x=await page.evaluate(()=>({
  entry:window.__miloviceSportovniEntrancesRuntime?.(),
  panel:window.__miloviceSportovniResidentialRuntime?.(),
  walk:window.__miloviceSportovniEstateWalkRuntime?.(),
  hoops:window.__miloviceSportovniBasketballRuntime?.(),
  panelHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
  cameras:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(x.entry.version,'5.143');
 assert.equal(x.entry.sourceBuildingCount,9);
 assert(x.entry.doorPlinthOpenings>=1&&x.entry.doorPlinthOpenings<=9);
 assert.equal(x.entry.doorPlinthPieces,x.entry.doorPlinthOpenings*2);
 assert.equal(x.entry.unverifiedEntryCanopiesSuppressed,x.entry.doorPlinthOpenings);
 assert.equal(x.entry.overlappingPlinthBandsRemoved,x.entry.doorPlinthOpenings);
 assert.equal(x.entry.surveyedDoorLocations,0);
 assert(x.entry.visiblePlinthInstances>0,
  'Real plinth batches must survive mobile LOD six seconds later');
 assert.equal(x.panel.mappedApartmentBuildings,9);
 assert.equal(x.panel.mappedFloorsTotal,75);
 assert.equal(x.walk.renderedCornerTriangles,10);
 assert.equal(x.hoops.renderedHoops,2);
 assert.equal(x.panelHeight<150,true);
 assert(x.cameras>=56);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-entrances-5143-mobile.png'});
 console.log('PASS 5.143: plinth entrances unblocked, 9 mapped towers, two hoops and 10 footway corners preserved after LOD');
 await page.close();
}finally{await browser.close()}
