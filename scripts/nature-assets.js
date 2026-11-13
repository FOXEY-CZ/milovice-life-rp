// Milovice RP 5.3.0 — detailed real GLB trees replacing low-poly spheres
// selectively near the rail-station district. Every location comes from an
// already generated roadside-tree position (no imaginary OSM tree claims).
// CC0 models by Quaternius, Ultimate Nature Pack (mirror: trebeljahr).
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const ROOT='https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/0128ca510d653bb04d6d1e4885bd8890b5050b4f/public/glb/nature_pack/';
export const TREE_ASSETS={
 broadleaf:ROOT+'CommonTree_3.glb',
 birch:ROOT+'BirchTree_2.glb'
};
export function makeNearFieldTreeKit(THREE){
 const loader=new GLTFLoader();
 const cached=new Map(),holders=[];
 let status='idle',container=null,pending=false;
 const fallBark=new THREE.MeshStandardMaterial({color:0x775941,roughness:1});
 const fallLeaves=new THREE.MeshStandardMaterial({color:0x518454,roughness:.94});
 const baseCrown=new THREE.IcosahedronGeometry(1,2);
 const baseTrunk=new THREE.CylinderGeometry(.19,.24,1,7);
 function fallback(holder,height){
  const trunk=new THREE.Mesh(baseTrunk,fallBark);
  trunk.position.y=height*.26;trunk.scale.y=height*.52;holder.add(trunk);
  const crown=new THREE.Mesh(baseCrown,fallLeaves);
  crown.position.y=height*.72;crown.scale.set(height*.28,height*.31,height*.28);holder.add(crown);
 }
 function populate(){
  if(!container)return;
  for(const item of holders){
   if(!item.holder.parent)continue;
   item.holder.clear();
   const glb=cached.get(item.kind);
   if(!glb){fallback(item.holder,item.height);continue}
   const model=glb.clone(true);
   const bounds=new THREE.Box3().setFromObject(model);
   const measured=bounds.max.y-bounds.min.y;
   if(!(measured>.1)){fallback(item.holder,item.height);continue}
   const scale=item.height/measured;
   model.scale.setScalar(scale);
   model.position.y=-bounds.min.y*scale;
   model.position.x=-(bounds.min.x+bounds.max.x)*scale*.5;
   model.position.z=-(bounds.min.z+bounds.max.z)*scale*.5;
   model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false}});
   item.holder.add(model);
  }
  state();
 }
 function state(){
  const stats={state:status,loaded:[...cached.keys()],instances:holders.length,license:'CC0-1.0'};
  if(typeof window!=='undefined')window.__miloviceNatureGLB=stats;
  return stats;
 }
 async function load(){
  if(pending)return;pending=true;status='loading';state();
  for(const [name,url] of Object.entries(TREE_ASSETS)){
   try{
    const result=await loader.loadAsync(url);
    if(!result?.scene)throw Error('Missing glTF scene');
    cached.set(name,result.scene);
   }catch(error){console.warn('CC0 tree download failed; using procedural fallback',name,String(error))}
  }
  status=cached.size?'ready':'fallback';populate();
 }
 function decorate(positions,parent,terrainAt){
  container=parent;
  for(const old of holders)old.holder.parent?.remove(old.holder);
  holders.length=0;
  positions.slice(0,12).forEach((p,i)=>{
   const holder=new THREE.Group();
   holder.name='MilovicePhotoStyleTree_'+i;
   holder.position.set(p.x,terrainAt(p.x,p.z),p.z);
   holder.rotation.y=(i*2.39996)%(Math.PI*2);
   parent.add(holder);
   const kind=i%3===0?'birch':'broadleaf',height=p.height||6;
   holders.push({holder,kind,height});
  });
  populate();
  if(!pending)load();
 }
 function update(x,z){
  for(const o of holders){
   o.holder.visible=Math.hypot(o.holder.position.x-x,o.holder.position.z-z)<200;
  }
 }
 state();
 return {decorate,update,state};
}
