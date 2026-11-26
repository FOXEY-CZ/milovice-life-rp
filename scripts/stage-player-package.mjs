// Build an unapproved staging candidate, never deploy it or overwrite a directory.
// Static module discovery is intentionally conservative; browser verification is still required.
import {existsSync,lstatSync,readFileSync,mkdirSync,mkdtempSync,copyFileSync,writeFileSync,rmSync,realpathSync} from 'node:fs';
import {resolve,dirname,relative,isAbsolute,sep,posix,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
import {proceduralProfile} from './stage-procedural-profile.mjs';
const roots=['index.html','credits.html'];
// Every new tracked data JSON needs an explicit distribution classification.
const playerData=new Set([
 'data/architecture/verified-buildings.json',
 'data/milovice-osm.json','data/milovice-terrain.json','data/osm-street-groups.json',
 'data/regions/index.json',
 ...['bozidar','centerlink','mlada','vrutice','westlink'].flatMap(region=>[
  'data/regions/'+region+'.json','data/regions/terrain-'+region+'.json'
 ])
]);
const developmentData=new Set(["data/architecture-references.json","data/architecture/building-audit-queue.json","data/architecture/building-work-progress.json","data/rebuild2-street-inventory.json"]);
const localModule=/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)(['"])(\.{1,2}\/[^'"\s]+)\1/g;
const htmlScript=/<script\b[^>]*\bsrc\s*=\s*(['"])(\.{1,2}\/[^'"\s]+|scripts\/[^'"\s]+)\1/gi;
const safe=p=>typeof p==='string'&&p.length>0&&!p.includes('\\')&&!p.includes(':')&&!/[\x00-\x1f\x7f]/.test(p)&&p.split('/').every(x=>x&&x!=='.'&&x!=='..');
function dependencies(path,source){
 const found=new Set();
 for(const re of [localModule,...(path.endsWith('.html')?[htmlScript]:[])]){
  for(const m of source.matchAll(re)){
   const target=posix.normalize(posix.join(posix.dirname(path),m[2].split(/[?#]/)[0]));
   if(!safe(target)||!/^scripts\/[^/]+\.js$/.test(target))throw Error('Unsupported local script dependency: '+path+' -> '+m[2]);
   found.add(target);
  }
 }
 return [...found].sort();
}
function plan(tracked,read){
 const allowed=new Set(tracked),selected=new Set();
 const add=p=>{
  if(!safe(p)||!allowed.has(p))throw Error('Missing/untracked dependency: '+p);
  if(selected.has(p))return;
  selected.add(p);
  if(/\.(?:html|js)$/.test(p))for(const dep of dependencies(p,read(p)))add(dep);
 };
 for(const p of roots)add(p);
 // Explicit candidate exclusions only; stop if any selected runtime source mentions one.
 for(const p of selected){if(!/\.(?:html|js)$/.test(p))continue;const source=read(p);for(const omitted of developmentData)if(source.includes(posix.basename(omitted)))throw Error('Possible runtime dependency on excluded data: '+p+' -> '+omitted);}
 for(const p of tracked.filter(p=>/^data\/.+\.json$/.test(p))){
  if(!playerData.has(p)&&!developmentData.has(p))throw Error('Unclassified data JSON: '+p);
 }
 for(const p of playerData){
  if(developmentData.has(p))throw Error('Conflicting data classification: '+p);
  add(p);
 }
 return [...selected].sort();
}
function inside(root,p){const rel=relative(root,p);return rel===''||(!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep));}
function realFile(root,p){
 const f=resolve(root,p);if(!inside(root,f)||!lstatSync(f).isFile()||realpathSync(f)!==f)throw Error('Not a plain source file: '+p);
 return f;
}
// The preview is tied to a committed revision, not an edited working tree.
// Ignore untracked files (including local tool dependencies); they are never selected.
function cleanRevision(root){
 const git=args=>execFileSync('git',['-C',root,...args],{encoding:'utf8'});
 if(realpathSync(git(['rev-parse','--show-toplevel']).trim())!==root)throw Error('Run staging from repository root');
 const revision=git(['rev-parse','--verify','HEAD']).trim();
 if(git(['status','--porcelain=v1','-z','--untracked-files=no','--ignore-submodules=none']))throw Error('Tracked checkout has uncommitted changes');
 return revision;
}
function build(root,dest,profile='standard'){
 root=realpathSync(root);dest=resolve(dest);
 if(inside(root,dest)||existsSync(dest))throw Error('Destination must be new and outside the source checkout');
 const parent=dirname(dest);if(realpathSync(parent)!==parent)throw Error('Destination parent must be a real directory');
 const revision=cleanRevision(root);
 const tracked=execFileSync('git',['-C',root,'ls-tree','-r','--name-only','-z',revision],{encoding:'utf8'}).split('\0').filter(Boolean);
 const read=p=>{const source=readFileSync(realFile(root,p),'utf8');return profile==='procedural-preview'?proceduralProfile(p,source):source;};
 const files=plan(tracked,read);
 for(const p of files)realFile(root,p);
 mkdirSync(dest);
 try{for(const p of files){
  const target=join(dest,p);mkdirSync(dirname(target),{recursive:true});if(profile==='procedural-preview'&&/\.(?:html|js)$/.test(p))writeFileSync(target,read(p));else copyFileSync(realFile(root,p),target);
 }
  if(cleanRevision(root)!==revision)throw Error('Source revision changed during staging');
 }catch(error){rmSync(dest,{recursive:true,force:true});throw error;}
 console.log('Staged '+files.length+' files ('+profile+') from '+revision+'; NOT release-approved. Run release-package-check.mjs --inventory '+JSON.stringify(dest));
}
function selfTest(){
 const sources=new Map([
  ['index.html',"<script type='module'>import {a} from './scripts/a.js?v=2';</script>"],
  ['credits.html','credits'],
  ['scripts/a.js',"export {b} from './b.js';"],
  ['scripts/b.js',"import './a.js';"],
  ...[...playerData,...developmentData].map(p=>[p,'{}']),
  ['editor.html','dev'],['scripts/unused.js','unused'],['scripts/a.test.mjs','test']
 ]);
 const read=p=>sources.get(p);
 assert.equal(playerData.size,15);
 assert.equal(developmentData.size,4);
 assert.throws(()=>plan([...sources.keys()],p=>p==='credits.html'?"<a href='data/rebuild2-street-inventory.json'>old</a>":read(p)),/Possible runtime dependency/);
 assert.deepEqual(plan([...sources.keys()],read),['credits.html','index.html','scripts/a.js','scripts/b.js',...playerData].sort());
 assert.throws(()=>plan([...sources.keys(),'data/private-audit.json'],read),/Unclassified data JSON: data\/private-audit\.json/);
 assert.throws(()=>plan([...sources.keys()].filter(p=>p!=='data/regions/index.json'),read),/Missing\/untracked dependency: data\/regions\/index\.json/);
 assert.throws(()=>plan([...sources.keys()],p=>p==='scripts/a.js'?"fetch('architecture-references.json')":read(p)),/Possible runtime dependency/);
 assert.deepEqual(dependencies('index.html',"<script src='scripts/a.js'></script>"),['scripts/a.js']);
 assert.deepEqual(dependencies('scripts/a.js',"const m=import('./b.js?v=3');"),['scripts/b.js']);
 assert.throws(()=>plan([...sources.keys()].filter(p=>p!=='scripts/b.js'),read),/Missing/);
 assert.throws(()=>dependencies('index.html',"import '../escape.js';"),/Unsupported/);
 const temp=realpathSync(mkdtempSync(join(tmpdir(),'crossvex-stage-')));
 try{
  const root=join(temp,'source'),dest=join(temp,'candidate');mkdirSync(root);
  execFileSync('git',['init','-q',root]);
  for(const [p,s] of sources){const f=join(root,p);mkdirSync(dirname(f),{recursive:true});writeFileSync(f,s);}
  const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8'});
  const commit=message=>git('-c','user.name=Staging Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm',message);
  git('add','.');commit('baseline');
  build(root,dest);assert.equal(readFileSync(join(dest,'scripts/b.js'),'utf8'),sources.get('scripts/b.js'));
  assert(existsSync(join(dest,'data/architecture/verified-buildings.json')));
 for(const p of playerData)assert(existsSync(join(dest,p)),p);
  for(const p of developmentData)assert(!existsSync(join(dest,p)),p);
 assert(!existsSync(join(dest,'editor.html')));assert(!existsSync(join(dest,'scripts/unused.js')));
  assert.throws(()=>build(root,dest),/Destination/);
  assert.throws(()=>build(root,join(root,'candidate')),/Destination/);
  // Fail before creating any candidate directory, not just during plan().
  const unknown=join(root,'data/private-audit.json'),rejected=join(temp,'rejected');
  const trackedScript=join(root,'scripts/b.js');
  writeFileSync(trackedScript,'// uncommitted');
  assert.throws(()=>build(root,rejected),/uncommitted changes/);
  assert(!existsSync(rejected));
  git('add','scripts/b.js');
  assert.throws(()=>build(root,rejected),/uncommitted changes/);
  assert(!existsSync(rejected));
  git('restore','--source=HEAD','--staged','--worktree','scripts/b.js');
  writeFileSync(unknown,'{}');
  build(root,join(temp,'untracked-ok'));
  assert(!existsSync(join(temp,'untracked-ok','data/private-audit.json')));
  git('add','data/private-audit.json');commit('unknown tracked data');
  assert.throws(()=>build(root,rejected),/Unclassified data JSON/);
  assert(!existsSync(rejected));
  git('rm','-f','data/private-audit.json');
  git('rm','-f','data/regions/index.json');commit('missing required data');
  assert.throws(()=>build(root,rejected),/Missing\/untracked dependency/);
  assert(!existsSync(rejected));
 }finally{rmSync(temp,{recursive:true,force:true});}
 console.log('PASS: staging builder self-test');
}
try{
 const [mode,dest,...extra]=process.argv.slice(2);
 if(mode==='--self-test'&&!dest)selfTest();
 else if(mode==='--stage'&&dest&&!extra.length)build(process.cwd(),dest);
 else if(mode==='--stage-procedural-preview'&&dest&&!extra.length)build(process.cwd(),dest,'procedural-preview');
 else throw Error('Usage from repository root: --stage <new-external-directory> | --stage-procedural-preview <new-external-directory> | --self-test');
}catch(error){console.error(error.message);process.exitCode=1;}
