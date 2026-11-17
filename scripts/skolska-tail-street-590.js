// Milovice RP 5.90: southeastern Školská streetscape.
// Exact OSM roads and houses; plausible residential greens with no claim
// of photographer-verified individual plant or private parcel boundaries.
// AREA-ONLY school photo context, not plant-level evidence, ŠJů 2024, CC BY 4.0:
// https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg
// https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg
import {isRoadFreeRect} from './road-clearance.js';
import {isBuildingFreeRect} from './street-pionyru-photo-2023.js';

export const SKOLSKA_TAIL_GREEN_590=Object.freeze({
 roadIds:['1331897645'],
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_Z%C5%A0_T._G._Masaryka_(01).jpg',
 photoDate:'2024-05-30',photoAuthor:'ŠJů',license:'CC BY 4.0',
 photoSupportsParticularPlant:false,plantPositionsSurveyed:false,
 photoVerifiesPrivateBoundaries:false,streetName:'Školská – jihovýchod'
});
const C=Math.cos(50.226*Math.PI/180);
const project=p=>({x:(p.lon-14.889)*111320*C,z:-(p.lat-50.226)*111320});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function sample(path,metres){
 let offset=metres;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],L=dist(a,b);
  if(L<.05)continue;
  if(offset<=L){
   const ux=(b.x-a.x)/L,uz=(b.z-a.z)/L;
   return {x:a.x+ux*offset,z:a.z+uz*offset,ux,uz};
  }
  offset-=L;
 }
 return null;
}
export function planSkolskaTailGreen590(elements,{roadClearance=null}={}){
 if(!Array.isArray(elements)||typeof roadClearance?.isClear!=='function')return null;
 const route=[];
 for(const id of SKOLSKA_TAIL_GREEN_590.roadIds){
  const way=elements.find(e=>String(e.id)===id&&e.tags?.name==='Školská'&&
   Array.isArray(e.geometry)&&e.geometry.length>=2);
  if(!way)return null;
  const coords=way.geometry[0].lon<=way.geometry.at(-1).lon?
   way.geometry:way.geometry.slice().reverse();
  const pts=coords.map(project);
  if(route.length&&dist(route.at(-1),pts[0])>1)return null;
  route.push(...pts.slice(route.length?1:0));
 }
 const polygons=elements.filter(e=>e.tags?.building&&
  Array.isArray(e.geometry)&&e.geometry.length>=4)
  .map(e=>e.geometry.map(project));
 const hedges=[],trees=[],rejected=[];
 // Distances and offsets are aesthetically estimated from OSM street scale,
 // never equated with observed individual photographs or cadastral limits.
 for(const along of [12,26,40,55,70,84,100,115,130,150]){
  const p=sample(route,along);if(!p)continue;
  const side=along%2===0?1:-1;
  for(const sideSign of [side,-side]){
   const offset=sideSign*(9.2+(along%3)*.8);
   const x=p.x-p.uz*offset,z=p.z+p.ux*offset;
   const yaw=Math.atan2(-p.uz,p.ux);
   const rect={x,z,length:2.5,depth:.62,yaw,buffer:.18,step:.35};
   if(!isRoadFreeRect(roadClearance,rect)){rejected.push({along,reason:'road'});continue}
   if(!isBuildingFreeRect(rect,polygons,.44)){rejected.push({along,reason:'building'});continue}
   hedges.push({x,z,yaw,length:2.5,depth:.62,height:.62,
    along,placementSurveyed:false});
   break;
  }
 }
 for(const along of [17,35,52,69,88,107,124,144,161]){
  const p=sample(route,along);if(!p)continue;
  if(trees.length>=4)break;
  let placed=false;
  for(const away of [11,13.5,16,19,22]){
   for(const sideSign of [1,-1]){
    const offset=sideSign*away;
    const x=p.x-p.uz*offset,z=p.z+p.ux*offset;
    const rect={x,z,length:1.85,depth:1.85,buffer:.5,step:.4,yaw:0};
    if(trees.some(t=>Math.hypot(t.x-x,t.z-z)<7)||
       hedges.some(h=>Math.hypot(h.x-x,h.z-z)<3))continue;
    if(!isRoadFreeRect(roadClearance,rect)||
       !isBuildingFreeRect(rect,polygons,.9))continue;
    trees.push({x,z,height:4.9+along%3,crown:1.65+along%2*.25,along,
     placementSurveyed:false});
    placed=true;break;
   }
   if(placed)break;
  }
 }
 return {
  roadIds:[...SKOLSKA_TAIL_GREEN_590.roadIds],source:SKOLSKA_TAIL_GREEN_590.source,
  hedges,trees,rejected,estimatedPlanting:true,photoVerifiedPlantCount:0,
  plantedObjects:hedges.length+trees.length,
  roadGeometryChanges:0,sidewalkChanges:0,newDriveways:0,
  parcelBoundariesClaimed:0,knownCameraHeadingRequired:false
 };
}
export function makeSkolskaTailGreen590(THREE,{
 layer,terrainAt=()=>0,roadClearance
}={}){
 const box=new THREE.BoxGeometry(1,1,1);
 const wood=new THREE.CylinderGeometry(.12,.17,1,6);
 const canopy=new THREE.IcosahedronGeometry(1,1);
 const hedgeMat=new THREE.MeshLambertMaterial({color:0x426c42});
 const borderMat=new THREE.MeshLambertMaterial({color:0x99968a});
 const trunkMat=new THREE.MeshLambertMaterial({color:0x72563c});
 const crownMat=new THREE.MeshLambertMaterial({color:0x4b7542});
 let root=null,plan=null;
 function status(){return {
  rendered:!!root,hedges:plan?.hedges.length||0,trees:plan?.trees.length||0,
  rejected:plan?.rejected.length||0,drawMeshes:root?.children.length||0,
  source:SKOLSKA_TAIL_GREEN_590.source,positionsEstimated:true,
  changedRoads:0,changedSidewalks:0,guessedPrivateEntrances:0
 }}
 function reset(){
  root?.parent?.remove(root);root=null;plan=null;
  if(typeof window!=='undefined')window.__miloviceSkolskaTailGreen590=status();
 }
 function batch(geometry,material,instances){
  if(!instances.length)return;
  const mesh=new THREE.InstancedMesh(geometry,material,instances.length);
  const obj=new THREE.Object3D();
  instances.forEach((p,i)=>{
   obj.position.set(p.x,p.y,p.z);obj.rotation.y=p.yaw||0;
   obj.scale.set(p.w,p.h,p.d);obj.updateMatrix();
   mesh.setMatrixAt(i,obj.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
  root.add(mesh);
 }
 function create(elements){
  const next=planSkolskaTailGreen590(elements,{roadClearance});
  if(!next)return null;
  reset();plan=next;
  root=new THREE.Group();
  root.name='Milovice_SkolskaTail_590_inferred_green_street';
  const plants=[],plinths=[],trunks=[],crowns=[];
  for(const h of plan.hedges){
   const ground=terrainAt(h.x,h.z);
   plants.push({x:h.x,y:ground+.17+h.height*.5,z:h.z,
    w:h.length,h:h.height,d:h.depth,yaw:h.yaw});
   plinths.push({x:h.x,y:ground+.09,z:h.z,
    w:h.length,h:.18,d:h.depth+.10,yaw:h.yaw});
  }
  for(const t of plan.trees){
   const ground=terrainAt(t.x,t.z);
   trunks.push({x:t.x,y:ground+t.height*.34,z:t.z,
    w:1,h:t.height*.68,d:1});
   crowns.push({x:t.x,y:ground+t.height*.82,z:t.z,
    w:t.crown,h:t.crown,d:t.crown});
  }
  batch(box,borderMat,plinths);batch(box,hedgeMat,plants);
  batch(wood,trunkMat,trunks);batch(canopy,crownMat,crowns);
  root.userData.lodX=plan.hedges[0]?.x??plan.trees[0]?.x??0;
  root.userData.lodZ=plan.hedges[0]?.z??plan.trees[0]?.z??0;
  root.userData.artisticInferred=true;root.userData.plantLocationsSurveyed=false;
  layer?.add(root);
  if(typeof window!=='undefined')window.__miloviceSkolskaTailGreen590=status();
  return plan;
 }
 reset();
 return {create,reset,status};
}
