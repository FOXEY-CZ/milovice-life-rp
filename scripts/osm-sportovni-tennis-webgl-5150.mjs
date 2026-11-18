// Source-guarded 5.150 seven-court Milten render after 6.5 seconds LOD.
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
 await page.goto('http://127.0.0.1:8080/?v=515000&streetAudit=pitch-tennis-milten-5150',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='pitch-tennis-milten-5150'&&
   window.__miloviceMiltenTennisRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.150 scene did not load: '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    tennis:window.__miloviceMiltenTennisRuntime?.()
   })))+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const s=await page.evaluate(()=>({
  tennis:window.__miloviceMiltenTennisRuntime?.(),
  hoop:window.__miloviceSportovniBasketballRuntime?.(),
  hall:window.__miloviceSportovniHallRuntime?.(),
  residence:window.__miloviceTopolovaResidentialRuntime?.(),
  scene:window.__miloviceCityGreenBatch,
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(s.tennis.version,'5.150');
 assert.equal(s.tennis.sourceCountFourPolygons,4);
 assert.equal(s.tennis.renderedNets,7);
 assert.equal(s.tennis.renderedPosts,14);
 assert.equal(s.tennis.visibleNets,7);
 assert.equal(s.tennis.modeledCourtLines,63);
 assert.equal(s.tennis.sceneDrawObjects,3);
 assert.equal(s.tennis.addedColliders,0);
 assert.equal(s.tennis.newPitchPolygons,0);
 assert(s.tennis.wireGridSegments>1000);
 assert(s.hoop?.ready&&s.hoop?.renderedHoops===2);
 assert(s.hall?.ready);
 assert(s.residence?.ready);
 assert(s.scene?.sportTaggedPitches===undefined||s.scene.sourcePitchLines>0);
 assert(s.menu<150,'Camera audit HUD must stay compact');
 assert.deepEqual(errors,[],'No browser page errors');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-milten-seven-tennis-5150-mobile.png'});
 console.log('PASS 5.150 7 court nets + 14 posts, 63 lines and old Mladá Sportovní structures after 6.5s LOD');
}finally{await browser.close()}
