// Real Chromium WebGL mobile test, not a photographic recreation.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
 executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
 const view='pitch-juventa-5301',page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
 await page.goto('http://127.0.0.1:8080/?v=530300&streetAudit='+view,{waitUntil:'domcontentloaded',timeout:35000});
 try{
  await page.waitForFunction(view=>window.__miloviceAreasLoaded?.includes('mlada')&&
   window.__miloviceSportPitchCameraAudit?.targetInFrame===true&&
   window.__miloviceStreetAuditRendered?.view===view&&window.__miloviceJuventaRender5301?.().visibleMeshes>0,view,{timeout:120000});
 }catch(e){
  const state=await page.evaluate(()=>({regions:window.__miloviceAreasLoaded,camera:window.__miloviceSportPitchCameraAudit,render:window.__miloviceJuventaRender5301?.()}));
  throw Error('Juventa not ready '+JSON.stringify(state)+' '+JSON.stringify(errors)+' '+e);
 }
 await page.waitForTimeout(7100);
 const state=await page.evaluate(()=>({camera:window.__miloviceSportPitchCameraAudit,render:window.__miloviceJuventaRender5301?.(),
  jump:window.__miloviceJuventaRender5301?.('long-jump'),
  shot:window.__miloviceJuventaRender5301?.('shot-put'),
  sport:window.__miloviceSportPitchAudit,selected:document.querySelector('#street-audit-nav a.selected')?.dataset.auditId,
  canvas:document.querySelector('canvas')?.clientWidth}));
 assert.equal(state.camera.pitchId,'1472419116');assert.equal(state.camera.sport,'soccer');
 assert.equal(state.camera.notAPhoto,true);assert.equal(state.camera.cameraInsideMappedPitch,true);
 assert.equal(state.camera.targetInFrame,true);assert(Math.abs(state.camera.targetProjection.x)<.8&&Math.abs(state.camera.targetProjection.y)<.8);
 assert(state.camera.paintedLineSegments>0);assert(state.camera.cameraHeightAboveTerrain>9);
 assert(state.render.visibleMeshes>0);
 assert(state.render.meshes.every(m=>m.attached&&m.color===0x3d7b52&&m.vertices>0));
 assert(state.sport.juventaTurf5301.some(t=>t.sourceOSMId==='1472419116'&&t.material==='pitchTurf'));
 assert.deepEqual([...new Set(state.sport.suppressedAthleticsOutlines5300.map(t=>t.id))].sort(),['1472419115','1472419120']);
 assert(state.jump?.visibleMeshes>0,'5.302 long-jump surface must survive mobile LOD');
 assert(state.jump.meshes.every(m=>m.attached&&m.color===0xc5aa78&&m.vertices>0&&m.sourceIds.includes('1472419120')));
 assert(state.sport.juventaLongJump5302.some(x=>x.sourceOSMId==='1472419120'&&x.material==='pitchSand'&&x.currentSurfaceVerified===false));
 console.log('PASS 5.302 mobile Juventa actual attached sand mesh after 7.1s LOD',JSON.stringify(state.jump));
 assert.equal(state.shot?.visibleMeshes,1);
 assert(state.shot.meshes.every(m=>m.attached&&m.color===0x485058&&m.vertices>0));
 const shot=state.sport.juventaShotPut5303.find(x=>x.sourceOSMId==='1472419115');
 assert(shot?.splitInferred&&shot.sourceGeometryPreserved&&!shot.currentSurfaceVerified);
 assert(Math.abs(shot.sectorArea+shot.capArea-shot.sourceArea)<1e-6);
 assert.equal(shot.additionalSurfaceMeshes,1);
 console.log('PASS 5.303 mobile shot-put rounded source cap after 7.1s LOD',JSON.stringify(state.shot));
 assert.equal(state.selected,view);assert(state.canvas>0);assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/juventa-5301-mobile.png'});
 console.log('PASS 5.301 mobile Juventa actual attached turf meshes after 7.1s LOD',JSON.stringify(state.render));
}finally{await browser.close()}
