// 5.227 real mobile Chromium/SwiftShader 3D renderer check.
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
 await page.goto('http://127.0.0.1:8080/?v=522700&streetAudit=lesni-east-link-5227',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-east-link-5227'&&
   window.__miloviceLesniEastRuntime5227?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.227 east link not ready '+JSON.stringify(
   await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    link:window.__miloviceLesniEastRuntime5227?.(),
    err:document.getElementById('err')?.textContent
   })))+' page errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceLesniEastRuntime5227());
 assert.equal(x.ready,true);
 assert.equal(x.version,'5.227');
 assert.deepEqual(x.sourceWayIds,
  ['1057549996','1057549995','1044078120','1314665579']);
 assert.equal(x.originalSegments,4);
 assert.equal(x.renderedOriginalSegments,4);
 assert.equal(x.originalMeters,41.608);
 assert.equal(x.neutralMaterial,'visnova-footway-model');
 assert.equal(x.materialAvailable,true);
 assert.equal(x.surfaceUntagged,true);
 assert.equal(x.westCrossingMarkings,'yes');
 assert.equal(x.eastCrossingMarkings,'zebra');
 assert.equal(x.eastCrossingIsland,'yes');
 assert.equal(x.pavedContinuationSurface,'paving_stones');
 assert.equal(x.encounteredSourceIds.length,4);
 for(const k of ['addedFootways','addedCrossings','addedZebras','addedBuildings',
  'addedColliders','addedStreetFurniture'])assert.equal(x[k],0,k);
 assert.deepEqual(errors,[],'no JS errors in real mobile browser');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-east-link-5227-mobile.png'});
 console.log('PASS 5.227 mobile WebGL original 4 sidewalks segments, two crossings, exact paved junction, LOD stable');
}finally{await browser.close()}
