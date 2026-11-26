// Audit a staged player package, never the development checkout itself.
import {createHash} from 'node:crypto';
import {lstatSync,readdirSync,readFileSync,mkdtempSync,mkdirSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {resolve,join,relative,isAbsolute,sep} from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';

const required=['index.html','credits.html'];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const validPath=p=>typeof p==='string'&&p.length>0&&!p.includes('\\')&&!p.includes(':')&&!/[\x00-\x1f\x7f]/.test(p)&&p.split('/').every(s=>s&&s!=='.'&&s!=='..');
const forbidden=p=>p.split('/').some(s=>s.startsWith('.'))||/^(?:editor|survey|photo-pilot|rebuild)\.html$/i.test(p)||/^(?:AGENTS|DEVELOPMENT_STATUS|README)\.md$/i.test(p)||/(?:\.test|-test)\.mjs$|(?:-browser|-webgl)[^/]*\.mjs$/i.test(p)||/^scripts\/(?:dev-check|release-package-check)\.mjs$/i.test(p);

function scan(root){
 root=resolve(root);if(!lstatSync(root).isDirectory())throw Error('Package root must be a real directory');
 const files=[],seen=new Set();
 function walk(dir){for(const name of readdirSync(dir).sort()){
  const full=join(dir,name),p=relative(root,full).split(sep).join('/');
  if(!validPath(p))throw Error('Invalid package path: '+p);
  const key=p.normalize('NFC').toLowerCase();if(seen.has(key))throw Error('Case/Unicode path collision: '+p);seen.add(key);
  const st=lstatSync(full);if(st.isSymbolicLink())throw Error('Symlink: '+p);
  if(st.isDirectory())walk(full);else if(st.isFile())files.push({path:p,sha256:sha(readFileSync(full))});else throw Error('Unsupported file type: '+p);
 }}
 walk(root);return files.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
}
function check(files,policy){
 if(policy?.schema!==1||!Array.isArray(policy.files))throw Error('Invalid manifest schema');
 const expected=new Map();for(const e of policy.files){
  if(!validPath(e?.path)||!(/^[a-f0-9]{64}$/.test(e?.sha256??''))||expected.has(e.path))throw Error('Invalid or duplicate manifest entry');
  expected.set(e.path,e);
 }
 const actual=new Map(files.map(e=>[e.path,e])),issues=[];
 for(const p of required)if(!actual.has(p))issues.push('Missing required: '+p);
 for(const e of files){
  if(forbidden(e.path))issues.push('Development-only: '+e.path);
  const entry=expected.get(e.path);
  if(!entry)issues.push('Unlisted: '+e.path);
  else{if(entry.sha256!==e.sha256)issues.push('Hash mismatch: '+e.path);
   if(entry.review!=='approved'||typeof entry.evidence!=='string'||!entry.evidence.trim())issues.push('Review/evidence missing: '+e.path);}
 }
 for(const p of expected.keys())if(!actual.has(p))issues.push('Missing listed: '+p);
 return issues;
}
function candidate(files){return {schema:1,files:files.map(e=>({...e,review:'pending',evidence:''}))};}
function selfTest(){
 const root=mkdtempSync(join(tmpdir(),'crossvex-package-'));
 try{
  writeFileSync(join(root,'index.html'),'game');writeFileSync(join(root,'credits.html'),'credits');
  let files=scan(root),draft=candidate(files);assert.equal(check(files,draft).length,2);
  const policy={schema:1,files:draft.files.map(e=>({...e,review:'approved',evidence:'test fixture'}))};
  assert.deepEqual(check(files,policy),[]);
  writeFileSync(join(root,'index.html'),'changed');assert(check(scan(root),policy).includes('Hash mismatch: index.html'));
  writeFileSync(join(root,'index.html'),'game');writeFileSync(join(root,'editor.html'),'tool');
  let issues=check(scan(root),policy);assert(issues.includes('Unlisted: editor.html'));assert(issues.includes('Development-only: editor.html'));
  rmSync(join(root,'editor.html'));rmSync(join(root,'credits.html'));issues=check(scan(root),policy);assert(issues.includes('Missing required: credits.html'));assert(issues.includes('Missing listed: credits.html'));
  assert.throws(()=>check(files,{schema:1,files:[{path:'../escape',sha256:'0'.repeat(64)}]}),/Invalid/);
  assert.throws(()=>check(files,{schema:1,files:[policy.files[0],policy.files[0]]}),/duplicate/);
  mkdirSync(join(root,'scripts'));symlinkSync(join(root,'index.html'),join(root,'scripts','link.js'));assert.throws(()=>scan(root),/Symlink/);
  rmSync(join(root,'scripts','link.js'));writeFileSync(join(root,'INDEX.HTML'),'collision');assert.throws(()=>scan(root),/collision/);
  console.log('PASS: release package checker self-test');
 }finally{rmSync(root,{recursive:true,force:true});}
}
try{
 const [mode,root,manifest,...extra]=process.argv.slice(2);
 if(mode==='--self-test'&&!root)selfTest();
 else if(mode==='--inventory'&&root&&!manifest)console.log(JSON.stringify(candidate(scan(root)),null,2));
 else if(mode==='--check'&&root&&manifest&&!extra.length){
  const rel=relative(resolve(root),resolve(manifest));if(!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep))throw Error('Review manifest must be outside package root');
  const files=scan(root),issues=check(files,JSON.parse(readFileSync(manifest,'utf8')));
  if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}
  else console.log('PASS: '+files.length+' staged files match the reviewed manifest (not a legal or network audit)');
 }else throw Error('Usage: --inventory <staging-dir> | --check <staging-dir> <external-manifest.json> | --self-test');
}catch(error){console.error(error.message);process.exitCode=1;}
