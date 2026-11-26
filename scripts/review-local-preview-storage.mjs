// Real browser profile restart against an existing unapproved local-library stage.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {chromium} from 'playwright-core';
import {previewOrigin,DEFAULT_PREVIEW_PORT} from './local-preview-port.mjs';
import {observeReleaseNetwork} from './release-network-observer.mjs';
const stage=resolve(process.argv[2]??'');
assert.ok(process.argv[2]&&process.env.RUNNER_TEMP,'Stage and RUNNER_TEMP required');
const port=DEFAULT_PREVIEW_PORT,base=previewOrigin(port);
const profile=mkdtempSync(join(tmpdir(),'crossvex-storage-profile-'));
const evidence={scope:'fixture balance read and actual draw-distance UI write; same Chromium profile and origin after browser and server restart',origin:base,runs:[]};
function start(){
 const child=spawn(process.execPath,['scripts/serve-local-preview.mjs',stage,String(port)],{stdio:['ignore','pipe','inherit'],shell:false});
 const lines=createInterface({input:child.stdout});
 let ready=false;
 const closed=new Promise(ok=>child.once('close',ok));
 const started=new Promise((ok,fail)=>{
  const timer=setTimeout(()=>{child.kill();fail(Error('Server startup timeout'));},15000);
  child.once('error',e=>{clearTimeout(timer);fail(e);});
  lines.on('line',line=>{console.log(line);if(line==='UNAPPROVED local preview: '+base){ready=true;clearTimeout(timer);ok();}});
  closed.then(code=>{clearTimeout(timer);lines.close();if(!ready)fail(Error('Server stopped before readiness: '+code));});
 });
 return {started,async stop(){if(child.exitCode===null&&child.signalCode===null)child.kill();await closed;}};
}
async function run(first){
 const result={phase:first?'write':'restore',remoteAttempts:[],errors:[]};evidence.runs.push(result);
 const server=start();let context,observer;
 try{
  await server.started;
  context=await chromium.launchPersistentContext(profile,{executablePath:'/usr/bin/google-chrome',headless:true,viewport:{width:1280,height:760},serviceWorkers:'block',args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  await context.route('**/*',route=>{
   const u=new URL(route.request().url());
   if((u.protocol==='http:'||u.protocol==='https:')&&u.origin!==base){result.remoteAttempts.push(u.href);return route.abort();}
   return route.continue();
  });
  const page=context.pages()[0]??await context.newPage();
  observer=observeReleaseNetwork(page);page.on('pageerror',e=>result.errors.push(String(e)));
  if(first){
   await page.goto(base+'/credits.html',{waitUntil:'domcontentloaded'});
   assert.equal(await page.evaluate(()=>localStorage.getItem('milovice_rp_money')),null,'Profile must start empty');
   await page.evaluate(()=>localStorage.setItem('milovice_rp_money','1250'));
  }
  await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:90000});
  const walking=page.locator('[data-spawn="walking"]');
  await walking.waitFor({state:'visible',timeout:90000});
  const distance=page.locator('#rp-distance-select');
  if(first){
   await distance.selectOption('360');
   await page.waitForFunction(()=>window.__miloviceDrawDistance===360&&localStorage.getItem('milovice_draw_distance')==='360',null,{timeout:15000});
  }
  assert.equal(await distance.inputValue(),'360');
  assert.equal(await page.evaluate(()=>window.__miloviceDrawDistance),360);
  await walking.click();
  await page.waitForFunction(()=>document.getElementById('mode')?.textContent==='Pěšky'&&document.getElementById('money')?.textContent==='1250',null,{timeout:30000});
  await page.waitForTimeout(6500);
  result.money=await page.locator('#money').textContent();
  result.distance=await page.evaluate(()=>({runtime:window.__miloviceDrawDistance,saved:localStorage.getItem('milovice_draw_distance'),money:localStorage.getItem('milovice_rp_money')}));
  assert.deepEqual(result.distance,{runtime:360,saved:'360',money:'1250'});
  assert.deepEqual(result.remoteAttempts,[]);assert.deepEqual(result.errors,[]);
  result.network=observer.snapshot().summary;
  for(const key of ['httpErrors','failed','pending'])assert.equal(result.network[key],0,key);
  result.result='pass';
 }catch(error){result.result='fail';result.error=String(error);throw error;}
 finally{if(observer)observer.stop();try{if(context)await context.close();}finally{await server.stop();}}
}
try{
 await run(true);await run(false);
 console.log('PASS local preview storage across full restart',JSON.stringify(evidence));
}finally{
 writeFileSync(join(process.env.RUNNER_TEMP,'local-preview-storage.json'),JSON.stringify(evidence,null,2));
 rmSync(profile,{recursive:true,force:true});
}
