import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {makeVehicleAssetManager,LICENSED_VEHICLES,selectVehicleModel} from './vehicle-assets.js';
import {adaptPairedAxleWheels} from './vehicle-axle-adapter.js';
// Diagnostic only: use actual manager loading, normalization and wheel guard.
const [output]=process.argv.slice(2);
assert.ok(output,'Output path required');
const hashes={
 spectralGT:'e7b7f0d9de0c3bc3897c8134b1ceae5631b1da2690d336df18c3ea82e7238c73',
 citySUV:'1a9ce2bba813dca5005abab09715b01b8b5f4a9c48d7260463afdfeb876aa8b6',
 cityCar:'e5f5fa41c4434383b20287725c0e9d757cbd0f059eedc342ec265d32a195fe39',
 citySport:'bbb1c718d2aaf5f4344e9fb2cd66d8332a998a515b09ddd4dfa14698d787124e'
};
for(const desktop of [false,true])for(const mode of ['auto','on','coupe','off']){
 assert.equal(selectVehicleModel(0,{desktop,mode,player:false}),mode==='off'?null:'cityCar');
 assert.equal(selectVehicleModel(0,{desktop,mode,player:true}),mode==='off'?null:desktop&&mode==='coupe'?'spectralGT':'cityCar');
}
assert.equal(selectVehicleModel(0,{desktop:true,mode:'coupe',player:true,coupeAvailable:false}),'cityCar');
for(const [type,key] of [[2,'citySUV'],[3,'citySport'],[6,null],[7,null],[8,null]])assert.equal(selectVehicleModel(type,{desktop:true,mode:'coupe',player:true}),key);
console.log('PASS explicit desktop player-only coupe selection policy');
const nativeFetch=globalThis.fetch;
if(typeof globalThis.ProgressEvent==='undefined')globalThis.ProgressEvent=class ProgressEvent extends Event{constructor(type,init={}){super(type);Object.assign(this,init)}};
const records=[];
const passengerSpec=LICENSED_VEHICLES.cityCar;
const passengerResponse=await nativeFetch(passengerSpec.uri,{redirect:'error',signal:AbortSignal.timeout(30000)});
assert.ok(passengerResponse.ok);
const passengerBytes=Buffer.from(await passengerResponse.arrayBuffer());
assert.equal(passengerBytes.length,passengerSpec.fileBytes);
assert.equal(createHash('sha256').update(passengerBytes).digest('hex'),hashes.cityCar);

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
   assert.ok(url===spec.uri||url===passengerSpec.uri,'Unexpected GLB dependency '+url);
   const payload=url===spec.uri?bytes:passengerBytes;
   return new Response(payload,{headers:{'Content-Length':String(payload.length),'Content-Type':'model/gltf-binary'}});
  };
  globalThis.window={matchMedia:()=>({matches:key==='spectralGT'})};
  const messages=[],manager=makeVehicleAssetManager(THREE,{status:m=>messages.push(m)});
  const normalized=await manager.load(key);assert.ok(normalized,key+' load failed');
  const diagnostics=inspect(normalized.clone(true));
  const car={id:'diagnostic-'+key,type:{spectralGT:0,cityCar:0,citySUV:2,citySport:3}[key],g:new THREE.Group(),driven:true,parked:false};
  car.g.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial()));
  if(key==='spectralGT'){
   await manager.load('cityCar');
   manager.update([car],0,0,1,car);
   assert.equal(globalThis.window.__miloviceGLBDebug.assignments.find(a=>a.id===car.id)?.key,'cityCar','auto must use low-poly car');
   manager.configure('coupe');
  }
  manager.update([car],0,0,2,car);
  const actual=globalThis.window.__miloviceGLBDebug;
  const installed=actual.assignments.some(a=>a.key===key&&a.wheels===4);
  assert.equal(installed,diagnostics.diagnosticAccepted,key+' diagnostic and real guard disagree');
  const record={key,bytes:bytes.length,installed,rejected:actual.rejected[key]||null,...diagnostics,messages};
  records.push(record);console.log(JSON.stringify(record));
  if(key!=='spectralGT'){
   assert.equal(installed,true,key+' must install all four adapted wheels');
   const model=car.g.userData.licensedGLB;
   assert.ok(model&&car.g.userData.proceduralLOD.visible===false);
   const other={...car,id:'other-'+key,g:new THREE.Group(),driven:false};
   other.g.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial()));
   // Two independent scene instances must never share mutable wheel transforms.
   car.g.rotation.y=.73;other.g.position.set(6,0,0);
   manager.update([car,other],0,0,2,car);
   const groups=model.children.filter(g=>g.name.startsWith('AdapterWheel_'));
   const otherGroups=other.g.userData.licensedGLB?.children.filter(g=>g.name.startsWith('AdapterWheel_'));
   assert.equal(groups.length,4);assert.equal(otherGroups?.length,4);
   assert.equal(adaptPairedAxleWheels(THREE,model,key),null,'double conversion must fail closed');
   car.g.updateMatrixWorld(true);other.g.updateMatrixWorld(true);
   const snapshots=groups.map(g=>({center:g.getWorldPosition(new THREE.Vector3()),q:g.quaternion.clone(),r:new THREE.Box3().setFromObject(g).getSize(new THREE.Vector3()).y/2}));
   const otherQ=otherGroups.map(g=>g.quaternion.clone());
   manager.spin(car,1);
   car.g.updateMatrixWorld(true);
   for(const [i,g] of groups.entries()){
    const s=snapshots[i];assert.ok(g.getWorldPosition(new THREE.Vector3()).distanceTo(s.center)<1e-5,'pivot moved');
    assert.ok(g.quaternion.angleTo(s.q)>.1,'wheel did not rotate');
    const axle=new THREE.Vector3(1,0,0).applyQuaternion(car.g.getWorldQuaternion(new THREE.Quaternion())).applyQuaternion(g.parent.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
    const expected=s.q.clone().premultiply(new THREE.Quaternion().setFromAxisAngle(axle,-1/s.r));
    assert.ok(g.quaternion.angleTo(expected)<1e-5,'wrong axle or radius');
    assert.ok(otherGroups[i].quaternion.angleTo(otherQ[i])<1e-6,'other car wheel mutated');
   }
   manager.spin(car,-1);car.g.updateMatrixWorld(true);
   for(const [i,g] of groups.entries())assert.ok(g.quaternion.angleTo(snapshots[i].q)<1e-5,'reverse did not restore');
   manager.configure('off');
   assert.equal(car.g.userData.licensedGLB,null);assert.equal(car.g.userData.proceduralLOD.visible,true);
   assert.equal(other.g.userData.licensedGLB,null);assert.equal(other.g.userData.proceduralLOD.visible,true);
   record.runtime={installed:true,independentInstances:true,spinAndReverse:true,stationaryPivots:true,fallbackRestored:true};
   console.log(JSON.stringify({key,runtime:record.runtime}));
  }else{
   assert.equal(installed,true,'opt-in coupe must install');
   const model=car.g.userData.licensedGLB,groups=model.children.filter(g=>g.name.startsWith('AdapterWheel_'));
   assert.equal(groups.length,4);
   const other={...car,id:'npc',g:new THREE.Group(),driven:false};
   other.g.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial()));
   manager.update([car,other],0,0,3,car);
   assert.equal(globalThis.window.__miloviceGLBDebug.assignments.find(a=>a.id==='npc')?.key,'cityCar');
   assert.equal(globalThis.window.__miloviceGLBDebug.assignments.filter(a=>a.key==='spectralGT').length,1);
   const before=groups.map(g=>({q:g.quaternion.clone(),p:g.getWorldPosition(new THREE.Vector3())}));
   manager.spin(car,.5);car.g.updateMatrixWorld(true);
   for(const [i,g] of groups.entries()){assert.ok(g.quaternion.angleTo(before[i].q)>.1);assert.ok(g.getWorldPosition(new THREE.Vector3()).distanceTo(before[i].p)<1e-5);}
   manager.spin(car,-.5);
   for(const [i,g] of groups.entries())assert.ok(g.quaternion.angleTo(before[i].q)<1e-5);
   manager.update([car,other],0,0,4,null);
   assert.equal(globalThis.window.__miloviceGLBDebug.assignments.filter(a=>a.key==='spectralGT').length,0,'exit must remove heavy coupe');
   manager.configure('off');
   assert.equal(car.g.userData.licensedGLB,null);assert.equal(car.g.userData.proceduralLOD.visible,true);
   record.runtime={installed:true,autoLowPoly:true,playerOnly:true,spinAndReverse:true,exitDowngrade:true,fallbackRestored:true};
   console.log(JSON.stringify({key,runtime:record.runtime}));
  }
  manager.reset();
 }
}finally{globalThis.fetch=nativeFetch;delete globalThis.window;}
writeFileSync(output,JSON.stringify({schema:1,scope:'four pinned GLB vehicle models, actual runtime guard, no visual or rights approval',records},null,2)+'\n',{flag:'wx'});
console.log('PASS vehicle wheel diagnostic collection; rejection is evidence, not a workflow failure');
