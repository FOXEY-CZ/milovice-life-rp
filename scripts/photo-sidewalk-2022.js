// Milovice RP 5.84 — photo-informed single LEFT walkway at 5. května.
// The user's historical 9 May 2022 panorama visibly shows a narrow public
// paved sidewalk and curb on the church-facing LEFT side of the road.
// Its GPS outline, width and parcel boundaries are not surveyed. We model
// ONLY a constrained original mesh, never extract proprietary imagery.
import {isRoadFreeRect} from './road-clearance.js';
import {isBuildingFreeRect} from './street-pionyru-photo-2023.js';

export const CHURCH_SIDEWALK_2022=Object.freeze({
 roadId:'219273174',junctionRoadId:'118488006',churchId:'118487991',
 imageDate:'2022-05-09',photoSource:'User-supplied Mapy.com Panorama screenshot',
 side:'left-going-toward-church',startAlongM:9,endAlongM:117,
 widthM:1.45,centreOffsetM:-5.53,stepM:2.25,
 measurementsSurveyed:false,year2026Confirmed:false,
 geometry:'photo-informed estimate with exact OSM road/building collision guards',
 notAClaimOfMappedOSMWay:true,publicSidewalkNotPrivateEntrance:true
});
const X=p=>p.x,Z=p=>p.z??p.y;
const distance=(p,q)=>Math.hypot(X(p)-X(q),Z(p)-Z(q));
const center=polygon=>({
 x:polygon.reduce((s,p)=>s+X(p),0)/polygon.length,
 z:polygon.reduce((s,p)=>s+Z(p),0)/polygon.length
});
function churchwardRoad(roads,churchFootprint){
 const road=roads.find(r=>String(r.osmId)===CHURCH_SIDEWALK_2022.roadId),
  cross=roads.find(r=>String(r.osmId)===CHURCH_SIDEWALK_2022.junctionRoadId);
 if(!road?.points?.length||!cross?.points?.length||
   !Array.isArray(churchFootprint)||churchFootprint.length<3)return null;
 let match=null;
 for(let i=0;i<road.points.length;i++)for(const p of cross.points){
  const dist=distance(road.points[i],p);
  if(!match||dist<match.dist)match={dist,index:i};
 }
 if(!match||match.dist>.75)return null;
 const church=center(churchFootprint),origin=road.points[match.index],
  candidates=[-1,1].map(dir=>{
   const next=road.points[match.index+dir];
   return next?{dir,dist:distance(church,next)}:null;
  }).filter(Boolean).sort((a,b)=>a.dist-b.dist);
 if(!candidates.length||candidates[0].dist>=distance(church,origin)-2)return null;
 const dir=candidates[0].dir;
 const poly=[origin];let total=0,prev=origin;
 for(let i=match.index+dir;i>=0&&i<road.points.length;i+=dir){
  const next=road.points[i],seg=distance(next,prev);
  if(seg>.01){poly.push(next);total+=seg;}
  prev=next;
 }
 return {poly,total,dir,roadWidth:road.width||9,
  roadId:String(road.osmId),junctionRoadId:String(cross.osmId),
  churchId:CHURCH_SIDEWALK_2022.churchId};
}
function pointAt(route,along){
 if(along<0||along>route.total+.001)return null;
 let remain=along;
 for(let i=1;i<route.poly.length;i++){
  const a=route.poly[i-1],b=route.poly[i],dx=X(b)-X(a),dz=Z(b)-Z(a),
   len=Math.hypot(dx,dz);
  if(len<.01)continue;
  if(remain<=len+.0001){
   const ux=dx/len,uz=dz/len,t=Math.min(1,Math.max(0,remain/len));
   return {x:X(a)+dx*t,z:Z(a)+dz*t,ux,uz};
  }
  remain-=len;
 }
 return null;
}
function lateral(p,offset){
 return {x:p.x-p.uz*offset,z:p.z+p.ux*offset};
}
/**
 * Fail-closed against all available carriageways, footways and house
 * polygons. Candidate segments are ~2m long. Never glue rejected gaps with
 * extra paving or claim this visual estimate creates a new routable OSM way.
 */
export function planPhotoChurchSidewalk2022(roads,{
 roadClearance=null,buildingFootprints=[],churchFootprint=[],
 config=CHURCH_SIDEWALK_2022
}={}){
 if(!Array.isArray(roads)||!roadClearance||
  typeof roadClearance.isClear!=='function'||
  !Array.isArray(buildingFootprints)||!Array.isArray(churchFootprint)||
  ![config.startAlongM,config.endAlongM,config.widthM,
   config.centreOffsetM,config.stepM].every(Number.isFinite)||
  config.stepM<.4||config.stepM>5||config.widthM<.7||
  config.widthM>3||config.endAlongM<=config.startAlongM)return null;
 const route=churchwardRoad(roads,churchFootprint);
 if(!route||route.total<config.endAlongM)return null;
 const samples=[],accepted=[],rejected=[];
 const count=Math.ceil((config.endAlongM-config.startAlongM)/config.stepM);
 for(let i=0;i<count;i++){
  const a=config.startAlongM+i*config.stepM,
    b=Math.min(config.endAlongM,a+config.stepM);
  const p=pointAt(route,a),q=pointAt(route,b),
   mid=pointAt(route,(a+b)*.5);
  if(!p||!q||!mid)continue;
  const c=lateral(mid,config.centreOffsetM),
   yaw=Math.atan2(-mid.uz,mid.ux);
  // Test the full rectangular pavement footprint, not just centreline.
  const rect={x:c.x,z:c.z,length:b-a,depth:config.widthM,
   yaw,buffer:.07,step:.16};
  const roadSafe=isRoadFreeRect(roadClearance,rect),
   buildingSafe=isBuildingFreeRect(rect,buildingFootprints,.15);
  const item={a,b,p,q,x:c.x,z:c.z,width:config.widthM,
   offset:config.centreOffsetM};
  if(roadSafe&&buildingSafe)accepted.push(item);
  else rejected.push({a,b,reason:roadSafe?'building-footprint':'road-or-footway'});
  samples.push(item);
 }
 const lengthM=accepted.reduce((sum,s)=>sum+s.b-s.a,0);
 return {street:'5. května – levý chodník ke kostelu',
  source:'user-map-panorama-2022-05-09',imageDate:config.imageDate,
  roadId:route.roadId,junctionRoadId:route.junctionRoadId,
  churchId:route.churchId,churchwardDirection:route.dir,
  candidateSegments:samples.length,acceptedSegments:accepted.length,
  rejectedSegments:rejected.length,accepted,rejected,
  lengthM:Math.round(lengthM*100)/100,
  requestedLengthM:config.endAlongM-config.startAlongM,
  modelledWidthM:config.widthM,positionSurveyed:false,
  currentStatusUnverified:true,
  createsMappedFootway:false,sidewalkMayNeedPanoramaRefinement:true,
  mappedRoadsChanged:false,mappedBuildingsChanged:false,
  inventedPrivateDriveways:0,publicFootwayApproximation:true};
}
export function makePhotoChurchSidewalk2022(THREE,{
 layer,terrainAt=()=>0,roadClearance=null,sidewalkMaterial=null
}={}){
 let root=null,plan=null,geometry=[];
 const curbMaterial=new THREE.MeshLambertMaterial({
  color:0xbebdb4,side:THREE.DoubleSide
 });
 function create(roads,buildingFootprints=[],churchFootprint=[]){
  // Preserve the existing street meshes when a streamed region has no
  // church/road source evidence. Explicit reset() still clears on full reload.
  const nextPlan=planPhotoChurchSidewalk2022(roads,{
   roadClearance,buildingFootprints,churchFootprint});
  if(!nextPlan)return plan;
  reset();
  plan=nextPlan;
  if(plan?.acceptedSegments){
   root=new THREE.Group();
   const positions=[],uv=[],indices=[],curbPos=[],curbIdx=[];
   for(const segment of plan.accepted){
    const k=positions.length/3,c=curbPos.length/3;
    const inner=segment.offset+segment.width*.5,
     outer=segment.offset-segment.width*.5;
    const p0=lateral(segment.p,inner),p1=lateral(segment.p,outer),
     q0=lateral(segment.q,inner),q1=lateral(segment.q,outer);
    for(const [point,along,u] of [
      [p0,segment.a,0],[p1,segment.a,1],
      [q0,segment.b,0],[q1,segment.b,1]]){
     positions.push(point.x,terrainAt(point.x,point.z)+.224,point.z);
     uv.push(u,along/3);
    }
    indices.push(k,k+2,k+1,k+1,k+2,k+3);
    const low=(point)=>terrainAt(point.x,point.z)+.150;
    curbPos.push(
     p0.x,low(p0),p0.z,p0.x,low(p0)+.08,p0.z,
     q0.x,low(q0),q0.z,q0.x,low(q0)+.08,q0.z
    );
    curbIdx.push(c,c+1,c+2,c+1,c+3,c+2);
   }
   const paving=new THREE.BufferGeometry();
   paving.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
   paving.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
   paving.setIndex(indices);paving.computeVertexNormals();
   const pavement=new THREE.Mesh(paving,sidewalkMaterial||
    new THREE.MeshLambertMaterial({color:0xb5b1a6,side:THREE.DoubleSide}));
   pavement.name='Milovice_5kv_photo2022_left_pavement_continuous';
   pavement.receiveShadow=true;
   const curbing=new THREE.BufferGeometry();
   curbing.setAttribute('position',new THREE.Float32BufferAttribute(curbPos,3));
   curbing.setIndex(curbIdx);curbing.computeVertexNormals();
   const curbMesh=new THREE.Mesh(curbing,curbMaterial);
   curbMesh.name='Milovice_5kv_photo2022_left_curb_continuous';
   root.add(pavement,curbMesh);geometry=[paving,curbing];
   root.userData.photoSource=CHURCH_SIDEWALK_2022.photoSource;
   root.userData.notSurveyed=true;
   root.userData.lodX=plan.accepted[Math.floor(plan.accepted.length/2)].x;
   root.userData.lodZ=plan.accepted[Math.floor(plan.accepted.length/2)].z;
   layer?.add(root);
  }
  if(typeof window!=='undefined')window.__miloviceChurchSidewalk2022=status();
  return plan;
 }
 function status(){
  return {active:!!plan,rendered:!!root,modelledLengthM:plan?.lengthM||0,
   candidateSegments:plan?.candidateSegments||0,
   acceptedSegments:plan?.acceptedSegments||0,
   rejectedSegments:plan?.rejectedSegments||0,
   sourceDate:CHURCH_SIDEWALK_2022.imageDate,source:'user Panorama',
   roadId:CHURCH_SIDEWALK_2022.roadId,churchId:CHURCH_SIDEWALK_2022.churchId,
   drawMeshes:root?.children.length||0,positionSurveyed:false,
   roadAndBuildingChecksRequired:true,createsMappedFootway:false,
   roadsModified:false,privateDrivewaysInvented:0};
 }
 function reset(){
  root?.parent?.remove(root);root=null;plan=null;
  for(const mesh of geometry)mesh.dispose();
  geometry=[];
  if(typeof window!=='undefined')window.__miloviceChurchSidewalk2022=status();
 }
 reset();
 return {create,plan:()=>plan,status,reset};
}
