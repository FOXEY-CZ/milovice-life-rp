// Browser proof, unlike a pure planner test, checks a real phone camera.
// Independent from the historic street-photography regression.
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
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=59800&streetAudit=forest-mlada-597',
  {waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceForestCameraAudit?.ready&&
  window.__miloviceForestCameraAudit?.targetInFrame===true,
 null,{timeout:110000});
 const state=await page.evaluate(()=>({
  forest:window.__miloviceForestCameraAudit,
  trees:window.__miloviceGreenTreeAudit,
  street:window.__miloviceStreetAuditRendered,
  label:document.querySelector('#street-block-audit > strong')?.textContent,
  imageWidth:document.querySelector('canvas')?.clientWidth,
  loaded:window.__miloviceAreasLoaded,
  build:document.querySelector('meta[name="milovice-build"]')?.content
 }));
 assert.equal(state.forest.mappedForest,true);
 assert.equal(state.forest.eyeInsideMappedPolygon,true);
 assert.equal(state.forest.eyeSafe,true);
 assert(state.forest.nearbyTreesInFront>=1);
 assert.equal(state.forest.targetInFrame,true);
 assert(state.forest.targetProjection?.x<1&&state.forest.targetProjection?.y<1);
 assert(Math.abs(state.forest.cameraHeightAboveTerrain-1.68)<.1);
 assert.equal(state.trees.perPolygon['26023867'],34);
 assert(state.label.includes('Juventský les'));
 assert.equal(state.street.view,'forest-mlada-597');
 assert(state.imageWidth>0);
 assert.equal(state.build,'20261117-osm-forest-audit-59800');
 assert.deepEqual(errors,[],'No page errors in forest camera mode');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/milovice-forest-598-mobile.png'});
 console.log('PASS forest phone camera after region streaming',JSON.stringify(state));
 await page.close();
}finally{await browser.close()}
