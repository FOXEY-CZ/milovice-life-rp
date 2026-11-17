// Milovice RP 5.102 — playground equipment on ordinary mapped OSM
// leisure=playground polygons. The AREA is sourced; individual swings/slides,
// their exact location and colours are modeling estimates, never photos.
// Named customer attractions, private play areas, water play and specifically
// tagged special-purpose devices must NEVER receive generic equipment.
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
function inside(x,z,pts){
 let result=false;
 for(let i=0,j=pts.length-1;i<pts.length;j=i++){
  const a=pts[i],b=pts[j],az=Z(a),bz=Z(b);
  if((az>z)!==(bz>z)&&x<(X(b)-X(a))*(z-az)/(bz-az)+X(a))result=!result;
 }
 return result;
}
function edgeDistance(x,z,pts){
 let minimum=Infinity;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  const dx=X(b)-X(a),dz=Z(b)-Z(a),len=dx*dx+dz*dz;
  if(len<.0001)continue;
  const t=Math.max(0,Math.min(1,((x-X(a))*dx+(z-Z(a))*dz)/len));
  minimum=Math.min(minimum,Math.hypot(x-X(a)-t*dx,z-Z(a)-t*dz));
 }
 return minimum;
}
function areaOf(pts){
 let area=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  area+=X(a)*Z(b)-X(b)*Z(a);
 }
 return Math.abs(area)*.5;
}
function hashId(id){
 let h=2166136261;
 for(const ch of String(id))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;
 return h>>>0;
}
export function ordinaryMappedPlayground(tags={}){
 return tags.leisure==='playground' &&
  !['private','no','customers'].includes(tags.access) &&
  tags.fee!=='yes' && !tags.building &&
  // A tagged attraction is a different geometry, not a generic public park.
  (tags.playground===undefined||tags.playground==='swing') &&
  !tags.maxheight && !['yes','true'].includes(tags.indoor);
}
export function planMappedPlaygroundEquipment(ways,{
 roads,buildings,water,photoAllowed=()=>true,maxCity=32,maxPerArea=2
}={}){
 const result={version:'5.102',equipment:[],eligibleAreas:0,
  mappedIds:[],modeledAreas:0,byOsmId:{},skippedRestricted:0,
  skippedSmallOrInvalid:0,skippedClearance:0,skippedPhotoZone:0,
  positionsEstimated:true,playgroundPolygonFromOSM:true,
  photoVerifiedEquipment:0,attractionsInvented:0,changedSourceGeometry:false};
 if(!Array.isArray(ways)||!roads?.isClear||!buildings?.isClear||
   !water?.isClear||typeof photoAllowed!=='function'||
   !Number.isInteger(maxCity)||maxCity<0||maxCity>80||
   !Number.isInteger(maxPerArea)||maxPerArea<1||maxPerArea>3)return result;
 const seen=new Set();
 const sorted=ways.slice().sort((a,b)=>String(a?.id).localeCompare(
  String(b?.id),'en',{numeric:true}));
 for(const way of sorted){
  const id=String(way?.id??'');
  if(!id||seen.has(id))continue;
  seen.add(id);
  if(!ordinaryMappedPlayground(way?.tags)){result.skippedRestricted++;continue;}
  const points=Array.isArray(way.points)?way.points.slice():[];
  if(points.length<4||points.length>120||points.some(p=>!finite(p))){
   result.skippedSmallOrInvalid++;continue;
  }
  if(Math.hypot(X(points[0])-X(points.at(-1)),
    Z(points[0])-Z(points.at(-1)))<.05)points.pop();
  if(points.length<3){result.skippedSmallOrInvalid++;continue;}
  const area=areaOf(points);
  const minX=Math.min(...points.map(X)),maxX=Math.max(...points.map(X)),
   minZ=Math.min(...points.map(Z)),maxZ=Math.max(...points.map(Z));
  if(area<85||area>25000||maxX-minX<6.8||maxZ-minZ<6.8){
   result.skippedSmallOrInvalid++;continue;
  }
  result.eligibleAreas++;result.mappedIds.push(id);
  const candidates=[];
  // Deterministic ordered grid, bounded to 169 candidates per area.
  const n=13;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){
   const x=minX+(i+.5)/n*(maxX-minX),
    z=minZ+(j+.5)/n*(maxZ-minZ);
   if(!inside(x,z,points))continue;
   const clearance=edgeDistance(x,z,points);
   if(clearance<3.4)continue;
   if(!photoAllowed(x,z,way)){result.skippedPhotoZone++;continue;}
   if(!roads.isClear(x,z,3.15,.65)||
      !buildings.isClear(x,z,3.0)||
      !water.isClear(x,z,3.2,.75)){
    result.skippedClearance++;continue;
   }
   candidates.push({x,z,clearance});
  }
  candidates.sort((a,b)=>b.clearance-a.clearance||a.x-b.x||a.z-b.z);
  const limit=Math.min(maxPerArea,area>=370?2:1);
  let added=0;
  for(const c of candidates){
   if(result.equipment.length>=maxCity||added>=limit)break;
   if(result.equipment.some(e=>e.osmId===id&&
      Math.hypot(e.x-c.x,e.z-c.z)<8.6))continue;
   const h=hashId(id+':'+added);
   const type=way.tags.playground==='swing'?'swing':
    (h%2?'swing':'slide');
   // The map establishes the park boundary, not any equipment bearings.
   const yaw=(h%360)*Math.PI/180;
   result.equipment.push({osmId:id,regionId:way.regionId||null,
    x:c.x,z:c.z,type,yaw,source:'OSM leisure=playground',
    polygonArea:Math.round(area),positionEstimated:true});
   added++;
  }
  if(added){result.modeledAreas++;result.byOsmId[id]=added;}
  if(result.equipment.length>=maxCity)break;
 }
 return result;
}

/**
 * 5.103 direct 3D inspection camera of an EXISTING modeled item.
 * No manufactured survey bearings: pick a safe eye WITHIN the mapped
 * public polygon so the model is in view at walking height.
 * Geometry and object positions are never changed by this planner.
 */
export function planPlaygroundReviewCamera(sourceId,equipment,way,{
 roads,buildings,water
}={}){
 const id=String(sourceId??''),items=Array.isArray(equipment)?
  equipment.filter(p=>p.osmId===id&&finite(p)):[];
 const pts=way?.points?.slice()||[];
 if(!id||!items.length||String(way?.id)!==id||
  !ordinaryMappedPlayground(way.tags)||pts.length<4||
  pts.some(p=>!finite(p))||!roads?.isClear||
  !buildings?.isClear||!water?.isClear)return null;
 if(Math.hypot(X(pts[0])-X(pts.at(-1)),Z(pts[0])-Z(pts.at(-1)))<.05)
  pts.pop();
 const main=items[0],angles=[-90,90,0,180,-45,45,135,-135];
 const base=main.yaw||0;
 const target={x:main.x,z:main.z,height:main.type==='swing'?1.55:1.20,
  type:main.type,osmId:id};
 // Prefer a photographically useful 6–10 m view and avoid other modeled
 // equipment. Never place the camera on a road or inside a building.
 for(const radius of [8.4,9.8,7.0,5.7,11.2]){
  for(const turn of angles){
   const theta=base+turn*Math.PI/180;
   const x=main.x+Math.cos(theta)*radius,
    z=main.z+Math.sin(theta)*radius;
   if(!inside(x,z,pts)||edgeDistance(x,z,pts)<.75||
    !roads.isClear(x,z,.55,.50)||
    !buildings.isClear(x,z,.85)||
    !water.isClear(x,z,.7,.50)||
    items.some(p=>Math.hypot(p.x-x,p.z-z)<3.0))continue;
   return {sourceId:id,ready:true,cameraEye:{x,z},
    target,metersFromTarget:radius,sourceOSMPolygon:true,
    cameraInsideMappedPlayground:true,notAPhoto:true,
    estimatedCamera:true,estimatedEquipment:true};
  }
 }
 return null;
}
