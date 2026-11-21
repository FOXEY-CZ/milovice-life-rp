import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=516100&streetAudit=topolova-inferred-616618-5161',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-inferred-616618-5161'&&
   window.__miloviceTopolovaInferredRuntime?.()?.ready,
   null,{timeout:115000});
 }catch(e){throw Error('5.161 provisional mapped facades not ready '+JSON.stringify(
  await page.evaluate(()=>({loaded:window.__miloviceAreasLoaded,
   view:window.__miloviceStreetAuditRendered,
   facades:window.__miloviceTopolovaInferredRuntime?.(),
   hip:window.__miloviceTopolovaHipRuntime?.(),
   drawing:window.__miloviceTopolovaDrawingRuntime?.(),
   err:document.getElementById('err')?.textContent})))+
   ' '+JSON.stringify(errors)+' '+e)}
 await page.waitForTimeout(7200);
 const result=await page.evaluate(()=>({
  inferred:window.__miloviceTopolovaInferredRuntime?.(),
  hip:window.__miloviceTopolovaHipRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  drawing:window.__miloviceTopolovaDrawingRuntime?.(),
  both:window.__miloviceTopolovaBothFacadesRuntime?.(),
  party:window.__miloviceRUIANPartyWallRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(result.inferred?.ready,true);
 assert.deepEqual(result.inferred?.sourceAddresses,[616,617,618]);
 for(const [k,v] of Object.entries({
  renderedFacades:6,renderedMeshes:3,genericFacadeEdgesSuppressed:6,
  visibleAfterLOD:3,normalWindows:88,balconyWindowDoorSets:32,
  stairWindows:24,createdBalconyPlatforms:0,createdEntranceDoors:0
 }))assert.equal(result.inferred[k],v,k);
 assert(result.hip?.ready&&result.row?.ready&&result.drawing?.ready&&
  result.both?.ready&&result.party?.ready);
 assert(result.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-inferred-616618-5161-mobile.png'});
 console.log('PASS 5.161 mobile WebGL +7.2s LOD: 6 real OSM facade planes with provisional bays, 3 visible GPU meshes, 5.160 hip preserved');
}finally{await browser.close()}
