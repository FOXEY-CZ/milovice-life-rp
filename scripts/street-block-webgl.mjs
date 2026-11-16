// Milovice RP 5.82 — 2014 5. května and 2024 Mírová camera review.
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
 for(const cfg of [
  {id:'5kv',width:393,height:852,mobile:true,technical:true},
  {id:'pionyru',width:393,height:852,mobile:true,technical:true},
  {id:'mirova',width:1280,height:760,mobile:false,technical:false}
 ]){
  const page=await browser.newPage({
   viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:1,
   isMobile:cfg.mobile,hasTouch:cfg.mobile
  });
  const errors=[];page.on('pageerror',e=>errors.push(String(e.stack||e)));
  await page.goto('http://127.0.0.1:8080/?v=58200&streetAudit='+cfg.id,
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>
   window.__miloviceStreetAuditRendered?.active===true&&
   window.__miloviceStreetEnvironment?.photoSceneDecision?.reason!=='not-loaded'&&
   window.__miloviceStreetEnvironment?.photoSceneDecision?.reason!=='evaluating',
   null,{timeout:120000});
  const info=await page.evaluate(()=>({
   audit:window.__miloviceStreetAuditRendered,
   scene:window.__miloviceStreetEnvironment,
   label:document.getElementById('street-audit-label')?.textContent,
   source:document.getElementById('street-audit-source')?.href,
   panel:document.getElementById('street-block-audit')?.offsetWidth,
   compact:document.getElementById('street-block-audit')?.classList.contains('audit-compact'),
   playerHudHidden:getComputedStyle(document.getElementById('hud')).display==='none',
   visibleCanvas:!!document.querySelector('canvas')?.clientWidth,
   build:document.getElementById('build-label')?.textContent
  }));
  assert.equal(info.build,'20261116-street-block-evidence-58200');
  assert.equal(info.audit.view,cfg.id);
  assert.equal(info.audit.cameraMode,cfg.technical?
   'technical-osm-overhead':'documented-photo-gps-and-heading');
  assert.equal(info.audit.legacyPhotoHeadingUnavailable,cfg.technical);
  assert.equal(info.audit.estimatedObjectLocations,true);
  assert.equal(info.audit.photoCameraIsObjectSurvey,false);
  assert.equal(info.audit.treeEvidenceCount,1);
  assert.equal(info.audit.poleEvidenceCount,1);
  assert.equal(info.audit.duplicatedTreeDisabled,true);
  assert.equal(info.audit.duplicatedPoleDisabled,true);
  assert.equal(info.audit.unverifiedOverheadSpanDisabled,true);
  assert.equal(info.audit.generatedSceneCount,1,
   'Photo-backed 5. května streetscape must actually load in real 3D, not only its camera');
  assert.equal(info.scene?.photoSceneDecision?.reason,'accepted-photo-scene');
  assert.equal(info.scene?.photoSceneDecision?.roadIds?.[0],'219273174');
  assert(info.scene?.minRoadClearance>=2,
   'Historically depicted models must remain off all indexed OSM roads');
  assert(info.scene?.drawMeshes>0&&info.scene?.drawMeshes<=26,
   'Visible historical features must use compact mobile-friendly batched meshes');
  assert(info.source.startsWith(cfg.id==='pionyru'?'https://mapy.com':
   'https://commons.wikimedia.org/wiki/File:'));
  if(cfg.id==='pionyru'){
   const p=info.audit.pionyruSatelliteAudit;
   assert.equal(p?.active,true,'Satellite vegetation must be built from OSM road and Pionýrů intersection');
   assert.equal(p.roadId,'219273174');
   assert.equal(p.junctionRoadId,'118488006');
   assert.equal(p.imageDate,'2023-06-04');
   assert(p.plantedShrubPockets>=2&&p.plantedShrubPockets<=5,
    'A few satellite-confirmed hedge pockets must be visible in city model');
   assert(p.instancedDrawCalls<=1);
   assert.equal(p.roadSurfaceChanged,false);
   assert.equal(p.sidewalkGeometryChanged,false);
   assert.equal(p.modelledNotSurveyed,true);
  }
  assert(info.panel>0);
  assert.equal(info.compact,cfg.mobile);
  assert.equal(info.playerHudHidden,true);
  assert.equal(info.visibleCanvas,true);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'browser-artifacts/milovice-street-58200-'+cfg.id+'.png'});
  console.log('STREET_BLOCK_WEBGL_OK',JSON.stringify({
   mode:cfg.id,scenes:info.audit.generatedSceneCount,source:info.source,
   cameraMode:info.audit.cameraMode,roadClearance:info.scene?.minRoadClearance,
   decision:info.scene?.photoSceneDecision,
   pionyru:info.audit.pionyruSatelliteAudit
  }));
  await page.close();
 }
}finally{await browser.close()}
