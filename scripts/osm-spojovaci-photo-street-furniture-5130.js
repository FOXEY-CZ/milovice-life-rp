// Milovice RP 5.130 — Spojovací clinic-to-north-crossing streetscape.
// Photo-documented features ONLY: a blue "P" parking plate visible in
// SPADIA's entrance photo, and one freestanding bent-arm pole visible in
// the 2026 gynecology clinic exterior image. Unlike OSM "lit=yes", the
// pole is actually visible in a photo; its GPS, type and size are estimates.
// The surrounding street, zebra link and one-floor commercial footprint
// are real OSM; they are NOT re-created from imagined drawing.
export const SPOJOVACI_PHOTO_STREET_SOURCES=Object.freeze({
 clinicId:'1057548624',streetId:'246652750',
 clinicFootwayId:'1339091016',oppositeFootwayId:'1092081938',
 northernCrossingId:'1044078125',
 oppositeCommercialId:'202380957',
 grassPolygonId:'1454936713',
 parkingPlate:'https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/',
 streetLight:'https://gynekologie-milovice.cz/',
 photo2026:'https://gynekologie-milovice.cz/uploads/20260401061151_poliklinika-milovice.jpg',
 exactPoleCountInStreetNotKnown:true,exactPhotoFixturePositionsNotKnown:true,
 officialTrafficRestrictionNotAsserted:true
});
const num=Number.isFinite;
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>num(X(p))&&num(Z(p));
function nearest(point,path,closed=false){
 if(!Array.isArray(path)||path.length<2||path.some(p=>!finite(p)))return Infinity;
 let best=Infinity;
 const end=closed?path.length:path.length-1;
 for(let i=0;i<end;i++){
  const a=path[i],b=path[(i+1)%path.length];
  const dx=X(b)-X(a),dz=Z(b)-Z(a),den=dx*dx+dz*dz;
  if(den<1e-5)continue;
  const t=Math.max(0,Math.min(1,
    ((point.x-X(a))*dx+(point.z-Z(a))*dz)/den));
  best=Math.min(best,Math.hypot(
   point.x-X(a)-t*dx,point.z-Z(a)-t*dz));
 }
 return best;
}
function inside(point,polygon){
 let odd=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((Z(a)>point.z)!==(Z(b)>point.z)&&
   point.x<(X(b)-X(a))*(point.z-Z(a))/(Z(b)-Z(a))+X(a))
   odd=!odd;
 }
 return odd;
}
function tileContains(p,tiles,margin=.06){
 return tiles.some(c=>{
  const pts=c.corners;
  if(!Array.isArray(pts)||pts.length!==4)return false;
  // Convex 4-corner tiles, original 5.123 paving geometry.
  let last=0;
  for(let i=0;i<4;i++){
   const a=pts[i],b=pts[(i+1)%4];
   const cross=(X(b)-X(a))*(p.z-Z(a))-
    (Z(b)-Z(a))*(p.x-X(a));
   if(Math.abs(cross)<margin)return false;
   const sign=Math.sign(cross);
   if(last&&last!==sign)return false;
   last=sign;
  }
  return true;
 });
}
const isRoad=r=>r&&num(r.width)&&r.width>=1&&r.width<=16&&
 Array.isArray(r.points)&&r.points.length>=2&&
 r.points.every(finite);
export function planSpojovaciPhotoStreetFurniture({
 id,regionId,tags={},front,pavement,street,clinicFootway,
 oppositeFootway,northernCrossing,oppositeCommercial,westGrass,
 nearbyRoads=[],nearbyFootways=[],nearbyBuildings=[],
 existingPhotoSaplings=[]
}={}){
 const src=SPOJOVACI_PHOTO_STREET_SOURCES;
 if(String(id)!==src.clinicId||regionId!=='mlada'||
  tags.building!=='yes'||tags.amenity!=='clinic'||
  tags.healthcare!=='clinic'||tags.name!=='Poliklinika Milovice'||
  !front||front.index!==2||front.nx<.95||front.uz>-.97||
  ![front.mx,front.mz,front.nx,front.nz,
    front.ux,front.uz,front.len].every(num)||
  Math.abs(front.len-44.86)>.5||
  !pavement||pavement.clinicId!==src.clinicId||
  pavement.sourceStreetId!==src.streetId||
  pavement.sourceFootwayId!==src.clinicFootwayId||
  !pavement.photoObservedPaving||
  !Array.isArray(pavement.cells)||pavement.cells.length<300||
  !street||String(street.id)!==src.streetId||
  street.kind!=='residential'||street.tags?.lit!=='yes'||
  street.name!=='Spojovací'||!isRoad(street)||
  street.width<6||street.width>9||
  !clinicFootway||String(clinicFootway.id)!==src.clinicFootwayId||
  clinicFootway.kind!=='footway'||!isRoad(clinicFootway)||
  !oppositeFootway||String(oppositeFootway.id)!==src.oppositeFootwayId||
  oppositeFootway.kind!=='footway'||!isRoad(oppositeFootway)||
  !northernCrossing||
  String(northernCrossing.id)!==src.northernCrossingId||
  northernCrossing.tags?.footway!=='crossing'||
  northernCrossing.tags?.crossing!=='marked'||
  northernCrossing.tags?.['crossing:markings']!=='yes'||
  northernCrossing.kind!=='footway'||!isRoad(northernCrossing)||
  !oppositeCommercial||
  String(oppositeCommercial.id)!==src.oppositeCommercialId||
  oppositeCommercial.tags?.building!=='commercial'||
  oppositeCommercial.tags?.['building:levels']!=='1'||
  !Array.isArray(oppositeCommercial.points)||
  oppositeCommercial.points.length<10||
  !westGrass||String(westGrass.id)!==src.grassPolygonId||
  westGrass.tags?.landuse!=='grass'||
  !Array.isArray(westGrass.points)||westGrass.points.length<10||
  !nearbyRoads.some(r=>String(r.id)===src.streetId)||
  !nearbyFootways.some(r=>String(r.id)===src.clinicFootwayId)||
  !nearbyFootways.some(r=>String(r.id)===src.northernCrossingId)||
  !Array.isArray(nearbyBuildings)||!nearbyBuildings.some(
   b=>String(b.id)===src.clinicId)||
  !nearbyBuildings.some(b=>String(b.id)===src.oppositeCommercialId)||
  !nearbyRoads.every(isRoad)||!nearbyFootways.every(isRoad)||
  !Array.isArray(existingPhotoSaplings)||
  existingPhotoSaplings.length!==3||
  existingPhotoSaplings.some(p=>!finite(p)))return null;
 const toWorld=(a,b)=>({
  x:front.mx+front.ux*a+front.nx*b,
  z:front.mz+front.uz*a+front.nz*b
 });
 // Positioned by photo relative to the OSM east-facing wall, not a
 // measured location. Kept away from the 5.127 yellow X and 5.125
 // parking separators. The photographed poles are visual only.
 const specs=[
  {kind:'parkingP',along:-6.2,depth:4,postHeight:2.5,
   plateWidth:.65,plateHeight:.65},
  {kind:'singleBentStreetLamp',along:-18,depth:4.8,
   postHeight:5.8,armLength:.85}
 ];
 const items=[],metadata=[];
 for(const spec of specs){
  const p=toWorld(spec.along,spec.depth);
  const roadDistance=Math.min(...nearbyRoads.map(r=>
   nearest(p,r.points)-r.width/2));
  const walkDistance=Math.min(...nearbyFootways.map(r=>
   nearest(p,r.points)-r.width/2));
  const nearBuilding=Math.min(...nearbyBuildings.filter(
   b=>Array.isArray(b.points)&&b.points.length>=4).map(b=>
   inside(p,b.points)?-1:nearest(p,b.points,true)));
  const saplingDistance=Math.min(...existingPhotoSaplings.map(
   s=>Math.hypot(p.x-X(s),p.z-Z(s))));
  if(!tileContains(p,pavement.cells)||roadDistance<1.25||
   walkDistance<1.25||nearBuilding<1.7||
   saplingDistance<3.25)return null;
  items.push({...spec,x:p.x,z:p.z,
   photographedFixtureType:true,
   exactGPSUnmeasured:true,
   sizeEstimated:true, noGameplayCollision:true});
  metadata.push({kind:spec.kind,
   roadClearance:+roadDistance.toFixed(2),
   footwayClearance:+walkDistance.toFixed(2),
   buildingClearance:+nearBuilding.toFixed(2),
   saplingClearance:+saplingDistance.toFixed(2),
   onSourcePaving:true});
 }
 return {
  version:'5.130',
  sourceClinicId:src.clinicId,sourceStreetId:src.streetId,
  sourceNearFootwayId:src.clinicFootwayId,
  sourceFarFootwayId:src.oppositeFootwayId,
  sourceNorthernCrossingId:src.northernCrossingId,
  sourceOppositeCommercialId:src.oppositeCommercialId,
  sourceWestGrassId:src.grassPolygonId,
  sourceParkingSignPhoto:src.parkingPlate,
  sourceStreetLampPhoto:src.streetLight,
  photoLampFixtureActuallyVisible:true,
  photoBlueParkingPlateActuallyVisible:true,
  photographedTypesOnly:true,exactFixtureGPSKnown:false,
  totalPhysicalPolesInStreetKnown:false,
  parkingRightsOrReservedSpaceAsserted:false,
  existingOSMCrossingPreserved:true,
  oppositeBuildingExactlyOneOSMLevel:true,
  nearbyCrossingAlreadyRenderedByMappedPedestrianSystem:true,
  noNewRoadOrFootwayGeometry:true,
  sourcePavingCellsPreserved:true,
  nearbyMappedGreenAreaUntouched:true,
  newRoads:0,newFootways:0,newCrosswalks:0,
  newParkingBays:0,newTrafficRestrictions:0,
  newTrees:0,newColliders:0,
  plannedVisibleFixtures:2,
  plannedDrawMeshes:5,
  renderItems:items,
  clearanceAudit:metadata
 };
}
