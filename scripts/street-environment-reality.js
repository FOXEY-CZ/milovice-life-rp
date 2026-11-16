// Milovice RP 5.26.2 — photo-informed STREET scene, including full ground footprints.
// Original model geometry; no photographed pixels or proprietary panorama assets.
// The only precisely known spatial datum is the photo-camera GPS position.
// Street-furniture positions relative to the road are approximate and tracked.
import {isRoadFreeRect} from './road-clearance.js';
// 5.82: historical-photo feature limits: NEVER multiply a unique object.
export const STREET_PASS_03_FEATURE_POLICY=Object.freeze({
 sourceDate:'2014-07-26',photoObservedTrees:1,photoObservedUtilityPoles:1,
 extraTreesDisabled:true,unmappedSecondUtilityPoleDisabled:true,
 unverifiedPowerLineSpanDisabled:true,exactPlacementsSurveyed:false
});
export const PHOTO_STREET_ENVIRONMENT=[
 {
  id:'street-5-kvetna-2014',
  name:'5. května · ulice, zeleň a orientační značení',
  osmRoadId:'219273174',
  latitude:50.227797,longitude:14.884813,
  source:'https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg',
  photoAuthor:'Tiia Monto',photoLicense:'CC BY-SA 4.0',photoDate:'2014-07-26',
  observed:['asphalt road','narrow roadside paving','trimmed street tree',
   'low hedges and planted flowers','directional signs reading Městská policie, Sběrný dvůr, Mirakulum',
   'timber utility pole and overhead cable','brick/stone property boundary and wooden gate'],
  accuracy:'Photo features observed; exact positions are modelling estimates. The 2014 scene may have changed by 2026.'
 }
];
const COS_LAT=Math.cos(50.226*Math.PI/180);
export function gpsToStreetWorld(latitude,longitude){
 return {x:(longitude-14.889)*111320*COS_LAT,z:-(latitude-50.226)*111320};
}
export function nearestPhotoRoadSegment(road,latitude,longitude){
 const target=gpsToStreetWorld(latitude,longitude);
 if(!road?.points||road.points.length<2)return null;
 let best=null;
 for(let i=1;i<road.points.length;i++){
  const a=road.points[i-1],b=road.points[i];
  const dx=b.x-a.x,dz=b.y-a.y,lenSq=dx*dx+dz*dz;
  if(lenSq<1)continue;
  const t=Math.max(0,Math.min(1,((target.x-a.x)*dx+(target.z-a.y)*dz)/lenSq));
  const x=a.x+dx*t,z=a.y+dz*t,dist=Math.hypot(x-target.x,z-target.z);
  if(!best||dist<best.distance){
   const len=Math.sqrt(lenSq);
   best={x,z,ux:dx/len,uz:dz/len,nx:-dz/len,nz:dx/len,
    width:road.width||9,distance:dist,segmentIndex:i,osmRoadId:String(road.osmId)};
  }
 }
 return best;
}
export function makePhotoStreetEnvironment(THREE,{layer,terrainAt=()=>0,roadClearance=null}={}){
 const entries=new Set(),groups=new Set(),data=[];
 const colors={
  bark:new THREE.MeshLambertMaterial({color:0x69503d}),
  leaf:new THREE.MeshLambertMaterial({color:0x46683c,flatShading:true}),
  leafLight:new THREE.MeshLambertMaterial({color:0x65824a,flatShading:true}),
  hedge:new THREE.MeshLambertMaterial({color:0x355e35,flatShading:true}),
  grass:new THREE.MeshLambertMaterial({color:0x718e51}),
  soil:new THREE.MeshLambertMaterial({color:0x796c50}),
  flowers:new THREE.MeshLambertMaterial({color:0xffffff,side:THREE.DoubleSide}),
  metal:new THREE.MeshLambertMaterial({color:0x4a5553}),
  timber:new THREE.MeshLambertMaterial({color:0x5e4234}),
  stone:new THREE.MeshLambertMaterial({color:0xc8c2b3}),
  pole:new THREE.MeshLambertMaterial({color:0x79614e}),
  fence:new THREE.MeshLambertMaterial({color:0x5a4d43}),
  roadSign:new THREE.MeshBasicMaterial({color:0x4a3327}),
  pavement:new THREE.MeshLambertMaterial({color:0xb9b6a9}),
  pavementAlt:new THREE.MeshLambertMaterial({color:0xa8a79f}),
  curb:new THREE.MeshLambertMaterial({color:0xd1cec1}),
  drainage:new THREE.MeshLambertMaterial({color:0x4c5556}),
  mortar:new THREE.MeshLambertMaterial({color:0x968e82})
 };
 const geometries={
  box:new THREE.BoxGeometry(1,1,1),
  trunk:new THREE.CylinderGeometry(.14,.21,2.8,7),
  crown:new THREE.IcosahedronGeometry(1,2),
  hedge:new THREE.BoxGeometry(1,1,1),
  flower:new THREE.IcosahedronGeometry(.17,0),
  stem:new THREE.CylinderGeometry(.025,.028,.42,4),
  wire:new THREE.CylinderGeometry(.015,.015,1,4)
 };
 let drawMeshes=0,instances=0,featureCount=0;
 let pavementPieces=0,roadRejected=0;
 const emptyStats=()=>({sources:PHOTO_STREET_ENVIRONMENT.length,sceneCount:entries.size,
  minRoadClearance:data.length?Math.min(...data.map(v=>v.minimumRoadClearance)):null,
  chosenSides:data.map(v=>v.sideSign),
  pavementPieces,roadRejected,unverifiedPhotoPavingDisabled:true,checkedGreeneryAgainstRoads:true,
  fullFootprintChecked:true,
  photoObservedTrees:STREET_PASS_03_FEATURE_POLICY.photoObservedTrees,
  photoObservedUtilityPoles:STREET_PASS_03_FEATURE_POLICY.photoObservedUtilityPoles,
  duplicatedPhotoTreeDisabled:true,duplicatedPhotoPoleDisabled:true,
  unverifiedOverheadSpanDisabled:true,
  drawMeshes,instances,featureCount,ids:[...entries],spatiallyApproximate:true,
  scope:'Photo-informed street environments, not exact surveyed positions'});
 function report(){if(typeof window!=='undefined')window.__miloviceStreetEnvironment=emptyStats()}
 function placeOnRoad(anchor,along,sideDistance){
  return {x:anchor.x+anchor.ux*along+anchor.nx*sideDistance,
   z:anchor.z+anchor.uz*along+anchor.nz*sideDistance};
 }
 function addParts(group,geo,material,items,{colorsList=null}={}){
  if(!items.length)return;
  const mesh=new THREE.InstancedMesh(geo,material,items.length);
  const dummy=new THREE.Object3D(),color=new THREE.Color();
  for(let i=0;i<items.length;i++){
   const item=items[i];dummy.position.set(item.x,item.y,item.z);
   dummy.rotation.set(item.rx||0,item.ry||0,item.rz||0);
   dummy.scale.set(item.sx||1,item.sy||1,item.sz||1);
   dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
   if(colorsList)mesh.setColorAt(i,color.setHex(colorsList[i%colorsList.length]));
  }
  mesh.instanceMatrix.needsUpdate=true;
  if(colorsList)mesh.instanceColor.needsUpdate=true;
  mesh.computeBoundingSphere();group.add(mesh);drawMeshes++;instances+=items.length;
 }
 function itemAt(anchor,along,sideDistance,y,sx=1,sy=1,sz=1,ry=0){
  const p=placeOnRoad(anchor,along,sideDistance);
  return {x:p.x,y:terrainAt(p.x,p.z)+y,z:p.z,sx,sy,sz,ry};
 }
 // Check EACH actual model footprint against all mapped vehicle and
 // pedestrian surfaces, not only the source photo's rough camera anchor.
 function photoGroundClearance(anchor,along,sideDistance,radius=.5){
  const p=placeOnRoad(anchor,along,sideDistance);
  const safe=!roadClearance||roadClearance.isClear(p.x,p.z,radius,.20);
  if(!safe)roadRejected++;
  return safe;
 }
 // The full ground footprint of a gate, wall, flowerbed or hedge must
 // clear every mapped vehicle AND pedestrian lane, not just the model centre.
 function photoRectClearance(anchor,along,sideDistance,length,depth){
  const p=placeOnRoad(anchor,along,sideDistance);
  const yaw=Math.atan2(-anchor.uz,anchor.ux);
  const safe=!roadClearance||isRoadFreeRect(roadClearance,{
   x:p.x,z:p.z,length,depth,yaw,buffer:.14
  });
  if(!safe)roadRejected++;
  return safe;
 }
 function treeRow(group,anchor,side){
  // Y rotation aligns a local box X-axis with the real OSM street tangent.
  // One documented tree; two crown meshes create one canopy, not two trees.
  const trunks=[],crowns=[],smallCrowns=[],hedges=[],beds=[],soil=[],flowers=[],stems=[];
  for(const [along,size] of [[-17,1]]){
   if(!photoGroundClearance(anchor,along,side,.8*size))continue;
   const pos=itemAt(anchor,along,side,0);
   const y=terrainAt(pos.x,pos.z);
   trunks.push({...pos,y:y+1.40*size,sx:size,sy:size,sz:size});
   crowns.push({...pos,y:y+3.16*size,sx:1.52*size,sy:1.34*size,sz:1.48*size});
   smallCrowns.push({...pos,x:pos.x+.21*size,y:y+3.31*size,z:pos.z-.14*size,sx:1.15*size,sy:.93*size,sz:1.1*size});
  }
  // One short photographed hedge, not an invented hedge row up the road.
  for(let i=0;i<2;i++){
   const a=-26+i*2.05,offset=side+Math.sign(side)*.76;
   if(!photoRectClearance(anchor,a,offset,2.0,1.05))continue;
   const at=itemAt(anchor,a,offset,0);
   beds.push({...at,y:at.y+.015,sx:2.00,sy:.06,sz:1.05,ry:Math.atan2(-anchor.uz,anchor.ux)});
   hedges.push({...at,y:at.y+.43,sx:1.68,sy:.79,sz:.6,ry:Math.atan2(-anchor.uz,anchor.ux)});
  }
  // Compact observed planted patch; positions remain photo-estimated.
  for(let i=0;i<8;i++){
   const along=-24+(i%4)*.55;
   const out=side+Math.sign(side)*(.1+Math.floor(i/4)*.4);
   if(!photoGroundClearance(anchor,along,out,.25))continue;
   const at=itemAt(anchor,along,out,.1);
   stems.push({...at,y:at.y+.16});
   flowers.push({...at,y:at.y+.43,sx:.9,sy:.75,sz:.9});
  }
  addParts(group,geometries.trunk,colors.bark,trunks);
  addParts(group,geometries.crown,colors.leaf,crowns);
  addParts(group,geometries.crown,colors.leafLight,smallCrowns);
  addParts(group,geometries.box,colors.grass,beds);
  addParts(group,geometries.hedge,colors.hedge,hedges);
  addParts(group,geometries.stem,colors.hedge,stems);
  addParts(group,geometries.flower,colors.flowers,flowers,{colorsList:[0xe6b355,0xe8d6c7,0xc78b88,0xf0e3be,0xa57cba]});
  featureCount+=trunks.length+hedges.length+flowers.length;
 }
 function makeSignMap(text){
  const c=document.createElement('canvas');c.width=512;c.height=88;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#694834';ctx.fillRect(0,0,512,88);
  ctx.strokeStyle='#e2d1b1';ctx.lineWidth=4;ctx.strokeRect(5,5,502,78);
  ctx.fillStyle='#fff6df';ctx.font='bold 37px sans-serif';
  ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('◀  '+text,27,44,462);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
 }
 function signs(group,anchor,side){
  // These THREE sign inscriptions are visible in the dated public photo.
  // The exact pole position/orientation cannot be recovered from one image.
  if(!photoGroundClearance(anchor,6,side+Math.sign(side)*.08,.4))return;
  const at=itemAt(anchor,6,side+Math.sign(side)*.08,0);
  addParts(group,geometries.wire,colors.metal,[{...at,y:at.y+2.02,sy:4.04,sx:2.8,sz:2.8}]);
  for(const [i,text] of ['Městská policie','Sběrný dvůr','Mirakulum'].entries()){
   const texture=makeSignMap(text);
   const signMaterial=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
   const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.12,.365),signMaterial);
   sign.position.set(at.x,at.y+3.26-i*.43,at.z);
   sign.rotation.y=Math.atan2(-anchor.uz,anchor.ux);
   group.add(sign);drawMeshes++;
  }
  featureCount+=4;
 }
 function wallAndGate(group,anchor,side){
  // The 2014 photo identifies a wall and gate, but neither its footprint nor
  // its side-of-street is surveyed. Reject COMPLETE segments that cross OSM.
  const stone=[],timber=[],caps=[],joints=[],slats=[];
  const yaw=Math.atan2(-anchor.uz,anchor.ux);
  const outer=side+Math.sign(side)*4.30;
  for(let i=0;i<4;i++){
   const along=12+i*2.25;
   // Largest ground footprint is the 2.31m masonry cap, not the centre stone.
   if(!photoRectClearance(anchor,along,outer,2.31,.52))continue;
   stone.push(itemAt(anchor,along,outer,.65,2.24,1.3,.34,yaw));
   caps.push(itemAt(anchor,along,outer,1.32,2.31,.10,.46,yaw));
   for(let j=0;j<2;j++)joints.push(itemAt(anchor,along-.75+j*1.5,
    outer+Math.sign(side)*.18,.72,.045,.83,.015,yaw));
  }
  for(const along of [11.25,21.9]){
   if(photoRectClearance(anchor,along,outer,.5,.5))
    stone.push(itemAt(anchor,along,outer,.97,.48,1.94,.50));
  }
  const gateAlong=20,gateOffset=outer+Math.sign(side)*.06;
  if(photoRectClearance(anchor,gateAlong,gateOffset,3.5,.35)){
   timber.push(itemAt(anchor,gateAlong,outer+Math.sign(side)*.06,
    1.09,3.5,1.77,.13,yaw));
   for(let i=0;i<9;i++)slats.push(itemAt(anchor,18.55+i*.34,
    outer+Math.sign(side)*.10,1.10,.07,1.60,.035,yaw));
  }
  addParts(group,geometries.box,colors.stone,stone);
  addParts(group,geometries.box,colors.timber,timber);
  addParts(group,geometries.box,colors.curb,caps);
  addParts(group,geometries.box,colors.mortar,joints);
  addParts(group,geometries.box,colors.fence,slats);
  featureCount+=stone.length+timber.length+caps.length+joints.length+slats.length;
 }
 function utility(group,anchor,side){
  // 2014 photo visibly contains ONE timber pole with a crossbar.
  // The second pole and its 63m cable span previously extrapolated from
  // a single image were not grounded in mapped pole endpoints.
  const poleOffset=side+Math.sign(side)*3.6;
  if(!photoGroundClearance(anchor,28,poleOffset,.52))return;
  const at=itemAt(anchor,28,poleOffset,0);
  addParts(group,geometries.trunk,colors.pole,[
   {...at,y:at.y+3.4,sx:1.1,sy:5.2/2.8,sz:1.1}
  ]);
  const yaw=Math.atan2(-anchor.uz,anchor.ux);
  addParts(group,geometries.box,colors.timber,[
   {...at,y:at.y+6.10,sx:2.8,sy:.13,sz:.16,ry:yaw}
  ]);
  featureCount+=2;
 }
 function addFromRoads(roads){
  if(!Array.isArray(roads))return 0;
  let created=0;
  for(const ref of PHOTO_STREET_ENVIRONMENT){
   if(entries.has(ref.id))continue;
   const road=roads.find(r=>String(r.osmId)===ref.osmRoadId);
   if(!road)continue;
   const anchor=nearestPhotoRoadSegment(road,ref.latitude,ref.longitude);
   if(!anchor||anchor.distance>18)continue;
   // 5.82: The old GLOBAL min-clearance gate included -35m and another
   // unphotographed end, so one mapped side path hid this entire street
   // scene. Never discard a supported tree/sign merely because a different
   // object 50m away is unsafe. Individual props keep their OWN conservative
   // road/footway checks in treeRow/signs/wallAndGate/utility.
   // GPS of a photographer still does NOT establish which side contains
   // each particular item; keep this scored side choice provisional.
   const halfWidth=anchor.width*.5+2.65;
   const sideCandidates=[
    {along:-17,out:0,radius:.8}, // one visible pruned tree
    {along:-26,out:.76,radius:1.1}, // one short hedge/bed
    {along:6,out:.08,radius:.4}, // named historical signpost
    {along:16,out:4.3,radius:1.3}, // house-boundary wall (approximate)
    {along:28,out:3.6,radius:.52} // one photographed utility pole
   ];
   function clearanceScore(sign){
    if(!roadClearance)return {accepted:0,minimum:-Infinity};
    let accepted=0,minimum=Infinity;
    for(const sample of sideCandidates){
     const offset=sign*(halfWidth+sample.out);
     const p=placeOnRoad(anchor,sample.along,offset);
     const match=roadClearance.nearest(p.x,p.z);
     const available=match?.clearance??Infinity;
     if(available>=sample.radius+.2){accepted++;
      minimum=Math.min(minimum,available);}
    }
    return {accepted,minimum:accepted?minimum:null};
   }
   const leftScore=clearanceScore(1),rightScore=clearanceScore(-1);
   const sideSign=leftScore.accepted>=rightScore.accepted?1:-1;
   const choice=sideSign>0?leftScore:rightScore;
   // At least one independent feature must be placed off OSM road.
   // Otherwise adding a photo-inspired scene would be unjustified.
   if(choice.accepted===0)continue;
   const minimumRoadClearance=choice.minimum;
   const side=sideSign*halfWidth;
   const root=new THREE.Group();
   root.userData.lodX=anchor.x;root.userData.lodZ=anchor.z;
   root.userData.lodDetail=true;
   root.userData.photoEnvironment=true;
   root.userData.photoReference=ref.id;
   // 5.26 Strict Reality: previous 156 slab/curb instances were invented
   // from one photograph and duplicated the actual mapped OSM footways.
   // Only the georeferenced OSM sidewalk renders paving now.
   treeRow(root,anchor,side);
   signs(root,anchor,side);
   wallAndGate(root,anchor,side);
   utility(root,anchor,side);
   if(layer)layer.add(root);
   groups.add(root);entries.add(ref.id);created++;
   data.push({id:ref.id,osmRoadId:ref.osmRoadId,anchorDistance:anchor.distance,
    x:anchor.x,z:anchor.z,ux:anchor.ux,uz:anchor.uz,
    sideSign,eligibleFeatureAnchors:choice.accepted,minimumRoadClearance,
    source:ref.source,photoDate:ref.photoDate});
  }
  report();return created;
 }
 function reset(){
  for(const g of groups){
   if(g.parent)g.parent.remove(g);
   g.traverse(mesh=>{
    if(mesh.isMesh&&mesh.geometry&&![geometries.box,geometries.trunk,
      geometries.crown,geometries.hedge,geometries.flower,geometries.stem,
      geometries.wire].includes(mesh.geometry))mesh.geometry.dispose();
    if(mesh.isMesh&&mesh.material?.map&&mesh.material.map.isCanvasTexture)mesh.material.map.dispose();
   });
  }
  entries.clear();groups.clear();data.length=0;
  drawMeshes=instances=featureCount=pavementPieces=roadRejected=0;report();
 }
 report();
 return {addFromRoads,reset,status:emptyStats,anchors:()=>data.slice()};
}
