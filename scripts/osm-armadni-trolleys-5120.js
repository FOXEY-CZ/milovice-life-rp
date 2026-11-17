// Milovice RP 5.120 — the shopping-cart shelter visible on the
// PUBLIC Armádní 874 BILLA entrance photograph.
// Only the identified OSM building/frontage/service access is eligible.
// Individual trolley positions, shelter size, exact canopy curve and
// colours are model estimates, not surveyed site geometry.
export const BILLA_TROLLEY_SOURCE=Object.freeze({
 buildingWayId:'53865798',
 serviceWayId:'1057548615',
 photo:'https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html',
 feature:'covered shopping trolley row on the viewer-left side of the entrance'
});
const xz=p=>({x:p?.x,z:p?.z??p?.y});
const finite=(...numbers)=>numbers.every(Number.isFinite);
function pointSegmentDistance(pt,a,b){
 const vx=b.x-a.x,vz=b.z-a.z,den=vx*vx+vz*vz;
 if(den<.01)return Infinity;
 const t=Math.max(0,Math.min(1,((pt.x-a.x)*vx+(pt.z-a.z)*vz)/den));
 return Math.hypot(pt.x-a.x-vx*t,pt.z-a.z-vz*t);
}
function contains(p,outline){
 let inside=false;
 for(let i=0,j=outline.length-1;i<outline.length;j=i++){
  const a=outline[i],b=outline[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
}
export function planBillaTrolleyShelter({
 id,regionId,tags={},front,footprint=[],
 serviceWay,photoApprovedElsewhere=false
}={}){
 if(String(id)!==BILLA_TROLLEY_SOURCE.buildingWayId||
  regionId!=='mlada'||photoApprovedElsewhere||
  tags.name!=='Billa'||tags.building!=='supermarket'||
  tags.shop!=='supermarket'||tags['building:levels']!=='1'||
  tags.height!==undefined||['private','no'].includes(tags.access)||
  !front||!finite(front.mx,front.mz,front.ux,front.uz,
   front.nx,front.nz,front.len,front.yaw)||
  front.len<17.5||front.len>18.5||
  Math.abs(Math.hypot(front.ux,front.uz)-1)>.01||
  Math.abs(Math.hypot(front.nx,front.nz)-1)>.01||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  !Array.isArray(footprint)||footprint.length<6||
  !serviceWay||String(serviceWay.osmId)!==
   BILLA_TROLLEY_SOURCE.serviceWayId||
  serviceWay.kind!=='service'||!finite(serviceWay.width)||
  serviceWay.width<3||serviceWay.width>6.5||
  !Array.isArray(serviceWay.points)||serviceWay.points.length!==2)
  return null;
 const polygon=footprint.map(xz);
 const road=serviceWay.points.map(xz);
 if([...polygon,...road].some(p=>!finite(p.x,p.z)))return null;
 // The photograph places the shelter LEFT from the road-facing camera:
 // the viewer faces east, so this is the NORTHERN part of the west recess.
 // The mapped way 53865798's front edge is about 18m long.
 const north=front.uz<0?1:-1;
 const along=north*Math.min(7.25,front.len*.5-1.70);
 const outward=1.40;
 const width=2.96,depth=1.64;
 if(Math.abs(along)+width*.5>front.len*.5-.12||
  Math.abs(along)-width*.5<5.45)return null;
 const center={
  x:front.mx+front.ux*along+front.nx*outward,
  z:front.mz+front.uz*along+front.nz*outward
 };
 const corners=[];
 for(const side of [-1,1])for(const fwd of [-1,1]){
  corners.push({
   x:center.x+front.ux*side*width*.5+front.nx*fwd*depth*.5,
   z:center.z+front.uz*side*width*.5+front.nz*fwd*depth*.5
  });
 }
 // No post/roof corner may enter the real store or mapped service carriageway.
 if(corners.some(p=>contains(p,polygon)))return null;
 const roadClearance=Math.min(...corners.map(p=>
  pointSegmentDistance(p,road[0],road[1])-serviceWay.width*.5));
 if(roadClearance<.45)return null;
 // Anchor is an approximate 3D fixture, not an extra OSM walkway,
 // an inferred parking polygon or a replacement shop doorway.
 return {
  center,along,northSide:north,width,depth,roofHeight:2.21,
  frameHeight:2.05,cartCount:6,
  roadClearanceMeters:+roadClearance.toFixed(2),
  sourceBuildingWayId:String(id),
  sourceServiceWayId:String(serviceWay.osmId),
  originalFootprintUntouched:true,streetGeometryUntouched:true,
  photoSource:BILLA_TROLLEY_SOURCE.photo,
  observedFeature:BILLA_TROLLEY_SOURCE.feature,
  estimatedSitePlacement:true,exactRoofCurvatureMeasured:false,
  estimatedTrolleyCount:true,
  newFootpaths:0,newParkingBays:0,newBuildings:0,
  renderFacing:{ux:front.ux,uz:front.uz,nx:front.nx,nz:front.nz,
   yaw:front.yaw}
 };
}
