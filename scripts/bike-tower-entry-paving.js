// Milovice RP 5.81.4 — photo-observed, OSM-anchored pavement directly
// outside the existing blue Bike Tower entry. Not a new street or full plaza.
// Photo evidence: user-shared Mapy.com panorama (2022-05-17) and ŠJů
// Wikimedia Commons Bike Tower (2024-05-30, CC BY 4.0).
// The photo shows paved access; the exact edge/width is still an estimate.
import {isRoadFreeRect} from './road-clearance.js';
import {stationGpsToWorld} from './station-forecourt-pass.js';

export const BIKE_TOWER_ENTRY_PAVING_SOURCE=Object.freeze({
 towerWayId:1011197691,footwayWayId:1165594426,
 expectedTowerName:'Cyklověž Milovice',
 photo:'https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg',
 commonsDate:'2024-05-30',commonsAuthor:'ŠJů',license:'CC BY 4.0',
 mapyPanoramaDate:'2022-05-17',
 observed:'paved pedestrian space immediately outside the blue Bike Tower entrance',
 surveyedPavingBoundary:false,photosCopied:false,
 entryCamera:Object.freeze({lat:50.2290656,lon:14.8822978,heading:5})
});

const DIST_TO_DOOR=.11;
const PAD_WIDTH=3.10;
const PAD_DEPTH=2.10;
const HEIGHT_OFFSET=.15;
const gcd=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);

export function planBikeTowerEntryPaving(elements,roadClearance){
 if(!Array.isArray(elements)||!roadClearance?.isClear)return null;
 const tower=elements.find(e=>Number(e.id)===BIKE_TOWER_ENTRY_PAVING_SOURCE.towerWayId);
 const footway=elements.find(e=>Number(e.id)===BIKE_TOWER_ENTRY_PAVING_SOURCE.footwayWayId);
 if(tower?.tags?.name!==BIKE_TOWER_ENTRY_PAVING_SOURCE.expectedTowerName||
    tower?.tags?.building!=='yes'||tower.geometry?.length<15||
    footway?.tags?.highway!=='footway')return null;
 const corners=tower.geometry.map(stationGpsToWorld);
 if(gcd(corners[0],corners.at(-1))<.03)corners.pop();
 const cx=corners.reduce((a,b)=>a+b.x,0)/corners.length;
 const cz=corners.reduce((a,b)=>a+b.z,0)/corners.length;
 const rawRadius=corners.reduce((a,b)=>a+Math.hypot(b.x-cx,b.z-cz),0)/corners.length;
 const radius=Math.max(3.2,Math.min(4.1,rawRadius));
 if(rawRadius<3.2||rawRadius>4.4)return null;
 const entry=stationGpsToWorld(BIKE_TOWER_ENTRY_PAVING_SOURCE.entryCamera);
 const ex=entry.x-cx,ez=entry.z-cz,len=Math.hypot(ex,ez);
 if(len<15||len>35)return null;
 const nx=ex/len,nz=ez/len;
 const yaw=Math.atan2(nx,nz);
 const centreRadius=radius+DIST_TO_DOOR+PAD_DEPTH/2;
 const x=cx+nx*centreRadius,z=cz+nz*centreRadius;
 // In the 5.81.3 road map, this candidate is in the gap between mapped
 // tower and real OSM footway 1165594426, with no new road footprint.
 // Reject the ENTIRE rectangle if any sampled corner nears road/footway,
 // including future OSM dataset updates.
 if(!isRoadFreeRect(roadClearance,{x,z,length:PAD_WIDTH,depth:PAD_DEPTH,
  yaw,buffer:.18,step:.25}))return null;
 return {
  x,z,cx,cz,nx,nz,yaw,radius,
  width:PAD_WIDTH,depth:PAD_DEPTH,groundOffset:HEIGHT_OFFSET,
  sourceWayIds:[tower.id,footway.id],source:BIKE_TOWER_ENTRY_PAVING_SOURCE.photo,
  provenance:'2022-and-2024-photos-plus-OSM-footway',
  approximateWidth:true,approximateBoundary:true,
  realOSMFootwayProtected:true,originalRoadsUntouched:true,
  buildingMoved:false,collisionsChanged:false,
  noNewRoads:true,photosCopied:false,drawCalls:1
 };
}

export function makeBikeTowerEntryPavingScene(THREE,{layer,terrainAt=()=>0,
 roadClearance}={}){
 let root=null,geometry=null,plan=null,sharedMaterial=null;
 function publish(){
  window.__miloviceBikeTowerEntryPaving={
   active:!!root,sourceWayIds:plan?.sourceWayIds||[],
   drawCalls:root?1:0,triangles:geometry?.index?.count/3||0,
   width:plan?.width||0,depth:plan?.depth||0,
   source:BIKE_TOWER_ENTRY_PAVING_SOURCE.photo,
   photoDimensionsEstimated:true,roadClearanceVerified:!!root,
   noNewRoads:true,buildingMoved:false,originalRoadsUntouched:true,
   materialReused:!!sharedMaterial,photosCopied:false
  };
 }
 function reset(){
  if(root){root.parent?.remove(root);root=null;}
  geometry?.dispose();geometry=null;plan=null;sharedMaterial=null;
  publish();
 }
 function create(elements,{sidewalkMaterial}={}){
  if(root)return window.__miloviceBikeTowerEntryPaving;
  plan=planBikeTowerEntryPaving(elements,roadClearance);
  if(!plan||!sidewalkMaterial){publish();return window.__miloviceBikeTowerEntryPaving;}
  // A SINGLE terrain-following mesh. It reuses the exact shared city
  // sidewalk material; no new texture, no dark checkerboard of 3D tiles.
  const countX=8,countZ=6,vertices=[],uvs=[],indices=[];
  const tanX=plan.nz,tanZ=-plan.nx;
  for(let i=0;i<=countX;i++){
   const u=(i/countX-.5)*plan.width;
   for(let j=0;j<=countZ;j++){
    const v=(j/countZ-.5)*plan.depth;
    const x=plan.x+tanX*u+plan.nx*v;
    const z=plan.z+tanZ*u+plan.nz*v;
    vertices.push(x,terrainAt(x,z)+plan.groundOffset,z);
    uvs.push(u/1.2,v/1.2);
   }
  }
  for(let i=0;i<countX;i++)for(let j=0;j<countZ;j++){
   const k=i*(countZ+1)+j,after=k+countZ+1;
   // Right-handed tangent/front orientation; these triangles face UP.
   indices.push(k,k+1,after,k+1,after+1,after);
  }
  geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  sharedMaterial=sidewalkMaterial;
  root=new THREE.Mesh(geometry,sharedMaterial);
  root.name='Photo2022_2024_BikeTower_EntryPaving_OSM1011197691';
  root.receiveShadow=true;root.userData.photoBoundaryEstimated=true;
  root.userData.lodX=plan.cx;root.userData.lodZ=plan.cz;
  root.userData.lodDetail=true;
  root.userData.originalRoadsUntouched=true;
  layer.add(root);publish();
  return window.__miloviceBikeTowerEntryPaving;
 }
 publish();
 return {create,reset,status:()=>window.__miloviceBikeTowerEntryPaving,
  plan:()=>plan};
}
