import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright-core';
const out=join(process.env.RUNNER_TEMP||'.','procedural-car-review');mkdirSync(out);
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:720,height:540}});
const errors=[];const external=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.route('**/*',r=>{if(r.request().url().startsWith('http://127.0.0.1:8080/'))return r.continue();external.push(r.request().url());return r.abort();});
try{
 await page.goto('http://127.0.0.1:8080/procedural-car-review.html');
 await page.waitForFunction(()=>window.reviewReady===true);
 const results=[];
 for(let variant=0;variant<8;variant++){
  const r=await page.evaluate(async variant=>{
   const THREE=await import('three');
   const {makeRoadCar}=await import('/scripts/world-models.js');
   const {batchProceduralRoadCar}=await import('/scripts/procedural-car-batching.js');
   const original=makeRoadCar(THREE,variant),optimized=batchProceduralRoadCar(THREE,original);
   if(!optimized)throw Error('Batch candidate failed '+variant);
   const renderer=new THREE.WebGLRenderer({antialias:false,preserveDrawingBuffer:true});renderer.setSize(640,420);
   const scene=new THREE.Scene();scene.background=new THREE.Color(0x263645);
   scene.add(new THREE.HemisphereLight(0xffffff,0x69717d,2));
   const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,8,-4);scene.add(light);
   const camera=new THREE.PerspectiveCamera(36,640/420,.1,100);
   const cv=document.createElement('canvas');cv.width=640;cv.height=420;const ctx=cv.getContext('2d',{willReadFrequently:true});
   const views=[];
   function render(group,eye){
    scene.add(group);camera.position.set(...eye);camera.lookAt(0,.8,0);
    renderer.render(scene,camera);const calls=renderer.info.render.calls,tris=renderer.info.render.triangles;
    ctx.drawImage(renderer.domElement,0,0);
    const pixels=ctx.getImageData(0,0,640,420).data;
    const png=renderer.domElement.toDataURL();scene.remove(group);return {calls,tris,pixels,png};
   }
   for(const [i,eye] of [[5,3.2,-6],[-5,3.1,6]].entries()){
    const a=render(original.group,eye),b=render(optimized.group,eye);
    let significant=0,visible=0,maxDelta=0;
    for(let p=0;p<a.pixels.length;p+=4){
     const delta=Math.max(...[0,1,2].map(j=>Math.abs(a.pixels[p+j]-b.pixels[p+j])));
     maxDelta=Math.max(maxDelta,delta);if(delta>12)significant++;
     if(Math.max(...[0,1,2].map(j=>Math.abs(a.pixels[p+j]-a.pixels[j])))>12)visible++;
    }
    views.push({i,callsBefore:a.calls,callsAfter:b.calls,trianglesBefore:a.tris,trianglesAfter:b.tris,significant,visible,maxDelta,png:b.png});
   }
   const before=optimized.wheels.map(w=>w.quaternion.clone());
   optimized.wheels[0].rotation.x-=.4;
   const independent=optimized.wheels[0].quaternion.angleTo(before[0])>.39&&
    optimized.wheels.slice(1).every((w,i)=>w.quaternion.angleTo(before[i+1])<1e-6)&&
    original.wheels.every((w,i)=>w.quaternion.angleTo(before[i])<1e-6)&&
    optimized.wheels.every((w,i)=>w.position.distanceTo(original.wheels[i].position)<1e-6&&w.userData.wheelRadius===original.wheels[i].userData.wheelRadius);
   renderer.dispose();renderer.forceContextLoss();optimized.disposeBatches();
   return {variant,kind:original.kind,stats:optimized.stats,independent,views};
  },variant);
  assert.equal(r.independent,true);
  for(const v of r.views){
   assert.ok(v.visible>1000,'Empty car render');
   assert.ok(v.callsAfter<=v.callsBefore-6,'Expected further reduction beyond first three saved draws');
   assert.equal(v.trianglesAfter,v.trianglesBefore);
   assert.ok(v.significant<=v.visible*.005,'More than 0.5% foreground pixels changed significantly');
   writeFileSync(join(out,'car-'+variant+'-'+v.i+'.png'),Buffer.from(v.png.split(',')[1],'base64'));
   delete v.png;
  }
  results.push(r);
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 writeFileSync(join(out,'report.json'),JSON.stringify(results,null,2));
 console.log('PROCEDURAL CAR REVIEW',JSON.stringify(results));
}finally{await browser.close();}
