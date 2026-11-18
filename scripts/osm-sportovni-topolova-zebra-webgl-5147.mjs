import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=514700&streetAudit=sportovni-topolova-zebra-5147',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='sportovni-topolova-zebra-5147'&&
  window.__miloviceSidewalkDebug?.mappedMarkedCrossingOSMIds?.includes('1316882853'),
  null,{timeout:105000});
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>({
  crossings:window.__miloviceSidewalkDebug,
  northWalk:window.__miloviceSportovniNorthWalkRuntime?.()
 }));
 assert(r.crossings.mappedMarkedCrossingOSMIds.includes('1316882854'));
 assert(r.crossings.crossingStripeSegments>=6);
 assert.equal(r.crossings.removedInventedCrosswalks,true);
 assert(r.northWalk?.ready);
 assert.equal(r.northWalk.addedZebras,0);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-topolova-zebra-5147-mobile.png'});
 console.log('PASS 5.147 mobile WebGL: mapped Topolova zebra and intact northern Sportovni walk after LOD');
}finally{await browser.close()}
