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
 await page.goto('http://127.0.0.1:8080/?v=527800&streetAudit=pod-lesem-pedestrian-5275',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__milovicePodLesemWalkerRuntime5275?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='pod-lesem-pedestrian-5275',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  walker:window.__milovicePodLesemWalkerRuntime5275?.(),
  zebra:window.__milovicePodLesemCrossRuntime5270?.(),
  bends:window.__milovicePodLesemBendsRuntime5272?.(),
  track:window.__milovicePodLesemTrackRuntime5273?.(),
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent,
  view:window.__miloviceStreetAuditRendered?.view
 }));
 assert.equal(r.walker?.ready,true,JSON.stringify(r));
 assert.equal(r.walker?.sourceFootwayId,'1005977571');
 assert.equal(r.walker?.actorCount,1);
 assert.equal(r.walker?.predictiveVehicleSafety5276,true);
 assert.equal(r.walker?.forecastSeconds5276,4);
 assert.equal(r.walker?.version,'5.278');
 assert(r.walker?.distance>=0&&r.walker?.distance<=r.walker?.totalMetres);
 assert(r.walker?.totalMetres>266&&r.walker?.totalMetres<269);
 assert.equal(r.walker?.joinedFootwayId,'1044078118');
 assert.equal(r.walker?.beforeServiceRoadId,'1456361936');
 assert(r.walker?.serviceRoadIntersectionUncrossed);
 assert.equal(r.walker?.routePoints?.length,9);
 assert.equal(r.walker?.otherVehicleRoadCrossings,0);
 assert.equal(r.walker?.newFootways,0);
 assert.equal(r.walker?.newColliders,0);
 assert.equal(r.zebra?.ready,true);
 assert(r.zebra?.paintedBars>=4);
 assert.equal(r.bends?.ready,true);
 assert.equal(r.track?.ready,true);
 assert.equal(r.build,'20261122-pod-lesem-branch-walker-527900');
 assert.equal(r.build,r.hud);
 assert.equal(r.view,'pod-lesem-pedestrian-5275');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/pod-lesem-pedestrian-5275-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/pod-lesem-pedestrian-5275-wide.png'});
 await page.goto('http://127.0.0.1:8080/?v=527800&streetAudit=pod-lesem-west-sidewalk-5278',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__milovicePodLesemWalkerRuntime5278?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='pod-lesem-west-sidewalk-5278',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const west=await page.evaluate(()=>window.__milovicePodLesemWalkerRuntime5278?.());
 assert.equal(west?.version,'5.278');
 assert(west?.extendedByMetres>70&&west?.extendedByMetres<72);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'browser-artifacts/pod-lesem-west-sidewalk-5278-wide.png'});
 console.log('PASS 5.278 joined 267m walker, predictive yield and western camera mobile+wide Chromium after LOD');
}finally{await browser.close()}
