import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright-core';
const stage=process.argv[2],output=process.argv[3];
assert.ok(stage&&output);
const path=join(stage,'index.html');
let html=readFileSync(path,'utf8');
function replaceOnce(from,to){
 assert.equal(html.split(from).length,2,'Expected unique stage marker: '+from);
 html=html.replace(from,to);
}
replaceOnce("import {makeVehicleAssetManager} from './scripts/vehicle-assets.js?v=534800';",
 "import {makeVehicleAssetManager} from './scripts/vehicle-assets.js?v=534800';\nimport {batchProceduralRoadCar} from './scripts/procedural-car-batching.js';\nconst batchPreview=new URLSearchParams(location.search).get('batchPreview')==='1';");
replaceOnce(" const vehicle=type===7?makePidBus(THREE,'432',true):makeRoadCar(THREE,index);",
 " const originalVehicle=type===7?makePidBus(THREE,'432',true):makeRoadCar(THREE,index);\n const vehicle=batchPreview&&type!==7?(batchProceduralRoadCar(THREE,originalVehicle)||originalVehicle):originalVehicle;\n if(vehicle.stats)vehicle.group.userData.batchPreview=true;");
replaceOnce("  glbModels:window.__miloviceGLBDebug?.assignments||[]",
 "  glbModels:window.__miloviceGLBDebug?.assignments||[],\n  previewBatchCount:trafficCars.filter(c=>c.g.userData.batchPreview===true).length,\n  previewRoadCount:trafficCars.filter(c=>c.type!==7).length");
copyFileSync(new URL('./procedural-car-batching.js',import.meta.url),join(stage,'scripts/procedural-car-batching.js'));
writeFileSync(path,html);
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
   await page.goto('http://127.0.0.1:8080/?batchPreview='+(batch?1:0),{waitUntil:'domcontentloaded',timeout:30000});
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
   await page.keyboard.down('w');
   try{await page.waitForFunction(()=>Number(document.getElementById('speed').textContent)>0,null,{timeout:25000});}finally{await page.keyboard.up('w');}
   const moved=await page.evaluate(()=>window.__miloviceVehicleDebug);
   assert.equal(moved.activeCarId,state.debug.activeCarId);
   assert.ok(moved.drivenWheels.some((w,i)=>w!==state.debug.drivenWheels[i]),'Wheels did not rotate');
   assert.deepEqual(errors,[]);assert.deepEqual(carRequests,[]);
   const mean=sample.intervals.reduce((a,b)=>a+b,0)/sample.intervals.length;
   results.push({batch,roadCount:state.debug.previewRoadCount,meanMs:mean,...sample,vehicleId:moved.activeCarId,wheels:moved.drivenWheels});
   console.log('CITY BATCH PREVIEW',JSON.stringify(results.at(-1)));
  }finally{await page.close();}
 }
 assert.equal(new Set(results.flatMap(r=>r.sizes)).size,1);
}finally{writeFileSync(output,JSON.stringify({scope:'separate fresh staged pages ABBA; SwiftShader only; uncontrolled NPC count; not physical GPU FPS',results},null,2));await browser.close();}
