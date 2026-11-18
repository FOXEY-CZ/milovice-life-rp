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
 await page.goto('http://127.0.0.1:8080/?v=514800&streetAudit=topolova-residential-5148',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='topolova-residential-5148'&&
  window.__miloviceTopolovaResidentialRuntime?.()?.mappedApartmentBuildings===1,
  null,{timeout:105000});
 await page.waitForTimeout(6500);
 const runtime=await page.evaluate(()=>({
  home:window.__miloviceTopolovaResidentialRuntime?.(),
  estate:window.__miloviceSportovniResidentialRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  road:window.__miloviceSidewalkDebug,
  walk:window.__miloviceSportovniNorthWalkRuntime?.()
 }));
 assert.equal(runtime.home.version,'5.148');
 assert(runtime.home.ready,'Floor seams and open doorway must be in scene');
 assert.equal(runtime.home.mappedLevelsByBuilding['53866045'],6);
 assert.equal(runtime.home.mappedFlatsByBuilding['53866045'],60);
 assert(runtime.home.visibleSeamMeshes>0);
 assert.equal(runtime.home.unverifiedEntryCanopiesSuppressed,1);
 assert.equal(runtime.estate.mappedApartmentBuildings,9);
 assert(runtime.hall?.ready&&runtime.walk?.ready);
 assert(runtime.road?.mappedMarkedCrossingOSMIds?.includes('1316882853'));
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-ruian-panel-5148-mobile.png'});
 console.log('PASS 5.148 mobile LOD: 6-floor Topolova model, no floating door plinth and earlier blocks safe');
}finally{await browser.close()}
