// 5.139 – verify real Sportovní 2025 material proposal on mobile WebGL,
// and previous 5.134/5.135/5.137/5.138 work survives.
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
 await page.goto('http://127.0.0.1:8080/?v=513900&streetAudit=sportovni-sidewalk-5139',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-sidewalk-5139'&&
   window.__miloviceSportovniSidewalkRuntime?.()?.ready&&
   window.__milovicePrubezna2025Runtime?.()?.ready&&
   window.__milovicePrubeznaRoadRuntime?.()?.ready&&
   window.__milovicePrubeznaLinksRuntime?.()?.ready&&
   window.__milovicePrubeznaBendsRuntime?.()?.ready,
   null,{timeout:100000});
 }catch(e){
  const state=await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,camera:window.__miloviceStreetAuditRendered,
   sidewalk:window.__miloviceSportovniSidewalkRuntime?.(),
   previous:window.__milovicePrubeznaBendsRuntime?.(),
   material:window.__miloviceOSMSurfaceAudit?.byMaterial
  }));
  throw Error('5.139 source footway not rendered '+JSON.stringify(state)+
   ' errors='+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const s=await page.evaluate(()=>({
  camera:window.__miloviceStreetAuditRendered,
  sidewalk:window.__miloviceSportovniSidewalkRuntime?.(),
  original:window.__milovicePrubezna2025Runtime?.(),
  links:window.__milovicePrubeznaLinksRuntime?.(),
  bends:window.__milovicePrubeznaBendsRuntime?.(),
  road:window.__milovicePrubeznaRoadRuntime?.(),
  byMaterial:window.__miloviceOSMSurfaceAudit?.byMaterial,
  panelHeight:document.querySelector('#street-block-audit')?.getBoundingClientRect().height,
  cameras:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(s.camera.view,'sportovni-sidewalk-5139');
 assert.equal(s.sidewalk.version,'5.139');
 assert.equal(s.sidewalk.sourceFootwayId,'1278749454');
 assert.equal(s.sidewalk.sourceOSMSegments,23);
 assert.equal(s.sidewalk.sourceOSMMeters,162.9);
 assert(s.sidewalk.renderedFootwayPieces>0,'Visual pavers actually appear');
 assert.equal(s.sidewalk.newFootways,0);
 assert.equal(s.sidewalk.newColliders,0);
 assert.equal(s.sidewalk.newZebraCrossings,0);
 assert.equal(s.sidewalk.newStreetLamps,0);
 assert.equal(s.sidewalk.newCurbs,0);
 assert.deepEqual(s.sidewalk.unchangedCrossingIDs,['1278749453','1278749455']);
 assert.equal(s.original.updatedSurfaceWayCount,2);
 assert.equal(s.links.renderedExistingSegments,2);
 assert.equal(s.bends.renderedBendSeals,18);
 assert.equal(s.road.renderedExistingSegments,12);
 assert.equal(s.road.originalMapDrivenOneWay,true);
 assert.equal(s.byMaterial['prubezna-concrete'],5);
 assert.equal(s.byMaterial['prubezna-repaired-asphalt'],1);
 assert(s.cameras>=52);
 assert(s.panelHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-sportovni-2025-paver-footway-5139-mobile.png'});
 console.log('PASS 5.139 mobile WebGL: 24 mapped sidewalk nodes, 162.9m proposed paving, both unmarked crossings untouched');
 await page.close();
}finally{await browser.close()}
