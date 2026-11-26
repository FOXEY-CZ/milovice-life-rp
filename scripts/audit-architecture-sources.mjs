import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {parseApprovedArchitectureManifest} from './architecture-manifest.js';
const inventory=JSON.parse(readFileSync(new URL('../docs/architecture-source-inventory.json',import.meta.url),'utf8'));
function audit(raw){
 const cards=parseApprovedArchitectureManifest(raw);
 const issues=[],records=[];
 const expected=new Map(inventory.records.map(r=>[r.id,r]));
 assert.equal(expected.size,inventory.records.length,'Duplicate source inventory IDs');
 for(const [id,b] of Object.entries(raw.buildings)){
  const entry=expected.get(id);
  if(!entry){issues.push('Missing source review for building '+id);continue;}
  const actual={source:b.source,secondarySource:b.provenance?.secondPhoto??null,facadeSources:Object.entries(b.facades??{}).map(([face,f])=>({face,source:f.source})),declaredPhotoAuthor:b.provenance?.photoAuthor??null,declaredPhotoLicense:b.provenance?.photoLicense??null,photoDate:b.provenance?.photoDate};
  for(const [key,value] of Object.entries(actual))if(JSON.stringify(value)!==JSON.stringify(entry[key]))issues.push(id+': changed source field '+key);
  if(entry.reviewStatus!=='pending')issues.push(id+': review status must remain pending until separate rights decision');
  for(const url of [actual.source,actual.secondarySource,...actual.facadeSources.map(f=>f.source)].filter(Boolean)){
   try{const parsed=new URL(url);if(parsed.protocol!=='https:'||parsed.username||parsed.password)throw Error('invalid reference');}catch{issues.push(id+': invalid reference URL');}
  }
  records.push({id,provider:entry.provider,reviewStatus:entry.reviewStatus,declaredPhotoLicense:actual.declaredPhotoLicense});
 }
 for(const id of expected.keys())if(!cards.has(id))issues.push('Orphan source inventory entry '+id);
 return {review:'pending',published:cards.size,inventory:expected.size,records,issues};
}
const [mode,root,output]=process.argv.slice(2);
assert.ok(root,'Provide staged root');
const raw=JSON.parse(readFileSync(join(root,'data/architecture/verified-buildings.json'),'utf8'));
if(mode==='--self-test'){
 const changed=structuredClone(raw),id=Object.keys(changed.buildings)[0];
 changed.buildings[id].provenance.photoLicense='changed';
 assert.ok(audit(changed).issues.some(x=>x.includes('declaredPhotoLicense')));
 const added=structuredClone(raw);added.buildings['999999999999']=structuredClone(raw.buildings[id]);
 assert.ok(audit(added).issues.some(x=>x.includes('Missing source review')));
 console.log('PASS architecture source inventory negative tests');
}else if(mode==='--audit'&&output){
 const report=audit(raw);
 writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(report));
 if(report.issues.length)process.exitCode=1;
}else throw Error('Use --self-test <stage> or --audit <stage> <new-json>');
