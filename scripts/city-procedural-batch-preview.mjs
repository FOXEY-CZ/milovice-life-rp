import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright-core';
const stage=process.argv[2],output=process.argv[3];
assert.ok(stage&&output);
assert.ok(readFileSync(join(stage,'index.html'),'utf8').includes('20261126-procedural-preview-535000'),'Expected staged 5.350 runtime');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try{
 for(const batch of [false,true,true,false]){
  const page=await browser.newPage({viewport:{width:1280,height:760},deviceScaleFactor:1});
  const errors=[],carRequests=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('request',r=>{if(/quaternius-(car|sport|suv)\.glb|spectral_gt_rs_game_ready\.glb/.test(r.url()))carRequests.push(r.url());});
  await page.addInitScript(()=>localStorage.setItem('milovice_glb_quality','off'));
  try{
   await page.goto('http://127.0.0.1:8080/?proceduralBatch='+(batch?1:0),{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:90000});
   await page.locator('[data-spawn="sedan"]').click({timeout:90000});
   await page.waitForFunction(()=>!!window.__miloviceVehicleDebug?.activeCarId&&window.__miloviceVehicleDebug?.previewRoadCount>0,null,{timeout:60000});
   await page.waitForTimeout(6500);
   const state=await page.evaluate(()=>({debug:window.__miloviceVehicleDebug,glb:window.__miloviceGLBDebug?.mode,speed:Number(document.getElementById('speed').textContent)}));
   assert.equal(state.glb,'off');assert.equal(state.speed,0);
   assert.equal(state.debug.previewBatchCount,batch?state.debug.previewRoadCount:0);
   assert.equal(state.debug.drivenWheels.length,4);
   const sample=await page.evaluate(()=>new Promise((resolve,reject)=>{
    const intervals=[],counts=new Set(),sizes=new Set();let first,prev;
    const timeout=setTimeout(()=>reject(Error('RAF timeout')),35000);
    function tick(t){
     if(first===undefined)first=t;
     if(prev!==undefined)intervals.push(t-prev);prev=t;
     const d=window.__miloviceVehicleDebug;counts.add(d.previewRoadCount+':'+d.previewBatchCount);
     const canvas=[...document.querySelectorAll('canvas')].sort((a,b)=>b.width*b.height-a.width*a.height)[0];
     if(canvas)sizes.add(canvas.width+'x'+canvas.height);
     if(t-first>=8000){clearTimeout(timeout);resolve({intervals,counts:[...counts],sizes:[...sizes]});}else requestAnimationFrame(tick);
    }requestAnimationFrame(tick);
   }));
   assert.ok(sample.intervals.length>=5);assert.equal(sample.sizes.length,1);
   for(const count of sample.counts){const [n,b]=count.split(':').map(Number);assert.ok(n>0);assert.equal(b,batch?n:0);}
   const mean=sample.intervals.reduce((a,b)=>a+b,0)/sample.intervals.length;
   const record={batch,roadCount:state.debug.previewRoadCount,meanMs:mean,...sample,vehicleId:state.debug.activeCarId,wheelsBefore:state.debug.drivenWheels,driveVerified:false};
   results.push(record);
   console.log('CITY BATCH STATIONARY',JSON.stringify(record));
   await page.keyboard.down('w');
   try{
    await page.waitForFunction(({id,wheels})=>{
     const d=window.__miloviceVehicleDebug;
     return d?.activeCarId===id&&Number(document.getElementById('speed').textContent)>0&&
      d.drivenWheels.length===4&&d.drivenWheels.every((w,i)=>Math.abs(w-wheels[i])>.001);
    },{id:state.debug.activeCarId,wheels:state.debug.drivenWheels},{timeout:25000});
    const moved=await page.evaluate(()=>window.__miloviceVehicleDebug);
    assert.equal(moved.activeCarId,state.debug.activeCarId);
    assert.ok(moved.drivenWheels.every((w,i)=>Math.abs(w-state.debug.drivenWheels[i])>.001),'All four wheels must rotate');
    record.wheels=moved.drivenWheels;record.driveVerified=true;
   }finally{
    await page.keyboard.up('w');
    record.finalDiagnostic=await page.evaluate(()=>({debug:window.__miloviceVehicleDebug,speed:Number(document.getElementById('speed').textContent)}));
    record.pageErrors=[...errors];record.carRequests=[...carRequests];
   }
   assert.deepEqual(errors,[]);assert.deepEqual(carRequests,[]);
   if(batch){
    // Separate zero-speed page reload for deterministic removal regression.
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:90000});
    const snapshot=()=>page.evaluate(()=>window.__miloviceVehicleDebug);
    await page.locator('[data-spawn="sedan"]').click({timeout:90000});
    await page.waitForFunction(()=>{const d=window.__miloviceVehicleDebug;return d?.activeCarId&&d.proceduralLifetime?.enabled&&d.proceduralLifetime.live===d.previewRoadCount;},null,{timeout:60000});
    const before=await snapshot(),cycles=[];
    for(const kind of ['suv','van','sedan']){
     const prior=await snapshot();
     await page.locator('#rp-vehicles').click();
     await page.locator('[data-spawn="'+kind+'"]').click();
     await page.waitForFunction(({id,released})=>{const d=window.__miloviceVehicleDebug;return d?.activeCarId&&d.activeCarId!==id&&d.proceduralLifetime?.released>released&&d.proceduralLifetime.live===d.previewRoadCount;},{id:prior.activeCarId,released:prior.proceduralLifetime.released},{timeout:60000});
     const current=await snapshot();
     assert.equal(current.proceduralLifetime.created-current.proceduralLifetime.released,current.proceduralLifetime.live);
     cycles.push(current.proceduralLifetime);
    }
    const last=await snapshot();
    await page.keyboard.press('r');
    await page.waitForFunction(n=>{const d=window.__miloviceVehicleDebug;return !d?.activeCarId&&d?.proceduralLifetime?.released>n&&d.proceduralLifetime.live===d.previewRoadCount;},last.proceduralLifetime.released,{timeout:60000});
    const reset=await snapshot();
    assert.equal(reset.proceduralLifetime.created-reset.proceduralLifetime.released,reset.proceduralLifetime.live);
    record.lifecycle={before:before.proceduralLifetime,cycles,reset:reset.proceduralLifetime};
    assert.deepEqual(errors,[]);assert.deepEqual(carRequests,[]);
   }
   console.log('CITY BATCH PREVIEW',JSON.stringify(record));
  }finally{await page.close();}
 }
 assert.equal(results.length,4);assert.ok(results.every(r=>r.driveVerified));
 assert.equal(new Set(results.flatMap(r=>r.sizes)).size,1);
}finally{writeFileSync(output,JSON.stringify({scope:'separate fresh staged pages ABBA; SwiftShader only; uncontrolled NPC count; not physical GPU FPS',results},null,2));await browser.close();}
