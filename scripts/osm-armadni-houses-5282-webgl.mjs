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
 await page.goto('http://127.0.0.1:8080/?v=528301&streetAudit=armadni-houses-east-5282',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceArmadniHousesRuntime5282?.()?.ready===true&&
   window.__miloviceStreetAuditRendered?.view==='armadni-houses-east-5282',
   null,{timeout:120000});
 }catch(e){
  const state=await page.evaluate(()=>({
   loaded:window.__miloviceAreasLoaded,
   runtime:window.__miloviceArmadniHousesRuntime5282?.(),
   street:window.__miloviceStreetAuditRendered
  }));
  throw Error('5.282 buildings not ready '+JSON.stringify(state)+' errors '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(7100);
 const r=await page.evaluate(()=>({
  runtime:window.__miloviceArmadniHousesRuntime5282?.(),
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  view:window.__miloviceStreetAuditRendered?.view
 }));
 assert.equal(r.view,'armadni-houses-east-5282');
 assert.match(r.build,/^\d{8}-[a-z0-9-]+$/);
 const x=r.runtime;
 assert(x?.ready);
 assert.deepEqual(x.houses,['886','887','891','890']);
 assert.equal(x.modelWindows,360);
 assert.equal(x.modelFacades,26);
 assert.equal(x.meshCount,16);
 assert.equal(x.triangles,5136);
 assert(x.entries.every(b=>b.floors===4&&b.inScene&&b.visibleMeshes===4));
 for(const k of ['newBuildings','newDoors','newBalconies','newRoofs','newFootways','newRoads','newColliders'])assert.equal(x[k],0);
 const e=await page.evaluate(()=>window.__miloviceArmadniEvidenceRuntime5283?.());
 assert.equal(e?.panelMounted,true);
 assert.equal(e?.projectConceptOnly,true);
 assert.equal(e?.approvedFacadePhotos,0);
 assert.equal(e?.newBalconies,0);
 const panel=page.locator('#armadni-evidence-5283');
 await panel.locator('summary').click();
 assert.equal(await panel.locator('a[href*="stakohk.cz"]').count(),1);
 assert.equal(await panel.locator('a[href*="hlasenirozhlasu.cz"]').count(),1);
 await panel.locator('summary').click();
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/armadni-houses-5282-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/armadni-houses-5282-wide.png'});
 console.log('PASS 5.282 four Armádní RÚIAN apartments 100 flats, mobile+wide WebGL after 7.1s LOD');
}finally{await browser.close()}
