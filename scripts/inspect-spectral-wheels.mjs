import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {makeVehicleAssetManager,LICENSED_VEHICLES} from './vehicle-assets.js';
import {adaptSpectralWheels} from './prepare-spectral-wheels.mjs';
const output=process.argv[2];assert.ok(output);
const spec=LICENSED_VEHICLES.spectralGT;
const r=await fetch(spec.uri,{redirect:'error',signal:AbortSignal.timeout(30000)});assert.ok(r.ok);
const chunks=[];let total=0;for await(const p of r.body){total+=p.byteLength;assert.ok(total<=32*1024*1024);chunks.push(Buffer.from(p));}
const bytes=Buffer.concat(chunks);assert.equal(bytes.length,4688844);
assert.equal(createHash('sha256').update(bytes).digest('hex'),'e7b7f0d9de0c3bc3897c8134b1ceae5631b1da2690d336df18c3ea82e7238c73');
if(typeof globalThis.ProgressEvent==='undefined')globalThis.ProgressEvent=class ProgressEvent extends Event{constructor(type,init={}){super(type);Object.assign(this,init)}};
const nativeFetch=globalThis.fetch;
globalThis.fetch=async input=>{assert.equal(typeof input==='string'?input:input.url,spec.uri);return new Response(bytes,{headers:{'Content-Length':String(bytes.length),'Content-Type':'model/gltf-binary'}});};
const manager=makeVehicleAssetManager(THREE);
let original;
try{original=await manager.load('spectralGT');}finally{globalThis.fetch=nativeFetch;}
assert.ok(original);
const meshes=root=>{const out=new Map();root.updateMatrixWorld(true);root.traverse(n=>{if(n.isMesh){const name=n.userData.sourceName||n.name;assert.ok(!out.has(name),'duplicate '+name);out.set(name,{node:n,matrix:n.matrixWorld.clone(),geometry:n.geometry,material:n.material});}});return out;};
const before=meshes(original),proposal=adaptSpectralWheels(THREE,original);
assert.ok(proposal,'exact layout adaptation failed');assert.equal(proposal.groups.length,4);assert.equal(proposal.rotatingParts,68);
const after=meshes(proposal.root);assert.equal(after.size,before.size);
for(const [name,a] of before){const b=after.get(name);assert.ok(b);assert.equal(b.geometry,a.geometry);assert.equal(b.material,a.material);assert.ok(a.matrix.elements.every((v,i)=>Math.abs(v-b.matrix.elements[i])<1e-5),name+' moved');}
const moving=new Set(proposal.groups.flatMap(g=>g.children.map(n=>n.userData.sourceName)));
assert.equal(moving.size,68);
const pivots=proposal.groups.map(g=>g.getWorldPosition(new THREE.Vector3()));
for(const [i,g] of proposal.groups.entries()){
 const b=new THREE.Box3().setFromObject(g),center=b.getCenter(new THREE.Vector3());
 assert.ok(center.distanceTo(pivots[i])<1e-5);
 const axle=new THREE.Vector3(1,0,0).applyQuaternion(g.parent.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
 g.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axle,Math.PI/2));
}
const spun=meshes(proposal.root);let changed=0,stationary=0;
for(const [name,a] of after){const b=spun.get(name),same=a.matrix.elements.every((v,i)=>Math.abs(v-b.matrix.elements[i])<1e-5);if(moving.has(name)){assert.ok(!same,name+' did not rotate');changed++;}else{assert.ok(same,name+' stationary part moved');stationary++;}}
for(const [i,g] of proposal.groups.entries())assert.ok(g.getWorldPosition(new THREE.Vector3()).distanceTo(pivots[i])<1e-5);
const restored=meshes(original);for(const [name,a] of before)assert.ok(a.matrix.elements.every((v,i)=>Math.abs(v-restored.get(name).matrix.elements[i])<1e-5),'source clone changed');
const bad=original.clone(true);bad.getObjectByName('Rear_Left_Tire').name='Unexpected';assert.equal(adaptSpectralWheels(THREE,bad),null);
const record={model:'spectralGT',meshes:before.size,rotating:changed,stationary,pivots:pivots.map(v=>v.toArray()),unchangedSource:true,negativeCase:true,review:'pending'};
writeFileSync(output,JSON.stringify(record,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(record));
