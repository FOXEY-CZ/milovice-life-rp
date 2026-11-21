// 5.229 original Lesní north footways: real mobile Chromium/SwiftShader.
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
 await page.goto('http://127.0.0.1:8080/?v=522900&streetAudit=lesni-north-branches-5229',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-north-branches-5229'&&
   window.__miloviceLesniNorthRuntime5229?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.229 mobile not ready '+JSON.stringify(await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,view:window.__miloviceStreetAuditRendered,
   source:window.__miloviceLesniNorthRuntime5229?.(),
   prior:window.__miloviceLesniEastRuntime5227?.(),
   err:document.getElementById('err')?.textContent
  })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceLesniNorthRuntime5229());
 assert.equal(x.ready,true);assert.equal(x.version,'5.229');
 assert.deepEqual(x.sourceWayIds,['1460019794','1460019793','1057549995','1057549996']);
 assert.equal(x.neutralOriginalMeters,84.236);
 assert.equal(x.neutralSourceSegments,4);
 assert.equal(x.connectedOriginalMeters,135.257);
 assert.equal(x.processedSourceEdges,4);
 assert.equal(x.sourceEdgeSafetyAudit.length,4);
 assert(x.renderedSafePieces>0,'at least one physically safe source strip must appear');
 assert.equal(x.unclassifiedSourceEdges,0);
 assert.equal(x.encounteredSourceIds.length,4);
 assert.equal(x.sourceCrossingRetained,true);
 assert.equal(x.crossingSourceMarkings,'yes');
 assert.equal(x.neutralMaterialAvailable,true);
 for(const k of ['newFootways','newCrossings','newZebras','newRoads','newColliders',
 'newBuildings','newKerbs','newEntrances','newStreetFurniture'])assert.equal(x[k],0);
 assert.deepEqual(errors,[],'no actual mobile JS page errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-north-branches-5229-mobile.png'});
 console.log('PASS 5.229 mobile actual safety-clipped footways, four original GPS edges, old crossing untouched and LOD stable');
}finally{await browser.close()}
