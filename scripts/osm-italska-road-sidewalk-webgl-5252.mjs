// Milovice RP 5.252: actual mobile WebGL test of recovered ORIGINAL
// Italská sidewalk next to OSM residential road 8590284.
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
 page.on('pageerror',error=>errors.push(String(error.stack||error)));
 await page.goto('http://127.0.0.1:8080/?v=525200&streetAudit=italska-road-footway-5252',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceStreetAuditRendered?.view==='italska-road-footway-5252'&&
   window.__miloviceItalskaRoadFootwayRuntime5252?.()?.ready===true,
   null,{timeout:120000});
 }catch(e){
  throw Error('Italská 5.252 camera not ready '+
   JSON.stringify(await page.evaluate(()=>({
    source:window.__miloviceItalskaRoadFootwayRuntime5252?.(),
    audit:window.__miloviceItalskaWalkChainRuntime5233?.(),
    view:window.__miloviceStreetAuditRendered,
    areas:window.__miloviceAreasLoaded,
    error:document.getElementById('err')?.textContent
   })))+' pageerrors='+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6800);
 const result=await page.evaluate(()=>({
  road:window.__miloviceItalskaRoadFootwayRuntime5252?.(),
  view:window.__miloviceStreetAuditRendered,
  build:document.getElementById('build-label')?.textContent,
  meta:document.querySelector('meta[name="milovice-build"]')
   ?.getAttribute('content')
 }));
 assert.equal(result.road?.ready,true);
 assert.equal(result.road.sourceRoadOSMId,'8590284');
 assert.equal(result.road.sourceSidewalkOSMId,'1484073943');
 assert.equal(result.road.roadGeometryHash,'233aae3b');
 assert.equal(result.road.sidewalkGeometryHash,'7d8bc0e5');
 assert.equal(result.road.priorModelRoadWidthMetres,7.8);
 assert.equal(result.road.modelWidthMetres,5.0);
 assert(result.road.firstEdgeVisibleMetres>29&&
  result.road.firstEdgeVisibleMetres<31);
 assert.equal(result.road.firstEdgeSafePieces,1);
 assert.equal(result.road.originalGPSUnchanged,true);
 assert.equal(result.road.photoMeasuredRoadWidth,false);
 assert.equal(result.road.unmarkedCrossingsStillUnpainted,true);
 assert.equal(result.road.newZebras,0);
 assert.equal(result.road.newRoads,0);
 assert.equal(result.road.newFootways,0);
 assert.equal(result.road.newColliders,0);
 assert.equal(result.view?.view,'italska-road-footway-5252');
 assert.equal(result.build,result.meta);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/italska-road-footway-5252-mobile.png'});
 console.log('PASS 5.252 mobile: source sidewalk newly visible '+result.road.firstEdgeVisibleMetres+
  'm, road narrowed only where source geometry allows, no zebra / road collisions after 6.8s LOD');
}finally{await browser.close()}
