// Milovice RP 5.99: check BOTH OSM sports review cameras in phone WebGL.
// We assert actual streamed region state and the drawn scene's camera vector,
// not simply that links or painted line-planner outputs exist.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||
 '/usr/bin/google-chrome',headless:true,args:[
 '--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'
]});
try{
 await mkdir('browser-artifacts',{recursive:true});
 for(const {id,way,sport,surface,label} of [
  {id:'pitch-tennis-599',way:'612386900',sport:'tennis',
   surface:'clay',label:'antukové tenisové'},
  {id:'pitch-multi-599',way:'1327246355',sport:'multisport',
   surface:'asphalt',label:'multifunkční'}
 ]){
  // Release the previous SwiftShader renderer before starting a new 3D view.
  const page=await browser.newPage({viewport:{width:393,height:852},
   deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=59900&streetAudit='+id,
   {waitUntil:'domcontentloaded',timeout:30000});
  try{
   await page.waitForFunction(id=>
    window.__miloviceAreasLoaded?.includes('mlada')&&
    window.__miloviceSportPitchCameraAudit?.ready===true&&
    window.__miloviceSportPitchCameraAudit?.targetInFrame===true&&
    window.__miloviceStreetAuditRendered?.view===id,
   id,{timeout:100000});
  }catch(e){
   const audit=await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    sport:window.__miloviceSportPitchCameraAudit,
    map:window.__miloviceSportPitchAudit,
    street:window.__miloviceStreetAuditRendered
   }));
   throw Error('Mobile sport review missing or camera not aiming at court: '+
    JSON.stringify(audit)+'; '+e);
  }
  const result=await page.evaluate(()=>({
   camera:window.__miloviceSportPitchCameraAudit,
   pitch:window.__miloviceSportPitchAudit,
   label:document.getElementById('street-audit-label')?.textContent,
   header:document.querySelector('#street-block-audit > strong')?.textContent,
   canvas:document.querySelector('canvas')?.clientWidth||0,
   build:document.querySelector('meta[name="milovice-build"]')?.content,
   hud:document.getElementById('build-label')?.textContent
  }));
  assert.equal(result.camera.pitchId,way);
  assert.equal(result.camera.sport,sport);
  assert.equal(result.camera.sourceSurface,surface);
  assert(result.camera.court.segments.length>=8);
  assert.equal(result.camera.cameraInsideMappedPitch,true);
  assert.equal(result.camera.targetInFrame,true);
  assert(result.camera.targetProjection?.z>=-1&&
    result.camera.targetProjection.z<=1);
  assert(Math.abs(result.camera.cameraHeightAboveTerrain-
    result.camera.court.cameraHeight)<.15);
  assert(result.pitch.mappedPitches>=15);
  assert(result.pitch.estimatedPaintedCourtSegments>70);
  assert(result.pitch.lineDrawMeshes>0);
  assert(result.pitch.pitchIds.includes(way));
  assert(result.header.includes('Sportovní areály Milovic'));
  assert(result.label.includes(label));
  assert.equal(result.build,result.hud);
  assert(result.canvas>0);
  assert.deepEqual(errors,[],'Browser errors in pitch review '+id);
  await page.screenshot({path:'browser-artifacts/milovice-sports-599-'+id+'.png'});
  console.log('PASS mobile OSM pitch WebGL '+id,JSON.stringify({
   id,way,sport,surface,paintedLines:result.camera.court.segments.length,
   terrainHeight:result.camera.cameraHeightAboveTerrain,
   projectedCentre:result.camera.targetProjection,
   loadedTotal:result.pitch.mappedPitches
  }));
  await page.close();
 }
}finally{await browser.close()}
