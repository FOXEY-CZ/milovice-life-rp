import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
import {observeReleaseNetwork} from './release-network-observer.mjs';
import {runReleaseRegionScenario} from './release-region-scenario.mjs';

const groups={central:['old','mlada'],west:['vrutice','westlink'],north:['centerlink','bozidar']};
const ids=groups[process.env.REGION_GROUP],out=process.env.RUNNER_TEMP;
assert.ok(ids&&out,'Region group and RUNNER_TEMP required');
const base='http://127.0.0.1:8080',results=[];
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const id of ids){
  const page=await browser.newPage({viewport:{width:1280,height:760}});
  const observer=observeReleaseNetwork(page),errors=[],evidence={region:id,steps:[]};
  page.on('pageerror',e=>errors.push(String(e)));
  if(process.env.PROCEDURAL_PREVIEW==='1')await page.addInitScript(()=>{localStorage.setItem('milovice_glb_quality','coupe');localStorage.setItem('milovice_glb_humans','on');});

  let trace;
  try{
   await runReleaseRegionScenario(page,base,id,evidence);
   if(process.env.PROCEDURAL_PREVIEW==='1'){
    const state=await page.evaluate(()=>({profile:document.querySelector('meta[name="crossvex-profile"]')?.content,cars:window.__miloviceGLBDebug,humans:window.__miloviceHumans,lifetime:window.__miloviceVehicleDebug?.proceduralLifetime,road:window.__miloviceVehicleDebug?.previewRoadCount,batched:window.__miloviceVehicleDebug?.previewBatchCount}));
    assert.equal(state.profile,'procedural-preview');assert.equal(state.cars?.mode,'off');assert.deepEqual(state.cars.assignments,[]);assert.equal(state.humans?.mode,'off');assert.deepEqual(state.humans.loaded,[]);
    assert.equal(state.lifetime?.enabled,true);assert.ok(state.road>0);assert.equal(state.road,state.batched);assert.equal(state.lifetime.live,state.road);assert.equal(state.lifetime.created-state.lifetime.released,state.lifetime.live);
    evidence.procedural={roadCars:state.road,lifetime:state.lifetime};
   }

   assert.deepEqual(errors,[],'Uncaught page errors');
   evidence.scenario='pass';
  }catch(error){evidence.scenario='fail';evidence.error=String(error);}
  finally{
   trace=observer.stop();
   evidence.pageErrors=errors;
   evidence.networkSummary=trace.summary;
   writeFileSync(join(out,'regional-'+id+'-responses.json'),JSON.stringify(trace,null,2));
   writeFileSync(join(out,'regional-'+id+'-requests.json'),JSON.stringify([...new Set(trace.records.map(r=>r.url))].sort(),null,2));
   await page.close();
  }
  if(process.env.PROCEDURAL_PREVIEW==='1'){
   evidence.glbRequests=trace.records.filter(r=>/\.(?:glb|gltf)(?:[?#.]|$)/i.test(r.url)).map(r=>r.url);
   evidence.proceduralNetwork=evidence.glbRequests.length===0&&trace.summary.httpErrors===0&&trace.summary.failed===0&&trace.summary.pending===0?'pass':'fail';
  }
  const missing=trace.records.filter(r=>r.url.startsWith(base+'/')&&!r.url.endsWith('/favicon.ico')&&(r.status>=400||r.outcome==='failed'));
  evidence.missingLocal=missing;
  try{
   execFileSync(process.execPath,['scripts/audit-release-network.mjs','--check',join(out,'regional-'+id+'-requests.json'),join(out,'regional-'+id+'-network-review.json')],{stdio:'inherit'});
   evidence.urlAudit='pass';
  }catch(error){evidence.urlAudit='fail';evidence.urlError=String(error);}
  evidence.result=(process.env.PROCEDURAL_PREVIEW!=='1'||evidence.proceduralNetwork==='pass')&&evidence.scenario==='pass'&&evidence.urlAudit==='pass'&&missing.length===0?'pass':'fail';
  results.push(evidence);
  writeFileSync(join(out,'regional-'+id+'-result.json'),JSON.stringify(evidence,null,2));
  console.log('Regional evidence',JSON.stringify(evidence));
 }
}finally{await browser.close();}
assert.equal(results.filter(r=>r.result==='pass').length,ids.length,'Regional preview failures');
