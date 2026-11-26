import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:760}});
const errors=[],requests=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('request',r=>{if(/quaternius-(car|sport|suv)\.glb|spectral_gt_rs_game_ready\.glb/.test(r.url()))requests.push(r.url());});
await page.addInitScript(()=>localStorage.setItem('milovice_glb_quality','on'));
try{
 await page.goto('http://127.0.0.1:8080/?proceduralBatch=1',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:90000});
 const state=()=>page.evaluate(()=>({vehicle:window.__miloviceVehicleDebug,glb:window.__miloviceGLBDebug}));
 // Vehicle ID and GLB assignments can update before the 2 Hz lifetime diagnostic.
 // Require a coherent fresh snapshot from the same spawn generation.
 await page.waitForFunction(()=>{
  const d=window.__miloviceVehicleDebug,p=d?.proceduralLifetime;
  return !d?.activeCarId&&p?.enabled&&d.previewRoadCount>0&&p.live===d.previewRoadCount&&p.created-p.released===p.live;
 },null,{timeout:60000});
 const initial=await state();
 const waitModel=async (key,prior,releases)=>{
  const old=prior.vehicle.proceduralLifetime,oldId=prior.vehicle.activeCarId;
  await page.waitForFunction(({key,old,oldId,releases})=>{
   const d=window.__miloviceVehicleDebug,g=window.__miloviceGLBDebug,p=d?.proceduralLifetime;
   return d?.activeCarId&&d.activeCarId!==oldId&&p?.enabled&&d.previewBatchCount===d.previewRoadCount&&
    p.live===d.previewRoadCount&&p.created-p.released===p.live&&p.created>=old.created+1&&p.released===old.released+releases&&
    d.drivenWheels.length===4&&g?.mode==='on'&&
    (!oldId||!g.assignments.some(a=>a.id===oldId))&&
    g.assignments.some(a=>a.id===d.activeCarId&&a.key===key&&a.wheels===4&&a.driven&&!a.overlay);
  },{key,old,oldId,releases},{timeout:90000});
  return state();
 };
 await page.locator('[data-spawn="sedan"]').click({timeout:90000});
 const first=await waitModel('cityCar',initial,0);
 const firstId=first.vehicle.activeCarId;
 await page.locator('#rp-vehicles').click();
 await page.locator('[data-spawn="suv"]').click();
 const second=await waitModel('citySUV',first,1),secondId=second.vehicle.activeCarId;
 assert.notEqual(firstId,secondId);
 assert.ok(!second.glb.assignments.some(a=>a.id===firstId));
 assert.equal(second.vehicle.proceduralLifetime.released,first.vehicle.proceduralLifetime.released+1);
 assert.equal(second.vehicle.proceduralLifetime.live,first.vehicle.proceduralLifetime.live);
 await page.keyboard.press('r');
 await page.waitForFunction(({id,released})=>{
  const d=window.__miloviceVehicleDebug,g=window.__miloviceGLBDebug;
  return !d?.activeCarId&&d?.proceduralLifetime?.released>released&&d.proceduralLifetime.live===d.previewRoadCount&&
   !g?.assignments.some(a=>a.id===id);
 },{id:secondId,released:second.vehicle.proceduralLifetime.released},{timeout:60000});
 const reset=await state();
 assert.equal(reset.vehicle.proceduralLifetime.created-reset.vehicle.proceduralLifetime.released,reset.vehicle.proceduralLifetime.live);
 await page.locator('#rp-vehicles').click();
 await page.locator('#rp-model-select').selectOption('off');
 await page.locator('[data-spawn="sedan"]').click();
 await page.waitForFunction(previousCreated=>{
  const d=window.__miloviceVehicleDebug,g=window.__miloviceGLBDebug;
  return d?.activeCarId&&d.previewBatchCount===d.previewRoadCount&&d.proceduralLifetime?.live===d.previewRoadCount&&g?.mode==='off'&&g.assignments.length===0&&d.drivenWheels.length===4&&d.proceduralLifetime.created>previousCreated;
 },reset.vehicle.proceduralLifetime.created,{timeout:60000});
 const fallback=await state();
 assert.deepEqual(errors,[]);
 assert.ok(requests.some(r=>r.includes('quaternius-car.glb'))&&requests.some(r=>r.includes('quaternius-suv.glb')));
 console.log('PASS GLB retirement in procedural mode',JSON.stringify({firstId,secondId,first:first.vehicle.proceduralLifetime,second:second.vehicle.proceduralLifetime,reset:reset.vehicle.proceduralLifetime,fallback:fallback.vehicle.proceduralLifetime,requests:requests.length,errors}));
}catch(error){
 console.error('GLB retirement failure snapshot',JSON.stringify(await page.evaluate(()=>({vehicle:window.__miloviceVehicleDebug,glb:window.__miloviceGLBDebug})).catch(()=>null)),JSON.stringify(errors));
 throw error;
}finally{await browser.close();}
