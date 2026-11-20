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
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-entry-survey-5170-mobile.png'});
 console.log('PASS 5.172 mobile Chromium WebGL +8.5s LOD and real click/close of six-facade DEM inspection: six OSM-based 616-618 inspection cameras, 30 real DEM/foundation samples, no invented entrances, older facades + roof + traffic intact');
}finally{await browser.close()}
