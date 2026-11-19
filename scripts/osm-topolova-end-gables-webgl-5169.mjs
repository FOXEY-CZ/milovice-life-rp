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
 await page.goto('http://127.0.0.1:8080/?v=516900&streetAudit=topolova-end-gables-5169',
  {waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(()=>
   window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceStreetAuditRendered?.view==='topolova-end-gables-5169'&&
   window.__miloviceTopolovaGableRuntime?.()?.ready===true,
   null,{timeout:115000});
 }catch(e){
  throw Error('5.169 source gable scene not ready: '+
   JSON.stringify(await page.evaluate(()=>({
    regions:window.__miloviceAreasLoaded,
    camera:window.__miloviceStreetAuditRendered,
    gable:window.__miloviceTopolovaGableRuntime?.(),
    old:window.__miloviceTopolovaInferredRuntime?.()
   })))+' pageErrors='+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(7700); // post-LOD visual verification
 const state=await page.evaluate(()=>({
  gable:window.__miloviceTopolovaGableRuntime?.(),
  inferred:window.__miloviceTopolovaInferredRuntime?.(),
  hip:window.__miloviceTopolovaHipRuntime?.(),
  source:window.__miloviceTopolovaRowRuntime?.(),
  priority:window.__miloviceTopolovaPriorityRuntime?.(),
  menu:document.getElementById('street-block-audit')?.getBoundingClientRect().height
 }));
 assert(state.gable?.ready,JSON.stringify(state.gable));
 assert.equal(state.gable.genericEdgesSuppressed,2);
 assert.equal(state.gable.newMeshes,0);
 assert.equal(state.gable.newWindows,0);
 assert.equal(state.gable.newEntranceDoors,0);
 assert.deepEqual(state.gable.blockedGenericEdgesById,{
  '61979151':[1],'61979145':[2]
 });
 assert.equal(state.gable.exactEntrancePositionsUnknown,true);
 assert.equal(state.gable.originalCadastralEndWallsPreserved,true);
 assert.equal(state.gable.longEastWestFacadesUnchanged,true);
 assert(state.inferred?.ready&&state.hip?.ready&&
  state.source?.ready&&state.priority?.ready,
  'old source-locked facade, hip roof, row and 5.166 traffic remain');
 assert(state.menu<150,'mobile technical menu remains compact');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/topolova-end-gables-5169-mobile.png'});
 console.log('PASS 5.169 mobile WebGL +7.7 s LOD: both real blank source end gables; no random windows/doors, original roof + long facades + pedestrians preserved');
}finally{await browser.close()}
