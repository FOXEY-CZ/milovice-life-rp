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
   clips:player?.clips||[],license:'CC0-1.0',fallback:!player
  };
  if(typeof window!=='undefined')window.__miloviceHumans=ret;
  return ret;
 };
 function allowed(){return mode!=='off'}
 function takeModel(key,rig){
  const asset=assets.get(key);if(!asset)return null;
  // SkeletonUtils is essential: a raw scene.clone breaks skinned joint bindings.
  const imported=cloneSkeleton(asset.scene),root=new THREE.Group();
  root.name='MiloviceCC0_'+key;
  imported.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(imported),size=bounds.getSize(new THREE.Vector3());
  if(size.y<.25||size.y>200)throw Error('Invalid humanoid bounding box '+key);
  const scalar=1.95/size.y;
  imported.scale.setScalar(scalar);
  imported.position.set(-(bounds.min.x+bounds.max.x)*scalar*.5,-bounds.min.y*scalar,-(bounds.min.z+bounds.max.z)*scalar*.5);
  root.add(imported);
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
  const record={root,mixer,clips:asset.clips.map(c=>c.name),idle,walk,action:null,phase:0,rig,key,container:root};
  attached.set(rig,record);
  return record;
 }
 function setVisible(record,visible,moving){
  if(!record)return;
  record.container.visible=visible;
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
   assets.set(key,{scene:data.scene,clips:data.animations||[]});
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
 function update(dt,t,moving,playerX,playerZ){
  if(!allowed()){if(player)setVisible(player,false,false);return}
  if(player){
   setVisible(player,true,moving);
   if(player.mixer)player.mixer.update(Math.min(dt,.05));
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
  for(const [rig,record] of attached)if(rig!==playerRig&&record.container.visible&&record.mixer)
   record.mixer.update(Math.min(dt,.05));
 }
 state();
 return {load,configure,update,state};
}
