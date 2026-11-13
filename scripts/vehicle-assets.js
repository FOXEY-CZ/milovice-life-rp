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

// 5.4.0 - mixed nearby models with a strict mobile GPU budget.
// Crucially, multiple GLB cars require independent scene instances; a Three
// Object3D cannot have two parents at once. Preserve car identity across exit.
export function makeVehicleAssetManager(THREE,{status=()=>{}}={}){
 const loader=new GLTFLoader();
 const scenes=new Map(),states=new Map(),pending=new Map(),active=new Map();
 let mode='auto',lastUpdate=-1,activeKey='cityCar';
 const pc=()=>typeof window!=='undefined'&&window.matchMedia?.('(pointer:fine)').matches
   &&(typeof navigator.deviceMemory!=='number'||navigator.deviceMemory>=4);
 const enabled=()=>mode!=='off';
 const budget=()=>pc()?5:3;
 const modelFor=(car)=>{
  if(car.type===6||car.type===8)return null; // distinct custom van / emergency silhouette stays procedural
  if(car.type===2||car.type===5)return 'citySUV';
  if(car.type===3||car.type===4)return 'citySport';
  return (pc()||mode==='on')?'spectralGT':'cityCar';
 };
 function publish(message=''){
  if(message)status(message);
  const asset=activeKey||'cityCar';
  if(typeof window!=='undefined')window.__miloviceGLBDebug={
   state:states.get(asset)||'idle',mode,ready:scenes.has(asset),active:active.size>0,
   activeCount:active.size,maxActive:budget(),activeModel:asset,
   loaded:[...scenes.keys()],source:LICENSED_VEHICLES[asset]?.source,
   models:Object.fromEntries(states),
   assignments:[...active].map(([car,inst])=>({id:car.id,type:car.type,key:inst.key,
    wheels:inst.wheels.length,overlay:!!car.g.userData.wheelOverlay?.visible,parked:car.parked,driven:car.driven})),
   orientation:Object.fromEntries([...scenes].map(([key,model])=>[key,{
    frontAxis:model.userData.miloviceFrontAxis,correctionRadians:model.userData.miloviceFrontCorrection
   }]))
  };
 }
 function normalize(scene,spec){
  scene.updateMatrixWorld(true);
  const bbox=new THREE.Box3().setFromObject(scene),initial=bbox.getSize(new THREE.Vector3());
  if(Math.min(initial.x,initial.y,initial.z)<.002||Math.max(initial.x,initial.y,initial.z)>500)
   throw Error('Unexpected GLB bounds for '+spec.name);
  // Our car simulation and camera use -Z forward. All Quaternius cars face +Z.
  const rotations={'+X':Math.PI*.5,'+Z':Math.PI,'-X':-Math.PI*.5,'-Z':0};
  const axis=spec.frontAxis==='AUTO'?(initial.x>initial.z?'+X':'-Z'):spec.frontAxis;
  if(!(axis in rotations))throw Error('Unknown model front axis: '+axis);
  const correction=rotations[axis];
  if(correction)scene.rotateY(correction);
  scene.userData.miloviceFrontAxis=axis;
  scene.userData.miloviceFrontCorrection=correction;
  scene.updateMatrixWorld(true);
  const rotatedBox=new THREE.Box3().setFromObject(scene),length=rotatedBox.getSize(new THREE.Vector3()).z;
  if(!Number.isFinite(length)||length<.15)throw Error('No GLB road length');
  // Preserve source scale just as with our humanoid GLB normalisation.
  scene.scale.multiplyScalar(spec.length/length);
  scene.updateMatrixWorld(true);
  const groundedBox=new THREE.Box3().setFromObject(scene),center=groundedBox.getCenter(new THREE.Vector3());
  scene.position.x-=center.x;scene.position.z-=center.z;scene.position.y-=groundedBox.min.y;
  scene.updateMatrixWorld(true);
  scene.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true}});
  return scene;
 }
 function load(key){
  if(scenes.has(key))return Promise.resolve(scenes.get(key));
  if(pending.has(key))return pending.get(key);
  const spec=LICENSED_VEHICLES[key];if(!spec)return Promise.resolve(null);
  states.set(key,'loading');activeKey=key;publish('🚘 Načítám '+spec.name+' (CC0)…');
  const task=loader.loadAsync(spec.uri).then(result=>{
   const scene=normalize(result.scene,spec);
   scenes.set(key,scene);states.set(key,'ready');activeKey=key;lastUpdate=-1; // force next frame to attach freshly loaded mesh
   publish('🚘 Model '+spec.name+' je připraven.');
   return scene;
  }).catch(err=>{
   console.warn('Licensed car unavailable, retaining procedural car',key,String(err));
   states.set(key,'fallback');activeKey=key;publish('🚘 Model nedostupný, původní auto zůstává.');
   return null;
  });
  pending.set(key,task);return task;
 }
 function detach(car){
  const instance=active.get(car);if(!instance)return;
  car.g.remove(instance.group);
  const fallback=car.g.userData.proceduralLOD;
  if(fallback)fallback.visible=true;
  if(car.g.userData.wheelOverlay)car.g.userData.wheelOverlay.visible=true;
  car.g.userData.licensedGLB=null;active.delete(car);
 }
 function detachAll(){for(const car of [...active.keys()])detach(car)}
 function install(car,key){
  const original=scenes.get(key);if(!original)return false;
  const previous=active.get(car);
  if(previous?.key===key)return true;
  if(previous)detach(car);
  // Once-only wrapper for the original vehicle; preserves its wheel pivots.
  if(!car.g.userData.proceduralLOD){
   const fallback=new THREE.Group();
   fallback.name='ProceduralVehicleFallback';
   for(const child of [...car.g.children])fallback.add(child);
   car.g.add(fallback);car.g.userData.proceduralLOD=fallback;
  }
  const model=original.clone(true);
  model.name='Licensed3D_'+key;
  const wheels=[];
  model.traverse(o=>{
   if(!o.name||!/(?:wheel|tyre|tire|rim)/i.test(o.name))return;
   // Only independently pivotable wheel nodes; never rotate an entire car shell.
   if(o.isGroup||o.isMesh&&o.position.lengthSq()>.03)wheels.push(o);
  });
  car.g.add(model);
  car.g.userData.licensedGLB=model;
  car.g.userData.proceduralLOD.visible=false;
  // Some CC0 mobile GLBs merge all wheel geometry into the body mesh. Retain the
  // original animated wheels as a minimal overlay in that case, rather than
  // leaving the visible car with permanently static wheels.
  if(wheels.length<4&&car.wheels?.length>=4&&!car.g.userData.wheelOverlay){
   const overlay=new THREE.Group();overlay.name='AnimatedWheelFallback';
   for(const wheel of car.wheels)overlay.add(wheel);
   car.g.add(overlay);car.g.userData.wheelOverlay=overlay;
  }
  if(car.g.userData.wheelOverlay)car.g.userData.wheelOverlay.visible=wheels.length<4;
  active.set(car,{group:model,key,wheels});
  return true;
 }
 function configure(next){
  if(!['auto','on','off'].includes(next))return;
  mode=next;
  if(!enabled())detachAll();
  if(enabled()&&!states.has(pc()?'spectralGT':'cityCar'))load(pc()?'spectralGT':'cityCar');
  publish(enabled()?'🚘 Rozmanitá detailní auta aktivní v okolí hráče.':'🚘 Úsporné procedurální modely.');
 }
 function update(cars,x,z,t,playerCar=null){
  if(t-lastUpdate<.65)return;
  lastUpdate=t;
  if(!enabled()){detachAll();publish();return}
  const nearby=cars.filter(c=>!c.service&&c.type!==7&&c.g.visible!==false)
   .filter(c=>modelFor(c)!==null)
   .map(c=>({car:c,dist:Math.hypot(c.g.position.x-x,c.g.position.z-z)}))
   .filter(item=>item.dist<100||item.car===playerCar)
   .sort((a,b)=>(a.car===playerCar?-10000:a.dist)-(b.car===playerCar?-10000:b.dist))
   .slice(0,budget());
  const wanted=new Set(nearby.map(o=>o.car));
  for(const car of [...active.keys()])if(!wanted.has(car))detach(car);
  for(const {car} of nearby){
   const key=modelFor(car);activeKey=car===playerCar?key:activeKey;
   if(!scenes.has(key)){if(!states.has(key))load(key);continue}
   install(car,key);
  }
  // Test harness and HUD keep a live current model indicator.
  if(playerCar)activeKey=modelFor(playerCar);
  else if(nearby.length)activeKey=modelFor(nearby[0].car);
  publish();
 }
 function spin(car,distance){
  if(!distance||!Number.isFinite(distance))return;
  const item=active.get(car);if(!item)return;
  for(const wheel of item.wheels)wheel.rotation.x-=distance/.38;
 }
 function reset(){
  detachAll();lastUpdate=-1;publish();
 }
 function getState(){return {mode,enabled:enabled(),states:Object.fromEntries(states),activeCount:active.size}}
 publish();
 return {configure,update,load,getState,spin,reset};
}
