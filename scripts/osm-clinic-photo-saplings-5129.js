// Milovice RP 5.129 — 3 young trees in front of Poliklinika Milovice.
// A RE/MAX exterior photo actually shows three foreground saplings and
// round planting/mulch circles between paved visitor parking and the road.
// The exact specimen species, 3D crown dimensions and surveyed coordinates
// are NOT known. Positions are model approximations anchored to real OSM:
// building 1057548624, Spojovaci 246652750, opposite footway 1092081938.
// Do NOT create a green OSM polygon, new avenue, guessed street trees,
// invented parking spaces or any traffic/pedestrian collision.
export const CLINIC_PHOTO_SAPLINGS_SOURCE=Object.freeze({
 clinic:'1057548624',street:'246652750',oppositeFootway:'1092081938',
 photo:'https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice',
 photoImage:'https://mlsf.remax-czech.cz/data/zs/423323/3002119.jpg',
 photographedForegroundYoungTreeCount:3,
 rowsObserved:1,exactGpsKnown:false,treeSpeciesKnown:false,
 bedDimensionsMeasured:false,actualGrassParcelBoundsMapped:false
});
const finite=Number.isFinite;
function vec(p){return {x:p?.x,z:p?.z??p?.y};}
function distanceToPolyline(p,points,close=false){
 let shortest=Infinity;
 const end=close?points.length:points.length-1;
 for(let i=0;i<end;i++){
  const a=vec(points[i]),b=vec(points[(i+1)%points.length]);
  if(![a.x,a.z,b.x,b.z].every(finite))return Infinity;
  const dx=b.x-a.x,dz=b.z-a.z,sq=dx*dx+dz*dz;
  if(sq<.001)continue;
  const t=Math.max(0,Math.min(1,
   ((p.x-a.x)*dx+(p.z-a.z)*dz)/sq));
  shortest=Math.min(shortest,
   Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
 }
 return shortest;
}
function insideRing(p,ring){
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=vec(ring[i]),b=vec(ring[j]);
  if(![a.x,a.z,b.x,b.z].every(finite))return true;
  if((a.z>p.z)!==(b.z>p.z)&&
     p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)
     inside=!inside;
 }
 return inside;
}
const roadValid=r=>r&&finite(r.width)&&r.width>=.6&&
 r.width<=16&&Array.isArray(r.points)&&r.points.length>=2&&
 r.points.every(p=>[vec(p).x,vec(p).z].every(finite));
export function planPhotographedClinicVergeSaplings({
 id,regionId,tags={},front,pavement,street,oppositeFootway,
 nearbyRoads=[],nearbyFootways=[],nearbyBuildings=[]
}={}){
 const src=CLINIC_PHOTO_SAPLINGS_SOURCE;
 if(String(id)!==src.clinic||regionId!=='mlada'||
  tags.name!=='Poliklinika Milovice'||tags.building!=='yes'||
  tags.amenity!=='clinic'||tags.healthcare!=='clinic'||
  !front||front.index!==2||front.nx<.95||front.uz>-.97||
  ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz,front.len]
   .every(finite)||
  Math.abs(front.len-44.86)>.5||
  Math.abs(Math.hypot(front.ux,front.uz)-1)>.01||
  Math.abs(Math.hypot(front.nx,front.nz)-1)>.01||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  !pavement||pavement.clinicId!==src.clinic||
  pavement.sourceStreetId!==src.street||
  pavement.sourceFootwayId!=='1339091016'||
  pavement.photoObservedPaving!==true||
  !Array.isArray(pavement.cells)||pavement.cells.length<300||
  !street||String(street.id)!==src.street||
  street.kind!=='residential'||street.name!=='Spojovací'||
  !roadValid(street)||street.width<6||street.width>9||
  !oppositeFootway||
  String(oppositeFootway.id)!==src.oppositeFootway||
  oppositeFootway.kind!=='footway'||
  !roadValid(oppositeFootway)||
  oppositeFootway.points.length!==2||
  !Array.isArray(nearbyRoads)||!Array.isArray(nearbyFootways)||
  !Array.isArray(nearbyBuildings)||
  !nearbyRoads.every(roadValid)||
  !nearbyFootways.every(roadValid))return null;
 // All current street/path geometry around this frontage must be supplied.
 // A second 5.128 literal-paving, 5.125 parking or invented way isn't needed.
 if(!nearbyRoads.some(r=>String(r.id)===src.street)||
  !nearbyFootways.some(r=>String(r.id)===src.oppositeFootway))
  return null;
 const polygonBuildings=nearbyBuildings.filter(b=>
  b?.tags?.building&&b.tags.building!=='roof'&&
  Array.isArray(b.points)&&b.points.length>=4);
 if(!polygonBuildings.some(b=>String(b.id)===src.clinic)||
  !polygonBuildings.some(b=>String(b.id)==='202380957'))
  return null;
 if(polygonBuildings.some(b=>b.points.some(q=>
  ![vec(q).x,vec(q).z].every(finite))))return null;
 const pavers=pavement.cells.map(cell=>{
  if(!Array.isArray(cell?.corners)||cell.corners.length!==4)return null;
  const pts=cell.corners.map(vec);
  if(pts.some(p=>![p.x,p.z].every(finite)))return null;
  return pts;
 });
 if(pavers.some(c=>!c))return null;
 const roadParts=nearbyRoads;
 const walkParts=nearbyFootways;
 const byNear=(a,b)=>({
  x:front.mx+front.ux*a+front.nx*b,
  z:front.mz+front.uz*a+front.nz*b
 });
 const proposals=[
  {along:-16.0,depth:25.2,stemHeight:2.68,canopyRadius:.90,canopyHeight:1.18},
  {along:-4.0,depth:25.2,stemHeight:2.73,canopyRadius:1.06,canopyHeight:1.29},
  {along:8.0,depth:25.2,stemHeight:2.62,canopyRadius:.95,canopyHeight:1.22}
 ];
 const saplings=[];let minRoad=Infinity,minWalk=Infinity,minBuilding=Infinity;
 const groundBuffer=.75;
 for(const [i,tree] of proposals.entries()){
  const pos=byNear(tree.along,tree.depth);
  if(Math.abs(tree.along)+tree.canopyRadius>front.len/2-1.5||
   tree.depth<=pavement.sourceRoadCenterDistance+
    street.width*.5+1.0) {
   // 2022/2023 documents do not provide as-built plant GPS.
   // This is intentionally STRICTER than accepting ambiguous road-edge sites.
   return null;
  }
  const nearestRoad=Math.min(...roadParts.map(r=>
   distanceToPolyline(pos,r.points)-r.width*.5));
  const nearestWalk=Math.min(...walkParts.map(r=>
   distanceToPolyline(pos,r.points)-r.width*.5));
  const nearestBuilding=Math.min(...polygonBuildings.map(b=>
   insideRing(pos,b.points)?-1:distanceToPolyline(pos,b.points,true)));
  if(!(nearestRoad>tree.canopyRadius+groundBuffer&&
   nearestWalk>tree.canopyRadius+groundBuffer&&
   nearestBuilding>tree.canopyRadius+1.15))
   return null;
  // The photographed saplings are OUTSIDE the old 5.123 paved lot,
  // not a replacement of its exact OSM-clipped pale paving.
  if(pavers.some(tile=>insideRing(pos,tile)))return null;
  if(saplings.some(p=>Math.hypot(p.x-pos.x,p.z-pos.z)<9))return null;
  minRoad=Math.min(minRoad,nearestRoad);
  minWalk=Math.min(minWalk,nearestWalk);
  minBuilding=Math.min(minBuilding,nearestBuilding);
  saplings.push({...tree,x:pos.x,z:pos.z,
   sourcePhotoSaplingIndex:i+1,
   saplingHeightEstimated:true,
   speciesNotInferred:true,
   exactPositionNotMeasured:true,
   trunkRadius:.078,
   soilDiskRadius:.64});
 }
 return {
  version:'5.129',sourceClinicId:src.clinic,
  sourceRoadId:src.street,
  sourceOppositeFootwayId:src.oppositeFootway,
  sourcePhoto:src.photo,photoImage:src.photoImage,
  photographedForegroundSaplings:3,
  modelledSaplings:saplings.length,
  approximateSameRow:true,numberFromPhoto:true,
  measuredTreeCoordinates:false,estimatedSaplingSizes:true,
  sourceSpeciesIdentified:false,exactBedDiameterMeasured:false,
  actualGrassParcelMapped:false,
  streetSidePlantingAreaSource:'photo only; no new OSM landuse polygon',
  modelledPlantingDisks:saplings.length,
  groundBedsPhotoSeen:true,
  minMappedRoadClearance:+minRoad.toFixed(3),
  minMappedFootwayClearance:+minWalk.toFixed(3),
  minMappedBuildingClearance:+minBuilding.toFixed(3),
  safetyBufferBeyondCrown:groundBuffer,
  existingPavingPreserved:true,existingStreetPreserved:true,
  existingFootpathsPreserved:true,
  existingOSMBuildingsPreserved:true,
  newRoads:0,newFootways:0,newParkingSpaces:0,
  newSyntheticGrassPolygons:0,newTrafficSigns:0,
  newColliders:0,newRandomTreesOutsidePhoto:0,
  trunkInstances:3,primaryCrownInstances:3,
  secondaryCrownInstances:3,soilDiskInstances:3,
  visualDrawMeshCount:4,
  saplings
 };
}
