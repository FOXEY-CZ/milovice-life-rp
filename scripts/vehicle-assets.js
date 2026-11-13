// Milovice RP 5.1.1 — source-verified CC0 GLB vehicles, streamed by proximity.
// Requires the SAME Three.js module revision in the page importmap and GLTFLoader.
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const LICENSED_VEHICLES={
 spectralGT:{
  name:'Spectral GT RS · sportovní kupé (nebrandované)',
  uri:'https://raw.githubusercontent.com/JaronKBragg7337/spectral-gt-rs/34499c501908818a2b08e589a7aecf963343cee7/spectral_gt_rs_game_ready.glb',
  source:'https://github.com/JaronKBragg7337/spectral-gt-rs',
  license:'CC0-1.0',author:'JaronKBragg7337',frontAxis:'+X',length:4.80,
  fileBytes:4688844
 },
 citySUV:{
  name:'SUV · Quaternius Realistic Car Pack',
  uri:'https://raw.githubusercontent.com/bennibeni/garage/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/quaternius-suv.glb',
  source:'https://quaternius.itch.io/lowpoly-cars',
  license:'CC0-1.0',author:'Quaternius',frontAxis:'+Z',length:4.70,
  fileBytes:181608
 },
 cityCar:{
  name:'Osobní vůz · Quaternius CC0',
  uri:'https://raw.githubusercontent.com/bennibeni/garage/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/quaternius-car.glb',
  source:'https://poly.pizza/m/unqqkULtRU',
  license:'CC0-1.0',author:'Quaternius',frontAxis:'+Z',length:4.36,
  fileBytes:174320
 },
 citySport:{
  name:'Sportovní vůz · Quaternius CC0',
  uri:'https://raw.githubusercontent.com/bennibeni/garage/5c26fd4bac37080cd55f8064c59de4b14b489ddd/public/models/quaternius-sport.glb',
  source:'https://poly.pizza/bundle/Cars-Bundle-FE5IWe6OMk',
  license:'CC0-1.0',author:'Quaternius',frontAxis:'+Z',length:4.43,
  fileBytes:175100
 }
};

export function makeVehicleAssetManager(THREE,{status=()=>{}}={}){
 const loader=new GLTFLoader();
 const scenes=new Map(),states=new Map(),pending=new Map();
 let mode='auto',current=null,lastUpdate=-1,activeKey=null;
 const pc=()=>typeof window!=='undefined'&&window.matchMedia?.('(pointer:fine)').matches
   &&(typeof navigator.deviceMemory!=='number'||navigator.deviceMemory>=4);
 const enabled=()=>mode==='on'||mode==='auto'; // auto: one low-memory GLB on mobile, one high-detail GLB on PC
 const publish=(message='')=>{
  if(message)status(message);
  const asset=activeKey||'spectralGT';
  if(typeof window!=='undefined')window.__miloviceGLBDebug={
   state:states.get(asset)||'idle',mode,ready:scenes.has(asset),active:!!current,
   activeModel:asset,loaded:[...scenes.keys()],source:LICENSED_VEHICLES[asset].source,
   models:Object.fromEntries(states),
   orientation:Object.fromEntries([...scenes].map(([key,model])=>[key,{
    frontAxis:model.userData.miloviceFrontAxis,
    correctionRadians:model.userData.miloviceFrontCorrection,
    expectedForward:'-Z'
   }]))
  };
 };
 function normalize(scene,spec){
  scene.updateMatrixWorld(true);
  const bbox=new THREE.Box3().setFromObject(scene),initial=bbox.getSize(new THREE.Vector3());
  if(Math.min(initial.x,initial.y,initial.z)<.002||Math.max(initial.x,initial.y,initial.z)>500)
   throw Error('Unexpected GLB bounds for '+spec.name);
  // All driving and camera code uses -Z as forward. glTF authored vehicle
  // front is +Z, so Quaternius cars need a 180-degree visual correction.
  // Spectral GT is explicitly authored +X and retains its 90-degree correction.
  // Rotate the imported mesh only; NEVER reverse steering, road AI or the camera.
  const rotations={'+X':Math.PI*.5,'+Z':Math.PI,'-X':-Math.PI*.5,'-Z':0};
  const axis=spec.frontAxis==='AUTO'?(initial.x>initial.z?'+X':'-Z'):spec.frontAxis;
  if(!(axis in rotations))throw Error('Unknown model front axis: '+axis);
  const modelYawCorrection=rotations[axis];
  if(modelYawCorrection)scene.rotateY(modelYawCorrection); // preserve authored transform
  scene.userData.miloviceFrontAxis=axis;
  scene.userData.miloviceFrontCorrection=modelYawCorrection;
  scene.updateMatrixWorld(true);
  const rotatedBox=new THREE.Box3().setFromObject(scene),length=rotatedBox.getSize(new THREE.Vector3()).z;
  if(!Number.isFinite(length)||length<.15)throw Error('No GLB road length');
  scene.scale.multiplyScalar(spec.length/length);
  scene.updateMatrixWorld(true);
  const groundedBox=new THREE.Box3().setFromObject(scene),center=groundedBox.getCenter(new THREE.Vector3());
  scene.position.x-=center.x;scene.position.z-=center.z;scene.position.y-=groundedBox.min.y;
  scene.updateMatrixWorld(true);
  scene.traverse(o=>{
   if(o.isMesh){o.castShadow=false;o.receiveShadow=true}
  });
  return scene;
 }
 function load(key){
  if(scenes.has(key))return Promise.resolve(scenes.get(key));
  if(pending.has(key))return pending.get(key);
  const spec=LICENSED_VEHICLES[key];if(!spec)return Promise.resolve(null);
  states.set(key,'loading');activeKey=key;publish('🚘 Načítám '+spec.name+' (CC0)…');
  const task=loader.loadAsync(spec.uri)
   .then(result=>{
    const scene=normalize(result.scene,spec);
    scenes.set(key,scene);states.set(key,'ready');
    activeKey=key;publish('🚘 Detailní '+spec.name+' připraveno.');
    return scene;
   })
   .catch(error=>{
    console.warn('Could not load licensed GLB, using procedural vehicles',key,error);
    states.set(key,'fallback');activeKey=key;
    publish('🚘 Externí GLB není dostupné, používám záložní auto.');
    return null;
   });
  pending.set(key,task);
  return task;
 }
 function showFallback(car){
  if(!car)return;
  const glb=car.g.userData.licensedGLB;
  if(glb)car.g.remove(glb);
  if(car.g.userData.proceduralLOD)car.g.userData.proceduralLOD.visible=true;
  car.g.userData.licensedGLB=null;
 }
 function configure(next){
  if(!['auto','on','off'].includes(next))return;
  mode=next;if(!enabled()){showFallback(current);current=null}
  if(enabled()&&!states.has(pc()?'spectralGT':'cityCar'))load(pc()?'spectralGT':'cityCar');
  publish(enabled()?'🚘 Skutečné GLB modely aktivní poblíž hráče.':'🚘 Úsporná procedurální auta.');
 }
 function update(cars,x,z,t,playerCar=null){
  if(t-lastUpdate<.75)return;
  lastUpdate=t;
  if(!enabled()){if(current)showFallback(current);current=null;publish();return}
  let chosen=playerCar&&!playerCar.service?playerCar:null;
  if(!chosen){
   let min=85;
   for(const car of cars){
    if(car.service||car.type===7||car.driven||car.g.visible===false)continue;
    const d=Math.hypot(car.g.position.x-x,car.g.position.z-z);
    if(d<min){min=d;chosen=car}
   }
  }
  // One textured GLB near the camera: small licensed models on touch devices,
  // higher-detail sports coupe only on PCs or if manually forced.
  const key=chosen&&(chosen.type===2||chosen.type===5)?'citySUV'
   :mode==='on'||pc()?'spectralGT'
   :chosen?.type===3||chosen?.type===4?'citySport':'cityCar';
  activeKey=key;
  if(chosen&&!states.has(key))load(key);
  const loaded=scenes.get(key);
  if(current===chosen&&chosen?.g.userData.licensedGLB===loaded){publish();return}
  if(current)showFallback(current);current=null;
  // One detailed near-field model maximum: low draw-call meshes render everywhere else.
  if(!chosen||!loaded){publish();return}
  if(!chosen.g.userData.proceduralLOD){
   const fallback=new THREE.Group();
   for(const child of [...chosen.g.children])fallback.add(child);
   chosen.g.add(fallback);chosen.g.userData.proceduralLOD=fallback;
  }
  chosen.g.add(loaded);
  chosen.g.userData.licensedGLB=loaded;
  chosen.g.userData.proceduralLOD.visible=false;
  current=chosen;activeKey=key;publish();
 }
 function getState(){return {mode,enabled:enabled(),states:Object.fromEntries(states),active:!!current}}
 publish();
 return {configure,update,load,getState};
}
