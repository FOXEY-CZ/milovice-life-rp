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
 await page.goto('http://127.0.0.1:8080/?v=516000&streetAudit=topolova-hip-roof-5160',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-hip-roof-5160'&&
   window.__miloviceTopolovaHipRuntime?.()?.ready,
   null,{timeout:115000});
 }catch(e){throw Error('5.160 roof not ready '+JSON.stringify(
  await page.evaluate(()=>({areas:window.__miloviceAreasLoaded,
   cam:window.__miloviceStreetAuditRendered,
   hip:window.__miloviceTopolovaHipRuntime?.(),
   row:window.__miloviceTopolovaRowRuntime?.(),
   err:document.getElementById('err')?.textContent})))+
   ' '+JSON.stringify(errors)+' '+e)}
 await page.waitForTimeout(7000);
 const x=await page.evaluate(()=>({
  hip:window.__miloviceTopolovaHipRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  drawing:window.__miloviceTopolovaDrawingRuntime?.(),
  both:window.__miloviceTopolovaBothFacadesRuntime?.(),
  party:window.__miloviceRUIANPartyWallRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(x.hip?.ready,true);
 assert.equal(x.hip?.suppressedFlatCaps,5);
 assert.equal(x.hip?.drawMeshes,1);
 assert.equal(x.hip?.triangles,22);
 assert.equal(x.hip?.visibleAfterLOD,1);
 assert.equal(x.hip?.allInScene,true);
 assert.equal(x.hip?.modelRiseMeters,2.25);
 assert.deepEqual(x.hip?.sourceOSMIds,
 ['61979151','61979152','61979144','61979139','61979145']);
 assert(x.row?.ready&&x.drawing?.ready&&x.both?.ready&&x.party?.ready);
 assert(x.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-hip-roof-5160-mobile.png'});
 console.log('PASS 5.160 mobile WebGL +7s LOD: five flat caps gone, one continuous mapped hip roof, earlier streets intact');
}finally{await browser.close()}
