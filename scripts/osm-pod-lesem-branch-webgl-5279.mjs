import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--enable-webgl','--use-gl=angle','--use-angle=swiftshader',
 '--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:393,height:852},
  deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',err=>errors.push(String(err.stack||err)));
 await page.goto('http://127.0.0.1:8080/?v=527900&streetAudit=pod-lesem-branch-5279',
  {waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>window.__milovicePodLesemBranchRuntime5279?.()?.ready===true&&
  window.__miloviceStreetAuditRendered?.view==='pod-lesem-branch-5279',null,{timeout:120000});
 await page.waitForTimeout(7200);
 const r=await page.evaluate(()=>({
  branch:window.__milovicePodLesemBranchRuntime5279?.(),
  main:window.__milovicePodLesemWalkerRuntime5278?.(),
  view:window.__miloviceStreetAuditRendered?.view,
  build:document.querySelector('meta[name="milovice-build"]')?.content,
  hud:document.getElementById('build-label')?.textContent
 }));
 assert.equal(r.branch?.ready,true,JSON.stringify(r));
 assert.equal(r.branch?.sourcePathId,'1272081412');
 assert.equal(r.branch?.actorCount,1);
 assert(r.branch?.totalMetres>108&&r.branch?.totalMetres<110);
 assert(r.branch?.distance>=0&&r.branch?.distance<=r.branch?.totalMetres);
 assert.equal(r.branch?.newFootways,0);
 assert.equal(r.branch?.newCrossings,0);
 assert.equal(r.branch?.newColliders,0);
 assert.equal(r.branch?.sourceLitTag,'no');
 assert.equal(r.branch?.firstRoadSharedNodeExcluded,true);
 assert.equal(r.main?.version,'5.278');
 assert.equal(r.main?.actorCount,1);
 assert.equal(r.build,'20261122-pod-lesem-branch-walker-527900');
 assert.equal(r.build,r.hud);
 assert.equal(r.view,'pod-lesem-branch-5279');
 assert.deepEqual(errors,[]);
 await mkdir('browser-artifacts',{recursive:true});
 await page.screenshot({path:'browser-artifacts/pod-lesem-branch-5279-mobile.png'});
 await page.setViewportSize({width:1280,height:720});
 await page.waitForTimeout(950);
 await page.screenshot({path:'browser-artifacts/pod-lesem-branch-5279-wide.png'});
 console.log('PASS 5.279 original safe 109m branch pedestrian and retained 5.278 main walker mobile+wide WebGL after LOD');
}finally{await browser.close();}
