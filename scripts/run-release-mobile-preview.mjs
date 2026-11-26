import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
import {observeReleaseNetwork} from './release-network-observer.mjs';
import {blockRemotePreviewRequests} from './local-preview-network-guard.mjs';
const localOnly=process.env.LOCAL_LIBRARY_PREVIEW==='1';
assert.ok(!localOnly||process.env.PROCEDURAL_PREVIEW==='1','Local preview requires procedural profile');
import {runReleaseMobileScenario} from './release-mobile-scenario.mjs';
const profiles=[{name:'portrait',width:390,height:844},{name:'landscape',width:844,height:390}];
const out=process.env.RUNNER_TEMP,base='http://127.0.0.1:8080',results=[];
assert.ok(out,'RUNNER_TEMP required');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const {name,width,height} of profiles){
  const context=await browser.newContext({viewport:{width,height},screen:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage(),observer=observeReleaseNetwork(page),errors=[],evidence={profile:name,width,height};
  const remoteAttempts=localOnly?await blockRemotePreviewRequests(page,base):[];
  page.on('pageerror',e=>errors.push(String(e)));
  if(process.env.PROCEDURAL_PREVIEW==='1')await page.addInitScript(()=>{localStorage.setItem('milovice_glb_quality','coupe');localStorage.setItem('milovice_glb_humans','on');});

  let trace;
  try{await runReleaseMobileScenario(page,base,evidence);
   if(process.env.PROCEDURAL_PREVIEW==='1'){
    const state=await page.evaluate(()=>({profile:document.querySelector('meta[name="crossvex-profile"]')?.content,cars:window.__miloviceGLBDebug,humans:window.__miloviceHumans,lifetime:window.__miloviceVehicleDebug?.proceduralLifetime,road:window.__miloviceVehicleDebug?.previewRoadCount,batched:window.__miloviceVehicleDebug?.previewBatchCount}));
    assert.equal(state.profile,'procedural-preview');assert.equal(state.cars?.mode,'off');assert.deepEqual(state.cars.assignments,[]);assert.equal(state.humans?.mode,'off');assert.deepEqual(state.humans.loaded,[]);
    assert.equal(state.lifetime?.enabled,true);assert.ok(state.road>0);assert.equal(state.road,state.batched);assert.equal(state.lifetime.live,state.road);assert.equal(state.lifetime.created-state.lifetime.released,state.lifetime.live);
    evidence.procedural={roadCars:state.road,lifetime:state.lifetime};
   }
   assert.deepEqual(errors,[]);evidence.scenario='pass';}
  catch(error){evidence.scenario='fail';evidence.error=String(error);}
  finally{
   trace=observer.stop();
   evidence.pageErrors=errors;evidence.networkSummary=trace.summary;
   writeFileSync(join(out,'mobile-'+name+'-responses.json'),JSON.stringify(trace,null,2));
   writeFileSync(join(out,'mobile-'+name+'-requests.json'),JSON.stringify([...new Set(trace.records.map(r=>r.url))].sort(),null,2));
   try{await page.screenshot({path:join(out,'mobile-'+name+'.png'),timeout:10000});}catch(error){evidence.screenshotError=String(error);}
   await context.close();
  }
  if(localOnly)evidence.remoteAttempts=remoteAttempts;
  if(process.env.PROCEDURAL_PREVIEW==='1'){
   evidence.glbRequests=trace.records.filter(r=>/\.(?:glb|gltf)(?:[?#.]|$)/i.test(r.url)).map(r=>r.url);
   evidence.proceduralNetwork=evidence.glbRequests.length===0&&trace.summary.httpErrors===0&&trace.summary.failed===0&&trace.summary.pending===0?'pass':'fail';
  }
  evidence.missingLocal=trace.records.filter(r=>r.url.startsWith(base+'/')&&!r.url.endsWith('/favicon.ico')&&(r.status>=400||r.outcome==='failed'));
  try{execFileSync(process.execPath,['scripts/audit-release-network.mjs',localOnly?'--check-local':'--check',join(out,'mobile-'+name+'-requests.json'),join(out,'mobile-'+name+'-network-review.json')],{stdio:'inherit'});evidence.urlAudit='pass';}
  catch(error){evidence.urlAudit='fail';evidence.urlError=String(error);}
  evidence.result=remoteAttempts.length===0&&(process.env.PROCEDURAL_PREVIEW!=='1'||evidence.proceduralNetwork==='pass')&&evidence.scenario==='pass'&&evidence.urlAudit==='pass'&&!evidence.missingLocal.length?'pass':'fail';
  results.push(evidence);
  writeFileSync(join(out,'mobile-'+name+'-result.json'),JSON.stringify(evidence,null,2));
  console.log('Mobile evidence',JSON.stringify(evidence));
 }
}finally{await browser.close();}
assert.equal(results.filter(r=>r.result==='pass').length,profiles.length,'Mobile emulation preview failures');
