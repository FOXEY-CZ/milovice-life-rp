// 5.273: real WebGL mobile+wide verification of compacted track seam.
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
 await page.goto('http://127.0.0.1:8080/?v=527300&streetAudit=pod-lesem-track-seam-5273',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__milovicePodLesemTrackRuntime5273?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='pod-lesem-track-seam-5273',
  null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  track:window.__milovicePodLesemTrackRuntime5273?.(),
  bends:window.__milovicePodLesemBendsRuntime5272?.(),
  crossing:window.__milovicePodLesemCrossRuntime5270?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  meta:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(r.track?.version,'5.273');
 assert.equal(r.track?.ready,true);
 assert.equal(r.track?.sourceTrackId,'1011197688');
 assert.equal(r.track?.sourceRoadId,'128087258');
 assert(r.track?.visualTrimMetres>3.04&&r.track.visualTrimMetres<3.07);
 assert.equal(r.track.paintedTrackFirstSegments,1);
 assert.equal(r.track.newRoads,0);
 assert.equal(r.track.newColliders,0);
 assert.equal(r.track.newKerbs,0);
 assert.equal(r.bends?.ready,true);
 assert.equal(r.bends.queuedAsphaltTriangles,2);
 assert.equal(r.crossing?.ready,true);
 assert(r.crossing?.paintedBars>=4);
 assert.equal(r.meta,'20261122-pod-lesem-track-seam-527300');
 assert.equal(r.meta,r.hud);
 assert.equal(r.view,'pod-lesem-track-seam-5273');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/pod-lesem-track-seam-5273-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/pod-lesem-track-seam-5273-wide.png'});
 console.log('PASS 5.273 original compacted track meets asphalt edge after 7.2s LOD, mobile+wide, zebra+road bends unchanged');
}finally{await browser.close()}
