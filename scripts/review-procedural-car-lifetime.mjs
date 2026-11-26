import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage();const errors=[],external=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.route('**/*',r=>{if(r.request().url().startsWith('http://127.0.0.1:8080/'))return r.continue();external.push(r.request().url());return r.abort();});
try{
 await page.goto('http://127.0.0.1:8080/procedural-car-review.html');
 const report=await page.evaluate(async()=>{
  const THREE=await import('three');
  const {makeRoadCar}=await import('/scripts/world-models.js');
  const {batchProceduralRoadCar}=await import('/scripts/procedural-car-batching.js');
  const {createProceduralCarOwnership}=await import('/scripts/procedural-car-ownership.js');
  const owner=createProceduralCarOwnership();
  const renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(320,240);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,320/240,.1,100);
  camera.position.set(6,5,-12);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x555555,2));
  function make(batch){
   const original=makeRoadCar(THREE,0),selected=batch?batchProceduralRoadCar(THREE,original):original;
   if(!selected)throw Error('Missing batch');
   return {selected,lease:owner.register(original,selected)};
  }
  const survivor=make(true);survivor.selected.group.position.x=-2;scene.add(survivor.selected.group);
  const shared=new Set(),textures=new Set();let sharedDisposals=0;
  survivor.selected.group.traverse(n=>{if(n.isMesh){shared.add(n.material);if(n.material.map)textures.add(n.material.map);}});
  for(const r of [...shared,...textures])r.addEventListener('dispose',()=>sharedDisposals++);
  const render=()=>{renderer.render(scene,camera);return {geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,calls:renderer.info.render.calls};};
  const baseline=render(),cycles=[];
  for(let i=0;i<16;i++){
   const car=make(i%2===0);car.selected.group.position.x=2;scene.add(car.selected.group);
   const expanded=render();
   scene.remove(car.selected.group);
   const first=car.lease.release(),second=car.lease.release(),restored=render();
   cycles.push({batch:i%2===0,expanded,restored,first,second});
  }
  scene.remove(survivor.selected.group);survivor.lease.release();
  const final=render();
  renderer.dispose();renderer.forceContextLoss();
  return {baseline,cycles,final,sharedDisposals};
 });
 assert.ok(report.baseline.geometries>0);
 assert.equal(report.baseline.calls,21);
 for(const c of report.cycles){
  assert.ok(c.expanded.geometries>report.baseline.geometries);
  assert.equal(c.first,true);assert.equal(c.second,false);
  assert.deepEqual(c.restored,report.baseline);
 }
 assert.equal(report.final.geometries,0);
 assert.equal(report.sharedDisposals,0);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 console.log('PROCEDURAL LIFETIME',JSON.stringify(report));
}finally{await browser.close();}
