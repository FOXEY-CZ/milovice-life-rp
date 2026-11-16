// Milovice RP 5.82.2 — photo-confirmed verge-access paving near Pionýrů, June 2023.
// Only vegetation POCKETS are presently supported for this short stretch.
// This does not assume the road/sidewalk widths or property entrances are
// geodetically surveyed; photographic satellite positions are approximate.
import {isRoadFreeRect} from './road-clearance.js';
export const PIONYRU_2023=Object.freeze({
 roadId:'219273174',junctionRoadId:'118488006',imageDate:'2023-06-04',
 junction:'5. května × Pionýrů',
 evidence:'User-supplied historical Mapy.com satellite screenshot',
 observed:['asphalt carriageway','individual verge shrubs','continuous tree cover in private plots',
  'paved property accesses','different front garden treatments','sidewalk and separated verge'],
 sourceIsDirectUserReference:true,positionsSurveyed:false,
 newDrivewaysWithoutPerParcelConfirmation:false,
 photoConfirmedPublicVergeAccessCandidates:2
});
const X=p=>p.x,Z=p=>p.z??p.y;
const dist=(p,q)=>Math.hypot(X(p)-X(q),Z(p)-Z(q));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function nearBuilding(x,z,radius,polys){
 for(const polygon of polys){
  if(!Array.isArray(polygon)||polygon.length<3)continue;
  // Building outlines are OSM identity sources, not photo facade evidence.
  // Conservative bounding box pre-filter avoids expensive all-city geometry.
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const p of polygon){
   minX=Math.min(minX,X(p));maxX=Math.max(maxX,X(p));
   minZ=Math.min(minZ,Z(p));maxZ=Math.max(maxZ,Z(p));
  }
  if(x<minX-radius-.2||x>maxX+radius+.2||
     z<minZ-radius-.2||z>maxZ+radius+.2)continue;
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
   const a=polygon[i],b=polygon[j],ax=X(a),az=Z(a),bx=X(b),bz=Z(b);
   if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;
   const u=bx-ax,v=bz-az,den=u*u+v*v;
   const t=den>0?clamp(((x-ax)*u+(z-az)*v)/den,0,1):0;
   if(Math.hypot(x-(ax+t*u),z-(az+t*v))<radius+.2)return true;
  }
  if(inside)return true;
 }
 return false;
}
export function planPionyru2023Verge(roads,{roadClearance=null,buildingFootprints=[]}={}){
 const road=roads?.find(r=>String(r.osmId)===PIONYRU_2023.roadId);
 const cross=roads?.find(r=>String(r.osmId)===PIONYRU_2023.junctionRoadId);
 if(!road?.points?.length||!cross?.points?.length)return null;
 let best=null;
 for(let i=0;i<road.points.length;i++)for(const cp of cross.points){
  const d=dist(road.points[i],cp);
  if(!best||d<best.distance)best={distance:d,index:i,at:road.points[i]};
 }
 if(!best||best.distance>.75)return null;
 const j=best.at, neighbours=[road.points[best.index-1],road.points[best.index+1]]
  .filter(Boolean).sort((a,b)=>Z(a)-Z(b));
 const far=neighbours.find(p=>Z(p)<Z(j)-2);
 if(!far)return null;
 const dx=X(far)-X(j),dz=Z(far)-Z(j),length=Math.hypot(dx,dz);
 if(length<60)return null;
 const ux=dx/length,uz=dz/length,halfWidth=Math.max(3,Number(road.width||9)*.5);
 // Only several clear GREEN pockets on the junction-side section seen on
 // the uploaded 2023 satellite. They are NOT claimed as exact shrub GPS.
 // Avoid the older 2014 scene's different northern planting area.
 const photoCandidates=[
  {along:19,across:2.35,radius:.60},
  {along:27,across:2.55,radius:.43},
  {along:36,across:2.25,radius:.83},
  {along:44,across:2.75,radius:.48},
  {along:51,across:2.30,radius:.65}
 ];
 const accepted=[],rejected=[];
 for(const c of photoCandidates){
  const lateral=halfWidth+c.across;
  // `right` of path away from Pionýrů is north-east, as in the
  // user's overhead comparison of the right-side verge.
  const x=X(j)+ux*c.along-uz*lateral;
  const z=Z(j)+uz*c.along+ux*lateral;
  const clear=!roadClearance||roadClearance.isClear(x,z,c.radius,.25);
  const building=nearBuilding(x,z,c.radius,buildingFootprints);
  if(clear&&!building)accepted.push({...c,x,z});
  else rejected.push({...c,reason:!clear?'mapped-road-or-footway':'mapped-building-footprint'});
 }
 // Two paved accesses across the PUBLIC roadside verge are directly
 // visible at the upper end of the user-supplied 4 June 2023 screenshot,
 // one on each side. These strips STOP BEFORE the OSM pedestrian route or
 // mapped houses. Private gates / owners / garage thresholds are unknown
 // and are NOT added. Longitudinal image registration is approximate.
 const accessCandidates=[
  {id:'2023-west-upper-verge',along:94,side:-1,
   nearSide:halfWidth+.23,farSide:7.45,widthAlong:2.65,photoObserved:true},
  {id:'2023-east-upper-verge',along:92,side:1,
   nearSide:halfWidth+.23,farSide:6.72,widthAlong:2.65,photoObserved:true}
 ];
 const accessAccepted=[],accessRejected=[];
 const yaw=Math.atan2(-uz,ux);
 for(const c of accessCandidates){
  const depth=c.farSide-c.nearSide,across=c.side*(c.nearSide+c.farSide)*.5;
  const x=X(j)+ux*c.along-uz*across,z=Z(j)+uz*c.along+ux*across;
  const rect={x,z,length:c.widthAlong,depth,yaw,buffer:.04,step:.12};
  // The rectangle itself, including ALL its edges, must clear both
  // existing OSM carriageway and OSM sidewalk even at its narrow corner.
  const roadSafe=isRoadFreeRect(roadClearance,rect);
  let buildingSafe=true;
  for(let u=-c.widthAlong/2;u<=c.widthAlong/2+.001&&buildingSafe;u+=.28)
   for(let v=c.nearSide;v<=c.farSide+.001;v+=.25){
    const px=X(j)+ux*(c.along+u)-uz*(c.side*v);
    const pz=Z(j)+uz*(c.along+u)+ux*(c.side*v);
    if(nearBuilding(px,pz,.13,buildingFootprints)){buildingSafe=false;break}
   }
  const item={...c,x,z,depth,yaw,
   sourceDate:'2023-06-04',screenshotMatchedNotSurveyed:true,
   onlyPublicVerge:true,noPrivateDrivewayOwnershipClaim:true};
  if(roadSafe&&buildingSafe)accessAccepted.push(item);
  else accessRejected.push({...item,reason:!roadSafe?'mapped-road-or-footway':'mapped-building-footprint'});
 }
 return {
  accessAccepted,accessRejected,
  center:{x:X(j)+ux*length*.43,z:Z(j)+uz*length*.43},
  junction:{x:X(j),z:Z(j)},ux,uz,segmentLength:length,
  side:'northeast verge',roadId:String(road.osmId),
  junctionRoadId:String(cross.osmId),accepted,rejected,
  imageDate:PIONYRU_2023.imageDate,modelledNotSurveyed:true,
  sourceIsUserSatellite:true,roadSurfaceChanged:false,sidewalkGeometryChanged:false
 };
}
export function makePionyru2023Verge(THREE,{layer,terrainAt=()=>0,roadClearance=null}={}){
 let root=null,plan=null;
 const material=new THREE.MeshLambertMaterial({color:0x4e6c3c,flatShading:true});
 const geo=new THREE.IcosahedronGeometry(1,1);
 const pavingMaterial=new THREE.MeshLambertMaterial({color:0xa69b86});
 const pavingGeometry=new THREE.BoxGeometry(1,1,1);
 function create(roads,buildingFootprints=[]){
  if(root){root.parent?.remove(root);root=null}
  plan=planPionyru2023Verge(roads,{roadClearance,buildingFootprints});
  if(plan&&(plan.accepted.length||plan.accessAccepted.length)){
   root=new THREE.Group();root.userData.lodX=plan.center.x;
   root.userData.lodZ=plan.center.z;root.userData.lodDetail=true;
   root.userData.pionyru2023Satellite=true;
   const dummy=new THREE.Object3D();
   if(plan.accepted.length){
    const mesh=new THREE.InstancedMesh(geo,material,plan.accepted.length);
    for(const [i,p] of plan.accepted.entries()){
     const gy=terrainAt(p.x,p.z);
     dummy.position.set(p.x,gy+p.radius*.72,p.z);
     dummy.scale.set(p.radius,p.radius*.78,p.radius);
     dummy.rotation.set(0,0,0);
     dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
    root.add(mesh);
   }
   if(plan.accessAccepted.length){
    // Two narrow unmarked aprons only. Not an added highway or garage.
    // Both are independently checked against mapped road/path/building
    // footprints and share ONE instanced draw call.
    const mesh=new THREE.InstancedMesh(pavingGeometry,pavingMaterial,plan.accessAccepted.length);
    for(const [i,p] of plan.accessAccepted.entries()){
     const gy=terrainAt(p.x,p.z);
     dummy.position.set(p.x,gy+.016,p.z);
     dummy.rotation.set(0,p.yaw,0);
     dummy.scale.set(p.widthAlong,.025,p.depth);
     dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
    root.add(mesh);
   }
   layer?.add(root);
  }
  if(typeof window!=='undefined')window.__milovicePionyruSatellite2023=status();
  return plan;
 }
 function status(){
  return {active:!!plan,street:PIONYRU_2023.junction,imageDate:PIONYRU_2023.imageDate,
   roadId:PIONYRU_2023.roadId,junctionRoadId:PIONYRU_2023.junctionRoadId,
   modelledNotSurveyed:true,screenshotSourceNotCopied:true,
   roadSurfaceChanged:false,sidewalkGeometryChanged:false,
   plantedShrubPockets:plan?.accepted.length||0,
   rejectedUnsafeLocations:plan?.rejected.length||0,
   publicVergeAccesses:plan?.accessAccepted.length||0,
   rejectedUnsafeAccesses:plan?.accessRejected.length||0,
   privateDrivewaysInvented:false,footwaysModified:false,
   instancedDrawCalls:root?root.children.length:0,
   junction:plan?.junction||null,center:plan?.center||null,
   roadDirection:plan?{ux:plan.ux,uz:plan.uz}:null};
 }
 function reset(){root?.parent?.remove(root);root=null;plan=null;
  if(typeof window!=='undefined')window.__milovicePionyruSatellite2023=status();}
 reset();
 return {create,plan:()=>plan,status,reset};
}
