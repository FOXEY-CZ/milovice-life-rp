import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../docs/'+p,import.meta.url),'utf8'));
const inventory=read('architecture-source-inventory.json'),evidence=read('commons-source-metadata-evidence.json');
function verify(inv,ev){
 assert.equal(ev.result,'matched');assert.equal(ev.httpStatus,200);assert.equal(ev.rightsStatus,'pending');
 assert.equal(ev.records.length,5);assert.equal(new Set(ev.records.map(x=>x.pageid)).size,5);
 const seen=new Set();
 for(const r of inv.records){
  assert.equal(r.reviewStatus,'pending');
  if(r.provider!=='Wikimedia Commons')continue;
  for(const url of [r.source,r.secondarySource,...r.facadeSources.map(f=>f.source)].filter(Boolean)){
   const matches=ev.records.filter(x=>x.sources.some(s=>s.id===r.id&&s.url===url));assert.equal(matches.length,1);
   const x=matches[0];assert.equal(x.descriptionurl,url);assert.equal(x.requestedTitle,x.returnedTitle);
   assert.equal(x.artist,r.declaredPhotoAuthor);assert.equal(x.license,r.declaredPhotoLicense);assert.match(x.licenseUrl,/^https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/?$/);
   assert.equal(x.normalizedPhotoDate,r.photoDate);assert.match(x.sha1,/^[a-f0-9]{40}$/);assert.ok(x.pageid>0&&x.lastrevid>0);
   assert.equal(x.metadataStatus,'matched');assert.equal(x.rightsStatus,'pending');assert.deepEqual(x.checks[r.id],{author:true,license:true,photoDate:true});seen.add(x.pageid);
  }
 }
 assert.equal(seen.size,5);
}
verify(inventory,evidence);
for(const [key,value] of [['artist','wrong'],['normalizedPhotoDate','2024-05-31'],['rightsStatus','approved'],['sha1','invalid']]){
 const bad=structuredClone(evidence);bad.records[0][key]=value;assert.throws(()=>verify(inventory,bad));
}
console.log('PASS saved Commons evidence: 5 exact references, pending rights, negative fixtures');
