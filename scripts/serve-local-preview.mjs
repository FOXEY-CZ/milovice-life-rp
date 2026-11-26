// Local developer preview only. Serve an existing staged directory, never publish it.
import assert from 'node:assert/strict';
import {createServer,request} from 'node:http';
import {createReadStream,lstatSync,realpathSync,readFileSync,readdirSync,mkdtempSync,mkdirSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {resolve,join,extname,dirname} from 'node:path';
import {tmpdir} from 'node:os';
const host='127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.txt':'text/plain; charset=utf-8'};
function inventory(root,dir=''){
 const result=new Map();
 for(const entry of readdirSync(join(root,dir),{withFileTypes:true})){
  assert.ok(!entry.name.startsWith('.')&&!entry.name.includes('\\'),'Hidden or invalid staged entry: '+entry.name);
  const p=dir?dir+'/'+entry.name:entry.name,f=join(root,p);
  assert.equal(realpathSync(f),f,'Non-regular staged path: '+p);
  if(entry.isDirectory())for(const [k,v] of inventory(root,p))result.set(k,v);
  else{assert.ok(entry.isFile(),'Non-regular staged entry: '+p);result.set('/'+p,f);}
 }
 return result;
}
function makeServer(dir){
 const root=resolve(dir);assert.equal(realpathSync(root),root,'Stage root must not be a symlink');
 const files=inventory(root);
 for(const p of ['/index.html','/credits.html','/vendor/three/build/three.module.js','/vendor/leaflet/dist/leaflet.js','/vendor/leaflet/dist/leaflet.css'])assert.ok(files.has(p),'Missing local preview file: '+p);
 assert.match(readFileSync(files.get('/index.html'),'utf8'),/name="crossvex-profile" content="procedural-preview"/);
 const server=createServer((req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
  const fail=(status)=>{res.writeHead(status);res.end();};
  if(req.headers.host!==host+':'+server.address().port)return fail(403);
  if(req.method!=='GET'&&req.method!=='HEAD'){res.setHeader('Allow','GET, HEAD');return fail(405);}
  let path;
  try{path=decodeURIComponent(req.url.split('?')[0]);}catch{return fail(400);}
  if(!path.startsWith('/')||path.includes('\\')||/[\x00-\x1f\x7f]/.test(path)||(path!=='/'&&path.split('/').slice(1).some(x=>x.startsWith('.')||x==='')))return fail(400);
  const f=files.get(path==='/'?'/index.html':path);if(!f)return fail(404);
  try{
   const st=lstatSync(f);if(!st.isFile()||realpathSync(f)!==f)return fail(404);
   res.setHeader('Content-Type',mime[extname(f)]??(f.endsWith('/LICENSE')||f.endsWith('\\LICENSE')?'text/plain; charset=utf-8':'application/octet-stream'));
   res.setHeader('Content-Length',st.size);
   if(req.method==='HEAD'){res.end();return;}
   const stream=createReadStream(f);stream.on('error',()=>res.destroy());stream.pipe(res);
  }catch{return fail(404);}
 });
 return server;
}
async function listen(server,port){
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(port,host,()=>{server.off('error',fail);ok();});});
 return 'http://'+host+':'+server.address().port;
}
function raw(url,path,options={}){
 return new Promise((ok,fail)=>{const req=request(url,{path,...options},res=>{res.resume();res.on('end',()=>ok(res.statusCode));});req.on('error',fail);req.end();});
}
async function selfTest(){
 const temp=realpathSync(mkdtempSync(join(tmpdir(),'crossvex-serve-'))),root=join(temp,'preview');mkdirSync(root);
 let server;
 try{
  for(const [p,body] of Object.entries({'index.html':'<meta name="crossvex-profile" content="procedural-preview">game','credits.html':'credits','vendor/three/build/three.module.js':'export {}','vendor/leaflet/dist/leaflet.js':'library','vendor/leaflet/dist/leaflet.css':'body{}','data/test.json':'{}'})){
   const f=join(root,p);mkdirSync(dirname(f),{recursive:true});writeFileSync(f,body);
  }
  writeFileSync(join(temp,'secret.txt'),'not served');
  server=makeServer(root);const url=await listen(server,0);
  assert.equal((await fetch(url+'/')).status,200);
  const js=await fetch(url+'/vendor/three/build/three.module.js?v=1');assert.equal(js.status,200);assert.match(js.headers.get('content-type'),/javascript/);assert.equal(await js.text(),'export {}');
  const h=await fetch(url+'/data/test.json',{method:'HEAD'});assert.equal(h.status,200);assert.equal(await h.text(),'');
  assert.equal(await raw(url,'/data'),404);assert.equal(await raw(url,'/data/'),400);
  assert.equal(await raw(url,'/../secret.txt'),400);assert.equal(await raw(url,'/%2e%2e/secret.txt'),400);
  assert.equal(await raw(url,'/%ZZ'),400);assert.equal(await raw(url,'/',{method:'POST'}),405);
  assert.equal(await raw(url,'/',{headers:{host:'example.invalid'}}),403);
  if(process.platform!=='win32'){
   symlinkSync(join(temp,'secret.txt'),join(root,'link.txt'));
   assert.throws(()=>makeServer(root),/Non-regular/);
   assert.equal(await raw(url,'/link.txt'),404);
   rmSync(join(root,'data/test.json'));symlinkSync(join(temp,'secret.txt'),join(root,'data/test.json'));
   assert.equal(await raw(url,'/data/test.json'),404);
  }
  console.log('PASS local preview server HTTP self-test');
 }finally{if(server?.listening)await new Promise(ok=>server.close(ok));rmSync(temp,{recursive:true,force:true});}
}
const [mode,portText,...extra]=process.argv.slice(2);
if(mode==='--self-test'&&!portText)await selfTest();
else if(mode&&!extra.length){
 const port=Number(portText??8080);assert.ok(Number.isInteger(port)&&port>=0&&port<=65535,'Invalid port');
 const server=makeServer(mode);console.log('UNAPPROVED local preview: '+await listen(server,port));console.log('Open the address in a browser; Ctrl+C stops the preview.');
}else throw Error('Usage: node scripts/serve-local-preview.mjs <staged-directory> [port] | --self-test');
