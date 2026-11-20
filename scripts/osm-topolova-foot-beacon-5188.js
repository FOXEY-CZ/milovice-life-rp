/** Milovice RP 5.188 — temporary in-world marker for the already
 * playable pedestrian delivery on the original Topolová west sidewalk.
 * This is a deliberately luminous GAME UI target, not a real street object.
 * Two reusable meshes; no speculative entrances, paths or colliders.
 */
export function createTopolovaFootBeacon5188(THREE,{layer,terrainAt}={}){
 if(!THREE?.Group||!THREE?.Mesh||!THREE?.TorusGeometry||
  !THREE?.OctahedronGeometry||!THREE?.MeshBasicMaterial||
  !layer?.add||typeof terrainAt!=='function')return null;
 const group=new THREE.Group();
 group.name='Milovice_Gameplay_Topolova_FootCheckpoint_5188';
 group.userData.gameplayOnly=true;
 group.visible=false;
 const material=new THREE.MeshBasicMaterial({
  color:0x58f8aa,transparent:true,opacity:.83,depthWrite:false,
  side:THREE.DoubleSide
 });
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.15,.075,6,28),material);
 ring.rotation.x=Math.PI/2;
 ring.position.y=.18;
 const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.35,0),material);
 crystal.position.y=1.55;
 group.add(ring);group.add(crystal);layer.add(group);
 let lastCheckpoint=-1,active=false;
 const hide=()=>{
  group.visible=false;active=false;lastCheckpoint=-1;
 };
 const update=(job,elapsed=0)=>{
  if(job?.version!=='5.179'||job.sourceWayId!=='1314665579'||
   job.simulatedDelivery!==true||job.streetAssetsAdded!==0||
   !Array.isArray(job.checkpoints)||job.checkpoints.length!==3||
   !Number.isInteger(job.next)||job.next<0||job.next>=3){
   hide();return false;
  }
  const target=job.checkpoints[job.next];
  if(!Number.isFinite(target?.x)||!Number.isFinite(target?.z)){
   hide();return false;
  }
  if(!active||lastCheckpoint!==job.next){
   const height=terrainAt(target.x,target.z);
   if(!Number.isFinite(height)){hide();return false;}
   group.position.set(target.x,height+.06,target.z);
   lastCheckpoint=job.next;
  }
  active=true;group.visible=true;
  const t=Number.isFinite(elapsed)?elapsed:0;
  ring.scale.setScalar(1+.075*Math.sin(t*2.6));
  crystal.position.y=1.55+.17*Math.sin(t*2.4);
  crystal.rotation.y=t*.85;
  return true;
 };
 const inspect=()=>({
  version:'5.188',active:active&&group.visible,
  checkpoint:active?lastCheckpoint+1:null,
  world:active?{x:group.position.x,y:group.position.y,z:group.position.z}:null,
  sourceWayId:active?'1314665579':null,
  actualSceneObjects:group.children.length,
  inScene:group.parent===layer,
  visibleAfterLOD:group.visible&&layer.visible,
  gameplayOnly:true,physicalStreetObjectsAdded:0,newColliders:0,
  buildingGeometryChanged:false,sourceOSMChanged:false
 });
 return {update,inspect,group};
}
