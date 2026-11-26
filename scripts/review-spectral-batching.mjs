import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
const out=process.argv[2];assert.ok(out);mkdirSync(out,{recursive:false});
const url='https://raw.githubusercontent.com/JaronKBragg7337/spectral-gt-rs/34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rs_game_ready.glb';
const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});assert.ok(response.ok);
const chunks=[];let total=0;for await(const p of response.body){total+=p.byteLength;assert.ok(total<=32*1024*1024);chunks.push(Buffer.from(p));}
const bytes=Buffer.concat(chunks);assert.equal(bytes.length,4688844);
assert.equal(createHash('sha256').update(bytes).digest('hex'),'e7b7f0d9de0c3bc3897c8134b1ceae5631b1da2690d336df18c3ea82e7238c73');
const html=`<!doctype html><meta charset="utf-8"><style>body{margin:0}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"}}</script><script type="module">
import * as T from 'three';
import {makeVehicleAssetManager} from '/scripts/vehicle-assets.js';
import {adaptSpectralWheels} from '/scripts/prepare-spectral-wheels.mjs';
import {batchSpectralMeshes} from '/scripts/batch-spectral-meshes.mjs';
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(800,600);renderer.setPixelRatio(1);renderer.setClearColor(0xe2e5ea);document.body.append(renderer.domElement);
const scene=new T.Scene();scene.add(new T.HemisphereLight(0xffffff,0x8b8b8b,2.6));const light=new T.DirectionalLight(0xffffff,2.1);light.position.set(3,5,4);scene.add(light);
const manager=makeVehicleAssetManager(T);const original=await manager.load('spectralGT');if(!original)throw Error('load failed');
const t0=performance.now(),adapted=adaptSpectralWheels(T,original),adaptMs=performance.now()-t0;if(!adapted)throw Error('adaptation failed');
const t1=performance.now(),batched=batchSpectralMeshes(T,adapted),batchMs=performance.now()-t1;if(!batched)throw Error('batch adaptation failed');
const bounds=new T.Box3().setFromObject(original,true),center=bounds.getCenter(new T.Vector3()),extent=bounds.getSize(new T.Vector3()).length(),span=extent*.62;
const source=[original,adapted.root,batched.root];let active=null,baselinePixels=null;
const c=document.createElement('canvas');c.width=800;c.height=600;const ctx=c.getContext('2d',{willReadFrequently:true});
window.summary={adaptMs,batchMs,stats:batched.stats};
window.renderVariant=(variant,angle,spin)=>{
 if(active)scene.remove(active);
 active=source[variant].clone(true);scene.add(active);active.updateMatrixWorld(true);
 if(spin){
  for(const g of active.children.filter(n=>n.name.startsWith('AdapterWheel_'))){
   const axis=new T.Vector3(1,0,0).applyQuaternion(g.parent.getWorldQuaternion(new T.Quaternion()).invert()).normalize();
   g.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(axis,spin));
  }
 }
 const camera=new T.OrthographicCamera(-span*4/3,span*4/3,span,-span,.01,extent*20);
 camera.position.copy(center).add(new T.Vector3(Math.cos(angle)*extent*2,extent*.72,Math.sin(angle)*extent*2));camera.lookAt(center);
 renderer.render(scene,camera);
 const info={calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
 ctx.drawImage(renderer.domElement,0,0);const data=ctx.getImageData(0,0,800,600).data;
 let changed=0,large=0,delta=0,foreground=0;
 for(let i=0;i<data.length;i+=4){
  const bg=Math.abs(data[i]-data[0])+Math.abs(data[i+1]-data[1])+Math.abs(data[i+2]-data[2]);if(bg>=15)foreground++;
  if(baselinePixels){const v=Math.abs(data[i]-baselinePixels[i])+Math.abs(data[i+1]-baselinePixels[i+1])+Math.abs(data[i+2]-baselinePixels[i+2]);delta+=v;if(v>0)changed++;if(v>30)large++;}
 }
 if(variant===0||variant===1&&spin)baselinePixels=new Uint8ClampedArray(data);
 return {info,foreground,changed,large,delta,angle,spin,variant};
};window.ready=true;
</script>`;
const files=new Set(['vehicle-assets.js','fictional-identity.js','prepare-spectral-wheels.mjs','batch-spectral-meshes.mjs']);
const server=createServer((req,res)=>{
 const path=new URL(req.url,'http://127.0.0.1').pathname;if(path==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);return;}
 const name=path.startsWith('/scripts/')?path.slice(9):'';if(files.has(name)){res.writeHead(200,{'Content-Type':'application/javascript'});res.end(readFileSync(new URL('./'+name,import.meta.url)));return;}res.writeHead(404);res.end();
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;const records=[];
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:800,height:600},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.route(url,r=>r.fulfill({status:200,body:bytes,contentType:'model/gltf-binary',headers:{'access-control-allow-origin':'*'}}));
 await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.ready===true,null,{timeout:30000});
 const summary=await page.evaluate(()=>window.summary);console.log(JSON.stringify(summary));
 for(let view=0;view<4;view++){
  const angle=Math.PI/4+view*Math.PI/2;
  for(const [phase,variants,spin] of [['idle',[0,1,2],0],['rotated',[1,2],Math.PI/3]]){
   let baseline;
   for(const variant of variants){
    const evidence=await page.evaluate(args=>window.renderVariant(...args),[variant,angle,spin]);
    assert.ok(evidence.foreground>2400,'blank render');
    if(!baseline)baseline=evidence;
    assert.equal(evidence.info.triangles,baseline.info.triangles,'visible triangle count changed');
    if(variant===2){assert.ok(evidence.info.calls<baseline.info.calls,'no draw call improvement');assert.ok(evidence.large<evidence.foreground*.02,'significant pixel changes');}
    if(phase==='idle'&&variant===1)assert.ok(evidence.large<evidence.foreground*.02,'adapter changed appearance');
    const file=phase+'-'+view+'-'+variant+'.png';await page.locator('canvas').screenshot({path:join(out,file)});records.push({file,...evidence});
   }
  }
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({summary,records:records.map(({file,info,foreground,large})=>({file,info,foreground,large}))}));
}finally{
 writeFileSync(join(out,'spectral-visual.json'),JSON.stringify({review:'pending',scope:'isolated WebGL, no city FPS claim',records},null,2)+'\n');
 await browser?.close();await new Promise(resolve=>server.close(resolve));
}
assert.equal(records.length,20);console.log('PASS 20 isolated source/adapted/batched views; manual review pending');
