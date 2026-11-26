import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
const [reportPath,out]=process.argv.slice(2);
assert.ok(reportPath&&out);
const manifest=JSON.parse(readFileSync(reportPath,'utf8'));
const targets=['citySUV','cityCar','citySport'],models=new Map();
for(const id of targets){
 const m=manifest.models.find(m=>m.id===id);
 assert.ok(m&&m.hashMatches&&m.sizeMatches&&m.external.length===0);
 const response=await fetch(m.url,{redirect:'error',signal:AbortSignal.timeout(30000)});
 assert.ok(response.ok);
 const parts=[];let total=0;
 for await(const p of response.body){total+=p.byteLength;assert.ok(total<=32*1024*1024);parts.push(Buffer.from(p));}
 const bytes=Buffer.concat(parts);
 assert.equal(bytes.length,m.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),m.sha256);
 models.set(id,{url:m.url,bytes});
}
mkdirSync(out,{recursive:false});
const html=`<!doctype html><meta charset="utf-8"><style>body{margin:0}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"}}</script>
<script type="module">
import * as T from 'three';
import {makeVehicleAssetManager} from '/scripts/vehicle-assets.js';
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(800,600);renderer.setPixelRatio(1);renderer.setClearColor(0xe2e5ea);document.body.append(renderer.domElement);
const scene=new T.Scene();scene.add(new T.HemisphereLight(0xffffff,0x8b8b8b,2.6));const light=new T.DirectionalLight(0xffffff,2.1);light.position.set(3,5,4);scene.add(light);
let manager,car,model,groups,camera,baseline;
const size=()=>new T.Box3().setFromObject(model,true);
const state=()=>groups.map(g=>({center:g.getWorldPosition(new T.Vector3()).toArray(),q:g.quaternion.toArray()}));
function draw(angle){
 const b=baseline,center=b.getCenter(new T.Vector3()),extent=b.getSize(new T.Vector3()).length(),span=extent*.62;
 camera=new T.OrthographicCamera(-span*4/3,span*4/3,span,-span,.01,extent*20);
 camera.position.copy(center).add(new T.Vector3(Math.cos(angle)*extent*2,extent*.72,Math.sin(angle)*extent*2));camera.lookAt(center);
 renderer.render(scene,camera);
 const info={calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
 const c=document.createElement('canvas');c.width=800;c.height=600;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(renderer.domElement,0,0);
 const d=ctx.getImageData(0,0,800,600).data,bg=[d[0],d[1],d[2]];let count=0,minX=800,minY=600,maxX=-1,maxY=-1;
 for(let y=0;y<600;y++)for(let x=0;x<800;x++){const i=(y*800+x)*4;if(Math.abs(d[i]-bg[0])+Math.abs(d[i+1]-bg[1])+Math.abs(d[i+2]-bg[2])<15)continue;count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
 return {info,pixels:{count,minX,minY,maxX,maxY},wheels:state()};
}
window.prepare=async id=>{
 // Force only the relevant selection branch in this isolated harness.
 const nativeMatchMedia=window.matchMedia.bind(window);
 window.matchMedia=q=>q==='(pointer:fine)'?{matches:false}:nativeMatchMedia(q);
 manager=makeVehicleAssetManager(T);await manager.load(id);
 car={id:'review-'+id,type:{citySUV:2,cityCar:0,citySport:3}[id],g:new T.Group(),driven:true,parked:false};
 const proxy=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial());car.g.add(proxy);scene.add(car.g);
 const start=performance.now();manager.update([car],0,0,1,car);const installMs=performance.now()-start;
 model=car.g.userData.licensedGLB;if(!model)throw Error('real manager did not install '+id);
 groups=model.children.filter(g=>g.name.startsWith('AdapterWheel_'));if(groups.length!==4)throw Error('missing wheel groups');
 scene.updateMatrixWorld(true);baseline=size();
 return {installMs,bounds:{min:baseline.min.toArray(),max:baseline.max.toArray()},debug:window.__miloviceGLBDebug};
};
window.draw=draw;window.spin=d=>{manager.spin(car,d);scene.updateMatrixWorld(true);return state();};
window.fallback=()=>{manager.configure('off');return car.g.userData.licensedGLB===null&&car.g.userData.proceduralLOD.visible===true;};
window.ready=true;
</script>`;
const files=new Set(['vehicle-assets.js','fictional-identity.js','vehicle-axle-adapter.js']);
const server=createServer((req,res)=>{
 const path=new URL(req.url,'http://127.0.0.1').pathname;
 if(path==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);return;}
 const name=path.startsWith('/scripts/')?path.slice(9):'';
 if(files.has(name)){res.writeHead(200,{'Content-Type':'application/javascript'});res.end(readFileSync(new URL('./'+name,import.meta.url)));return;}
 res.writeHead(404);res.end();
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;const records=[];
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const id of targets){
  const page=await browser.newPage({viewport:{width:800,height:600},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const {url,bytes}=models.get(id);await page.route(url,r=>r.fulfill({status:200,body:bytes,contentType:'model/gltf-binary',headers:{'access-control-allow-origin':'*'}}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.ready===true,null,{timeout:30000});
  const initial=await page.evaluate(id=>window.prepare(id),id);
  assert.ok(initial.debug.assignments.some(a=>a.key===id&&a.wheels===4));
  const views=[];let idle;
  for(const [phase,travel] of [['idle',0],['rotated',.47],['reverse',-.47]]){
   if(travel)await page.evaluate(d=>window.spin(d),travel);
   for(let i=0;i<2;i++){
    const evidence=await page.evaluate(a=>window.draw(a),Math.PI/4+i*Math.PI);
    const p=evidence.pixels;
    assert.ok(p.count>2400&&p.maxX-p.minX>50&&p.maxY-p.minY>50,id+' blank');
    assert.ok(p.minX>=8&&p.minY>=8&&p.maxX<792&&p.maxY<592,id+' clipped');
    if(!idle)idle=evidence;
    assert.equal(evidence.info.triangles,idle.info.triangles,'triangle count changed during rotation');
    for(let w=0;w<4;w++){
     const a=idle.wheels[w],b=evidence.wheels[w];
     assert.ok(Math.hypot(...a.center.map((v,j)=>v-b.center[j]))<1e-5,'pivot moved');
     const dot=Math.abs(a.q.reduce((sum,v,j)=>sum+v*b.q[j],0));
     if(phase==='rotated')assert.ok(dot<.999,'wheel failed to rotate');
     else assert.ok(dot>.999999,'wheel not restored');
    }
    const file=id+'-'+phase+'-'+i+'.png';await page.locator('canvas').screenshot({path:join(out,file)});
    views.push({phase,file,...evidence});
   }
  }
  assert.equal(await page.evaluate(()=>window.fallback()),true);
  assert.deepEqual(errors,[]);
  records.push({id,initial,views,fallbackRestored:true});
  console.log(JSON.stringify({id,installMs:initial.installMs,renderCalls:idle.info.calls,triangles:idle.info.triangles,views:views.length,fallbackRestored:true}));
  await page.close();
 }
}finally{
 writeFileSync(join(out,'wheel-visual-evidence.json'),JSON.stringify({review:'pending',scope:'isolated browser renderer; not full-world FPS',records},null,2)+'\n');
 await browser?.close();await new Promise(resolve=>server.close(resolve));
}
assert.equal(records.length,3);console.log('PASS 18 actual-manager wheel renders, manual visual review pending');
