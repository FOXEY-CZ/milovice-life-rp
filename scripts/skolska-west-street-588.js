// Milovice RP 5.88: western Školská streetscape.
// Exact OSM roads and houses; plausible residential greens with no claim
// of photographer-verified individual plant or private parcel boundaries.
// Public references from ŠJů, 2024-05-30, CC BY 4.0:
// https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg
// https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna.jpg
import {isRoadFreeRect} from './road-clearance.js';
import {isBuildingFreeRect} from './street-pionyru-photo-2023.js';

export const SKOLSKA_WEST_GREEN_588=Object.freeze({
 roadIds:['22880480','1331897639'],
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_a_5._kv%C4%9Btna.jpg',
 photoDate:'2024-05-30',photoAuthor:'ŠJů',license:'CC BY 4.0',
 photoSupportsParticularPlant:false,plantPositionsSurveyed:false,
 photoVerifiesPrivateBoundaries:false,streetName:'Školská – západ'
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
export function planSkolskaWestGreen588(elements,{roadClearance=null}={}){
 if(!Array.isArray(elements)||typeof roadClearance?.isClear!=='function')return null;
 const route=[];
 for(const id of SKOLSKA_WEST_GREEN_588.roadIds){
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
 for(const along of [15,30,46,62,78,94,111,128,145,163,179]){
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
 for(const along of [25,66,108,153]){
  const p=sample(route,along);if(!p)continue;
  for(const sideSign of [1,-1]){
   const offset=sideSign*13.5;
   const x=p.x-p.uz*offset,z=p.z+p.ux*offset;
   const rect={x,z,length:1.2,depth:1.2,buffer:1.1,step:.4};
   if(!isRoadFreeRect(roadClearance,rect)||
      !isBuildingFreeRect(rect,polygons,1.6))continue;
   trees.push({x,z,height:4.9+along%3,crown:1.65+along%2*.25,along,
    placementSurveyed:false});
   break;
  }
 }
 return {
  roadIds:[...SKOLSKA_WEST_GREEN_588.roadIds],source:SKOLSKA_WEST_GREEN_588.source,
  hedges,trees,rejected,estimatedPlanting:true,photoVerifiedPlantCount:0,
  plantedObjects:hedges.length+trees.length,
  roadGeometryChanges:0,sidewalkChanges:0,newDriveways:0,
  parcelBoundariesClaimed:0,knownCameraHeadingRequired:false
 };
}
export function makeSkolskaWestGreen588(THREE,{
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
  source:SKOLSKA_WEST_GREEN_588.source,positionsEstimated:true,
  changedRoads:0,changedSidewalks:0,guessedPrivateEntrances:0
 }}
 function reset(){
  root?.parent?.remove(root);root=null;plan=null;
  if(typeof window!=='undefined')window.__miloviceSkolskaWestGreen588=status();
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
  const next=planSkolskaWestGreen588(elements,{roadClearance});
  if(!next)return null;
  reset();plan=next;
  root=new THREE.Group();
  root.name='Milovice_SkolskaWest_588_inferred_green_street';
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
  if(typeof window!=='undefined')window.__miloviceSkolskaWestGreen588=status();
  return plan;
 }
 reset();
 return {create,reset,status};
}
