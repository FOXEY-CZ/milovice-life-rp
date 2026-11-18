// Milovice RP 5.138: verify source road bends materialise in mobile WebGL.
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
 await page.goto('http://127.0.0.1:8080/?v=513800&streetAudit=prubezna-bends-west-5138',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='prubezna-bends-west-5138'&&
   window.__milovicePrubeznaBendsRuntime?.()?.ready&&
   window.__milovicePrubeznaRoadRuntime?.()?.ready&&
   window.__milovicePrubeznaLinksRuntime?.()?.ready,
   null,{timeout:100000});
 }catch(e){
  const state=await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   camera:window.__miloviceStreetAuditRendered,
   bends:window.__milovicePrubeznaBendsRuntime?.(),
   road:window.__milovicePrubeznaRoadRuntime?.(),
   links:window.__milovicePrubeznaLinksRuntime?.()
  }));
  throw Error('5.138 live bends failed '+JSON.stringify(state)+
   ' errors='+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const state=await page.evaluate(()=>({
  camera:window.__miloviceStreetAuditRendered,
  audit:window.__milovicePrubeznaBendsRuntime?.(),
  road:window.__milovicePrubeznaRoadRuntime?.(),
  links:window.__milovicePrubeznaLinksRuntime?.(),
  menus:document.querySelectorAll('#street-audit-nav a').length,
  panelHeight:document.querySelector('#street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(state.camera.view,'prubezna-bends-west-5138');
 assert.equal(state.audit.version,'5.138');
 assert.equal(state.audit.sourceWayCount,6);
 assert.equal(state.audit.plannedBendSeals,18);
 assert.equal(state.audit.renderedBendSeals,18);
 assert.deepEqual(state.audit.byStreet,{Průběžná:4,Sportovní:14});
 assert.equal(state.audit.queuedStandaloneMeshes,0);
 assert.equal(state.audit.addedRoads,0);
 assert.equal(state.audit.addedColliders,0);
 assert.equal(state.audit.addedCrossings,0);
 assert.equal(state.audit.addedStreetLamps,0);
 assert.equal(state.audit.originalDrivingGraphPreserved,true);
 assert.equal(state.road.renderedExistingSegments,12);
 assert.equal(state.road.originalMapDrivenOneWay,true);
 assert.equal(state.links.renderedExistingSegments,2);
 assert(state.menus>=51);
 assert(state.panelHeight<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-prubezna-sportovni-bends-5138-mobile.png'});
 console.log('PASS 5.138 live mobile 18 exact OSM Průběžná/Sportovní interior road bend seals; old streets and navigation preserved');
 await page.close();
}finally{await browser.close()}
