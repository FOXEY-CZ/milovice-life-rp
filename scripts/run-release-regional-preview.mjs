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
  let trace;
  try{
   await runReleaseRegionScenario(page,base,id,evidence);
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
  const missing=trace.records.filter(r=>r.url.startsWith(base+'/')&&!r.url.endsWith('/favicon.ico')&&(r.status>=400||r.outcome==='failed'));
  evidence.missingLocal=missing;
  try{
   execFileSync(process.execPath,['scripts/audit-release-network.mjs','--check',join(out,'regional-'+id+'-requests.json'),join(out,'regional-'+id+'-network-review.json')],{stdio:'inherit'});
   evidence.urlAudit='pass';
  }catch(error){evidence.urlAudit='fail';evidence.urlError=String(error);}
  evidence.result=evidence.scenario==='pass'&&evidence.urlAudit==='pass'&&missing.length===0?'pass':'fail';
  results.push(evidence);
  writeFileSync(join(out,'regional-'+id+'-result.json'),JSON.stringify(evidence,null,2));
  console.log('Regional evidence',JSON.stringify(evidence));
 }
}finally{await browser.close();}
assert.equal(results.filter(r=>r.result==='pass').length,ids.length,'Regional preview failures');
