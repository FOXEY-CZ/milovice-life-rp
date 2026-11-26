// Compare pinned CDN response bytes to the exact installed npm packages.
// Evidence only; not SRI enforcement, dependency completeness or legal approval.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const packages=[
 {name:'three',version:'0.160.1',base:'https://cdn.jsdelivr.net/npm/three@0.160.1/',paths:['build/three.module.js','examples/jsm/loaders/GLTFLoader.js','examples/jsm/utils/BufferGeometryUtils.js','examples/jsm/utils/SkeletonUtils.js']},
 {name:'leaflet',version:'1.9.4',base:'https://unpkg.com/leaflet@1.9.4/',paths:['dist/leaflet.js','dist/leaflet.css','dist/images/layers.png','dist/images/layers-2x.png','dist/images/marker-icon.png','dist/images/marker-icon-2x.png','dist/images/marker-shadow.png']}
];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function compare(expected,received){
 const localHash=sha(expected),cdnHash=sha(received);
 return {npmBytes:expected.length,cdnBytes:received.length,npmSha256:localHash,cdnSha256:cdnHash,matches:expected.equals(received)};
}
async function download(url){
 const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});
 assert(response.ok,'HTTP '+response.status);
 let size=0;const chunks=[];
 for await(const chunk of response.body){
  size+=chunk.byteLength;assert(size<=16*1024*1024,'Response exceeds evidence limit');
  chunks.push(Buffer.from(chunk));
 }
 return Buffer.concat(chunks);
}
function cssAssets(css){
 return [...new Set([...css.matchAll(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g)].map(m=>m[1]).filter(x=>!x.startsWith('data:')))].sort();
}
// Leaflet 1.9.4 retains an IE VML behavior reference, not a network asset.
// Only this exact fragment in its exact historical CSS declaration is recognized.
function inspectCss(css,knownPaths){
 const refs=cssAssets(css),legacy=[],issues=[];
 for(const ref of refs){
  if(ref==='#default#VML'&&/\bbehavior\s*:\s*url\(#default#VML\)\s*;/.test(css)){
   // Reject another occurrence of the same fragment outside the known declaration.
   const remaining=css.replace(/\bbehavior\s*:\s*url\(#default#VML\)\s*;/g,'');
   if(!cssAssets(remaining).includes(ref)){legacy.push(ref);continue;}
  }
  if(!knownPaths.includes('dist/'+ref))issues.push('Unreviewed CSS reference: '+ref);
 }
 return {refs,legacy,issues};
}
function selfTest(){
 const a=Buffer.from('abc'),b=Buffer.from('abd');
 assert.equal(compare(a,a).matches,true);
 assert.equal(compare(a,b).matches,false);
 assert.notEqual(compare(a,b).npmSha256,compare(a,b).cdnSha256);
 assert.deepEqual(cssAssets("a{background:url(images/x.png)}b{background:url('images/x.png')}c{background:url(data:image/png;base64,abc)}"),['images/x.png']);
 assert.deepEqual(inspectCss('.vml{behavior: url(#default#VML); } .x{background:url(images/x.png)}',['dist/images/x.png']),{refs:['#default#VML','images/x.png'],legacy:['#default#VML'],issues:[]});
 assert.equal(inspectCss('a{background:url(#unexpected)}',[]).issues.length,1);
 assert.equal(inspectCss('a{background:url(#default#VML)}',[]).issues.length,1);
 assert.equal(inspectCss('a{behavior: url(#default#VML);background:url(#default#VML)}',[]).issues.length,1);
 assert.equal(inspectCss('a{background:url(https://unknown.example/x.png)}',[]).issues.length,1);
 console.log('PASS CDN byte comparator and CSS reference self-test');
}
async function audit(output){
 const report={schema:1,review:'pending',files:[],cssReferences:[],legacyCssReferences:[],issues:[]};
 for(const pkg of packages){
  const root=join('node_modules',pkg.name);
  try{
   assert.equal(JSON.parse(readFileSync(join(root,'package.json'),'utf8')).version,pkg.version,'Installed package version mismatch');
  }catch(error){report.issues.push(pkg.name+': '+String(error));continue;}
  for(const path of pkg.paths){
   const url=pkg.base+path;
   try{
    const expected=readFileSync(join(root,path));
    const received=await download(url);
    const result=compare(expected,received);
    report.files.push({package:pkg.name,version:pkg.version,path,url,...result});
    if(!result.matches)report.issues.push('Byte mismatch: '+url);
    if(pkg.name==='leaflet'&&path==='dist/leaflet.css'){
     const css=inspectCss(received.toString('utf8'),pkg.paths);
     report.cssReferences=css.refs;
     report.legacyCssReferences=css.legacy;
     report.issues.push(...css.issues);
    }
   }catch(error){report.files.push({package:pkg.name,version:pkg.version,path,url,error:String(error),matches:null});report.issues.push(url+': '+String(error));}
  }
 }
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 for(const file of report.files)console.log(JSON.stringify(file));
 console.log(JSON.stringify({matches:report.files.filter(x=>x.matches===true).length,expected:packages.reduce((n,p)=>n+p.paths.length,0),cssReferences:report.cssReferences,legacyCssReferences:report.legacyCssReferences,issues:report.issues}));
 if(report.issues.length||report.files.length!==packages.reduce((n,p)=>n+p.paths.length,0))process.exitCode=1;
}
const [mode,output]=process.argv.slice(2);
if(mode==='--self-test')selfTest();
else if(mode==='--audit'&&output)await audit(output);
else throw Error('Use --self-test or --audit <new-json-path>');
