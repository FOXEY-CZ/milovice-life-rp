import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=515900&streetAudit=topolova-drawing-614615-5159',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>
  window.__miloviceAreasLoaded?.includes('mlada')&&
  window.__miloviceStreetAuditRendered?.view==='topolova-drawing-614615-5159'&&
  window.__miloviceTopolovaDrawingRuntime?.()?.ready,null,{timeout:115000});
 await page.waitForTimeout(6900);
 const r=await page.evaluate(()=>({
  new:window.__miloviceTopolovaDrawingRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  both:window.__miloviceTopolovaBothFacadesRuntime?.(),
  party:window.__miloviceRUIANPartyWallRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(r.new?.ready,true,JSON.stringify(r));
 assert.deepEqual(r.new?.sourceAddresses,[614,615]);
 for(const [k,v] of Object.entries({renderedFaces:4,renderedMeshes:6,
  genericFacadeEdgesSuppressed:4,visibleMeshesAfterLOD:6,
  normalWindows:48,balconySets:32,entries:4,roundedCaps:4,createdColliders:0}))
  assert.equal(r.new[k],v,k);
 assert(r.row?.ready&&r.both?.ready&&r.party?.ready);
 assert(r.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-drawing-614615-5159-mobile.png'});
 console.log('PASS 5.159 4 signed facades, 32 balcony sets, 4 rounded stairheads, 6 GPU batches after LOD');
}finally{await browser.close()}
