import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright-core';
import {observeReleaseNetwork} from './release-network-observer.mjs';
const root=process.argv[2];assert.ok(root);
const read=p=>readFileSync(join(root,p),'utf8');
assert.match(read('index.html'),/name="crossvex-profile" content="procedural-preview"/);
for(const p of ['vehicle-assets','human-assets']){
 const source=read('scripts/'+p+'.js');
 assert.doesNotMatch(source,/https?:|GLTFLoader|\.glb|\bfetch\s*\(/i);
}
for(const p of ['vehicle-axle-adapter.js','spectral-wheel-adapter.js','spectral-mesh-batching.js'])
 assert.ok(!readdirSync(join(root,'scripts')).includes(p),'Unneeded adapter staged '+p);
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:760}});
const observer=observeReleaseNetwork(page),errors=[],glb=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('request',r=>{if(/\.(?:glb|gltf)(?:[?#.]|$)/i.test(r.url()))glb.push(r.url());});
await page.addInitScript(()=>{localStorage.setItem('milovice_glb_quality','coupe');localStorage.setItem('milovice_glb_humans','on');});
try{
 await page.goto('http://127.0.0.1:8080/?proceduralBatch=0',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__miloviceStarted===true,null,{timeout:90000});
 for(const id of ['#rp-model-select','#rp-human-select']){
  const el=page.locator(id);assert.equal(await el.isDisabled(),true);assert.equal(await el.inputValue(),'off');assert.equal(await el.locator('option').count(),1);
 }
 await page.locator('[data-spawn="sedan"]').click({timeout:90000});
 await page.waitForFunction(()=>{
  const d=window.__miloviceVehicleDebug,g=window.__miloviceGLBDebug,h=window.__miloviceHumans;
  return d?.activeCarId&&d.proceduralLifetime?.enabled&&d.previewRoadCount>0&&d.previewBatchCount===d.previewRoadCount&&g?.mode==='off'&&g.assignments.length===0&&h?.mode==='off'&&h.loaded.length===0&&d.drivenWheels.length===4;
 },null,{timeout:60000});
 const before=await page.evaluate(()=>window.__miloviceVehicleDebug);
 await page.keyboard.down('w');
 try{await page.waitForFunction(({id,wheels})=>{const d=window.__miloviceVehicleDebug;return d?.activeCarId===id&&Number(document.getElementById('speed').textContent)>0&&d.drivenWheels.every((w,i)=>Math.abs(w-wheels[i])>.001);},{id:before.activeCarId,wheels:before.drivenWheels},{timeout:25000});}finally{await page.keyboard.up('w');}
 await page.keyboard.press('r');
 await page.waitForFunction(n=>{const d=window.__miloviceVehicleDebug;return !d?.activeCarId&&d?.proceduralLifetime?.released>n;},before.proceduralLifetime.released,{timeout:60000});
 const picker=page.locator('#rp-spawn');if(!(await picker.isVisible()))await page.locator('#rp-vehicles').click();await picker.waitFor({state:'visible'});
 await page.locator('[data-spawn="walking"]').click();
 await page.waitForFunction(()=>document.getElementById('mode')?.textContent==='Pěšky',null,{timeout:30000});
 await page.locator('#maplaunch').click();
 await page.locator('#osmmap .leaflet-control-attribution').waitFor({state:'visible',timeout:30000});
 assert.match(await page.locator('#osmmap .leaflet-control-attribution').innerText(),/OpenStreetMap/);
 await page.locator('#closemap').click();
 await page.waitForTimeout(6500);
 assert.deepEqual(glb,[]);assert.deepEqual(errors,[]);
 console.log('PASS procedural distribution preview',JSON.stringify({network:observer.snapshot().summary,glb,errors,roadCars:before.previewRoadCount}));
}finally{observer.stop();await browser.close();}
