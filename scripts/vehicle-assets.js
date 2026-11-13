// Milovice RP 5.1.1 — licensed external GLB pipeline.
// Three.js importmap must resolve "three" and "three/addons/" to the same revision.
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const LICENSED_VEHICLES={
  spectralGT:{
    name:'Spectral GT RS (nebrandované sportovní kupé)',
    uri:'https://raw.githubusercontent.com/JaronKBragg7337/spectral-gt-rs/34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rs_game_ready.glb',
    author:'JaronKBragg7337',license:'CC0-1.0',
    source:'https://github.com/JaronKBragg7337/spectral-gt-rs',
    copyright:'Public domain dedication: https://github.com/JaronKBragg7337/spectral-gt-rs/blob/main/LICENSE',
    forwardAxis:'+X',maxMetres:4.80
  }
};
const setDebug=(state)=>{if(typeof window!=='undefined')window.__miloviceGLBDebug={...state}};
export function makeVehicleAssetManager(THREE,{status=()=>{}}={}){
  const loader=new GLTFLoader();
  let state='idle',asset=null,mode='auto',current=null,lastUpdate=-1;
  const pending=new Map();
  const supportsHighQuality=()=>typeof window!=='undefined'
    &&window.matchMedia?.('(pointer:fine)').matches
    &&(typeof navigator.deviceMemory!=='number'||navigator.deviceMemory>=4);
  const enabled=()=>mode==='on'||mode==='auto'&&supportsHighQuality();
  const report=(msg)=>{status(msg);setDebug({state,mode,ready:!!asset,active:!!current,source:LICENSED_VEHICLES.spectralGT.source})};
  function normalize(root){
    // The original Blender car points +X; all Milovice road vehicles face -Z.
    root.rotation.set(0,Math.PI*.5,0);
    root.updateMatrixWorld(true);
    let box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());
    if(!Number.isFinite(size.z)||size.z<.1||size.z>300)throw Error('Invalid GLB car dimensions');
    root.scale.multiplyScalar(4.80/size.z);root.updateMatrixWorld(true);
    box=new THREE.Box3().setFromObject(root);
    const center=box.getCenter(new THREE.Vector3());
    // Zero is the road surface: real suspension geometry sets bottom of model.
    root.position.x-=center.x;root.position.z-=center.z;root.position.y-=box.min.y;
    root.updateMatrixWorld(true);
    return root;
  }
  function load(){
    if(pending.has('spectralGT'))return pending.get('spectralGT');
    state='loading';report('🚘 Načítám detailní CC0 model auta…');
    const promise=loader.loadAsync(LICENSED_VEHICLES.spectralGT.uri)
      .then(result=>{
        asset=normalize(result.scene);
        state='ready';report('🚘 Detailní 3D model připraven.');
        return asset;
      })
      .catch(err=>{
        state='fallback';asset=null;
        console.warn('Milovice licensed 3D model unavailable; procedural fallback used',err);
        report('🚘 GLB model se nenačetl, běží náhradní vozidla.');
        return null;
      });
    pending.set('spectralGT',promise);
    return promise;
  }
  function showFallback(car){
    if(!car)return;
    const high=car.g.userData.licensedGLB;
    if(high)car.g.remove(high);
    const fallback=car.g.userData.proceduralLOD;
    if(fallback)fallback.visible=true;
    car.g.userData.licensedGLB=null;
  }
  function configure(nextMode){
    if(!['auto','off','on'].includes(nextMode))return;
    mode=nextMode;
    if(!enabled())showFallback(current);
    if(enabled()&&!asset&&state==='idle')load();
    if(mode==='off')current=null;
    report(enabled()?'🚘 Detailní vozidla zapnutá.':'🚘 Úsporné modely vozidel.');
  }
  function update(cars,x,z,elapsed,playerCar=null){
    if(elapsed-lastUpdate<.8)return;
    lastUpdate=elapsed;
    if(!enabled()){if(current)showFallback(current);current=null;return}
    if(state==='idle')load();
    if(!asset)return;
    // One dense 263-object asset at a time: drawn only within 90m or while driving.
    let chosen=playerCar&&!playerCar.service?playerCar:null;
    if(!chosen){
      let bestDist=92;
      for(const car of cars){
        if(car.service||car.type===7||car.driven||car.g.visible===false)continue;
        const d=Math.hypot(car.g.position.x-x,car.g.position.z-z);
        if(d<bestDist){bestDist=d;chosen=car}
      }
    }
    if(chosen===current)return;
    if(current)showFallback(current);
    current=chosen;
    if(chosen){
      if(!chosen.g.userData.proceduralLOD){
        const fallback=new THREE.Group();
        for(const child of [...chosen.g.children])fallback.add(child);
        chosen.g.add(fallback);chosen.g.userData.proceduralLOD=fallback;
      }
      const model=asset;chosen.g.add(model);
      chosen.g.userData.licensedGLB=model;
      chosen.g.userData.proceduralLOD.visible=false;
    }
    report(chosen?'🚘 V okolí se vykresluje detailní CC0 sportovní auto.':'🚘 Detailní 3D auto mimo dohled.');
  }
  function getState(){return {state,mode,ready:!!asset,active:!!current,enabled:enabled()}}
  setDebug({state,mode,ready:false,active:false});
  return {configure,update,load,getState,LICENSED_VEHICLES};
}
