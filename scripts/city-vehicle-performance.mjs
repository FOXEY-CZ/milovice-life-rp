import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {chromium} from 'playwright-core';

const output=process.argv[2];
assert.ok(output,'Output JSON path required');
const base='http://127.0.0.1:8080';
const viewport={width:1280,height:760};
const backend=process.env.CITY_PERF_BACKEND||'swiftshader';
assert.ok(['swiftshader','auto'].includes(backend),'CITY_PERF_BACKEND must be swiftshader or auto');
const windowMs=Number(process.env.CITY_PERF_WINDOW_MS||8000);
assert.ok(Number.isInteger(windowMs)&&windowMs>=8000&&windowMs<=60000,'CITY_PERF_WINDOW_MS must be 8000–60000');
const evidence={schema:2,scope:'stationary in-world RAF comparison; not isolated GPU render time or hardware FPS certification',backendRequested:backend,viewport,warmupMs:6500,windowMs,order:['on','coupe','coupe','on'],samples:[],pageErrors:[]};
const browser=await chromium.launch(backend==='swiftshader'?
 {executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:
 {...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{channel:'chrome'}),headless:false});
function stats(values){
 const sorted=[...values].sort((a,b)=>a-b);
 const q=p=>sorted[Math.max(0,Math.ceil(sorted.length*p)-1)];
 return {count:sorted.length,meanMs:values.reduce((a,b)=>a+b,0)/values.length,p50Ms:q(.5),p95Ms:q(.95),p99Ms:q(.99),maxMs:sorted.at(-1),over33ms:values.filter(x=>x>1000/30).length,over50ms:values.filter(x=>x>50).length,over100ms:values.filter(x=>x>100).length};
}
try{
 const page=await browser.newPage({viewport,deviceScaleFactor:1});
 page.on('pageerror',e=>evidence.pageErrors.push(String(e)));
 await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:60000});
 assert.equal(await page.evaluate(()=>matchMedia('(pointer:fine)').matches),true);
 await page.locator('[data-spawn="sedan"]').waitFor({state:'visible',timeout:90000});
 await page.locator('[data-spawn="sedan"]').click();
 await page.waitForFunction(()=>!!window.__miloviceVehicleDebug?.activeCarId&&Number(document.getElementById('speed')?.textContent)===0,null,{timeout:30000});
 const id=await page.evaluate(()=>window.__miloviceVehicleDebug.activeCarId);
 evidence.vehicleId=id;
 evidence.environment=await page.evaluate(()=>{
  // Probe a separate temporary context, never alter the game's renderer.
  const canvas=document.createElement('canvas');
  const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');
  let renderer=null,vendor=null,unmasked=false;
  if(gl){
   const ext=gl.getExtension('WEBGL_debug_renderer_info');
   renderer=gl.getParameter(ext?.UNMASKED_RENDERER_WEBGL??gl.RENDERER);
   vendor=gl.getParameter(ext?.UNMASKED_VENDOR_WEBGL??gl.VENDOR);
   unmasked=!!ext;
   gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
  return {userAgent:navigator.userAgent,deviceMemory:navigator.deviceMemory??null,hardwareConcurrency:navigator.hardwareConcurrency,dpr:devicePixelRatio,visibility:document.visibilityState,probeRenderer:renderer,probeVendor:vendor,probeUnmasked:unmasked};
 });
 console.log('CITY VEHICLE ENVIRONMENT',JSON.stringify(evidence.environment));
 for(const mode of evidence.order){
  const key=mode==='coupe'?'spectralGT':'cityCar';
  await page.locator('#rp-vehicles').click();
  await page.locator('#rp-model-select').selectOption(mode);
  await page.locator('#rp-spawn-close').click();
  await page.waitForFunction(({id,key,mode})=>{
   const d=window.__miloviceGLBDebug;
   return d?.mode===mode&&d.assignments.some(a=>a.id===id&&a.key===key&&a.driven&&a.wheels===4&&!a.overlay)&&d.assignments.filter(a=>a.key==='spectralGT').length===(mode==='coupe'?1:0);
  },{id,key,mode},{timeout:45000});
  await page.waitForTimeout(evidence.warmupMs);
  const rec=await page.evaluate(({id,key,mode,duration})=>new Promise((resolve,reject)=>{
   const times=[],issues=new Set(),counts=new Set(),canvasSizes=new Set();
   let start,previous,raf,settled=false;
   const finish=(error)=>{if(settled)return;settled=true;clearTimeout(watchdog);cancelAnimationFrame(raf);if(error)reject(error);else resolve({times,issues:[...issues],activeModelCounts:[...counts],canvasSizes:[...canvasSizes],elapsedMs:previous-start});};
   const watchdog=setTimeout(()=>finish(new Error('RAF sampling watchdog expired')),duration+20000);
   function frame(t){
    if(start===undefined)start=t;
    if(previous!==undefined)times.push(t-previous);
    previous=t;
    const d=window.__miloviceGLBDebug;
    if(d?.mode!==mode||!d.assignments.some(a=>a.id===id&&a.key===key&&a.driven&&a.wheels===4&&!a.overlay))issues.add('model or mode changed');
    if(d?.assignments.filter(a=>a.key==='spectralGT').length!==(mode==='coupe'?1:0))issues.add('unexpected heavy model count');
    if(window.__miloviceVehicleDebug?.activeCarId!==id||Number(document.getElementById('speed')?.textContent)!==0)issues.add('vehicle or stationary state changed');
    if(document.visibilityState!=='visible')issues.add('page hidden');
    counts.add(d?.activeCount??-1);
    const canvas=[...document.querySelectorAll('canvas')].sort((a,b)=>b.width*b.height-a.width*a.height)[0];
    if(canvas)canvasSizes.add(canvas.width+'x'+canvas.height);else issues.add('no canvas');
    if(t-start>=duration)finish();else raf=requestAnimationFrame(frame);
   }
   raf=requestAnimationFrame(frame);
  }),{id,key,mode,duration:evidence.windowMs});
  assert.deepEqual(rec.issues,[]);
  assert.ok(rec.times.length>=5&&rec.times.every(x=>Number.isFinite(x)&&x>0),'Insufficient valid RAF intervals');
  assert.equal(rec.canvasSizes.length,1,'Canvas resolution changed during sample');
  const summary=stats(rec.times);
  const result={mode,key,...rec,summary,observedFps:1000/summary.meanMs};
  evidence.samples.push(result);
  console.log('CITY VEHICLE PERF',JSON.stringify({mode,key,canvasSizes:rec.canvasSizes,activeModelCounts:rec.activeModelCounts,observedFps:result.observedFps,...summary}));
 }
 assert.equal(new Set(evidence.samples.flatMap(x=>x.canvasSizes)).size,1,'Canvas differs across modes');
 assert.deepEqual(evidence.pageErrors,[]);
 const aggregate=mode=>{
  const timings=evidence.samples.filter(x=>x.mode===mode).flatMap(x=>x.times);
  const s=stats(timings);return {...s,observedFps:1000/s.meanMs};
 };
 evidence.aggregate={on:aggregate('on'),coupe:aggregate('coupe')};
 evidence.result='pass';
 console.log('PASS stationary ABBA comparison',JSON.stringify(evidence.aggregate));
}catch(error){evidence.result='fail';evidence.error=String(error);throw error;}
finally{writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');await browser.close();}
