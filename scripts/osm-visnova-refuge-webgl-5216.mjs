// Milovice RP 5.216: actual mobile Chrome verifies crossing split/real
// OSM island geometry remains in scene after the full streamed city loads.
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
 await page.goto('http://127.0.0.1:8080/?v=521600&streetAudit=visnova-refuge-5216',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='visnova-refuge-5216'&&
   window.__miloviceVisnovaRefugeRuntime5216?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.216 real OSM zebra refuge not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    refuge:window.__miloviceVisnovaRefugeRuntime5216?.(),
    olderRefuge:window.__miloviceArmadniRefugeRuntime5190?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const a=await page.evaluate(()=>window.__miloviceVisnovaRefugeRuntime5216());
 assert(a?.ready,'source-locked island must remain scene attached '+JSON.stringify(a));
 assert.equal(a.crossingId,'1044078120');
 assert.equal(a.roadId,'1331897686');
 assert.equal(a.crossingHash,'097b2218');
 assert.equal(a.roadHash,'b19851ee');
 assert.equal(a.sourceCrossingHasRefuge,true);
 assert.equal(a.sourceMiddleOnRoad,true);
 assert.equal(a.inScene,true);
 assert.equal(a.visibleAfterLOD,true);
 assert.equal(a.renderedMeshes,1);
 assert.equal(a.renderedTriangles,24);
 assert.equal(a.approachBars.length,2);
 assert(a.approachBars.every(n=>n>0));
 assert.equal(a.approachBars.reduce((x,y)=>x+y,0),a.paintedBars);
 assert(a.minimumPaintEdgeClearanceMetres>=.48);
 assert.equal(a.actualRefugeDimensionsPhotoVerified,false);
 assert.equal(a.geometryEstimated,true);
 for(const key of ['addedPlayerColliders','addedRoads',
 'addedPedestrianPaths','addedCrossings'])assert.equal(a[key],0,key);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/visnova-refuge-5216-mobile.png'});
 console.log('PASS 5.216 actual mobile WebGL original OSM island,',
  a.approachBars.join('+'),'split zebra bars; 24 triangles',
  '1 mesh, attached/visible after 6.5s, no invented routes');
}finally{await browser.close()}
