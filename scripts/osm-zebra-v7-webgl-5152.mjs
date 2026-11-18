// Source-mapped Topolova crossing 5.152 mobile Chromium after LOD.
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
 await page.goto('http://127.0.0.1:8080/?v=515200&streetAudit=sportovni-crossing-v7a-5152',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-crossing-v7a-5152'&&
   window.__miloviceZebraV7Runtime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.152 V7a source scene not rendered: '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    zebra:window.__miloviceZebraV7Runtime?.(),
    debug:window.__miloviceSidewalkDebug
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>({
  zebra:window.__miloviceZebraV7Runtime?.(),
  source:window.__miloviceSidewalkDebug,
  north:window.__miloviceSportovniNorthWalkRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  tennis:window.__miloviceMiltenTennisRuntime?.(),
  corridor:window.__miloviceMiltenCorridorRuntime?.(),
  topolova:window.__miloviceTopolovaResidentialRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(r.zebra?.version,'5.152');
 assert.equal(r.zebra?.sourceOSMId,'1316882853');
 assert(r.zebra?.paintedBars>=6&&r.zebra?.paintedBars<=12);
 assert.equal(r.zebra?.barThicknessMeters,.5);
 assert(r.zebra?.maxAxisDot<.005);
 assert.equal(r.zebra?.stripesPerpendicularToFootway,true);
 assert.equal(r.zebra?.allBarCentersOnMappedCarriageway,true);
 assert.equal(r.zebra?.newCrossingWays,0);
 assert.equal(r.zebra?.addedColliders,0);
 assert(r.source?.mappedMarkedCrossingOSMIds?.includes('1316882853'));
 assert(r.source?.mappedMarkedCrossingOSMIds?.includes('1316882854'));
 assert(r.source?.crossingStripeSegments>=r.zebra.paintedBars);
 assert.equal(r.source?.removedInventedCrosswalks,true);
 assert(r.north?.ready&&r.hall?.ready);
 assert(r.tennis?.ready&&r.tennis?.renderedNets===7);
 assert(r.corridor?.ready&&r.corridor?.visibleAfterLOD);
 assert(r.topolova?.ready);
 assert(r.menu<150,'Audit mobile menu compact');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/sportovni-topolova-v7a-transverse-5152-mobile.png'});
 console.log('PASS 5.152 mobile WebGL: transverse OSM V7a zebra still correct after 6.5s LOD; 5.151, 5.150, 5.149 surroundings intact');
}finally{await browser.close()}
