import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({
  viewport:{width:393,height:852},deviceScaleFactor:1,
  isMobile:true,hasTouch:true
 });
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=515300&streetAudit=topolova-slunicko-5153',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-slunicko-5153'&&
   window.__miloviceSlunickoRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.153 school not ready '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    school:window.__miloviceSlunickoRuntime?.()
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const a=await page.evaluate(()=>({
  school:window.__miloviceSlunickoRuntime?.(),
  masonry:window.__miloviceTopolovaResidentialRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  north:window.__miloviceSportovniNorthWalkRuntime?.(),
  zebra:window.__miloviceZebraV7Runtime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(a.school?.sourceOSMId,'53865699');
 assert.equal(a.school?.sourceRUIANId,'26092069');
 assert.equal(a.school?.sourceOriginalOSMLevels,2);
 assert.equal(a.school?.sourceReportedStoreys,4);
 assert.equal(a.school?.modelHeightMeters,12.2);
 assert.equal(a.school?.actualVisualHeightMeters,12.2);
 assert.equal(a.school?.renderedMappedFootprint,true);
 assert.equal(a.school?.addedBuildings,0);
 assert.equal(a.school?.addedDoors,0);
 assert.equal(a.school?.measuredHeight,false);
 assert(a.masonry?.ready&&a.hall?.ready&&a.north?.ready);
 assert(a.zebra?.ready);
 assert(a.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-slunicko-main-school-5153-mobile.png'});
 console.log('PASS 5.153 mobile WebGL after 6.5s LOD, with Topolova surroundings preserved');
}finally{await browser.close()}
