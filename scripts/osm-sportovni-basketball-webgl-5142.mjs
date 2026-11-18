// Live mobile Chromium regression for 5.142 source-verified basket count.
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
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=514200&streetAudit=sportovni-basketball-5142',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='sportovni-basketball-5142'&&
   window.__miloviceSportovniBasketballRuntime?.()?.ready,
   null,{timeout:105000});
 }catch(e){
  throw Error('5.142 not rendered '+
   JSON.stringify(await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    hoops:window.__miloviceSportovniBasketballRuntime?.()
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(6200);
 const x=await page.evaluate(()=>({
  basket:window.__miloviceSportovniBasketballRuntime?.(),
  walk:window.__miloviceSportovniEstateWalkRuntime?.(),
  panel:window.__miloviceSportovniResidentialRuntime?.(),
  panelHeight:document.getElementById('street-block-audit')?.getBoundingClientRect().height,
  linkCount:document.querySelectorAll('#street-audit-nav a').length
 }));
 assert.equal(x.basket?.version,'5.142');
 assert.equal(x.basket?.sourceBasketCount,2);
 assert.equal(x.basket?.renderedHoops,2);
 assert.equal(x.basket?.visibleHoops,2);
 assert.equal(x.basket?.drawMeshes,10);
 assert.equal(x.basket?.inventedHoops,0);
 assert.equal(x.basket?.newCollisionVolumes,0);
 assert.equal(x.basket?.photographicBasketLocationsVerified,false);
 assert.equal(x.walk?.renderedCornerTriangles,10);
 assert.equal(x.panel?.mappedApartmentBuildings,9);
 assert(x.panelHeight<150);
 assert(x.linkCount>=55);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/sportovni-two-basketball-hoops-5142-mobile.png'});
 console.log('PASS 5.142 mobile WebGL: two mapped hoops persist after 6s LOD, previous court walk and nine residential buildings intact');
 await page.close();
}finally{await browser.close()}
