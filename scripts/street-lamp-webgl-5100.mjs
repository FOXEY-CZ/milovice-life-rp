// Milovice RP 5.100: real mobile WebGL on two *mapped lit=yes* street ways.
// Pole positions are an honest visualization estimate; only road lighting
// status is map-sourced. No fake geotagged pole photograph is asserted.
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
 await mkdir('browser-artifacts',{recursive:true});
 for(const {view,id,region,street} of [
  {view:'lit-italska-5100',id:'8585601',region:'mlada',street:'Italská'},
  {view:'lit-armadni-5100',id:'304756364',region:'vrutice',street:'Armádní'}
 ]){
  const page=await browser.newPage({viewport:{width:393,height:852},
   deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=510000&streetAudit='+view,
   {waitUntil:'domcontentloaded',timeout:35000});
  try{
   await page.waitForFunction(({region,view})=>
    window.__miloviceAreasLoaded?.includes(region)&&
    window.__miloviceStreetLampCameraAudit?.ready===true&&
    window.__miloviceStreetLampCameraAudit?.targetInFrame===true&&
    window.__miloviceStreetAuditRendered?.view===view,
   {region,view},{timeout:110000});
  }catch(e){
   const debug=await page.evaluate(()=>({
    loaded:window.__miloviceAreasLoaded,
    lamps:window.__miloviceStreetLightingAudit,
    camera:window.__miloviceStreetLampCameraAudit,
    audit:window.__miloviceStreetAuditRendered
   }));
   throw Error('5.100 mapped lamp not in mobile view: '+JSON.stringify(debug)+
    '; errors '+JSON.stringify(errors)+'; '+String(e));
  }
  const result=await page.evaluate(()=>({
   camera:window.__miloviceStreetLampCameraAudit,
   lamps:window.__miloviceStreetLightingAudit,
   header:document.querySelector('#street-block-audit > strong')?.textContent,
   label:document.getElementById('street-audit-label')?.textContent,
   build:document.querySelector('meta[name="milovice-build"]')?.content,
   hud:document.getElementById('build-label')?.textContent,
   canvasWidth:document.querySelector('canvas')?.clientWidth
  }));
  assert.equal(result.camera.sourceWayId,id);
  assert.equal(result.camera.roadName,street);
  assert.equal(result.camera.litFromOSM,true);
  assert.equal(result.camera.notAPhoto,true);
  assert(result.camera.sourceWayPoles>=1);
  assert(result.camera.targetInFrame&&result.camera.targetProjection.z<=1);
  assert(Math.abs(result.camera.cameraHeightAboveTerrain-1.68)<.1);
  assert(result.lamps.renderedLampPosts>=1);
  assert(result.lamps.renderedParts===result.lamps.renderedLampPosts*3);
  assert(result.lamps.drawMeshes>=3);
  assert.equal(result.lamps.usingInstancing,true);
  assert.equal(result.lamps.estimatedIndividualLampPositions,true);
  assert.equal(result.lamps.physicalPolesPhotographed,0);
  assert(result.header.includes('Osvětlené ulice Milovic'));
  assert(result.label.includes(street));
  assert(result.canvasWidth>0);
  assert(result.build===result.hud&&result.build.includes('510000'));
  assert.deepEqual(errors,[],'No WebGL errors');
  await page.screenshot({path:'browser-artifacts/milovice-lamps-5100-'+view+'.png'});
  console.log('PASS 5.100 source-lit lamp review',JSON.stringify({
   view,sourceId:id,region,posts:result.lamps.renderedLampPosts,
   forThisWay:result.camera.sourceWayPoles,
   targetProjection:result.camera.targetProjection,
   drawMeshes:result.lamps.drawMeshes
  }));
  await page.close();
 }
}finally{await browser.close()}
