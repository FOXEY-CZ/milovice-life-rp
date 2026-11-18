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
 await page.goto(
  'http://127.0.0.1:8080/?v=515700&streetAudit=topolova-646-both-5157',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-646-both-5157'&&
   window.__miloviceTopolovaBothFacadesRuntime?.()?.ready,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.157 two-photo facades not ready '+
   JSON.stringify(await page.evaluate(()=>({
    regions:window.__miloviceAreasLoaded,
    view:window.__miloviceStreetAuditRendered,
    both:window.__miloviceTopolovaBothFacadesRuntime?.(),
    old:window.__miloviceTopolova646PhotoRuntime?.(),
    err:document.getElementById('err')?.textContent
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6900);
 const r=await page.evaluate(()=>({
  both:window.__miloviceTopolovaBothFacadesRuntime?.(),
  original:window.__miloviceTopolova646PhotoRuntime?.(),
  row:window.__miloviceTopolovaRowRuntime?.(),
  school:window.__miloviceSlunickoWestRuntime?.(),
  masonry:window.__miloviceTopolovaResidentialRuntime?.(),
  zebra:window.__miloviceZebraV7Runtime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.deepEqual(r.both?.photoExteriorEdges,[5,7]);
 assert.equal(r.both?.renderedMeshes,4);
 assert.equal(r.both?.visibleAfterLOD,4);
 assert.equal(r.both?.modelMainWindows,96);
 assert.equal(r.both?.modelAtticWindows,32);
 assert.equal(r.both?.modeledArches,32);
 assert.equal(r.both?.modelGables,16);
 assert.equal(r.both?.genericFacadesSuppressed,2);
 assert.equal(r.both?.sourceOSMId,'53866048');
 assert.equal(r.both?.originalOSMLevels,'1');
 assert.equal(r.both?.createdDoors,0);
 assert(r.original?.ready&&r.row?.ready&&r.school?.ready&&r.masonry?.ready&&r.zebra?.ready);
 assert(r.menu<150);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-646-both-5157-mobile.png'});
 console.log('PASS 5.157 mobile WebGL after 6.9s LOD: BOTH photo facades with 32 curved attic windows, 4 meshes; old streets preserved');
}finally{await browser.close()}
