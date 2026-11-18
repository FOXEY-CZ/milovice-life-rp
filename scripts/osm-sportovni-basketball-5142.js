/**
 * Milovice RP 5.142 — TWO OSM-tagged basketball hoops in Sportovní.
 * OSM way/1278746587 has sport=basketball and hoops=2. The count and
 * court outline are sourced; style, pole design, exact basket positions
 * and height are SCHEMATIC, NOT photographically measured.
 * Keep ALL geometry inside the original pitch. No fake courts or fences.
 */
import {planOSMPitchMarkings,insideMappedPitch} from './osm-pitch-markings-599.js';

export const SPORTOVNI_BASKETBALL_5142=Object.freeze({
 regionId:'mlada',id:'1278746587',nodes:6,hash:'40a2c301',
 sport:'basketball',hoops:'2',access:'yes',lit:'no'
});
function hashGPS(geo){
 let h=2166136261;
 const s=geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z??p?.y);
const pos=p=>({x:p.x,z:p.z??p.y});
export function planSportovniBasketballHoops({
 regionId,way,toWorld,roads,buildings
}={}){
 const ref=SPORTOVNI_BASKETBALL_5142;
 if(regionId!==ref.regionId||String(way?.id)!==ref.id||
  way?.tags?.leisure!=='pitch'||way.tags.sport!==ref.sport||
  way.tags.hoops!==ref.hoops||way.tags.access!==ref.access||
  way.tags.lit!==ref.lit||typeof toWorld!=='function'||
  !Array.isArray(way.geometry)||way.geometry.length!==ref.nodes||
  way.geometry.some(p=>!Number.isFinite(p.lat)||!Number.isFinite(p.lon))||
  hashGPS(way.geometry)!==ref.hash)return null;
 const points=way.geometry.map(toWorld);
 if(!points.every(finite))return null;
 const polygon=points.map(pos);
 const court=planOSMPitchMarkings(way.tags,polygon);
 if(court?.sport!=='basketball'||!court.center||!finite(court.center)||
   !finite(court.axis)||court.length<23||court.length>33||
   court.width<9||court.width>18)return null;
 const hoops=[];
 for(const sign of [-1,1]){
  const poleAt=sign*(court.length*.5-.35);
  const post={
   x:court.center.x+sign*court.axis.x*(court.length*.5-.35),
   z:court.center.z+sign*court.axis.z*(court.length*.5-.35)
  };
  const inward={x:-sign*court.axis.x,z:-sign*court.axis.z};
  const board={x:post.x+inward.x*.8,z:post.z+inward.z*.8};
  const rim={x:post.x+inward.x*1.3,z:post.z+inward.z*1.3};
  const probes=[post,board,rim,
   {x:board.x-court.axis.z*.92,z:board.z+court.axis.x*.92},
   {x:board.x+court.axis.z*.92,z:board.z-court.axis.x*.92}];
  if(probes.some(p=>!insideMappedPitch(p.x,p.z,polygon)))return null;
  if(typeof roads?.isClear==='function' &&
   !probes.every(p=>roads.isClear(p.x,p.z,.15,.07)))return null;
  if(typeof buildings?.isClear==='function' &&
   !probes.every(p=>buildings.isClear(p.x,p.z,.20)))return null;
  hoops.push({sign,post,board,rim,inward,
   heightMeters:3.05,poleHeightMeters:3.7,
   estimatedPosition:true,sourceCourtId:ref.id});
 }
 return {
  version:'5.142',sourceCourtId:ref.id,regionId,
  sourceOSMHash:ref.hash,sourceVertices:ref.nodes,
  sourceBasketCount:2,hoops,
  courtMeters:{length:+court.length.toFixed(2),
   width:+court.width.toFixed(2)},
  originalMappedPolygonPreserved:true,
  scannedExistingCourt:true,
  photographicBasketLocationsVerified:false,
  modelStyleEstimated:true,placedWithinOriginalPitch:true,
  inventedHoops:0,inventedCourtPolygons:0,
  inventedFences:0,inventedTrees:0,newCollisionVolumes:0
 };
}

/** Minimal reusable outdoor baskets; only two small groups, no physics. */
export function renderSportovniBasketballHoops(THREE,{
 layer,terrainAt,plan
}={}){
 if(!THREE||!layer?.add||typeof terrainAt!=='function'||
  plan?.version!=='5.142'||plan.hoops?.length!==2)return null;
 const poleGeo=new THREE.CylinderGeometry(.065,.075,3.7,8),
  armGeo=new THREE.BoxGeometry(.08,.08,.9),
  panelGeo=new THREE.BoxGeometry(1.80,1.05,.055),
  rimGeo=new THREE.TorusGeometry(.225,.028,6,20),
  squareGeo=new THREE.BoxGeometry(.57,.04,.008);
 const metal=new THREE.MeshStandardMaterial({color:0x525e66,roughness:.8}),
  board=new THREE.MeshStandardMaterial({color:0xe6e8df,roughness:.8}),
  orange=new THREE.MeshStandardMaterial({color:0xdb5821,roughness:.75}),
  mark=new THREE.MeshStandardMaterial({color:0x383f43,roughness:.8});
 const groups=[];
 for(const hoop of plan.hoops){
  const group=new THREE.Group();
  group.name='Milovice_OSM_Sportovni_BasketHoop_5142';
  group.position.set(hoop.post.x,terrainAt(hoop.post.x,hoop.post.z)+.13,
   hoop.post.z);
  group.rotation.y=Math.atan2(hoop.inward.x,hoop.inward.z);
  group.userData.lodX=hoop.post.x;
  group.userData.lodZ=hoop.post.z;
  group.userData.schematicFromOSM=true;
  const add=(geo,material,x,y,z)=>{
   const mesh=new THREE.Mesh(geo,material);
   mesh.position.set(x,y,z);
   mesh.castShadow=false;mesh.receiveShadow=false;
   group.add(mesh);return mesh;
  };
  add(poleGeo,metal,0,1.85,0);
  add(armGeo,metal,0,3.52,.44);
  add(panelGeo,board,0,3.48,.82);
  add(squareGeo,mark,0,3.10,.856);
  const ring=add(rimGeo,orange,0,3.05,1.30);
  ring.rotation.x=Math.PI/2;
  layer.add(group);
  groups.push(group);
 }
 return {
  groups,hoopCount:groups.length,drawMeshes:groups.reduce((n,g)=>n+g.children.length,0),
  visibleHoops:()=>groups.filter(g=>{
   for(let p=g;p;p=p.parent){if(!p.visible)return false}
   return true;
  }).length
 };
}
