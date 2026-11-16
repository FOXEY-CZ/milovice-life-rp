// Milovice RP 5.85 — streetscape pass sourced from the user's 9 May 2022
// Mapy Panorama of 5. května facing St Catherine church and older Commons.
// Render original geometry only. Individual furniture sites are PHOTO-INFORMED
// estimates, not surveyed coordinates or proof of existence in 2026.
import {isRoadFreeRect} from './road-clearance.js';
import {isBuildingFreeRect} from './street-pionyru-photo-2023.js';

export const CHURCH_STREET_PHOTO_PASS=Object.freeze({
 roadId:'219273174',junctionId:'118488006',churchId:'118487991',
 sourceDate:'2022-05-09',source:'User-supplied Mapy.com Panorama',
 sharedPublicSource:'https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg',
 publicSourceDate:'2014-07-26',sourceQuality:'street-level view; not georegistered per parcel',
 photographedFeatures:['left sidewalk','low fences and walls to left','large deciduous trees to right','patchy asphalt surface','mixed houses'],
 photoCameraGPSKnown:false,objectPlacementSurveyed:false,
 privateParcelBoundariesConfirmed:false,
 roadTagsChanged:false,buildingFootprintsChanged:false,
 unverifiedTrafficMarkings:0,unverifiedPrivateDriveways:0
});
export const PIONYRU_GATE_PANORAMA_2022=Object.freeze({
 source:'https://mapy.com/cs/letecka?pid=81190391&newest=1&yaw=3.834&fov=1.257&pitch=-0.032&x=14.8849165&y=50.2277105&z=18.748&ovl=8',
 camera:{lat:50.2277105,lon:14.8849165,yawRadians:3.834},
 photographedOSMHouseId:'202385910',date:'2022-05-09',
 observed:['brown diamond-panel gate','pale masonry piers','block boundary wall',
  'low mesh fence','paved sidewalk','grass verge'],
 approximateAlongFromPionyruM:62,positionSurveyed:false,
 privateOwnershipUnverified:true,roadOrFootwayChanged:false
});
const X=p=>p.x,Z=p=>p.z??p.y;
const dist=(a,b)=>Math.hypot(X(a)-X(b),Z(a)-Z(b));
function axis(roads,churchFootprint){
 const road=roads.find(r=>String(r.osmId)===CHURCH_STREET_PHOTO_PASS.roadId);
 const cross=roads.find(r=>String(r.osmId)===CHURCH_STREET_PHOTO_PASS.junctionId);
 if(!road?.points?.length||!cross?.points?.length||
 !Array.isArray(churchFootprint)||churchFootprint.length<3)return null;
 const church={x:churchFootprint.reduce((s,p)=>s+X(p),0)/churchFootprint.length,
  z:churchFootprint.reduce((s,p)=>s+Z(p),0)/churchFootprint.length};
 let best=null;
 for(let i=0;i<road.points.length;i++)for(const p of cross.points){
  const d=dist(p,road.points[i]);
  if(!best||d<best.d)best={i,d};
 }
 if(!best||best.d>.75)return null;
 const origin=road.points[best.i];
 const options=[-1,1].map(step=>{
  const p=road.points[best.i+step];
  return p?{step,d:dist(church,p)}:null;
 }).filter(Boolean).sort((a,b)=>a.d-b.d);
 if(!options.length||options[0].d>=dist(origin,church)-2)return null;
 const dir=options[0].step;
 const line=[origin];let length=0,prev=origin;
 for(let i=best.i+dir;i>=0&&i<road.points.length;i+=dir){
  const next=road.points[i],len=dist(prev,next);
  if(len>.01){length+=len;line.push(next)}
  prev=next;
 }
 if(length<120)return null;
 return {line,length,dir,roadId:String(road.osmId),roadWidth:road.width||9};
}
function sample(route,along){
 if(along<0||along>route.length)return null;
 let left=along;
 for(let i=1;i<route.line.length;i++){
  const a=route.line[i-1],b=route.line[i],dx=X(b)-X(a),dz=Z(b)-Z(a);
  const l=Math.hypot(dx,dz);if(l<.01)continue;
  if(left<=l){
   return {x:X(a)+dx*(left/l),z:Z(a)+dz*(left/l),
    ux:dx/l,uz:dz/l};
  }
  left-=l;
 }
 return null;
}
function offset(p,side){
 return {x:p.x-p.uz*side,z:p.z+p.ux*side};
}
/**
 * No guessed mapping of gates, shop identities, sign text or ownership.
 * Fence and tree candidates can exist only if their WHOLE ground footprints
 * clear every mapped road/footway and mapped building. Rejected = omitted.
 * Road-wear patches lie WITHIN the existing carriageway; they never change
 * drivable topology or act as lane markings.
 */
export function planChurchStreetscape2022(roads,{roadClearance=null,
 buildingFootprints=[],churchFootprint=[]}={}){
 if(!Array.isArray(roads)||!roadClearance||
  typeof roadClearance.isClear!=='function'||!Array.isArray(buildingFootprints))return null;
 const route=axis(roads,churchFootprint);
 if(!route)return null;
 const fence=[],rejectedFence=[];
 for(let along=24;along<=97;along+=7.6){
  const start=sample(route,along),end=sample(route,along+7.25),
   mid=sample(route,along+3.625);
  if(!start||!end||!mid)continue;
  // Right-hand normal in mathematical x/z corresponds to the visual LEFT
  // of the churchward view: negative side. Exterior to 5.84 sidewalk.
  const side=-7.25,pos=offset(mid,side);
  const yaw=Math.atan2(-mid.uz,mid.ux);
  const rect={x:pos.x,z:pos.z,length:7.25,depth:.18,
   yaw,buffer:.22,step:.46};
  const roadOk=isRoadFreeRect(roadClearance,rect),
   buildingOk=isBuildingFreeRect(rect,buildingFootprints,.22);
  const item={along,length:7.25,side,x:pos.x,z:pos.z,yaw,
   ax:offset(start,side),bx:offset(end,side),height:.90};
  if(roadOk&&buildingOk)fence.push(item);
  else rejectedFence.push({along,reason:!roadOk?'mapped-road-or-footway':'building'});
 }
 const photoGate=fence.find(f=>Math.abs(f.along-
   PIONYRU_GATE_PANORAMA_2022.approximateAlongFromPionyruM)<.4)||null;
  // Reuse ONLY a photo-informed, whole-footprint collision-cleared fence slot.
  const trees=[],rejectedTrees=[];
 for(const [along,side,height,crown] of [
  [34,12.0,7.5,3.4],[61,12.3,8.6,4.0],[88,12.2,9.1,4.2],
  [112,12.4,7.8,3.3]
 ]){
  const mid=sample(route,along);
  if(!mid)continue;
  const pos=offset(mid,side);
  const rect={x:pos.x,z:pos.z,length:.60,depth:.60,
   yaw:Math.atan2(-mid.uz,mid.ux),buffer:.28,step:.18};
  const roadOk=isRoadFreeRect(roadClearance,rect),
   buildingOk=isBuildingFreeRect(rect,buildingFootprints,.30);
  const item={along,side,x:pos.x,z:pos.z,height,crown};
  if(roadOk&&buildingOk)trees.push(item);
  else rejectedTrees.push({along,reason:!roadOk?'mapped-road-or-footway':'building'});
 }
 // Deterministic short tapering discontinuous tones, NOT a stripe map.
 // This is an artistic treatment of the photographed patchy road surface.
 const asphaltWear=[];
 for(let i=0;i<22;i++){
  const along=8+i*5.85,span=3.5+(i%5)*2.1;
  if(along+span>route.length-5)continue;
  const side=((i*7)%9-4)*.62;
  const width=.5+(i%4)*.27;
  asphaltWear.push({along,span,side,width,alpha:.10+(i%3)*.025});
 }
 return {sourceDate:CHURCH_STREET_PHOTO_PASS.sourceDate,roadId:route.roadId,
  churchwardDirection:route.dir,photoVerifiedFeatureClasses:3,
  photoPlacementSurveyed:false,currentYear2026Verified:false,
  fenceCandidates:fence.length+rejectedFence.length,
  fenceSegments:fence.length,rejectedFence,trees,rejectedTrees,fence,
  photoTrees:trees.length,roadTonePatches:asphaltWear.length,asphaltWear,
  photoGate,photoGatePositionSurveyed:false,photographedHouseId:'202385910',
  mappedRoadsChanged:false,footwaysChanged:false,
  buildingFootprintsChanged:false,privatePropertyLinesVerified:false,
  inventedPrivateDriveways:0,paintedRoadLines:0,
  sample:(along,side=0)=>{const p=sample(route,along);return p?offset(p,side):null}};
}
export function makeChurchStreetscape2022(THREE,{
 layer,terrainAt=()=>0,roadClearance=null
}={}){
 let root=null,plan=null,geometry=[];
 const mutedConcrete=new THREE.MeshLambertMaterial({color:0x938d80});
 const railMetal=new THREE.MeshLambertMaterial({color:0x787c70});
 const gateBrown=new THREE.MeshLambertMaterial({color:0x542b23});
 const gateEmboss=new THREE.MeshLambertMaterial({color:0x794032});
 const bark=new THREE.MeshLambertMaterial({color:0x544536});
 const leaves=new THREE.MeshLambertMaterial({color:0x426745,flatShading:true});
 const leavesAlt=new THREE.MeshLambertMaterial({color:0x66864d,flatShading:true});
 const roadTone=new THREE.MeshLambertMaterial({
  color:0x847d73,transparent:true,opacity:.19,depthWrite:false,side:THREE.DoubleSide
 });
 const boxGeo=new THREE.BoxGeometry(1,1,1);
 const trunkGeo=new THREE.CylinderGeometry(.12,.17,1,7);
 const crownGeo=new THREE.IcosahedronGeometry(1,2);
 function batch(items,geo,mat,scale){
  if(!items.length)return;
  const mesh=new THREE.InstancedMesh(geo,mat,items.length);
  const obj=new THREE.Object3D();
  items.forEach((p,i)=>{
   obj.position.set(p.x,p.y,p.z);
   obj.rotation.set(0,p.yaw||0,p.roll||0,'YXZ');
   obj.scale.set(p.w,p.h,p.d);obj.updateMatrix();
   mesh.setMatrixAt(i,obj.matrix);
  });
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();
  root.add(mesh);
 }
 function create(roads,buildingFootprints=[],churchFootprint=[]){
  // A regional import is not grounds to delete an existing PHOTO scene.
  const nextPlan=planChurchStreetscape2022(roads,{roadClearance,
   buildingFootprints,churchFootprint});
  if(!nextPlan)return plan;
  reset();
  plan=nextPlan;
  root=new THREE.Group();root.name='ChurchStreetscapePhotoMay2022';
  const bases=[],posts=[],rails=[],gatePanels=[],gateDiamonds=[],trunks=[],crowns=[],crowns2=[];
  for(const f of plan.fence){
   const ground=terrainAt(f.x,f.z);
   if(plan.photoGate===f){
    // Photo confirms gate design, NOT its cadastral location. Four original
    // mesh panels replace a safe generic fence section; no invented driveway.
    const n=4,leaf=f.length/n;
    for(let i=0;i<n;i++){
     const t=(i+.5)/n;
     const gx=f.ax.x+(f.bx.x-f.ax.x)*t,gz=f.ax.z+(f.bx.z-f.ax.z)*t;
     const y=terrainAt(gx,gz)+.89;
     gatePanels.push({x:gx,y,z:gz,w:leaf-.035,h:1.70,d:.09,yaw:f.yaw});
     for(const roll of [-.62,.62])
      gateDiamonds.push({x:gx,y,z:gz,w:1.88,h:.045,d:.105,yaw:f.yaw,roll});
    }
    for(const t of [0,1]){
     const gx=f.ax.x+(f.bx.x-f.ax.x)*t,gz=f.ax.z+(f.bx.z-f.ax.z)*t;
     bases.push({x:gx,y:terrainAt(gx,gz)+.92,z:gz,
      w:.28,h:1.84,d:.31,yaw:f.yaw});
    }
    continue;
   }
   // Low textured concrete plinth with slim metal rail posts above.
   bases.push({x:f.x,y:ground+.18,z:f.z,w:f.length,h:.36,d:.19,yaw:f.yaw});
   for(let i=0;i<=4;i++){
    const t=i/4,p={x:f.ax.x+(f.bx.x-f.ax.x)*t,
     z:f.ax.z+(f.bx.z-f.ax.z)*t};
    posts.push({x:p.x,y:terrainAt(p.x,p.z)+.72,z:p.z,
     w:.075,h:.74,d:.075,yaw:0});
   }
   for(const h of [.55,.88])
    rails.push({x:f.x,y:ground+h,z:f.z,w:f.length,h:.045,d:.055,yaw:f.yaw});
  }
  for(const [i,t] of plan.trees.entries()){
   const ground=terrainAt(t.x,t.z);
   trunks.push({x:t.x,y:ground+t.height*.46,z:t.z,w:1,h:t.height*.92,d:1});
   const size=t.crown;
   const lumps=[
    {dx:0,dz:0,dy:0,r:1},
    {dx:-.48*size,dz:.07*size,dy:-.24*size,r:.67},
    {dx:.31*size,dz:-.23*size,dy:-.17*size,r:.70}
   ];
   for(const [j,l] of lumps.entries()){
    const p={x:t.x+l.dx,z:t.z+l.dz,
     y:ground+t.height+l.dy,
     w:size*l.r,h:size*.83*l.r,d:size*.94*l.r};
    (i+j)%2?crowns2.push(p):crowns.push(p);
   }
  }
  batch(bases,boxGeo,mutedConcrete);
  batch(posts,boxGeo,railMetal);
  batch(rails,boxGeo,railMetal);
   batch(gatePanels,boxGeo,gateBrown);
   batch(gateDiamonds,boxGeo,gateEmboss);
  batch(trunks,trunkGeo,bark);
  batch(crowns,crownGeo,leaves);
  batch(crowns2,crownGeo,leavesAlt);
  // One discontinuous merged planar mesh for all subtle asphalt-wear
  // patches; no road edges, no zebra lines, no painting of fake lanes.
  const points=[],indices=[];
  for(const [i,patch] of plan.asphaltWear.entries()){
   const k=points.length/3;
   for(let j=0;j<5;j++){
    const progress=j/4,
     along=patch.along+patch.span*progress,
     wav=(Math.sin(i*2.7+j*3.1))*.14,
     spanWidth=patch.width*(j===0||j===4?.55:1)*(1+wav);
    for(const sign of [-1,1]){
     const p=plan.sample(along,patch.side+sign*spanWidth*.5);
     if(!p)continue;
     points.push(p.x,terrainAt(p.x,p.z)+.188,p.z);
    }
   }
   if(points.length/3!==k+10){points.length=k*3;continue}
   for(let j=0;j<4;j++){
    const a=k+j*2,b=a+2;
    indices.push(a,a+1,b,a+1,b+1,b);
   }
  }
  if(points.length){
   const geo=new THREE.BufferGeometry();
   geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
   geo.setIndex(indices);geo.computeVertexNormals();
   const mesh=new THREE.Mesh(geo,roadTone);
   mesh.name='5kv_Photo2022_AsphaltWeathering_NoPaint';
   mesh.receiveShadow=false;mesh.renderOrder=2;
   root.add(mesh);geometry.push(geo);
  }
  root.userData.sourceDate='2022-05-09';
  root.userData.photoPlacementApproximate=true;
  root.userData.lodX=plan.fence[0]?.x??plan.trees[0]?.x??0;
  root.userData.lodZ=plan.fence[0]?.z??plan.trees[0]?.z??0;
  layer?.add(root);
  if(typeof window!=='undefined')window.__miloviceChurchPhotoStreet=status();
  return plan;
 }
 function status(){
  return {active:!!plan,rendered:!!root,sourceDate:'2022-05-09',
   photoPlacementSurveyed:false,
   fenceSegments:plan?.fenceSegments||0,
    brownGateLeaves:plan?.photoGate?4:0,
    photoGateSource:PIONYRU_GATE_PANORAMA_2022.source,
    photoGatePositionSurveyed:false,
   rejectedFenceSegments:plan?.rejectedFence.length||0,
   rightTrees:plan?.photoTrees||0,
   rejectedTrees:plan?.rejectedTrees.length||0,
   asphaltWearPatches:plan?.roadTonePatches||0,
   drawMeshes:root?.children.length||0,
   roadGeometryChanged:false,footwayGeometryChanged:false,
   buildingGeometryChanged:false,
   inventedRoadPaint:0,inventedPrivateEntrances:0};
 }
 function reset(){
  root?.parent?.remove(root);root=null;plan=null;
  for(const g of geometry)g.dispose();geometry=[];
  if(typeof window!=='undefined')window.__miloviceChurchPhotoStreet=status();
 }
 reset();
 return {create,reset,status,plan:()=>plan};
}
