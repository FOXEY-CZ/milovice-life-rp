// 5.133: live mobile Chromium sanity at TRUE Tyršova × Sportovní.
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
 await page.goto(
  'http://127.0.0.1:8080/?v=513300&streetAudit=tyrsova-sportovni-5133',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>(
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='tyrsova-sportovni-5133'&&
   window.__miloviceRUIANPartyWallRuntime?.()?.ready===true&&
   window.__miloviceTyrsovaPartyWallRuntime?.()?.ready===true
  ),null,{timeout:110000});
 }catch(error){
  const ctx=await page.evaluate(()=>({
   areas:window.__miloviceAreasLoaded,
   cam:window.__miloviceStreetAuditRendered,
   plan:window.__miloviceRUIANPartyWallAudit,
   live:window.__miloviceRUIANPartyWallRuntime?.(),
   old:window.__miloviceTyrsovaPartyWallRuntime?.()
  }));
  throw Error('5.133 live plan failed: '+JSON.stringify(ctx)+
   ' JS '+JSON.stringify(errors)+' '+error);
 }
 await page.waitForTimeout(6800);
 const s=await page.evaluate(()=>({
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent,
  cam:window.__miloviceStreetAuditRendered,
  audit:window.__miloviceRUIANPartyWallAudit,
  runtime:window.__miloviceRUIANPartyWallRuntime?.(),
  old:window.__miloviceTyrsovaPartyWallRuntime?.(),
  hero:window.__miloviceHeroArchitecture,
  regions:window.__miloviceAreasLoaded,
  menuHeight:document.getElementById('street-block-audit')
   ?.getBoundingClientRect().height
 }));
 assert.match(s.build,/^20[0-9]{6}-[a-z0-9-]+$/,'Nonempty release identity must remain machine-readable');
 assert.equal(s.hud,s.build);
 assert.equal(s.cam.view,'tyrsova-sportovni-5133');
 assert(s.regions.includes('mlada'));
 assert.equal(s.audit.version,'5.133');
 assert.equal(s.audit.sourceSharedWallCount,29);
 assert.equal(s.audit.internalFacadeEdgesToSkip,58);
 assert.equal(s.audit.affectedBuildingCount,38);
 assert.equal(s.audit.runtimeSkippedInteriorEdges,58);
 assert.equal(s.runtime.ready,true);
 assert.equal(s.runtime.allBuildingCountsCorrect,true);
 assert.equal(s.runtime.skipped,58);
 assert.equal(s.runtime.heroFacadesSkipped,1,
  'One priority-mass hero building must also skip its actual shared party wall');
 assert.equal(s.runtime.genericFacadesSkipped,57);
 assert.equal(s.runtime.countsPartitionCorrect,true);
 assert.equal(s.audit.skipByBuilding['61979145'],1,
  'Corrected Topolova 618 party wall must not be decorated as exterior');
 assert.equal(s.audit.skipByBuilding['202381246'],1,
  'Photo-priority hero 202381246 must NOT cut false exterior windows into a party wall');
 assert(s.hero.sharedPartyWallFacesSuppressed>=1,
  'Hero architecture should still emit a physically SOLID common wall');
 assert.equal(s.runtime.alteredRoads,0);
 assert.equal(s.runtime.alteredBuildingPolygons,0);
 assert.equal(s.runtime.addedMeshes,0);
 assert.equal(s.old.ready,true);
 assert.equal(s.old.skippedInteriorEdges,8);
 assert(s.menuHeight<150,'Street audit menu must not cover mobile viewport');
 assert.deepEqual(errors,[],'No JS exceptions after streaming and LOD');
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({
  path:'browser-artifacts/milovice-tyrsova-sportovni-ruian-walls-5133-mobile.png'
 });
 console.log('PASS 5.133 live Tyršova × Sportovní camera; 29 RUIAN shared walls / 58 empty interior facades after mobile LOD');
 await page.close();
}finally{await browser.close()}
