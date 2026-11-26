import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {brotliCompressSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
const dir=mkdtempSync(join(tmpdir(),'car-provenance-'));
const prefix='https://raw.githubusercontent.com/bennibeni/garage/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/';
const files=[];
try{
 // Known pinned mirrors are test fixtures only; not evidence of upstream origin.
 for(const name of ['car','sport','suv']){
  const r=await fetch(prefix+'quaternius-'+name+'.glb',{redirect:'error',signal:AbortSignal.timeout(30000)});
  assert.ok(r.ok,'Fixture HTTP '+r.status);
  const chunks=[];let size=0;
  for await(const chunk of r.body){size+=chunk.byteLength;assert.ok(size<=32*1024*1024);chunks.push(Buffer.from(chunk));}
  const bytes=Buffer.concat(chunks);
  const file=join(dir,name+(name==='sport'?'.glb.br':'.glb'));
  writeFileSync(file,name==='sport'?brotliCompressSync(bytes):bytes);
  files.push(file);
 }
 const run=(out,args)=>spawnSync(process.execPath,['scripts/audit-release-glb.mjs','--compare-local-cars',out,...args],{encoding:'utf8',timeout:30000});
 const report=(name,args,expected,states)=>{
  const out=join(dir,name+'.json'),r=run(out,args);
  assert.ifError(r.error);assert.equal(r.status,expected,r.stderr);
  const text=readFileSync(out,'utf8'),data=JSON.parse(text);
  assert.equal(data.review,'pending');
  assert.deepEqual(data.results.map(x=>x.status),states);
  assert.ok(!text.includes(dir),'local paths exposed');
  return out;
 };
 const good=report('match',files,0,['match','match','match']);
 report('swap',[files[1],files[0],files[2]],1,['mismatch','mismatch','match']);
 const bad=join(dir,'bad.glb');writeFileSync(bad,Buffer.from('not a GLB'));
 report('bad',[bad,join(dir,'absent.glb'),files[2]],1,['unverified','unverified','match']);
 const original=readFileSync(good,'utf8');
 assert.equal(run(good,files).status,1,'must not overwrite report');
 assert.equal(readFileSync(good,'utf8'),original);
 assert.equal(run(join(dir,'wrong-args.json'),files.slice(0,2)).status,1);
 console.log('PASS local comparison: pinned fixtures raw/Brotli, swapped, malformed, missing, report protection, argument count; no upstream provenance approval');
}finally{rmSync(dir,{recursive:true,force:true});}
