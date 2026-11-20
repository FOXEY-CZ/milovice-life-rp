import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=518900&streetAudit=topolova-slunicko-west-5154',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-slunicko-west-5154'&&
   window.__miloviceSlunickoWestRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.154 school west wall not ready '+JSON.stringify(
   await page.evaluate(()=>({area:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    school:window.__miloviceSlunickoWestRuntime?.()})))+
    ' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const r=await page.evaluate(()=>({
  wall:window.__miloviceSlunickoWestRuntime?.(),
  windows:window.__miloviceSlunickoWestWindowsRuntime5189?.(),
  school:window.__miloviceSlunickoRuntime?.(),
  topolova:window.__miloviceTopolovaResidentialRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  tennis:window.__miloviceMiltenTennisRuntime?.(),
  zebra:window.__miloviceZebraV7Runtime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(r.wall?.version,'5.154');
 assert.equal(r.wall?.westEdgeMeters,44.429);
 assert.equal(r.wall?.modelHeightMeters,13.15);
 assert(Math.abs(r.wall?.wallSpanMeters-13.15)<.01);
 assert.equal(r.wall?.newShades,0);
 assert.equal(r.wall?.newDoors,0);
 // 5.189: actual 3D modelled school glazing on exactly one mapped west face,
 // not generic duplicate windows, after 6.5s mobile LOD.
 assert.equal(r.windows?.version,'5.189',JSON.stringify(r.windows));
 assert.equal(r.windows?.sourceOSMId,'53865699');
 assert.equal(r.windows?.bays,36);
 assert.equal(r.windows?.meshes,3);
 assert.equal(r.windows?.genericWestEdgesSuppressed,1);
 assert.equal(r.windows?.allBayPositionsEstimated,true);
 assert.equal(r.windows?.inScene,true);
 assert.equal(r.windows?.visibleAfterLOD,3);
 assert.equal(r.windows?.gpuTriangles,504);
 assert.equal(r.windows?.sourceGeometryChanged,false);
 assert(r.school?.ready&&r.topolova?.ready&&r.hall?.ready&&r.tennis?.ready&&r.zebra?.ready);
 assert(r.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/slunicko-west-elevation-5154-mobile.png'});
 console.log('PASS 5.189 mobile WebGL 6.5-second LOD: school 44m west wall, 36 modelled 2.4m glazing bays and no duplicate generic windows');
}finally{await browser.close()}
