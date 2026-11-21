// 5.225 real mobile Chromium/SwiftShader WebGL regression.
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
 await page.goto('http://127.0.0.1:8080/?v=522500&streetAudit=lesni-walk-chain-5225',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='lesni-walk-chain-5225'&&
   window.__miloviceLesniWalkChainRuntime5225?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.225 OSM four-way pedestrian chain not ready '+
   JSON.stringify(await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    chain:window.__miloviceLesniWalkChainRuntime5225?.(),
    paved:window.__miloviceVisnovaEstatePaversRuntime5220?.(),
    err:document.getElementById('err')?.textContent
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const x=await page.evaluate(()=>window.__miloviceLesniWalkChainRuntime5225());
 assert(x.ready,'original path materials still applied after LOD');
 assert.equal(x.version,'5.225');
 assert.deepEqual(x.sourceWayIds,
  ['1460019797','1460019795','1460019796','1057549994']);
 assert.equal(x.sourceSegments,11);
 assert(Math.abs(x.originalMeters-165.489)<.01);
 assert.deepEqual(x.neutralFootwayIds,['1460019797','1460019795']);
 assert.equal(x.neutralOriginalSegments,4);
 assert.equal(x.neutralMaterial,'visnova-footway-model');
 assert.equal(x.neutralSurfaceIsUntagged,true);
 assert.equal(x.neutralSurfaceIsModelOnly,true);
 assert(x.paintedNeutralPieces>0,
  'actual original footway strips must be rendered');
 assert.equal(x.crossingSourceTag,'unmarked');
 assert.equal(x.crossingMarkingsTag,'no');
 assert.equal(x.crossingOriginalSegments,2);
 assert.equal(x.crossingWayId,'1460019796');
 assert.equal(x.pavedSourceWayId,'1057549994');
 assert.equal(x.pavedSourceTag,'paving_stones');
 assert.equal(x.pavedMaterial,'visnova-tagged-paving-stones');
 assert.equal(x.pavedAnchorLoaded,true);
 assert.equal(x.modelNeutralMaterialAvailable,true);
 assert.equal(x.originalOSMConnectionsExist,true);
 for(const key of ['inventedZebraStripes','newFootways','newCrossings',
  'newRoads','newKerbs','newColliders','newStreetLights',
  'newTrees','newBuildings'])assert.equal(x[key],0,key);
 assert.deepEqual(errors,[],'zero browser JS exceptions');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/lesni-walk-chain-5225-mobile.png'});
 console.log('PASS 5.225 original four-way OSM pedestrian chain 165.489m',
  'connected at three exact GPS junctions,',
  x.paintedNeutralPieces,'existing path pieces visibly rendered;',
  'crossing stays UNMARKED, no synthetic geometry');
}finally{await browser.close()}
