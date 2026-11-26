// Optional original procedural road-car optimization, not wired into the game.
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export function batchProceduralRoadCar(THREE,car){
 const source=car?.group,wheels=car?.wheels;
 if(!source?.isGroup||!Array.isArray(wheels)||wheels.length!==4||
    new Set(wheels).size!==4||wheels.some(w=>w.parent!==source||!w.isGroup))return null;
 const root=source.clone(true);
 const pivots=wheels.map(w=>root.children[source.children.indexOf(w)]);
 const created=[];
 const fail=()=>{for(const g of created)g.dispose();return null;};
 const counts=o=>{let meshes=0,triangles=0;o.traverse(n=>{
  if(n.isMesh){meshes++;triangles+=(n.geometry.index?.count??n.geometry.attributes.position.count)/3*(n.isInstancedMesh?n.count:1);}
 });return {meshes,triangles};};
 root.updateMatrixWorld(true);
 const before=counts(root),box=new THREE.Box3().setFromObject(root,true);
 let batches=0;
 for(const parent of [root,...pivots]){
  const bins=new Map();
  for(const n of parent.children){
   const g=n.geometry,m=n.material;
   if(!n.isMesh||n.isInstancedMesh||n.isSkinnedMesh||n.children.length||!g||!m||
      Array.isArray(m)||!n.visible||m.transparent||m.opacity!==1||m.alphaTest>0||
      m.transmission>0||n.renderOrder!==0||
      // Three renders the complete draw range for a single material, ignoring groups.
      // Arrays of materials remain excluded above; clear groups only on private clones.
      
      Object.keys(g.morphAttributes).length||n.matrix.determinant()<=0||
      g.drawRange.start!==0||g.drawRange.count<(g.index?.count??g.attributes.position.count)||
      Object.values(g.attributes).some(a=>a.isInterleavedBufferAttribute||a.isInstancedBufferAttribute))continue;
   const key=JSON.stringify([!!g.index,n.castShadow,n.receiveShadow,n.frustumCulled,n.layers.mask,
    Object.keys(g.attributes).sort().map(k=>[k,g.attributes[k].itemSize,g.attributes[k].normalized,g.attributes[k].array.constructor.name])]);
   if(!bins.has(m))bins.set(m,new Map());
   const bucket=bins.get(m);if(!bucket.has(key))bucket.set(key,[]);bucket.get(key).push(n);
  }
  for(const [m,bucket] of bins)for(const nodes of bucket.values()){
   if(nodes.length<2)continue;
   const pieces=nodes.map(n=>{const g=n.geometry.clone().applyMatrix4(n.matrix);g.clearGroups();return g;});
   let merged;
   try{merged=mergeGeometries(pieces,false);}finally{for(const g of pieces)g.dispose();}
   if(!merged)return fail();
   created.push(merged);merged.computeBoundingBox();merged.computeBoundingSphere();
   const n=new THREE.Mesh(merged,m);n.name='ProceduralCarBatch_'+batches++;
   n.castShadow=nodes[0].castShadow;n.receiveShadow=nodes[0].receiveShadow;
   n.frustumCulled=nodes[0].frustumCulled;n.layers.mask=nodes[0].layers.mask;
   for(const node of nodes)parent.remove(node);parent.add(n);
  }
 }
 root.updateMatrixWorld(true);
 const after=counts(root),newBox=new THREE.Box3().setFromObject(root,true);
 if(after.triangles!==before.triangles||after.meshes>=before.meshes||
    box.min.distanceTo(newBox.min)>1e-5||box.max.distanceTo(newBox.max)>1e-5)return fail();
 return {group:root,wheels:pivots,kind:car.kind,stats:{before,after,batches},
  disposeBatches:()=>{for(const g of created)g.dispose();}};
}
