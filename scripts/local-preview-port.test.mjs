import assert from 'node:assert/strict';
import {previewPort,previewOrigin,DEFAULT_PREVIEW_PORT} from './local-preview-port.mjs';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const old=process.env.CROSSVEX_PREVIEW_PORT;
try{
 delete process.env.CROSSVEX_PREVIEW_PORT;
 assert.equal(previewPort(),47835);assert.equal(DEFAULT_PREVIEW_PORT,47835);
 process.env.CROSSVEX_PREVIEW_PORT='47836';assert.equal(previewPort(),47836);
 for(const invalid of ['','0','80','1023','65536','01234',' 47835','47835 ','47835.0','1e4','+47835','NaN',null,47835])assert.throws(()=>previewPort(invalid),/must be an integer/);
 assert.equal(previewPort('1024'),1024);assert.equal(previewPort('65535'),65535);
 assert.equal(previewOrigin(47835),'http://127.0.0.1:47835');
 assert.throws(()=>previewOrigin(0),/Invalid fixed/);
}finally{if(old===undefined)delete process.env.CROSSVEX_PREVIEW_PORT;else process.env.CROSSVEX_PREVIEW_PORT=old;}
const server=fileURLToPath(new URL('./serve-local-preview.mjs',import.meta.url));
const root=realpathSync(mkdtempSync(join(tmpdir(),'crossvex-origin-')));
function start(port){
 const child=spawn(process.execPath,[server,root,String(port)],{stdio:['ignore','pipe','pipe'],shell:false,windowsHide:true});
 const lines=createInterface({input:child.stdout});
 let stderr='',ready=false;
 child.stderr.on('data',b=>stderr+=b);
 const closed=new Promise(resolve=>child.once('close',(code,signal)=>resolve({code,signal,stderr})));
 const url=new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{child.kill();reject(Error('Server startup timeout'));},10000);
  child.once('error',e=>{clearTimeout(timer);reject(e);});
  lines.on('line',line=>{
   const match=/^UNAPPROVED local preview: (http:\/\/127\.0\.0\.1:\d+)$/.exec(line);
   if(match&&!ready){ready=true;clearTimeout(timer);resolve(match[1]);}
  });
  closed.then(result=>{clearTimeout(timer);lines.close();if(!ready)reject(Error('Server exited: '+result.stderr));});
 });
 return {child,url,closed,async stop(){if(child.exitCode===null&&child.signalCode===null)child.kill();await closed;}};
}
let first,second,collision;
try{
 for(const [p,body] of Object.entries({'index.html':'<meta name="crossvex-profile" content="procedural-preview">game','credits.html':'credits','vendor/three/build/three.module.js':'export {}','vendor/leaflet/dist/leaflet.js':'library','vendor/leaflet/dist/leaflet.css':'body{}'})){
  const file=join(root,p);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,body);
 }
 // Allocate a test port dynamically only in this fixture, not in the player launcher.
 first=start(0);const address=await first.url,port=previewPort(new URL(address).port);
 assert.equal(address,previewOrigin(port));
 assert.equal((await fetch(address,{signal:AbortSignal.timeout(5000)})).status,200);
 collision=start(port);await assert.rejects(collision.url,/EADDRINUSE/);assert.notEqual((await collision.closed).code,0);
 await first.stop();
 second=start(port);assert.equal(await second.url,address);
 assert.match(await (await fetch(address,{signal:AbortSignal.timeout(5000)})).text(),/procedural-preview/);
 console.log('PASS stable preview origin and occupied-port rejection');
}finally{await Promise.all([first,second,collision].filter(Boolean).map(s=>s.stop()));rmSync(root,{recursive:true,force:true});}
