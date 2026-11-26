// Windows developer convenience wrapper. Never downloads or builds a release.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {createInterface as promptInterface} from 'node:readline/promises';
import {realpathSync,statSync,existsSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {previewPort,previewOrigin} from './local-preview-port.mjs';
const here=dirname(fileURLToPath(import.meta.url));
function readyUrl(line){
 const m=/^UNAPPROVED local preview: http:\/\/127\.0\.0\.1:(\d{1,5})$/.exec(line);
 if(!m)return null;
 const n=Number(m[1]);return n>0&&n<=65535?'http://127.0.0.1:'+n+'/':null;
}
function stagePath(input){
 let p=input.trim();if(p.startsWith('"')&&p.endsWith('"'))p=p.slice(1,-1);
 assert.ok(p,'Provide an existing staged preview directory');
 const root=realpathSync(resolve(p));assert.ok(statSync(root).isDirectory(),'Not a directory');
 for(const f of ['index.html','credits.html','vendor/three/build/three.module.js','vendor/leaflet/dist/leaflet.js','vendor/leaflet/dist/leaflet.css'])assert.ok(existsSync(join(root,f)),'Missing preview file: '+f);
 return root;
}
async function runServer(serverPath,stage,onReady,{port=previewPort(),timeout=15000}={}){
 const child=spawn(process.execPath,[serverPath,stage,String(port)],{stdio:['ignore','pipe','inherit'],shell:false,windowsHide:true});
 const lines=createInterface({input:child.stdout});let ready=false,stopping=false;
 return await new Promise((ok,fail)=>{
  const timer=setTimeout(()=>{if(!ready){child.kill();fail(Error('Local server did not start'));}},timeout);
  const stop=()=>{stopping=true;if(child.exitCode===null)child.kill();};
  process.once('SIGINT',stop);process.once('SIGTERM',stop);
  const cleanup=()=>{clearTimeout(timer);process.off('SIGINT',stop);process.off('SIGTERM',stop);lines.close();};
  lines.on('line',line=>{
   console.log(line);const url=readyUrl(line);
   if(!ready&&url){if(port!==0&&url!==previewOrigin(port)+'/'){stop();fail(Error('Server reported a different port; browser not opened'));return;}ready=true;clearTimeout(timer);try{Promise.resolve(onReady(url,stop)).catch(error=>{stop();fail(error);});}catch(error){stop();fail(error);}}
  });
  child.once('error',error=>{cleanup();fail(error);});
  child.once('close',(code,signal)=>{cleanup();if(!ready)fail(Error('Local server stopped before startup: '+(code??signal)));else if(!stopping&&code&&code!==0)fail(Error('Local server exited: '+code));else ok();});
 });
}
function openWindows(url){
 const child=spawn('explorer.exe',[url],{shell:false,stdio:'ignore',windowsHide:true});
 child.once('error',()=>console.error('Browser did not open automatically. Open '+url+' manually.'));
 child.once('exit',code=>{if(code!==0)console.log('If no browser opened, use '+url+' manually.');});
 child.unref();
}
async function selfTest(){
 assert.equal(readyUrl('UNAPPROVED local preview: http://127.0.0.1:8080'),'http://127.0.0.1:8080/');
 for(const line of ['http://127.0.0.1:8080','UNAPPROVED local preview: https://127.0.0.1:8080','UNAPPROVED local preview: http://evil.example:8080','UNAPPROVED local preview: http://127.0.0.1:0','UNAPPROVED local preview: http://127.0.0.1:65536','UNAPPROVED local preview: http://127.0.0.1:8080/evil'])assert.equal(readyUrl(line),null);
 const dir=realpathSync(mkdtempSync(join(tmpdir(),'crossvex launcher ')));try{
  const stub=join(dir,'server fixture.mjs');
  writeFileSync(stub,"import assert from 'node:assert/strict'; assert.equal(process.argv[2],"+JSON.stringify(dir)+"); assert.equal(process.argv[3],'0'); console.log('UNAPPROVED local preview: http://127.0.0.1:43210');");
  const calls=[];await runServer(stub,dir,url=>calls.push(url),{port:0});assert.deepEqual(calls,['http://127.0.0.1:43210/']);
  writeFileSync(stub,"import assert from 'node:assert/strict'; assert.equal(process.argv[3],'47835'); console.log('UNAPPROVED local preview: http://127.0.0.1:47835');");
  const fixed=[];await runServer(stub,dir,url=>fixed.push(url),{port:47835});assert.deepEqual(fixed,['http://127.0.0.1:47835/']);
  await assert.rejects(runServer(stub,dir,()=>assert.fail(),{port:47836}),/before startup/);
  writeFileSync(stub,"console.log('UNAPPROVED local preview: http://127.0.0.1:47836');");
  await assert.rejects(runServer(stub,dir,()=>assert.fail(),{port:47835}),/different port/);
  writeFileSync(stub,"process.exit(3);");await assert.rejects(runServer(stub,dir,()=>assert.fail(),{port:0}),/before startup/);
  assert.throws(()=>stagePath(dir),/Missing preview file/);
  const stage=join(dir,'preview folder');
  for(const [p,body] of Object.entries({'index.html':'<meta name="crossvex-profile" content="procedural-preview">game','credits.html':'credits','vendor/three/build/three.module.js':'export {}','vendor/leaflet/dist/leaflet.js':'library','vendor/leaflet/dist/leaflet.css':'body{}'})){
   const file=join(stage,p);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,body);
  }
  assert.equal(stagePath('"'+stage+'"'),realpathSync(stage));
  let checked=false;
  await runServer(join(here,'serve-local-preview.mjs'),stage,async(url,stop)=>{
   try{
    const response=await fetch(url,{signal:AbortSignal.timeout(5000)});
    assert.equal(response.status,200);assert.match(await response.text(),/procedural-preview/);
    checked=true;
   }finally{stop();}
  },{port:0});
  assert.equal(checked,true,'Real server readiness and HTTP response required');
 }finally{rmSync(dir,{recursive:true,force:true});}
 console.log('PASS Windows preview wrapper fixtures');
}
async function main(){
 const args=process.argv.slice(2);
 if(args.length===1&&args[0]==='--self-test')return selfTest();
 assert.equal(process.platform,'win32','Use the Node server directly on non-Windows systems');
 assert.ok(args.length<=1,'Usage: node launch-local-preview.mjs [stage-directory]');
 let input=args[0];
 if(!input){const rl=promptInterface({input:process.stdin,output:process.stdout});try{input=await rl.question('Path to existing local CROSSVEX preview: ');}finally{rl.close();}}
 const stage=stagePath(input),server=join(here,'serve-local-preview.mjs');
 assert.ok(existsSync(server),'Local server script is missing');
 const port=previewPort();
 console.log('Developer preview only. Ctrl+C stops the server.');
 console.log('Stable browser storage origin: '+previewOrigin(port)+' (no automatic fallback port).');
 await runServer(server,stage,openWindows,{port});
}
try{await main();}catch(error){console.error(error.message);process.exitCode=1;}
