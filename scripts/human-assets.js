// Milovice RP 5.3.0: genuinely imported, textured, skeletal human characters.
// Models: Quaternius Ultimate Modular Men/Women CC0-1.0, mirrored as glTF GLB
// by trebeljahr/quaternius-showcase (pack license checked 2026-11-13).
// https://quaternius.com/packs/ultimatemodularcharacters.html
// https://quaternius.com/packs/ultimatemodularwomen.html
// No Rockstar or copyrighted commercial-game assets are used.
// Streaming/LOD: player + at most 5 close NPCs; robust procedural fallback.
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';

const ROOT='https://raw.githubusercontent.com/trebeljahr/quaternius-showcase/0128ca510d653bb04d6d1e4885bd8890b5050b4f/public/glb/';
export const HUMAN_ASSETS=Object.freeze({
 casualMan:{url:ROOT+'modular_men/Casual.glb',name:'Civilista – muž',license:'CC0-1.0',bytes:785308},
 casualWoman:{url:ROOT+'modular_women/Casual.glb',name:'Civilistka – žena',license:'CC0-1.0',bytes:804896},
 suitMan:{url:ROOT+'modular_men/Suit.glb',name:'Civilista – oblek',license:'CC0-1.0',bytes:857732}
});

export function makeMiloviceHumanAssets(THREE,{playerRig,people,maxNpc=5}){
 const loader=new GLTFLoader();
 const assets=new Map(),status=new Map(),attached=new Map();
 let player=null,mode='auto',lastRefresh=-1;
 const state=()=>{
  const ret={
   mode,loaded:[...assets.keys()],status:Object.fromEntries(status),
   playerReady:!!player,activeNpc:[...attached.values()].filter(v=>v.container.visible).length,
   runtimeSkeletalWalk:!!(player?.boneState?.nodes?.leftLeg&&player?.boneState?.nodes?.rightLeg)&&!player?.mixer,
   heightMeters:player?.root.userData.heightMeters||0,originalGLBScale:player?.root.userData.originalGLBScale||null,
   armsDown:player?.boneState?.armsDown===true,
   facingCorrectionRadians:player?.root.userData.forwardCorrectionRadians||0,
   clips:player?.clips||[],bones:assets.get('casualMan')?.bones?.slice(0,56)||[],license:'CC0-1.0',fallback:!player
  };
  if(typeof window!=='undefined')window.__miloviceHumans=ret;
  return ret;
 };
 function allowed(){return mode!=='off'}
 // Some web-ready CC0 mirror GLBs omit the included animation clips.
 // Animate their actual skin bones at runtime instead of moving a rigid mannequin.
 function findBones(imported){
  const all=[];
  imported.traverse(o=>{if(o.isBone)all.push(o)});
  const role=(side,type)=>{
   return all.find(b=>{
    const n=b.name.toLowerCase(),clean=n.replace(/[^a-z]/g,'');
    const matchesSide=side==='l'
      ?(/left/.test(n)||/_l$|\.l$|l_/.test(n)||/^(?:upperleg|lowerleg|upperarm|lowerarm|shoulder|hand|foot)l$/.test(clean))
      :(/right/.test(n)||/_r$|\.r$|r_/.test(n)||/^(?:upperleg|lowerleg|upperarm|lowerarm|shoulder|hand|foot)r$/.test(clean));
    if(!matchesSide)return false;
    if(type==='leg')return /upleg|upperleg|thigh|legupper/.test(n);
    if(type==='knee')return /lowerleg|calf|shin/.test(n);
    if(type==='arm')return /upperarm|uparm|armupper/.test(n);
    if(type==='elbow')return /lowerarm|forearm/.test(n);
    return false;
   });
  };
  const spine=all.find(b=>/chest|torso|spine/i.test(b.name));
  const nodes={
   leftLeg:role('l','leg'),rightLeg:role('r','leg'),
   leftKnee:role('l','knee'),rightKnee:role('r','knee'),
   leftArm:role('l','arm'),rightArm:role('r','arm'),
   leftElbow:role('l','elbow'),rightElbow:role('r','elbow'),spine
  };
  // The source mirror exports an actual T-pose. Orient each upper arm towards
  // the ground using the vector from shoulder to elbow, in its real bone space.
  // A fixed rotation.z was ineffective because each GLB joint has its own axes.
  let posed=0;
  for(const [upperName,lowerName] of [['leftArm','leftElbow'],['rightArm','rightElbow']]){
   const upper=nodes[upperName],lower=nodes[lowerName];
   if(!upper||!lower)continue;
   imported.updateMatrixWorld(true);
   const from=lower.getWorldPosition(new THREE.Vector3()).sub(upper.getWorldPosition(new THREE.Vector3())).normalize();
   const target=new THREE.Vector3(Math.sign(from.x)*.12,-1,0).normalize();
   const worldDelta=new THREE.Quaternion().setFromUnitVectors(from,target);
   const parentWorld=upper.parent.getWorldQuaternion(new THREE.Quaternion());
   const localDelta=parentWorld.clone().invert().multiply(worldDelta).multiply(parentWorld);
   upper.quaternion.premultiply(localDelta);
   imported.updateMatrixWorld(true);
   const after=lower.getWorldPosition(new THREE.Vector3()).sub(upper.getWorldPosition(new THREE.Vector3())).normalize();
   if(after.y<-.72)posed++;
  }
  const rest={};
  for(const [name,bone] of Object.entries(nodes))if(bone)rest[name]=bone.rotation.clone();
  return {nodes,rest,count:all.length,armsDown:posed===2};
 }
 function proceduralWalk(record,delta,seconds,intensity){
  const p=Math.max(0,Math.min(1,Number(intensity)||0));
  const moving=p>.022,running=p>.59,cycle=moving?(3.3+5.6*p):1.2;
  record.phase+=Math.min(.06,delta)*cycle;
  const phase=record.phase,weight=Math.min(1,p*1.85),walk=moving?Math.sin(phase)*weight:0,sway=Math.sin(phase*.5);
  const {nodes,rest}=record.boneState;
  const rotate=(key,amount,axis='x')=>{const b=nodes[key];if(b)b.rotation[axis]=rest[key][axis]+amount};
  const stride=running?.61:.39;
  rotate('leftLeg',walk*stride);rotate('rightLeg',-walk*stride);
  rotate('leftKnee',moving?Math.max(0,walk)*.34:0);
  rotate('rightKnee',moving?Math.max(0,-walk)*.34:0);
  // GLB export is in T-pose. Fold arms down at rest and add opposite arm swing.
  // The calculated rest quaternion already points both arms down.
  rotate('leftArm',-walk*(running?.42:.27));
  rotate('rightArm',walk*(running?.42:.27));
  rotate('leftElbow',moving?Math.max(0,-walk)*.22:.07);
  rotate('rightElbow',moving?Math.max(0,walk)*.22:.07);
  rotate('spine',sway*(moving?.023:.010));
  record.container.position.y=moving?Math.abs(Math.sin(phase))*(running?.045:.019):Math.sin(phase)*.003;
  record.container.rotation.z=moving?Math.sin(phase)*.008:Math.sin(phase)*.002;
 }
 function takeModel(key,rig){
  const asset=assets.get(key);if(!asset)return null;
  // SkeletonUtils is essential: a raw scene.clone breaks skinned joint bindings.
  const imported=cloneSkeleton(asset.scene),root=new THREE.Group();
  root.name='MiloviceCC0_'+key;
  // CRITICAL: preserve glTF's authored scene scale/rotation/translation!
  // The model can be authored in centimetres with a parent scale of .01.
  // Previously .scale.setScalar(1.95/height) REPLACED that intrinsic scale,
  // multiplying the character to a giant after load. Normalise a WRAPPER.
  imported.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(imported,true),size=bounds.getSize(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<.01||size.y>2000)throw Error('Invalid original humanoid bounds '+key);
  const scalar=1.94/size.y;
  const scaled=new THREE.Group();
  scaled.name='MiloviceNormalisedHuman';
  scaled.scale.setScalar(scalar);
  scaled.position.set(-(bounds.min.x+bounds.max.x)*scalar*.5,-bounds.min.y*scalar,-(bounds.min.z+bounds.max.z)*scalar*.5);
  scaled.add(imported);root.add(scaled);
  root.updateMatrixWorld(true);
  const finalBox=new THREE.Box3().setFromObject(root,true),finalSize=finalBox.getSize(new THREE.Vector3());
  if(!Number.isFinite(finalSize.y)||finalSize.y<1.65||finalSize.y>2.20||
     finalBox.min.y<-.22||finalBox.min.y>.22)throw Error('Bad humanoid world height after normalization '+key+': '+JSON.stringify({
       originalHeight:size.y,glbScale:asset.scene.scale.toArray(),finalHeight:finalSize.y,feet:finalBox.min.y
     }));
  root.userData.heightMeters=finalSize.y;
  root.userData.originalGLBScale=asset.scene.scale.toArray();
  // Quaternius modular GLBs face model-local +Z, while Milovice pedestrian
  // heading (atan2(-dx,-dz)) and the legacy rig use model-local -Z.
  // Correct the imported MODEL, not the walking direction or joystick axes.
  // A 180-degree yaw here also fixes NPCs without reversing their AI paths.
  root.rotation.y=Math.PI;
  root.userData.forwardCorrectionRadians=Math.PI;
  root.position.y=0;
  root.visible=false;
  root.userData.miloviceCC0=true;
  root.userData.lodDetail=true;
  root.traverse(o=>{
   if(o.isMesh||o.isSkinnedMesh){o.castShadow=false;o.receiveShadow=false;o.frustumCulled=false}
  });
  rig.group.add(root);
  let mixer=null,idle=null,walk=null;
  if(asset.clips.length){
   mixer=new THREE.AnimationMixer(imported);
   const by=(pattern)=>asset.clips.find(c=>pattern.test(c.name));
   idle=by(/(?:^|[^a-z])idle(?:[^a-z]|$)|stand|breath/i)||asset.clips[0];
   walk=by(/walk|locomotion|run|jog/i)||idle;
  }
  const boneState=findBones(imported);
  if(!boneState.armsDown)throw Error('Human mesh shoulders remained in T-pose '+key);
  const record={root,mixer,clips:asset.clips.map(c=>c.name),idle,walk,action:null,phase:0,rig,key,container:root,boneState};
  attached.set(rig,record);
  return record;
 }
 function setVisible(record,visible,moving){
  if(!record)return;
  record.container.visible=visible;
  record.rig.group.userData.cc0Active=visible;
  record.rig.high.visible=!visible;
  record.rig.low.visible=false;
  if(!visible)return;
  if(record.mixer){
   const clip=moving?record.walk:record.idle;
   if(clip&&record.action?.getClip()!==clip){
    const next=record.mixer.clipAction(clip);
    next.enabled=true;next.reset().setEffectiveWeight(1).play();
    if(record.action&&record.action!==next)record.action.fadeOut(.18);
    record.action=next;
   }
  }
 }
 async function loadOne(key){
  if(status.has(key))return;
  status.set(key,'loading');state();
  try{
   const data=await loader.loadAsync(HUMAN_ASSETS[key].url);
   if(!data?.scene)throw Error('GLB without a scene');
   const box=new THREE.Box3().setFromObject(data.scene),h=box.max.y-box.min.y;
   if(!(h>.25&&h<200))throw Error('Unexpected character height '+h);
   const bones=[];data.scene.traverse(o=>{if(o.isBone)bones.push(o.name)});
   assets.set(key,{scene:data.scene,clips:data.animations||[],bones});
   status.set(key,'ready');
   if(key==='casualMan'&&!player){player=takeModel(key,playerRig);if(player)player.clips=(data.animations||[]).map(a=>a.name)}
  }catch(error){
   status.set(key,'fallback');
   console.warn('CC0 human GLB is unavailable; preserving original character',key,String(error));
  }
  state();
 }
 function load(){
  // The main avatar is prioritized; NPC variants do not block the core game.
  loadOne('casualMan').then(()=>loadOne('casualWoman')).then(()=>loadOne('suitMan'));
 }
 function configure(next){
  if(!['auto','on','off'].includes(next))return;
  mode=next;
  if(mode!=='off'&&status.size===0)load();
  if(mode==='off'){
   if(player)setVisible(player,false,false);
   for(const p of attached.values())if(p!==player)setVisible(p,false,false);
  }
  state();
 }
 function resetPeople(){
  for(const [rig,record] of attached){
   if(rig===playerRig)continue;
   if(record.action)record.action.stop();
   if(record.mixer)record.mixer.stopAllAction();
   record.root.parent?.remove(record.root);
   attached.delete(rig);
  }
  state();
 }
 function update(dt,t,playerIntensity,playerX,playerZ){
  const moving=Number(playerIntensity)>.02;
  if(!allowed()){if(player)setVisible(player,false,false);return}
  if(player){
   setVisible(player,true,moving);
   if(player.mixer)player.mixer.update(Math.min(dt,.05));
   else proceduralWalk(player,dt,t,playerIntensity);
  }
  if(t-lastRefresh>.45){
   lastRefresh=t;
   const nearest=people
    .filter(p=>p.g.visible&&Math.hypot(p.g.position.x-playerX,p.g.position.z-playerZ)<45)
    .map(p=>({p,dist:Math.hypot(p.g.position.x-playerX,p.g.position.z-playerZ)}))
    .sort((a,b)=>a.dist-b.dist).slice(0,maxNpc);
   const selected=new Set(nearest.map(x=>x.p.rig));
   for(const [rig,record] of attached)if(rig!==playerRig){
    setVisible(record,selected.has(rig),selected.has(rig));
   }
   for(const {p} of nearest){
    let record=attached.get(p.rig);
    if(!record && attached.size<maxNpc+1){
     const keys=['casualWoman','suitMan','casualMan'];
     const key=keys[p.phase%3|0];
     try{record=takeModel(assets.has(key)?key:'casualMan',p.rig)}catch(e){console.warn('NPC GLB fallback',String(e))}
    }
    if(record)setVisible(record,true,true);
   }
   state();
  }
  for(const [rig,record] of attached)if(rig!==playerRig&&record.container.visible){
   if(record.mixer)record.mixer.update(Math.min(dt,.05));
   else proceduralWalk(record,dt,t,.64);
  }
 }
 state();
 function playerFacingXZ(){
  if(!player)return null;
  const front=new THREE.Vector3(0,0,1);
  player.root.getWorldQuaternion(new THREE.Quaternion()); // ensure world matrices are fresh
  front.applyQuaternion(player.root.getWorldQuaternion(new THREE.Quaternion())).normalize();
  return {x:front.x,z:front.z};
 }
 return {load,configure,update,state,resetPeople,playerFacingXZ};
}
