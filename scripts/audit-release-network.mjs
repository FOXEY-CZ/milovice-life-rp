// Exact remote URL inventory for the staged preview, not legal approval or a network firewall.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const local='http://127.0.0.1:8080';
const three='https://cdn.jsdelivr.net/npm/three@0.160.1/';
const leaflet='https://unpkg.com/leaflet@1.9.4/dist/';
const showcase='https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/0128ca510d653bb04d6d1e4885bd8890b5050b4f/public/glb/';
const garage='https://raw.githubusercontent.com/bennibeni/garage/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/';
const known=new Map([
 ...['build/three.module.js','examples/jsm/loaders/GLTFLoader.js','examples/jsm/utils/BufferGeometryUtils.js','examples/jsm/utils/SkeletonUtils.js'].map(p=>[three+p,'three']),
 ...['leaflet.css','leaflet.js'].map(p=>[leaflet+p,'leaflet']),
 ...['modular_men/Casual.glb','modular_men/Suit.glb','modular_women/Casual.glb','nature_pack/CommonTree_3.glb','nature_pack/BirchTree_2.glb'].map(p=>[showcase+p,'model']),
 ...['quaternius-suv.glb','quaternius-car.glb','quaternius-sport.glb'].map(p=>[garage+p,'model']),
 ['https://raw.githubusercontent.com/JaronKBragg7337/spectral-gt-rs/34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rs_game_ready.glb','model']
]);
const required=[three+'build/three.module.js',leaflet+'leaflet.css',leaflet+'leaflet.js'];
const localRequired=['/vendor/three/build/three.module.js','/vendor/leaflet/dist/leaflet.css','/vendor/leaflet/dist/leaflet.js'].map(p=>local+p);
function classify(trace,localOnly=false){
 assert(Array.isArray(trace)&&trace.every(u=>typeof u==='string'),'expected URL list');
 const unique=[...new Set(trace)].sort(),remote=[],unknown=[],localUrls=[];
 for(const url of unique){
  let u;try{u=new URL(url);}catch{unknown.push(url);continue;}
  if(u.origin===local&&!u.username&&!u.password){localUrls.push(url);continue;}
  const category=localOnly?undefined:known.get(url);
  if(category)remote.push({url,category,review:'pending'});else unknown.push(url);
 }
 const missingRequired=(localOnly?localRequired:required).filter(u=>!unique.includes(u));
 const notObserved=(localOnly?localRequired:[...known.keys()]).filter(u=>!unique.includes(u));
 return {schema:1,review:'pending',uniqueUrls:unique.length,localCount:localUrls.length,knownRemote:remote,unknown,missingRequired,notObserved};
}
function selfTest(){
 const r=classify([...required,required[0],local+'/index.html',showcase+'nature_pack/BirchTree_2.glb']);
 assert.equal(r.uniqueUrls,5);assert.equal(r.localCount,1);assert.equal(r.knownRemote.length,4);assert.equal(r.unknown.length,0);assert.equal(r.missingRequired.length,0);
 const bad=classify([three+'build/three.module.js?unexpected=1',local+'.example/index.html','https://unpkg.com/leaflet@latest/dist/leaflet.js','not a URL']);
 assert.equal(bad.unknown.length,4);assert.equal(bad.missingRequired.length,3);
 const offline=classify([...localRequired,local+'/index.html'],true);
 assert.equal(offline.unknown.length,0);assert.equal(offline.missingRequired.length,0);
 const leaked=classify([...localRequired,required[0],local+'.example/index.html'],true);
 assert.equal(leaked.unknown.length,2);
 assert.equal(classify(localRequired.slice(1),true).missingRequired.length,1);
 assert.throws(()=>classify({}));console.log('PASS exact URL inventory self-test');
}
const [mode,input,out]=process.argv.slice(2);
if(mode==='--self-test')selfTest();
else if((mode==='--check'||mode==='--check-local')&&input&&out){
 const report=classify(JSON.parse(readFileSync(input,'utf8')),mode==='--check-local');
 writeFileSync(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({uniqueUrls:report.uniqueUrls,localCount:report.localCount,knownRemote:report.knownRemote.length,unknown:report.unknown,missingRequired:report.missingRequired,notObserved:report.notObserved}));
 if(report.unknown.length||report.missingRequired.length)process.exitCode=1;
}else throw Error('Use --self-test or --check / --check-local trace.json new-report.json');
