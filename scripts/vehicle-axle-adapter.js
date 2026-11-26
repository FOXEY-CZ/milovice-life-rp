// Experimental adapter for exact observed three-assembly vehicle layouts.
// Return a separate normalized clone, or null; never modify the source scene.
// No selection by vague name matching and no geometry spanning the axle split.
const layout=Object.freeze({
 citySport:['SportsCar2_BackWheels_Cylinder002','SportsCar2_FrontLeftWheel_Cylinder017','SportsCar2_FrontRightWheel_Cylinder018'],
 citySUV:['SUV_BackWheels_Cylinder009','SUV_FrontLeftWheel_Cylinder010','SUV_FrontRightWheel_Cylinder005'],
 cityCar:['NormalCar2_BackWheels_Cylinder003','NormalCar2_FrontLeftWheel_Cylinder015','NormalCar2_FrontRightWheel_Cylinder016']
});
export function adaptPairedAxleWheels(THREE,original,key){
 if(!Object.hasOwn(layout,key)||!original)return null;
 const root=original.clone(true);root.updateMatrixWorld(true);
 const hull=new THREE.Box3().setFromObject(root),midX=(hull.min.x+hull.max.x)*.5;
 const inverse=root.matrixWorld.clone().invert();
 const names=layout[key],assemblies=names.map(name=>{
  const found=[];root.traverse(n=>{if(n.name===name)found.push(n)});
  return found.length===1?found[0]:null;
 });
 if(assemblies.some(n=>!n?.isGroup||n.parent!==root||n.children.length!==2||
  n.children.some(c=>!c.isMesh||c.children.length||c.isSkinnedMesh||Array.isArray(c.material))))return null;
 const expected=new Set(assemblies.flatMap(n=>[n,...n.children]));
 let unexpected=false;root.traverse(n=>{if(/wheel|tire|tyre/i.test(n.name)&&!expected.has(n))unexpected=true;});
 if(unexpected)return null;
 const bins=new Map(),intermediate=[];
 function fail(){for(const g of intermediate)g.dispose();return null;}
 let inputVertices=0;
 for(let a=0;a<assemblies.length;a++)for(const mesh of assemblies[a].children){
  const g=mesh.geometry;
  if(!g?.attributes.position||g.groups.length>1||Object.keys(g.morphAttributes).length||
   (g.groups.length===1&&(g.groups[0].start!==0||g.groups[0].count!==(g.index?.count??g.attributes.position.count)))||
   Object.values(g.attributes).some(v=>v.isInterleavedBufferAttribute||v.isInstancedBufferAttribute))return fail();
  const local=g.index?g.toNonIndexed():g.clone();intermediate.push(local);
  local.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));
  const pos=local.attributes.position;
  if(pos.count%3!==0||Object.values(local.attributes).some(v=>v.count!==pos.count))return fail();
  const sides={left:[],right:[]},v=new THREE.Vector3();inputVertices+=pos.count;
  for(let i=0;i<pos.count;i+=3){
   const xs=[0,1,2].map(j=>v.fromBufferAttribute(pos,i+j).applyMatrix4(root.matrixWorld).x-midX);
   if(xs.some(x=>!Number.isFinite(x)||Math.abs(x)<.02)||!xs.every(x=>Math.sign(x)===Math.sign(xs[0])))return fail();
   const side=xs[0]<0?'left':'right';sides[side].push(i,i+1,i+2);
  }
  if(a===0?(!sides.left.length||!sides.right.length):
     a===1?(!sides.left.length||sides.right.length):(!sides.right.length||sides.left.length))return fail();
  for(const [side,indices] of Object.entries(sides)){
   if(!indices.length)continue;
   const id=(a===0?'rear':'front')+'-'+side;
   const piece=new THREE.BufferGeometry();intermediate.push(piece);
   for(const [name,attr] of Object.entries(local.attributes)){
    const array=new attr.array.constructor(indices.length*attr.itemSize);
    for(let i=0;i<indices.length;i++)for(let j=0;j<attr.itemSize;j++)array[i*attr.itemSize+j]=attr.array[indices[i]*attr.itemSize+j];
    piece.setAttribute(name,new THREE.BufferAttribute(array,attr.itemSize,attr.normalized));
   }
   piece.computeBoundingBox();
   if(piece.boundingBox.isEmpty())return fail();
   if(!bins.has(id))bins.set(id,[]);
   bins.get(id).push({geometry:piece,material:mesh.material,source:mesh.name});
  }
 }
 if(bins.size!==4||[...bins.values()].some(p=>p.length!==2))return fail();
 let outputVertices=0;
 const newGroups=[];
 for(const [id,pieces] of bins){
  const bounds=new THREE.Box3();
  for(const p of pieces)bounds.union(p.geometry.boundingBox);
  const pivot=bounds.getCenter(new THREE.Vector3()),group=new THREE.Group();
  group.name='AdapterWheel_'+id;group.position.copy(pivot);
  for(const [i,p] of pieces.entries()){
   p.geometry.translate(-pivot.x,-pivot.y,-pivot.z);
   p.geometry.computeBoundingBox();p.geometry.computeBoundingSphere();
   const mesh=new THREE.Mesh(p.geometry,p.material);mesh.name='AxlePart_'+i;
   mesh.userData.sourceName=p.source;mesh.castShadow=false;mesh.receiveShadow=true;
   group.add(mesh);outputVertices+=p.geometry.attributes.position.count;
  }
  newGroups.push(group);
 }
 if(inputVertices!==outputVertices)return fail();
 for(const n of assemblies)root.remove(n);
 for(const group of newGroups)root.add(group);
 root.updateMatrixWorld(true);
 const after=new THREE.Box3().setFromObject(root);
 if(after.min.distanceTo(hull.min)>1e-5||after.max.distanceTo(hull.max)>1e-5)return fail();
 // Dispose temporary expanded buffers, retain only the eight replacement parts.
 const kept=new Set(newGroups.flatMap(g=>g.children.map(m=>m.geometry)));
 for(const g of intermediate)if(!kept.has(g))g.dispose();
 return {root,groups:newGroups,inputVertices,outputVertices};
}
