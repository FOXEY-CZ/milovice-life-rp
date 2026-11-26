// Isolated optimization experiment: merge only direct opaque, static Mesh siblings
// with identical material objects and compatible attributes. Keep wheel pivots separate.
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export function batchSpectralMeshes(THREE,adapted){
 const root=adapted?.root?.clone(true);
 if(!root)return null;
 root.updateMatrixWorld(true);
 const groups=root.children.filter(n=>n.name.startsWith('AdapterWheel_'));
 if(groups.length!==4)return null;
 const stats={batches:0,removedMeshes:0,addedMeshes:0,trianglesBefore:0,trianglesAfter:0,skipped:0};
 const triangles=g=>(g.index?.count??g.attributes.position.count)/3;
 const count=root=>{let meshes=0,tris=0;root.traverse(n=>{if(n.isMesh){meshes++;tris+=triangles(n.geometry);}});return {meshes,tris};};
 const before=count(root),bounds=new THREE.Box3().setFromObject(root,true);
 const created=[];
 function fail(){for(const g of created)g.dispose();return null;}
 for(const parent of [root,...groups]){
  const bins=new Map();
  for(const node of parent.children){
   const g=node.geometry,m=node.material;
   // Do not batch transparent surfaces, animated/control groups, or special render state.
   if(!node.isMesh||node.isSkinnedMesh||node.children.length||!g||!m||Array.isArray(m)||!node.visible||
    m.transparent||m.opacity!==1||m.alphaTest>0||m.transmission>0||node.renderOrder!==0||
    g.groups.length>1||Object.keys(g.morphAttributes).length||
    node.matrix.determinant()<=0||
    (g.groups.length===1&&(g.groups[0].start!==0||g.groups[0].count!==(g.index?.count??g.attributes.position.count)))||
    (g.drawRange.start!==0||g.drawRange.count<(g.index?.count??g.attributes.position.count))||
    Object.values(g.attributes).some(a=>a.isInterleavedBufferAttribute||a.isInstancedBufferAttribute)){stats.skipped++;continue;}
   const signature=JSON.stringify([g.index!==null,node.castShadow,node.receiveShadow,node.frustumCulled,node.layers.mask,Object.keys(g.attributes).sort().map(k=>[k,g.attributes[k].itemSize,g.attributes[k].normalized,g.attributes[k].array.constructor.name])]);
   if(!bins.has(m))bins.set(m,new Map());
   const bucket=bins.get(m);if(!bucket.has(signature))bucket.set(signature,[]);bucket.get(signature).push(node);
  }
  for(const [material,bucket] of bins)for(const nodes of bucket.values()){
   if(nodes.length<2)continue;
   const pieces=nodes.map(n=>n.geometry.clone().applyMatrix4(n.matrix));
   let merged;
   try{merged=mergeGeometries(pieces,false);}finally{for(const g of pieces)g.dispose();}
   if(!merged)return fail();
   created.push(merged);merged.computeBoundingBox();merged.computeBoundingSphere();
   const n=new THREE.Mesh(merged,material);n.name='StaticBatch_'+stats.batches;
   n.castShadow=nodes[0].castShadow;n.receiveShadow=nodes[0].receiveShadow;n.frustumCulled=nodes[0].frustumCulled;n.layers.mask=nodes[0].layers.mask;
   n.userData.sourceNames=nodes.map(n=>n.userData.sourceName||n.name);
   for(const node of nodes)parent.remove(node);parent.add(n);
   stats.batches++;stats.removedMeshes+=nodes.length;stats.addedMeshes++;
  }
 }
 root.updateMatrixWorld(true);const after=count(root),newBounds=new THREE.Box3().setFromObject(root,true);
 if(before.tris!==after.tris||bounds.min.distanceTo(newBounds.min)>1e-5||bounds.max.distanceTo(newBounds.max)>1e-5||after.meshes>=before.meshes)return fail();
 return {root,groups,stats:{...stats,trianglesBefore:before.tris,trianglesAfter:after.tris,meshesBefore:before.meshes,meshesAfter:after.meshes}};
}
