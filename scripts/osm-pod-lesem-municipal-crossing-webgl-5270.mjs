// 5.271 segment-aware safety patch for Pod Lesem crossing: REAL mobile WebGL.
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
 await page.goto('http://127.0.0.1:8080/?v=527100&streetAudit=pod-lesem-municipal-crossing-5270',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__milovicePodLesemCrossRuntime5270?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='pod-lesem-municipal-crossing-5270',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  plan:window.__milovicePodLesemCrossRuntime5270?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(r.plan?.ready,true,JSON.stringify(r));
 assert.equal(r.plan.version,'5.274');
 assert.equal(r.plan.sideRoadId,'128087258');
 assert.equal(r.plan.mainRoadId,'1331897690');
 assert(r.plan.paintedBars>=4&&r.plan.paintedBars<=9);
 assert.equal(r.plan.roadWidthMetres,6);
 assert(r.plan.modelDistanceFromJunctionMetres>8.77&&
  r.plan.modelDistanceFromJunctionMetres<8.80);
 assert.equal(r.plan.sourceSidewalkOSMId,'1005977571');
 assert.equal(r.plan.alignedToExistingOSMSidewalkVertex,true);
 assert.equal(r.plan.sidewalkTagsCrossingPaintNotProven,true);
 assert.equal(r.plan.mappedCrossingFound,false);
 assert.equal(r.plan.geometryPlacementEstimated,true);
 assert.equal(r.plan.newMappedCrossingWays,0);
 assert.equal(r.plan.newRoads,0);
 assert.equal(r.plan.newColliders,0);
 assert.equal(r.plan.newKerbs,0);
 assert.equal(r.plan.newMaterials,0);
 assert.equal(r.view,'pod-lesem-municipal-crossing-5270');
 assert.equal(r.meta,'20261122-pod-lesem-branch-walker-527900');
 assert.equal(r.meta,r.hud);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/pod-lesem-municipal-crossing-5270-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/pod-lesem-municipal-crossing-5270-wide.png'});
 console.log('PASS 5.274 Pod Lesem crosswalk visual model re-aligned to original sidewalk vertex, Chromium mobile+wide after 7.2s LOD, zero new OSM paths');
}finally{await browser.close()}
