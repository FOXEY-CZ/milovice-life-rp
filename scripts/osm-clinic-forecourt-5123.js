// 5.123 — Spojovací 873: photo-observed, OSM-bounded clinic forecourt.
// ABP 2023 and later photos show pale rectangular paving ACROSS the whole
// east-facing clinic frontage. This pass changes only visual ground SURFACE.
// It does NOT establish exact cadastral lot edges, car stall count, painted
// lines, paths, driveways or a public parking entitlement.
export const CLINIC_FORECOURT_SOURCE=Object.freeze({
 clinic:'1057548624',
 street:'246652750',
 walkingWay:'1339091016',
 photo:'https://www.abpholding.cz/en/project-detail/65/polyclinic-building-milovice',
 recentPhoto:'https://www.remax-czech.cz/reality/detail/423323/pronajem-komercniho-prostoru-41-m2-milovice',
 evidence:'Large pale paving-stone public-facing forecourt visible between clinic facade and Spojovaci road'
});
const get=p=>({x:p?.x,z:p?.z??p?.y});
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z);
function distanceToLine(p,points){
 let d=Infinity;
 for(let i=1;i<points.length;i++){
  const a=get(points[i-1]),b=get(points[i]);
  if(!finite(a)||!finite(b))return Infinity;
  const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
  if(den<.01)continue;
  const t=Math.max(0,Math.min(1,
   ((p.x-a.x)*dx+(p.z-a.z)*dz)/den));
  d=Math.min(d,Math.hypot(p.x-a.x-dx*t,p.z-a.z-dz*t));
 }
 return d;
}
function withinBounds(p,poly){
 let inside=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a.z>p.z)!==(b.z>p.z)&&
    p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
}
function area(poly){
 let v=0;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  v+=a.x*b.z-b.x*a.z;
 }
 return Math.abs(v)*.5;
}
export function planClinicPhotographedForecourt({
 id,regionId,tags={},polygon=[],front,
 street=null,walkingWay=null,carriageways=[]
}={}){
 const key=CLINIC_FORECOURT_SOURCE;
 if(String(id)!==key.clinic||regionId!=='mlada'||
  tags.name!=='Poliklinika Milovice'||tags.amenity!=='clinic'||
  tags.building!=='yes'||tags.healthcare!=='clinic'||
  !Array.isArray(polygon)||polygon.length!==4||
  polygon.some(p=>!finite(get(p)))||
  !front||front.index!==2||!Number.isFinite(front.len)||
  front.len<44.4||front.len>45.3||
  ![front.mx,front.mz,front.ux,front.uz,front.nx,front.nz]
   .every(Number.isFinite)||
  Math.abs(Math.hypot(front.ux,front.uz)-1)>.01||
  Math.abs(Math.hypot(front.nx,front.nz)-1)>.01||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  front.nx<.95||
  !street||String(street.id)!==key.street||
  street.kind!=='residential'||street.name!=='Spojovací'||
  !Number.isFinite(street.width)||street.width<6||street.width>9||
  !Array.isArray(street.points)||street.points.length<3||
  !walkingWay||String(walkingWay.id)!==key.walkingWay||
  walkingWay.kind!=='footway'||walkingWay.tags?.lit!=='yes'||
  !Array.isArray(walkingWay.points)||walkingWay.points.length!==5||
  !Array.isArray(carriageways))return null;
 const building=polygon.map(get);
 if(Math.abs(area(building)-827.58)>1)return null;
 const facadeCenter={x:front.mx,z:front.mz};
 const roadDistance=distanceToLine(facadeCenter,street.points);
 const footwayDistance=distanceToLine(facadeCenter,walkingWay.points);
 if(!(roadDistance>16&&roadDistance<21&&
  footwayDistance>5.5&&footwayDistance<11.5))return null;
 // 1.2-m modular *rendering* sampling: NOT 1.2-m actual paver blocks.
 // The photographed courtyard extends to Spojovací. Do not paint
 // over the mapped road carriageway or the building polygon.
 const alongMin=-front.len*.5+.72;
 const alongMax=front.len*.5-.72;
 const outwardMin=.42;
 const outwardMax=Math.min(15,roadDistance-street.width*.5-.14);
 const alongSteps=Math.ceil((alongMax-alongMin)/1.28);
 const depthSteps=Math.ceil((outwardMax-outwardMin)/1.08);
 if(alongSteps<22||depthSteps<8||depthSteps>17)return null;
 const nearRoads=[];
 for(const road of carriageways){
  if(!road||!Number.isFinite(road.width)||road.width<2.5||
   !Array.isArray(road.points)||road.points.length<2)continue;
  const distance=distanceToLine(facadeCenter,road.points);
  if(distance<36)nearRoads.push(road);
 }
 if(!nearRoads.some(r=>String(r.id)===key.street))
  nearRoads.push(street);
 const roadGuard=.22;
 const inside=p=>withinBounds(p,building);
 const alongPoint=(a,b)=>({
  x:front.mx+front.ux*a+front.nx*b,
  z:front.mz+front.uz*a+front.nz*b
 });
 const cells=[];let rejectedRoad=0,rejectedPolygon=0;
 let areaSquareMetres=0,minCarriagewayClearance=Infinity;
 for(let ai=0;ai<alongSteps;ai++){
  const a0=alongMin+ai*(alongMax-alongMin)/alongSteps;
  const a1=alongMin+(ai+1)*(alongMax-alongMin)/alongSteps;
  for(let di=0;di<depthSteps;di++){
   const o0=outwardMin+di*(outwardMax-outwardMin)/depthSteps;
   const o1=outwardMin+(di+1)*(outwardMax-outwardMin)/depthSteps;
   const corners=[
    alongPoint(a0,o0),alongPoint(a1,o0),
    alongPoint(a1,o1),alongPoint(a0,o1)
   ];
   if(corners.some(inside)){rejectedPolygon++;continue;}
   let safe=Infinity;
   for(const road of nearRoads){
    let d=Infinity;
    for(const p of [...corners,alongPoint((a0+a1)/2,(o0+o1)/2)]){
     d=Math.min(d,distanceToLine(p,road.points)-road.width*.5);
    }
    safe=Math.min(safe,d);
   }
   if(safe<roadGuard){rejectedRoad++;continue;}
   minCarriagewayClearance=Math.min(minCarriagewayClearance,safe);
   const area=(a1-a0)*(o1-o0);
   cells.push({corners,area});
   areaSquareMetres+=area;
  }
 }
 if(cells.length<120||areaSquareMetres<120)return null;
 return {
  version:'5.123',
  photo:key.photo,recentPhoto:key.recentPhoto,
  clinicId:key.clinic,sourceStreetId:key.street,
  sourceFootwayId:key.walkingWay,
  sourceRoadCenterDistance:+roadDistance.toFixed(2),
  sourceMappedFootwayDistance:+footwayDistance.toFixed(2),
  mappedStreetWidth:street.width,
  estimatedPavingCells:cells.length,
  pavedModelArea:+areaSquareMetres.toFixed(2),
  rejectedCarriagewayCells:rejectedRoad,
  rejectedClinicCells:rejectedPolygon,
  minCarriagewayClearance:+minCarriagewayClearance.toFixed(2),
  photoObservedPaving:true,
  pavingBoundaryMeasured:false,
  sourceFootwaysUntouched:true,
  newPedestrianRoutes:0,newRoads:0,newBuildings:0,
  inferredParkingBays:0,inferredPaintedParkingLines:0,
  paintedFictiveCrossings:0,noSyntheticVegetation:true,
  oneMergedSurfaceMesh:true,material:'shared-city-paving',
  cells
 };
}
