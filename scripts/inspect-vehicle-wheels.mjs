import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {makeVehicleAssetManager,LICENSED_VEHICLES} from './vehicle-assets.js';
// Diagnostic only: use actual manager loading, normalization and wheel guard.
const [output]=process.argv.slice(2);
assert.ok(output,'Output path required');
const hashes={
 spectralGT:'e7b7f0d9de0c3bc3897c8134b1ceae5631b1da2690d336df18c3ea82e7238c73',
 citySUV:'1a9ce2bba813dca5005abab09715b01b8b5f4a9c48d7260463afdfeb876aa8b6',
 cityCar:'e5f5fa41c4434383b20287725c0e9d757cbd0f059eedc342ec265d32a195fe39',
 citySport:'bbb1c718d2aaf5f4344e9fb2cd66d8332a998a515b09ddd4dfa14698d787124e'
};
const nativeFetch=globalThis.fetch;
if(typeof globalThis.ProgressEvent==='undefined')globalThis.ProgressEvent=class ProgressEvent extends Event{constructor(type,init={}){super(type);Object.assign(this,init)}};
const records=[];
const round=v=>Number.isFinite(v)?Number(v.toFixed(5)):null;
const vector=v=>v.toArray().map(round);
function inspect(root){
 root.updateMatrixWorld(true);
 const hull=new THREE.Box3().setFromObject(root),length=hull.max.z-hull.min.z,width=hull.max.x-hull.min.x;
 const midX=(hull.min.x+hull.max.x)*.5,midZ=(hull.min.z+hull.max.z)*.5;
 const nodes=[],accepted=[];
 root.traverse(node=>{
  if(!node.name||!/(wheel|tire|tyre)/i.test(node.name))return;
  const bounds=new THREE.Box3().setFromObject(node),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  const reasons=[];
  if(!(node.isGroup||node.isMesh)||!node.parent)reasons.push('node-type-or-parent');
  if(node.children.some(c=>/(wheel|tire|tyre)/i.test(c.name||'')))reasons.push('named-child');
  if(bounds.isEmpty())reasons.push('empty-bounds');
  if(Math.abs(center.x-midX)<=width*.20)reasons.push('near-center-x');
  if(Math.abs(center.z-midZ)<=length*.13)reasons.push('near-center-z');
  if(center.y>hull.min.y+1)reasons.push('too-high');
  if(size.z>length*.4)reasons.push('too-long');
  if(size.x>width*.65)reasons.push('too-wide');
  const rec={name:node.name,parent:node.parent?.name||null,type:node.type,children:node.children.map(c=>c.name),center:vector(center),size:vector(size),pivot:vector(node.getWorldPosition(new THREE.Vector3())),reasons};
  nodes.push(rec);
  if(!reasons.length)accepted.push({node,center});
 });
 const issues=[];
 if(accepted.length!==4)issues.push('expected-four-candidates');
 if(accepted.filter(w=>w.center.x>midX).length!==2||accepted.filter(w=>w.center.z>midZ).length!==2)issues.push('axle-distribution');
 for(let i=0;i<accepted.length;i++)for(let j=i+1;j<accepted.length;j++)if(accepted[i].center.distanceTo(accepted[j].center)<.38)issues.push('pair-too-close');
 return {hull:{min:vector(hull.min),max:vector(hull.max)},namedNodes:nodes,accepted:accepted.map(w=>w.node.name),issues,diagnosticAccepted:issues.length===0};
}
try{
 for(const [key,spec] of Object.entries(LICENSED_VEHICLES)){
  const response=await nativeFetch(spec.uri,{redirect:'error',signal:AbortSignal.timeout(30000)});
  assert.ok(response.ok,key+' HTTP '+response.status);
  const chunks=[];let total=0;
  for await(const part of response.body){total+=part.byteLength;assert.ok(total<=32*1024*1024);chunks.push(Buffer.from(part))}
  const bytes=Buffer.concat(chunks);
  assert.equal(bytes.length,spec.fileBytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),hashes[key]);
  // Feed only verified bytes to the actual GLTFLoader. Any unplanned URL fails.
  globalThis.fetch=async input=>{
   const url=typeof input==='string'?input:input.url||String(input);
   assert.equal(url,spec.uri,'Unexpected GLB dependency');
   return new Response(bytes,{headers:{'Content-Length':String(bytes.length),'Content-Type':'model/gltf-binary'}});
  };
  globalThis.window={matchMedia:()=>({matches:key==='spectralGT'})};
  const messages=[],manager=makeVehicleAssetManager(THREE,{status:m=>messages.push(m)});
  const normalized=await manager.load(key);assert.ok(normalized,key+' load failed');
  const diagnostics=inspect(normalized.clone(true));
  const car={id:'diagnostic-'+key,type:{spectralGT:0,cityCar:0,citySUV:2,citySport:3}[key],g:new THREE.Group(),driven:true,parked:false};
  car.g.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial()));
  manager.update([car],0,0,1,car);
  const actual=globalThis.window.__miloviceGLBDebug;
  const installed=actual.assignments.some(a=>a.key===key&&a.wheels===4);
  assert.equal(installed,diagnostics.diagnosticAccepted,key+' diagnostic and real guard disagree');
  const record={key,bytes:bytes.length,installed,rejected:actual.rejected[key]||null,...diagnostics,messages};
  records.push(record);console.log(JSON.stringify(record));
  manager.reset();
 }
}finally{globalThis.fetch=nativeFetch;delete globalThis.window;}
writeFileSync(output,JSON.stringify({schema:1,scope:'four pinned GLB vehicle models, actual runtime guard, no visual or rights approval',records},null,2)+'\n',{flag:'wx'});
console.log('PASS vehicle wheel diagnostic collection; rejection is evidence, not a workflow failure');
