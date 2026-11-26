// Separate unapproved procedural preview with local, version-pinned libraries.
import assert from 'node:assert/strict';
import {existsSync,realpathSync,lstatSync,readFileSync,writeFileSync,mkdirSync,mkdtempSync,readdirSync,rmSync,renameSync} from 'node:fs';
import {resolve,dirname,join,relative,isAbsolute,sep,posix} from 'node:path';
import {execFileSync} from 'node:child_process';
const libraries=[
 {name:'three',version:'0.160.1',prefix:'https://cdn.jsdelivr.net/npm/three@0.160.1/',paths:['build/three.module.js','examples/jsm/loaders/GLTFLoader.js','examples/jsm/utils/BufferGeometryUtils.js','examples/jsm/utils/SkeletonUtils.js','LICENSE']},
 {name:'leaflet',version:'1.9.4',prefix:'https://unpkg.com/leaflet@1.9.4/',paths:['dist/leaflet.js','dist/leaflet.css','dist/images/layers.png','dist/images/layers-2x.png','dist/images/marker-icon.png','dist/images/marker-icon-2x.png','dist/images/marker-shadow.png','LICENSE']}
];
function localize(path,source){
 for(const {name,prefix} of libraries){
  const local=posix.relative(posix.dirname(path),'vendor/'+name);
  source=source.replaceAll(prefix,(local.startsWith('.')?local:'./'+local)+'/');
 }
 return source;
}
function files(root,dir=''){
 return readdirSync(join(root,dir),{withFileTypes:true}).flatMap(e=>{
  const p=posix.join(dir,e.name);if(e.isDirectory())return files(root,p);
  assert.ok(e.isFile(),'Unexpected staged entry '+p);return [p];
 });
}
function inside(root,p){const r=relative(root,p);return r===''||(!isAbsolute(r)&&r!=='..'&&!r.startsWith('..'+sep));}
function build(dest,modules){
 const root=realpathSync(process.cwd());dest=resolve(dest);modules=realpathSync(modules);
 assert.ok(!inside(root,dest)&&!existsSync(dest),'Use a new external destination');
 const parent=dirname(dest);assert.equal(realpathSync(parent),parent);
 // Validate exact package versions and every selected input before writing.
 const assets=[];
 for(const lib of libraries){
  const packageRoot=realpathSync(join(modules,lib.name));
  assert.equal(JSON.parse(readFileSync(join(packageRoot,'package.json'),'utf8')).version,lib.version);
  for(const p of lib.paths){
   const f=join(packageRoot,p);assert.ok(lstatSync(f).isFile()&&realpathSync(f)===f,'Not a regular library file '+p);
   assets.push(['vendor/'+lib.name+'/'+p,readFileSync(f)]);
  }
 }
 const temp=mkdtempSync(join(parent,'.crossvex-local-')),stage=join(temp,'preview');
 try{
  execFileSync(process.execPath,['scripts/stage-player-package.mjs','--stage-procedural-preview',stage],{cwd:root,stdio:'inherit'});
  assert.ok(!existsSync(join(stage,'vendor')));
  for(const p of files(stage).filter(p=>/\.(html|js)$/.test(p))){
   const f=join(stage,p),before=readFileSync(f,'utf8'),after=localize(p,before);
   if(after!==before)writeFileSync(f,after);
  }
  for(const [p,bytes] of assets){const target=join(stage,p);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes,{flag:'wx'});}
  const index=readFileSync(join(stage,'index.html'),'utf8');
  for(const p of ['./vendor/three/build/three.module.js','./vendor/three/examples/jsm/','./vendor/leaflet/dist/leaflet.css','./vendor/leaflet/dist/leaflet.js'])assert.ok(index.includes(p),'Missing local runtime URL '+p);
  const credits=join(stage,'credits.html'),before=readFileSync(credits,'utf8'),marker='<h2>Technologie</h2>';
  assert.equal(before.split(marker).length,2);
  writeFileSync(credits,before.replace(marker,marker+'<p>Lokální knihovny tohoto náhledu: <a href="./vendor/three/LICENSE">Three.js MIT</a> · <a href="./vendor/leaflet/LICENSE">Leaflet BSD 2-Clause</a>.</p>'));
  assert.ok(!existsSync(dest),'Destination appeared during build');renameSync(stage,dest);
  console.log('Staged local-library procedural preview with '+assets.length+' vendor files; NOT release-approved.');
 }finally{rmSync(temp,{recursive:true,force:true});}
}
function selfTest(){
 const three=libraries[0].prefix,leaflet=libraries[1].prefix;
 assert.equal(localize('index.html',three+'build/three.module.js'),'./vendor/three/build/three.module.js');
 assert.equal(localize('scripts/a.js',three+'examples/jsm/loader.js'),'../vendor/three/examples/jsm/loader.js');
 assert.equal(localize('index.html',leaflet+'dist/leaflet.css'),'./vendor/leaflet/dist/leaflet.css');
 assert.equal(localize('index.html','https://example.org/a'),'https://example.org/a');
 assert.equal(libraries.reduce((n,l)=>n+l.paths.length,0),13);
 console.log('PASS local library URL rewrite fixtures');
}
const [mode,dest,modules,...extra]=process.argv.slice(2);
if(mode==='--self-test'&&!dest)selfTest();
else if(mode==='--stage'&&dest&&modules&&!extra.length)build(dest,modules);
else throw Error('Usage: --self-test | --stage <new-external-directory> <pinned-node_modules-directory>');
