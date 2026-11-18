// Milovice RP 5.125 — photographed brick-red parking-bay inlays at clinic.
// Aug 2022 municipal DIO documents perpendicular parking spaces + pavement
// beside Spojovaci. The 2023 ABP completed-building photograph actually
// shows narrow red/brown inset separator strips in pale block paving.
// Their spacing, exact count and end positions are UNMEASURED; they are
// conservative visual approximations, NOT map-authenticated parking slots.
export const CLINIC_PARKING_INLAY_SOURCES=Object.freeze({
 buildingWay:'1057548624',
 streetWay:'246652750',
 mappedSidewalkWay:'1339091016',
 completedPhoto:'https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice',
 municipal2022DIO:'https://ud.mestolysa.cz/vr2022/vm09/MULL0B019BZD_0/MULL0B019C01/DIO_sing.pdf',
 evidence:'2023 ABP completed exterior shows reddish narrow pavement inlays dividing perpendicular parking',
 type:'visual-inlay-only',
 exactMarkedSpacesUnknown:true
});
const num=Number.isFinite;
const p3=p=>({x:p?.x,z:p?.z??p?.y});
function distToPolyLine(pt,points){
 let d=Infinity;
 for(let i=1;i<points.length;i++){
  const a=p3(points[i-1]),b=p3(points[i]);
  if(!num(a.x)||!num(a.z)||!num(b.x)||!num(b.z))return Infinity;
  const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
  if(den<.005)continue;
  const t=Math.max(0,Math.min(1,
   ((pt.x-a.x)*dx+(pt.z-a.z)*dz)/den));
  d=Math.min(d,Math.hypot(pt.x-a.x-dx*t,pt.z-a.z-dz*t));
 }
 return d;
}
const nearly=(a,b,t=.02)=>Math.abs(a-b)<t;
export function planPhotographedClinicParkingInlays({
 id,regionId,tags={},front,pavement,
 street,footway,preExistingCarriageways=[]
}={}){
 const src=CLINIC_PARKING_INLAY_SOURCES;
 if(String(id)!==src.buildingWay||regionId!=='mlada'||
  tags.building!=='yes'||tags.amenity!=='clinic'||
  tags.name!=='Poliklinika Milovice'||tags.healthcare!=='clinic'||
  !front||front.index!==2||front.nx<.95||
  ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz,front.len].every(num)||
  !nearly(front.len,44.86,.5)||
  !pavement||pavement.clinicId!==src.buildingWay||
  pavement.sourceStreetId!==src.streetWay||
  pavement.sourceFootwayId!==src.mappedSidewalkWay||
  pavement.photoObservedPaving!==true||
  pavement.inferredParkingBays!==0||
  !Array.isArray(pavement.cells)||pavement.cells.length<120||
  pavement.pavedModelArea<400||pavement.pavedModelArea>700||
  !street||String(street.id)!==src.streetWay||
  street.kind!=='residential'||street.name!=='Spojovací'||
  !num(street.width)||street.width<6||street.width>9||
  !Array.isArray(street.points)||street.points.length<3||
  !footway||String(footway.id)!==src.mappedSidewalkWay||
  footway.kind!=='footway'||footway.tags?.lit!=='yes'||
  !Array.isArray(footway.points)||footway.points.length!==5||
  !Array.isArray(preExistingCarriageways))return null;
 const fp={x:front.mx,z:front.mz};
 const footDistance=distToPolyLine(fp,footway.points);
 const roadDistance=distToPolyLine(fp,street.points);
 if(!(footDistance>5.5&&footDistance<11.5&&
  roadDistance>16&&roadDistance<21))return null;
 const depthStart=Math.max(9.95,footDistance+1.30);
 const depthEnd=Math.min(13.45,roadDistance-street.width*.5-.80);
 if(depthEnd-depthStart<2.35)return null;
 // Read the SAME road-/building-clipped cells used by the 5.123 paving
 // rather than estimating a new parcel or making a fake road/parking lot.
 const toLocal=p=>{
  const x=p.x-front.mx,z=p.z-front.mz;
  return {a:x*front.ux+z*front.uz,
   b:x*front.nx+z*front.nz};
 };
 const cells=pavement.cells.map(cell=>{
  if(cell?.corners?.length!==4)return null;
  const p=cell.corners.map(toLocal);
  if(p.some(q=>!num(q.a)||!num(q.b)))return null;
  return {amin:Math.min(...p.map(q=>q.a)),
   amax:Math.max(...p.map(q=>q.a)),
   bmin:Math.min(...p.map(q=>q.b)),
   bmax:Math.max(...p.map(q=>q.b))};
 });
 if(cells.some(c=>!c))return null;
 const safeInPaving=(along,depth)=>cells.some(cell=>
  along>=cell.amin+.012&&along<=cell.amax-.012&&
  depth>=cell.bmin+.012&&depth<=cell.bmax-.012);
 const world=(along,depth)=>({
  x:front.mx+front.ux*along+front.nx*depth,
  z:front.mz+front.uz*along+front.nz*depth
 });
 const allRoads=preExistingCarriageways.filter(road=>
  Array.isArray(road?.points)&&road.points.length>1&&
  num(road.width)&&road.width>2.4&&road.width<16);
 if(!allRoads.some(r=>String(r.id)===src.streetWay))allRoads.push(street);
 const strokeWidth=.105,half=strokeWidth*.5;
 const stops=7; // 7 DEM-sampled segments, not 7 separate draw meshes.
 const lines=[];let rejectedAsphalt=0,rejectedSidewalk=0,rejectedPaving=0;
 const plannedAlong=[];
 for(let a=-17.875;a<=17.876;a+=2.75)plannedAlong.push(a);
 for(const along of plannedAlong){
  const samples=[];
  for(let j=0;j<=stops;j++){
   const depth=depthStart+(depthEnd-depthStart)*j/stops;
   for(const offset of [-half,+half]){
    const p=world(along+offset,depth);
    if(!safeInPaving(along+offset,depth)){samples.length=0;break;}
    samples.push(p);
   }
   if(!samples.length)break;
  }
  if(samples.length!==(stops+1)*2){rejectedPaving++;continue;}
  const nearFootway=samples.some(p=>
   distToPolyLine(p,footway.points)<1.03);
  if(nearFootway){rejectedSidewalk++;continue;}
  const onRoad=samples.some(p=>allRoads.some(r=>
   distToPolyLine(p,r.points)-r.width*.5<.32));
  if(onRoad){rejectedAsphalt++;continue;}
  lines.push({along,depthStart,depthEnd,width:strokeWidth,
   segments:stops,samples});
 }
 if(lines.length<7||lines.length>14)return null;
 return {
  version:'5.125',osmClinicId:src.buildingWay,
  streetWayId:src.streetWay,footwayId:src.mappedSidewalkWay,
  photoSource:src.completedPhoto,
  civilEngineeringSource:src.municipal2022DIO,
  parkingPresencePhotoConfirmed:true,
  directionPerpendicularToMappedFacade:true,
  reddishInlaysSeenOnPhoto:true,
  spacingMetresApproximate:true,
  exactStallCountKnown:false,
  modelledSeparatorCount:lines.length,
  actualParkingBayCountClaimed:0,
  paintedPavementStripsNotVehicles:true,
  widthsEstimated:true,paverTextureMeasured:false,
  material:'one-shared-red-inlay',
  drawMeshes:1,triangleCount:lines.length*stops*2,
  minRoadClearanceTargetMeters:.32,
  minSidewalkClearanceTargetMeters:1.03,
  rejectedAsphalt,rejectedSidewalk,rejectedPaving,
  originalOSMDataPreserved:true,streetGeometryChanged:false,
  originalPavingPreserved:true,
  pedestrianCollisionChanged:false,
  newParkingLotPolygons:0,newParkingRoads:0,newRoads:0,
  newFootways:0,newZebraCrossings:0,newParkingSigns:0,
  lines
 };
}
