// 5.272: real mobile WebGL inspection of original Pod Lesem road corners.
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
 await page.goto('http://127.0.0.1:8080/?v=527200&streetAudit=pod-lesem-bends-5272',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__milovicePodLesemBendsRuntime5272?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='pod-lesem-bends-5272',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  p:window.__milovicePodLesemBendsRuntime5272?.(),
  crossing:window.__milovicePodLesemCrossRuntime5270?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(r.p?.ready,true,JSON.stringify(r));
 assert.equal(r.p.version,'5.272');
 assert.equal(r.p.sourceRoadId,'128087258');
 assert.equal(r.p.wedgeCount,2);
 assert.equal(r.p.queuedAsphaltTriangles,2);
 assert(r.p.modelWedgeAreaSquareMeters>1.2&&
  r.p.modelWedgeAreaSquareMeters<1.5);
 assert.equal(r.p.newRoads,0);
 assert.equal(r.p.newColliders,0);
 assert.equal(r.p.newKerbs,0);
 assert.equal(r.p.newCrossingMarks,0);
 assert.equal(r.crossing?.ready,true,'5.271 model zebra remains visible');
 assert(r.crossing?.paintedBars>=4,'original 5.270 bars retained');
 assert.equal(r.meta,'20261122-pod-lesem-sidewalk-chain-527600');
 assert.equal(r.meta,r.hud);
 assert.equal(r.view,'pod-lesem-bends-5272');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/pod-lesem-road-bends-5272-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/pod-lesem-road-bends-5272-wide.png'});
 console.log('PASS 5.272 Pod Lesem original asphalt corners in mobile+wide WebGL after 7.2s LOD, old crossing retained');
}finally{await browser.close()}
