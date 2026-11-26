import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright-core';
import {observeReleaseNetwork} from './release-network-observer.mjs';
import {runReleaseMobileScenario} from './release-mobile-scenario.mjs';
const profiles=[{name:'portrait',width:390,height:844},{name:'landscape',width:844,height:390}];
const out=process.env.RUNNER_TEMP,base='http://127.0.0.1:8080',results=[];
assert.ok(out,'RUNNER_TEMP required');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 for(const {name,width,height} of profiles){
  const context=await browser.newContext({viewport:{width,height},screen:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage(),observer=observeReleaseNetwork(page),errors=[],evidence={profile:name,width,height};
  page.on('pageerror',e=>errors.push(String(e)));
  let trace;
  try{await runReleaseMobileScenario(page,base,evidence);assert.deepEqual(errors,[]);evidence.scenario='pass';}
  catch(error){evidence.scenario='fail';evidence.error=String(error);}
  finally{
   trace=observer.stop();
   evidence.pageErrors=errors;evidence.networkSummary=trace.summary;
   writeFileSync(join(out,'mobile-'+name+'-responses.json'),JSON.stringify(trace,null,2));
   writeFileSync(join(out,'mobile-'+name+'-requests.json'),JSON.stringify([...new Set(trace.records.map(r=>r.url))].sort(),null,2));
   try{await page.screenshot({path:join(out,'mobile-'+name+'.png'),timeout:10000});}catch(error){evidence.screenshotError=String(error);}
   await context.close();
  }
  evidence.missingLocal=trace.records.filter(r=>r.url.startsWith(base+'/')&&!r.url.endsWith('/favicon.ico')&&(r.status>=400||r.outcome==='failed'));
  try{execFileSync(process.execPath,['scripts/audit-release-network.mjs','--check',join(out,'mobile-'+name+'-requests.json'),join(out,'mobile-'+name+'-network-review.json')],{stdio:'inherit'});evidence.urlAudit='pass';}
  catch(error){evidence.urlAudit='fail';evidence.urlError=String(error);}
  evidence.result=evidence.scenario==='pass'&&evidence.urlAudit==='pass'&&!evidence.missingLocal.length?'pass':'fail';
  results.push(evidence);
  writeFileSync(join(out,'mobile-'+name+'-result.json'),JSON.stringify(evidence,null,2));
  console.log('Mobile evidence',JSON.stringify(evidence));
 }
}finally{await browser.close();}
assert.equal(results.filter(r=>r.result==='pass').length,profiles.length,'Mobile emulation preview failures');
