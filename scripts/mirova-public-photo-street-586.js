// Milovice RP 5.86 — one lightweight, reproducible Mírová streetscape pass.
// Public 30 May 2024 Wikimedia photographs by ŠJů (CC BY 4.0) show pale
// facades, low clipped hedges, narrow paving and a small number of trees.
// Hedge/tree TYPES are grounded; their precise sites are provisional.
// No invented streets, sidewalks, crossings, entrances, or parcel boundaries.
import {isRoadFreeRect} from './road-clearance.js';
import {isBuildingFreeRect} from './street-pionyru-photo-2023.js';

export const MIROVA_PHOTO_STREET_586=Object.freeze({
 roadId:'1331897651',
 source:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_(01).jpg',
 secondarySource:'https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg',
 date:'2024-05-30',author:'ŠJů',license:'CC BY 4.0',
 observed:['low trimmed roadside hedges','older plaster houses',
  'stone plinths','paving','localized roadside greenery'],
 exactPlantPositionsKnown:false,roadGeometryChanged:false,
 newPrivateEntrances:0,newCrossings:0,newPavements:0
});
const C=Math.cos(50.226*Math.PI/180);
const world=p=>({x:(p.lon-14.889)*111320*C,z:-(p.lat-50.226)*111320});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function alongLine(path,along){
 let left=along;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],len=distance(a,b);
  if(len<.01)continue;
  if(left<=len){
   const ux=(b.x-a.x)/len,uz=(b.z-a.z)/len;
   return {x:a.x+ux*left,z:a.z+uz*left,ux,uz};
  }
  left-=len;
 }
 return null;
}
function sideOffset(p,side){
 return {x:p.x-p.uz*side,z:p.z+p.ux*side};
}
export function planMirovaPhotoStreet586(elements,{roadClearance=null}={}){
 if(!Array.isArray(elements)||!roadClearance||
    typeof roadClearance.isClear!=='function')return null;
 const road=elements.find(e=>String(e.id)===MIROVA_PHOTO_STREET_586.roadId&&
   e.tags?.name==='Mírová'&&Array.isArray(e.geometry)&&e.geometry.length>=2);
 if(!road)return null;
 const path=(road.geometry[0].lat>=road.geometry.at(-1).lat?
  road.geometry:road.geometry.slice().reverse()).map(world);
 const buildings=elements.filter(e=>e.tags?.building&&Array.isArray(e.geometry)&&
    e.geometry.length>=4).map(e=>e.geometry.map(world));
 const hedges=[],rejected=[];
 for(const along of [15,23,31,39,47,55,63,71,79,87,95]){
  const mid=alongLine(path,along);
  if(!mid)continue;
  // Street-photo evidence: predominantly low trimmed hedge along the
  // northwest frontage; a few staggered pieces near the corner opposite.
  const side=(along===39||along===63||along===87)?-9.0:8.0;
  const pt=sideOffset(mid,side);
  const yaw=Math.atan2(-mid.uz,mid.ux);
  const rect={x:pt.x,z:pt.z,length:3.1,depth:.72,yaw,
   buffer:.26,step:.35};
  const roadSafe=isRoadFreeRect(roadClearance,rect);
  const buildingSafe=isBuildingFreeRect(rect,buildings,.34);
  if(roadSafe&&buildingSafe)hedges.push({
   ...pt,yaw,length:3.1,depth:.72,height:.60+along%3*.06,
   along,side,photoObservedKind:'trimmed-hedge',placementSurveyed:false
  });
  else rejected.push({along,reason:roadSafe?'mapped-building':'mapped-road-or-path'});
 }
 const trees=[];
 for(const [along,side,height,crown] of [[19,11.1,5.2,2.0],[55,-11.7,6.6,2.6],[94,11.4,6.0,2.25]]){
  const p=alongLine(path,along);if(!p)continue;
  const v=sideOffset(p,side),rect={x:v.x,z:v.z,length:1.1,depth:1.1,
   yaw:0,buffer:1.4,step:.35};
  if(!isRoadFreeRect(roadClearance,rect)||
     !isBuildingFreeRect(rect,buildings,1.7))continue;
  trees.push({...v,height,crown,along,
   photoObservedKind:'roadside-deciduous',placementSurveyed:false});
 }
 return {
  roadId:MIROVA_PHOTO_STREET_586.roadId,source:MIROVA_PHOTO_STREET_586.source,
  hedges,trees,hedgeCandidates:11,rejectedHedges:rejected,
  vegetationPositionsSurveyed:false,
  plantedElements:hedges.length+trees.length,
  newPrivateEntrances:0,newCrossings:0,newPavements:0,
  roadsOrFootwaysChanged:false,OSMBuildingsChanged:false,
  estimatedPlanting:true,photoApprovedPerPlant:false
 };
}
export function makeMirovaPhotoStreet586(THREE,{
 layer,terrainAt=()=>0,roadClearance=null
}={}){
 let root=null,plan=null;
 const box=new THREE.BoxGeometry(1,1,1);
 const trunk=new THREE.CylinderGeometry(.14,.2,1,7);
 const leaf=new THREE.IcosahedronGeometry(1,1);
 const hedgeMat=new THREE.MeshLambertMaterial({color:0x406d42,flatShading:true});
 const stoneMat=new THREE.MeshLambertMaterial({color:0x9d978c});
 const barkMat=new THREE.MeshLambertMaterial({color:0x68513d});
 const foliageMat=new THREE.MeshLambertMaterial({color:0x4b7948,flatShading:true});
 function batch(geometry,mat,items){
  if(!items.length)return;
  const mesh=new THREE.InstancedMesh(geometry,mat,items.length);
  const obj=new THREE.Object3D();
  for(const [i,p] of items.entries()){
   obj.position.set(p.x,p.y,p.z);
   obj.rotation.y=p.yaw||0;
   obj.scale.set(p.w,p.h,p.d);
   obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);
  }
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
  root.add(mesh);
 }
 function reset(){
  root?.parent?.remove(root);
  root=null;plan=null;
  if(typeof window!=='undefined')window.__miloviceMirovaPhotoStreet586=status();
 }
 function status(){return {
  active:!!root,hedgeSegments:plan?.hedges.length||0,
  plantedTrees:plan?.trees.length||0,
  rejectedHedges:plan?.rejectedHedges.length||0,
  drawMeshes:root?.children.length||0,
  source:MIROVA_PHOTO_STREET_586.source,
  publicPhotoDate:MIROVA_PHOTO_STREET_586.date,
  positionsEstimated:true,photoApprovedPerPlant:false,
  alteredRoadGeometry:false,alteredBuildingGeometry:false,
  inventedPrivateEntrances:0,inventedCrossings:0
 }}
 function create(elements){
  const next=planMirovaPhotoStreet586(elements,{roadClearance});
  if(!next)return null;
  reset();plan=next;
  root=new THREE.Group();
  root.name='Milovice_Mirova_2024_public_photo_inferred_street_greenery';
  const hedges=[],base=[],trunks=[],crowns=[];
  for(const h of plan.hedges){
   const ground=terrainAt(h.x,h.z);
   hedges.push({x:h.x,y:ground+.30+h.height*.5,z:h.z,
    w:h.length,h:h.height,d:h.depth,yaw:h.yaw});
   base.push({x:h.x,y:ground+.115,z:h.z,w:h.length,h:.23,d:h.depth+.12,
    yaw:h.yaw});
  }
  for(const t of plan.trees){
   const ground=terrainAt(t.x,t.z);
   trunks.push({x:t.x,y:ground+t.height*.34,z:t.z,w:1,h:t.height*.68,d:1});
   crowns.push({x:t.x,y:ground+t.height*.76,z:t.z,
    w:t.crown,h:t.crown*.9,d:t.crown});
  }
  batch(box,stoneMat,base);
  batch(box,hedgeMat,hedges);
  batch(trunk,barkMat,trunks);
  batch(leaf,foliageMat,crowns);
  root.userData.lodX=plan.hedges[0]?.x??plan.trees[0]?.x??0;
  root.userData.lodZ=plan.hedges[0]?.z??plan.trees[0]?.z??0;
  root.userData.estimatedStreetVegetation=true;
  layer?.add(root);
  if(typeof window!=='undefined')window.__miloviceMirovaPhotoStreet586=status();
  return plan;
 }
 reset();
 return {create,reset,status,plan:()=>plan};
}
