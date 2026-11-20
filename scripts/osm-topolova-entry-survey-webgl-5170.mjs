import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||
 '/usr/bin/google-chrome',headless:true,args:['--no-sandbox',
 '--disable-dev-shm-usage','--enable-webgl','--use-gl=angle',
 '--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=517000&streetAudit=topolova-entry-617-east-5170',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-entry-617-east-5170'&&
   window.__miloviceTopolovaEntrySurveyRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.170 source-grounded facade survey never ready: '+
   JSON.stringify(await page.evaluate(()=>({
    areas:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    entry:window.__miloviceTopolovaEntrySurveyRuntime?.(),
    error:document.getElementById('err')?.textContent
   })))+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(8500);
 const a=await page.evaluate(()=>({
  grade:window.__miloviceTopolovaEntrySurveyRuntime?.(),
  inferred:window.__miloviceTopolovaInferredRuntime?.(),
  hip:window.__miloviceTopolovaHipRuntime?.(),
  gables:window.__miloviceTopolovaGableRuntime?.(),
  traffic:window.__miloviceTopolovaPriorityRuntime?.(),
  paving:window.__miloviceTopolovaPaving5177,
  mappedPavingCount:window.__miloviceOSMSurfaceAudit?.byMaterial?.['topolova-paving-stones'],
  clay:window.__miloviceClayGrainRuntime5178?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert.equal(a.grade?.ready,true,JSON.stringify(a.grade));
 assert.deepEqual(a.grade.sourceHouseNumbers,[616,617,618]);
 assert.equal(a.grade.cameraCount,6);
 assert.equal(a.grade.realSampledFacades,6);
 assert.equal(a.grade.terrainSamples,30);
 assert.equal(a.grade.activeCameraMatchesOriginalWall,true);
 assert.equal(a.grade.activeViewId,'topolova-entry-617-east-5170');
 assert.equal(a.grade.noInventedDoorOrEntrance,true);
 assert.equal(a.grade.exactRealEntrancesUnverified,true);
 assert.equal(a.grade.newDoors,0);
 assert.equal(a.grade.newMeshes,0);
 assert(a.grade.groundGradeProfiles.every(x=>x.samples.length===5));
 assert(a.grade.groundGradeProfiles.every(x=>
  Number.isFinite(x.minFoundationAboveTerrainMetres)&&
  Number.isFinite(x.maxFoundationAboveTerrainMetres)));
 assert(a.inferred?.ready&&a.hip?.ready&&a.gables?.ready&&a.traffic?.ready);
 assert(a.menu<150);
 // 5.177: specific mapped existing footways are now rendered with
 // a paving-stone material, while all source GPS stays untouched.
 assert.equal(a.paving?.version,'5.177',JSON.stringify(a.paving));
 assert.deepEqual([...(a.paving?.sourceWayIds||[])].sort(),
  ['1314665579','1316882852','1316882860'].sort());
 assert.equal(a.paving?.newFootways,0);
 assert.equal(a.paving?.newGeometry,0);
 assert.equal(a.paving?.modelTintNotPhotoVerified,true);
 assert(a.mappedPavingCount>=3,JSON.stringify(a));
 assert.equal(a.clay?.ready,true,JSON.stringify(a.clay));
 assert.equal(a.clay?.rgbaBytes,16384);
 assert.deepEqual(a.clay.mappedClayPitchIds,
  ['612386900','612386901','612386902']);
 assert.equal(a.clay.newMeshes,0);
 assert.equal(a.clay.texturePhotoVerified,false);
 // 5.172: exercise the actual mobile control, not just a static HTML marker.
 const ui=await page.evaluate(()=>{
  const button=document.getElementById('topolova-grade-toggle');
  const details=document.getElementById('topolova-grade-details');
  const before={buttonHidden:button?.hidden,detailsHidden:details?.hidden,
   expanded:button?.getAttribute('aria-expanded')};
  button?.click();
  const opened={hidden:details?.hidden,expanded:button?.getAttribute('aria-expanded'),
   text:details?.textContent||''};
  button?.click();
  return {before,opened,closed:{
   hidden:details?.hidden,expanded:button?.getAttribute('aria-expanded')}};
 });
 assert.equal(ui.before.buttonHidden,false,JSON.stringify(ui));
 assert.equal(ui.before.detailsHidden,true,JSON.stringify(ui));
 assert.equal(ui.before.expanded,'false');
 assert.equal(ui.opened.hidden,false,JSON.stringify(ui));
 assert.equal(ui.opened.expanded,'true');
 assert(ui.opened.text.includes('Topolová 617'),JSON.stringify(ui));
 assert(ui.opened.text.includes('Pět bodů'),JSON.stringify(ui));
 assert(ui.opened.text.includes('Celý blok 616–618'),JSON.stringify(ui));
 for(const house of [616,617,618]){
  assert(ui.opened.text.includes(house+'/V:'),JSON.stringify(ui));
  assert(ui.opened.text.includes(house+'/Z:'),JSON.stringify(ui));
 }
 assert(ui.opened.text.includes('NEURČUJÍ práh ani schodiště'));
 assert(!ui.opened.text.includes('se ještě nenačetly'));
 assert.equal(ui.closed.hidden,true,JSON.stringify(ui));
 assert.equal(ui.closed.expanded,'false');
 // 5.175: the additional simulated pedestrian actually exists in the 3D scene.
 const westBefore=await page.evaluate(()=>
  window.__miloviceTopolovaWestWalkRuntime?.());
 assert.equal(westBefore?.ready,true,JSON.stringify(westBefore));
 assert.equal(westBefore.count,1);
 assert.equal(westBefore.wayId,'1314665579');
 assert.equal(westBefore.turnbackBeforeZebrasMetres,4);
 assert.equal(westBefore.modelMeshPresent,true);
 assert.equal(westBefore.modelVisible,true,
  'west-side walker must be visible to the active Topolova audit camera');
 assert(westBefore.highLODVisible||westBefore.lowLODVisible,
  'one pedestrian LOD must be visible, not just parent scene group');
 assert(Number.isFinite(westBefore.position?.x));
 assert(Number.isFinite(westBefore.position?.z));
 await page.waitForTimeout(1100);
 const westAfter=await page.evaluate(()=>
  window.__miloviceTopolovaWestWalkRuntime?.());
 assert.equal(westAfter?.ready,true,JSON.stringify(westAfter));
 assert.equal(westAfter.count,1);
 assert(Math.hypot(westAfter.position.x-westBefore.position.x,
  westAfter.position.z-westBefore.position.z)>.1,
  'west walker must physically move on existing OSM sidewalk');
 // 5.179: interact with the real job-menu control in loaded mobile 3D.
 const footJob=await page.evaluate(()=>{
  const before=window.__miloviceTopolovaFootJobRuntime5179?.();
  const control=document.getElementById('topolova-foot-job-start');
  control?.click();
  const after=window.__miloviceTopolovaFootJobRuntime5179?.();
  const hud=document.getElementById('topolova-foot-job-hud');
  const menuClosed=document.getElementById('rp-job-panel')?.hidden;
  document.getElementById('topolova-foot-job-end')?.click();
  const canceled=window.__miloviceTopolovaFootJobRuntime5179?.();
  return {before,after,hudHidden:hud?.hidden,menuClosed,canceled};
 });
 assert.equal(footJob.before?.active,false,JSON.stringify(footJob));
 assert.equal(footJob.after?.active,true,JSON.stringify(footJob));
 assert.equal(footJob.after?.sourceWayId,'1314665579');
 assert.equal(footJob.after?.rewardCZK,80);
 assert.equal(footJob.hudHidden,false,JSON.stringify(footJob));
 assert.equal(footJob.menuClosed,true);
 assert.equal(footJob.canceled?.active,false);
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-entry-survey-5170-mobile.png'});
 console.log('PASS 5.175 mobile Chromium WebGL +8.5s LOD and real click/close of six-facade DEM inspection: six OSM-based 616-618 inspection cameras, 30 real DEM/foundation samples, no invented entrances, older facades + roof + traffic intact');
}finally{await browser.close()}
