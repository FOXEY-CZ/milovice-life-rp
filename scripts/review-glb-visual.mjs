// Internal evidence only: produce four orthographic renders per exact pinned model.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';

const [reportPath,out]=process.argv.slice(2);
assert(reportPath&&out,'Expected audited manifest and new output directory');
const manifest=JSON.parse(readFileSync(reportPath,'utf8'));
assert.equal(manifest.review,'pending');
assert.equal(manifest.models.length,9);
mkdirSync(out,{recursive:false});
const models=new Map();
for(const m of manifest.models){
 assert(/^[a-zA-Z0-9]+$/.test(m.id)&&!models.has(m.id),'invalid id');
 assert.equal(m.hashMatches,true);assert.equal(m.sizeMatches,true);assert.equal(m.external.length,0);
 const url=new URL(m.url);assert.equal(url.origin,'https://raw.githubusercontent.com');
 const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});
 assert(r.ok,'HTTP '+r.status);
 const parts=[];let size=0;
 for await(const p of r.body){size+=p.byteLength;assert(size<=32*1024*1024);parts.push(Buffer.from(p));}
 const bytes=Buffer.concat(parts);
 assert.equal(bytes.length,m.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),m.sha256);
 models.set(m.id,bytes);
}
const html='<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#ddd}canvas{display:block}</style><script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"}}</script><script type="module">'+
'import * as T from "three";import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";'+
'const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(720,540);renderer.setPixelRatio(1);renderer.setClearColor(0xe2e5ea);document.body.append(renderer.domElement);'+
'const scene=new T.Scene();scene.add(new T.HemisphereLight(0xffffff,0x8b8b8b,2.6));const key=new T.DirectionalLight(0xffffff,2.1);key.position.set(3,5,4);scene.add(key);const fill=new T.DirectionalLight(0xffffff,1.2);fill.position.set(-4,2,-3);scene.add(fill);'+
'let root;window.drawModel=async(id,angle)=>{if(root)scene.remove(root);const gltf=await new GLTFLoader().loadAsync("/model/"+id);root=gltf.scene;scene.add(root);root.updateMatrixWorld(true);root.traverse(o=>{if(o.isSkinnedMesh){o.frustumCulled=false;o.skeleton.update();}});const b=new T.Box3().setFromObject(root,true);const center=b.getCenter(new T.Vector3());const size=b.getSize(new T.Vector3());const extent=Math.max(size.x,size.y,size.z);if(!Number.isFinite(extent)||extent<=0)throw Error("invalid bounds");const span=extent*0.85;const c=new T.OrthographicCamera(-span*4/3,span*4/3,span,-span,extent*0.001,extent*20);c.position.copy(center).add(new T.Vector3(Math.cos(angle)*extent*3,extent*1.15,Math.sin(angle)*extent*3));c.lookAt(center);renderer.render(scene,c);const canvas=document.createElement("canvas");canvas.width=720;canvas.height=540;const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(renderer.domElement,0,0);const data=ctx.getImageData(0,0,720,540).data;const bg=[data[0],data[1],data[2]];let minX=720,minY=540,maxX=-1,maxY=-1,count=0;for(let y=0;y<540;y++)for(let x=0;x<720;x++){const p=(y*720+x)*4;if(Math.abs(data[p]-bg[0])+Math.abs(data[p+1]-bg[1])+Math.abs(data[p+2]-bg[2])<15)continue;count++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}return {extent,center:center.toArray(),size:size.toArray(),pixelBounds:{minX,minY,maxX,maxY,count}};};window.ready=true;</script>';
const server=createServer((req,res)=>{
 if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);return;}
 const id=req.url?.match(/^\/model\/([a-zA-Z0-9]+)$/)?.[1];if(id&&models.has(id)){res.writeHead(200,{'Content-Type':'model/gltf-binary'});res.end(models.get(id));return;}
 res.writeHead(404);res.end();
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const evidence=[];
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:720,height:540},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 for(const m of manifest.models){
  await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.ready===true,null,{timeout:30000});
  const views=[];
  for(let i=0;i<4;i++){
   const bounds=await page.evaluate(async({id,angle})=>await window.drawModel(id,angle),{id:m.id,angle:Math.PI/4+i*Math.PI/2});
   const file=m.id+'-'+(i+1)+'.png';
   await page.locator('canvas').screenshot({path:join(out,file)});
   const p=bounds.pixelBounds;
   assert(p.count>=720*540*.005&&p.maxX-p.minX>=50&&p.maxY-p.minY>=50,m.id+' view '+i+' blank or too small: '+JSON.stringify(p));
   assert(p.minX>=8&&p.minY>=8&&p.maxX<712&&p.maxY<532,m.id+' view '+i+' clipped: '+JSON.stringify(p));
   views.push({file,angleDegrees:45+i*90,bounds});
  }
  evidence.push({id:m.id,sha256:m.sha256,review:'pending',views});
  console.log('Rendered four views for '+m.id);
 }
 assert.deepEqual(errors,[]);
}finally{
 writeFileSync(join(out,'visual-review.json'),JSON.stringify({review:'pending',models:evidence},null,2)+'\n');
 await browser?.close();await new Promise(resolve=>server.close(resolve));
}
assert.equal(evidence.length,9);
console.log('PASS generated 36 review views; human review still pending');
