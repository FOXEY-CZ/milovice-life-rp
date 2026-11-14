// Milovice RP 5.51 — OSM school ground (118634917) + player supplied
// 2022-05-17 street photos. The site boundary is mapped, BUT fence posts
// and vegetation positions are photographic approximations, not surveyed.
const project=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const segmentDistance=(p,a,b)=>{
 const dx=b.x-a.x,dz=b.z-a.z,d=dx*dx+dz*dz;
 const t=d>1e-7?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/d)):0;
 return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);
};
const pathDistance=(p,path)=>Math.min(...path.slice(1).map((v,i)=>segmentDistance(p,path[i],v)));
const edgeDistance=(p,poly)=>Math.min(...poly.map((v,i)=>segmentDistance(p,v,poly[(i+1)%poly.length])));
function inside(p,shape){
 let v=false;
 for(let i=0,j=shape.length-1;i<shape.length;j=i++){
  const a=shape[i],b=shape[j];
  if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)v=!v;
 }return v;
}
function polygon(way){
 const result=way?.geometry?.map(project);
 if(!result||result.length<4)return null;
 if(dist(result[0],result.at(-1))<.05)result.pop();
 return result;
}
export function planSchoolGrounds(elements,{roadClearance}={}){
 if(!Array.isArray(elements)||typeof roadClearance?.isClear!=='function')return null;
 const site=elements.find(e=>e.id===118634917),
  building=elements.find(e=>e.id===118487979),
  access=elements.find(e=>e.id===118634914);
 if(site?.tags?.amenity!=='school'||building?.tags?.building!=='school'||
  access?.tags?.highway!=='service')return null;
 const boundary=polygon(site),house=polygon(building),lane=access.geometry.map(project);
 if(boundary?.length!==19||house?.length!==22||lane.length<2)return null;
 const winding=Math.sign(boundary.reduce((n,p,i)=>{
  const q=boundary[(i+1)%boundary.length];return n+p.x*q.z-q.x*p.z;
 },0));
 if(!winding)return null;
 const at=(edge,t,depth)=>{
  const a=boundary[edge],b=boundary[(edge+1)%boundary.length];
  const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
  return {x:a.x+dx*t-winding*dz/len*depth,
   z:a.z+dz*t+winding*dx/len*depth};
 };
 const fence=[],rejected={gate:0,road:0,outside:0};
 let metres=0;
 // ONLY photo-observed street boundary; not fictional fencing elsewhere.
 for(const edge of [16,17,18]){
  const count=Math.ceil(dist(boundary[edge],boundary[(edge+1)%boundary.length])/1.45);
  for(let i=0;i<count;i++){
   const a=at(edge,i/count,.62),b=at(edge,(i+1)/count,.62);
   const m=at(edge,(i+.5)/count,.62),samples=[a,m,b];
   if(samples.some(p=>!inside(p,boundary))){rejected.outside++;continue}
   if(samples.some(p=>pathDistance(p,lane)<2.8)){rejected.gate++;continue}
   if(samples.some(p=>!roadClearance.isClear(p.x,p.z,.18,.16))){
    rejected.road++;continue;
   }
   const length=dist(a,b);metres+=length;fence.push({a,b,length,edge});
  }
 }
 const plants=[];
 for(const [kind,t,depth,height] of [
  ['deciduous',.22,10.5,5.8],['deciduous',.65,11,5.1],
  ['conifer',.43,15.5,6.4],['stone',.55,5.5,1.2]
 ]){
  const p=at(16,t,depth),radius=kind==='stone'?1:2.5;
  if(inside(p,boundary)&&!inside(p,house)&&
   edgeDistance(p,boundary)>radius+1&&
   edgeDistance(p,house)>radius+4&&
   pathDistance(p,lane)>radius+1.5&&
   roadClearance.isClear(p.x,p.z,radius,.7))
   plants.push({...p,kind,height,positionSurveyed:false});
 }
 return {osmId:118634917,fence,metres,plants,rejected,
  mappedAccessOpen:true,mappedBoundary:true,positionSurveyed:false,
  evidence:'User-supplied 2022-05-17 school frontage panorama'};
}
export function makeSchoolGrounds(THREE,{layer,terrainAt,roadClearance,collisionWorld}={}){
 let created=false;
 const box=new THREE.BoxGeometry(1,1,1);
 const mat=hex=>new THREE.MeshLambertMaterial({color:hex});
 const palette={concrete:mat(0xa49f97),teal:mat(0x39777d),
  bark:mat(0x685042),leaf:mat(0x56764b),
  fir:mat(0x335c43),rock:mat(0x929086)};
 function batch(items,geometry,material,name){
  if(!items.length)return 0;
  const mesh=new THREE.InstancedMesh(geometry,material,items.length);
  mesh.name=name;mesh.receiveShadow=true;
  const o=new THREE.Object3D();
  items.forEach((p,i)=>{
   o.position.set(p.x,p.y,p.z);o.rotation.set(0,p.yaw||0,0);
   o.scale.set(p.sx,p.sy,p.sz);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
  mesh.userData.lodX=-178;mesh.userData.lodZ=-295;mesh.userData.lodDetail=true;
  layer.add(mesh);return 1;
 }
 function create(elements){
  if(created)return 0;
  const plan=planSchoolGrounds(elements,{roadClearance});
  if(!plan)return 0;
  const concrete=[],iron=[],trunks=[],crowns=[],conifer=[],stones=[];
  let collisionWalls=0;
  for(const part of plan.fence){
   const {a,b,length}=part,dx=b.x-a.x,dz=b.z-a.z;
   const x=(a.x+b.x)/2,z=(a.z+b.z)/2,ground=terrainAt(x,z);
   const yaw=Math.atan2(-dz,dx);
   concrete.push({x,y:ground+.26,z,sx:length,sy:.52,sz:.22,yaw});
   for(const y of [.70,1.62])
    iron.push({x,y:ground+y,z,sx:length,sy:.055,sz:.052,yaw});
   for(let j=1;j<=6;j++){
    const t=j/7,px=a.x+dx*t,pz=a.z+dz*t;
    iron.push({x:px,y:terrainAt(px,pz)+1.09,z:pz,
     sx:.035,sy:1.07,sz:.035});
   }
   iron.push({x:a.x,y:terrainAt(a.x,a.z)+1.12,z:a.z,
    sx:.075,sy:1.35,sz:.075});
   if(collisionWorld?.addWall(a,b,.22,{id:'school-fence'}))collisionWalls++;
  }
  for(const p of plan.plants){
   const y=terrainAt(p.x,p.z);
   if(p.kind==='stone'){
    stones.push({x:p.x,y:y+.5,z:p.z,sx:1.6,sy:.9,sz:1.2,yaw:.34});
   }else if(p.kind==='conifer'){
    trunks.push({x:p.x,y:y+1,z:p.z,sx:.48,sy:2,sz:.48});
    conifer.push({x:p.x,y:y+p.height*.63,z:p.z,
     sx:1.15,sy:p.height*.75,sz:1.15});
   }else{
    trunks.push({x:p.x,y:y+1.5,z:p.z,sx:.9,sy:3,sz:.9});
    crowns.push({x:p.x,y:y+p.height-.95,z:p.z,
     sx:2.05,sy:1.55,sz:1.95});
   }
  }
  const drawCalls=[
   batch(concrete,box,palette.concrete,'School_concrete_fence'),
   batch(iron,box,palette.teal,'School_green_railings'),
   batch(trunks,new THREE.CylinderGeometry(.22,.28,1,7),palette.bark,'School_trees'),
   batch(crowns,new THREE.IcosahedronGeometry(1,1),palette.leaf,'School_canopies'),
   batch(conifer,new THREE.ConeGeometry(1,1,8),palette.fir,'School_cypress'),
   batch(stones,new THREE.DodecahedronGeometry(1),palette.rock,'School_rock')
  ].reduce((s,n)=>s+n,0);
  window.__miloviceSchoolGrounds={
   version:'5.51',osmId:plan.osmId,fencePanels:plan.fence.length,
   fenceMetres:+plan.metres.toFixed(2),collisionWalls,
   trees:plan.plants.filter(x=>x.kind!=='stone').length,
   stones:plan.plants.filter(x=>x.kind==='stone').length,
   drawCalls,rejected:plan.rejected,
   mappedAccessOpen:plan.mappedAccessOpen,
   positionSurveyed:plan.positionSurveyed,
   roadPavingInvented:0,evidence:plan.evidence
  };
  created=true;return 1;
 }
 return {create};
}
