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
 await page.goto('http://127.0.0.1:8080/?v=515500&streetAudit=topolova-panel-row-5155',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-panel-row-5155'&&
   window.__miloviceTopolovaRowRuntime?.()?.ready===true,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.155 housing block not ready '+JSON.stringify(
   await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    cam:window.__miloviceStreetAuditRendered,
    plan:window.__miloviceTopolovaRowAudit,
    live:window.__miloviceTopolovaRowRuntime?.(),
    walls:window.__miloviceRUIANPartyWallRuntime?.(),
    error:document.getElementById('err')?.textContent
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6500);
 const s=await page.evaluate(()=>({
  row:window.__miloviceTopolovaRowRuntime?.(),
  walls:window.__miloviceRUIANPartyWallRuntime?.(),
  school:window.__miloviceSlunickoWestRuntime?.(),
  masonry:window.__miloviceTopolovaResidentialRuntime?.(),
  zebra:window.__miloviceZebraV7Runtime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(s.row?.sourceOSMId,'61979145');
 assert.deepEqual(s.row?.houseNumbers,[614,615,616,617,618]);
 assert.equal(s.row?.actualModelFloors,5);
 assert.equal(s.row?.visualHeightMeters,15.25);
 assert.equal(s.row?.actualModelHeightMeters,15.25);
 assert(Math.abs(s.row?.actualWallGeometryHeightMeters-15.25)<.01);
 assert.equal(s.row?.actualGableOrHipRoof,false);
 assert.equal(s.row?.sourcePartyEdgeCount,1);
 assert.equal(s.row?.originalOSMLevelTag,'1');
 assert.equal(s.row?.preserveOriginalOSMLevelTag,true);
 assert.equal(s.walls?.ready,true);
 assert.equal(s.walls?.sourceSharedWallCount,29);
 assert.equal(s.walls?.skipped,58);
 assert(s.school?.ready&&s.masonry?.ready&&s.zebra?.ready);
 assert(s.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-panel-row-614-618-5155-mobile.png'});
 console.log('PASS 5.155 mobile WebGL + 6.5s LOD: five-source panel row, 618 now 5-floor flat silhouette and full party-wall closure');
}finally{await browser.close()}
