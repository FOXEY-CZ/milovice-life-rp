// Exact observed SpectralGT layout. Group a cloned scene; no geometry or material edits.
const corners=['Rear_Left','Rear_Right','Front_Left','Front_Right'];
const rotating=['Tire','Sidewall_Bead','Brake_Disc','Brake_Hat','Rim_Base',...Array.from({length:6},(_,i)=>'Spoke_'+(i+1)),'Hub','Hub_Cap',...Array.from({length:4},(_,i)=>'Tire_Block_'+(i+1))];
const stationary=['Brake_Caliper','Lower_Control_Arm','Upper_Control_Arm','Toe_Link','Damper','Damper_Cap',...Array.from({length:5},(_,i)=>'Coil_Spring_'+(i+1)),'Brake_Line'];
export function adaptSpectralWheels(THREE,original){
 if(!original)return null;
 const root=original.clone(true);root.updateMatrixWorld(true);
 const hull=new THREE.Box3().setFromObject(root),plans=[];
 for(const corner of corners){
  const found=new Map();let invalid=false;
  root.traverse(n=>{
   if(!n.name.startsWith(corner+'_'))return;
   const suffix=n.name.slice(corner.length+1);
   if(![...rotating,...stationary].includes(suffix)||found.has(suffix)||!n.isMesh||n.parent!==root||n.children.length||n.isSkinnedMesh)invalid=true;
   found.set(suffix,n);
  });
  if(invalid||found.size!==rotating.length+stationary.length)return null;
  const nodes=rotating.map(s=>found.get(s));if(nodes.some(n=>!n))return null;
  const tire=found.get('Tire'),tb=new THREE.Box3().setFromObject(tire);
  const tc=tb.getCenter(new THREE.Vector3()),ts=tb.getSize(new THREE.Vector3());
  if(Math.abs(ts.y-ts.z)>1e-4||ts.y<.5||ts.y>1.2||ts.x>.4)return null;
  if(tc.distanceTo(tire.getWorldPosition(new THREE.Vector3()))>1e-5)return null;
  const box=new THREE.Box3();
  for(const node of nodes){
   const b=new THREE.Box3().setFromObject(node);
   if(b.isEmpty()||b.min.y<tb.min.y-1e-4||b.max.y>tb.max.y+1e-4||b.min.z<tb.min.z-1e-4||b.max.z>tb.max.z+1e-4)return null;
   box.union(b);
  }
  const pivot=box.getCenter(new THREE.Vector3());
  if(Math.abs(pivot.y-tc.y)>1e-5||Math.abs(pivot.z-tc.z)>1e-5)return null;
  plans.push({corner,nodes,pivot});
 }
 const groups=[];
 for(const {corner,nodes,pivot} of plans){
  const group=new THREE.Group();group.name='AdapterWheel_'+corner;group.position.copy(root.worldToLocal(pivot.clone()));root.add(group);root.updateMatrixWorld(true);
  for(const [i,node] of nodes.entries()){
   const before=node.matrixWorld.clone();const name=node.name;
   group.attach(node);node.userData.sourceName=name;node.name='RotatingPart_'+i;
   node.updateWorldMatrix(true,false);
   if(before.elements.some((v,j)=>Math.abs(v-node.matrixWorld.elements[j])>1e-5))return null;
  }
  groups.push(group);
 }
 root.updateMatrixWorld(true);
 const after=new THREE.Box3().setFromObject(root);
 if(after.min.distanceTo(hull.min)>1e-5||after.max.distanceTo(hull.max)>1e-5)return null;
 return {root,groups,rotatingParts:plans.reduce((n,p)=>n+p.nodes.length,0)};
}
