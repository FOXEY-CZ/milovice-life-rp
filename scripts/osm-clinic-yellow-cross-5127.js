// Milovice RP 5.127 — yellow crossed pavement observed at the clinic.
// SPADIA's street-level photo shows a yellow X near the teal entrance.
// It does NOT establish the official parking restriction, legal sign type,
// precise corner coordinates, dimensions, or survey position.
// Render only two slim decorative paint strips inside the existing 5.123
// OSM-road-clipped stone paving, never a new road or parking stall.
export const CLINIC_YELLOW_CROSS_SOURCES=Object.freeze({
 clinicWay:'1057548624',
 streetWay:'246652750',
 footway:'1339091016',
 clinicPhoto:'https://www.spadia.cz/verejnost/odberova-mista/praha-a-stredocesky-kraj/milovice/',
 evidence:'yellow diagonal X-shaped pavement paint photographed near the teal entrance',
 markingType:'photo-only-visual-cross',
 preciseLocationKnown:false,legalPurposeKnown:false
});
const finite=Number.isFinite;
const xyz=p=>({x:p?.x,z:p?.z??p?.y});
const near=(a,b,t)=>Math.abs(a-b)<t;
function lineDistance(p,points){
 let best=Infinity;
 for(let i=1;i<points.length;i++){
  const a=xyz(points[i-1]),b=xyz(points[i]);
  if(![a.x,a.z,b.x,b.z].every(finite))return Infinity;
  const dx=b.x-a.x,dz=b.z-a.z,den=dx*dx+dz*dz;
  if(den<.005)continue;
  const t=Math.max(0,Math.min(1,
   ((p.x-a.x)*dx+(p.z-a.z)*dz)/den));
  best=Math.min(best,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));
 }
 return best;
}
export function planPhotoClinicYellowCross({
 id,regionId,tags={},front,pavement,street,footway,
 preExistingCarriageways=[]
}={}){
 const src=CLINIC_YELLOW_CROSS_SOURCES;
 if(String(id)!==src.clinicWay||regionId!=='mlada'||
  tags.building!=='yes'||tags.amenity!=='clinic'||
  tags.healthcare!=='clinic'||tags.name!=='Poliklinika Milovice'||
  !front||front.index!==2||front.nx<.95||front.uz>-.97||
  ![front.mx,front.mz,front.nx,front.nz,
    front.ux,front.uz,front.len].every(finite)||
  !near(front.len,44.86,.5)||
  !near(Math.hypot(front.ux,front.uz),1,.01)||
  !near(Math.hypot(front.nx,front.nz),1,.01)||
  Math.abs(front.ux*front.nx+front.uz*front.nz)>.01||
  !pavement||pavement.clinicId!==src.clinicWay||
  pavement.sourceStreetId!==src.streetWay||
  pavement.sourceFootwayId!==src.footway||
  pavement.photoObservedPaving!==true||
  pavement.inferredParkingBays!==0||
  !Array.isArray(pavement.cells)||pavement.cells.length<300||
  pavement.pavedModelArea<400||pavement.pavedModelArea>700||
  !street||String(street.id)!==src.streetWay||
  street.name!=='Spojovací'||street.kind!=='residential'||
  !finite(street.width)||street.width<6||street.width>9||
  !Array.isArray(street.points)||street.points.length<3||
  !footway||String(footway.id)!==src.footway||
  footway.kind!=='footway'||footway.tags?.lit!=='yes'||
  !Array.isArray(footway.points)||footway.points.length!==5||
  !Array.isArray(preExistingCarriageways))return null;
 // The photo confirms an X, not its actual parcel position. Place near
 // modeled central entrance and BEFORE the real parallel sidewalk.
 const entryAlong=front.len/16; // 8-bay facade, estimated bay 4 centre.
 const alongHalf=1.65,depthNear=3.8,depthFar=6.55,width=.10;
 const footCenterDist=lineDistance(
  {x:front.mx,z:front.mz},footway.points);
 const roadCenterDist=lineDistance(
  {x:front.mx,z:front.mz},street.points);
 if(!(footCenterDist>5.5&&footCenterDist<11.5&&
  roadCenterDist>16&&roadCenterDist<21))return null;
 const local=point=>{
  const x=point.x-front.mx,z=point.z-front.mz;
  return {a:x*front.ux+z*front.uz,
   b:x*front.nx+z*front.nz};
 };
 const cells=pavement.cells.map(cell=>{
  if(cell?.corners?.length!==4)return null;
  const ps=cell.corners.map(local);
  if(ps.some(p=>!finite(p.a)||!finite(p.b)))return null;
  return {minA:Math.min(...ps.map(p=>p.a)),
   maxA:Math.max(...ps.map(p=>p.a)),
   minB:Math.min(...ps.map(p=>p.b)),
   maxB:Math.max(...ps.map(p=>p.b))};
 });
 if(cells.some(c=>!c))return null;
 const safePaving=(a,b)=>cells.some(c=>a>=c.minA+.015&&
  a<=c.maxA-.015&&b>=c.minB+.015&&b<=c.maxB-.015);
 const toWorld=(a,b)=>({
  x:front.mx+front.ux*a+front.nx*b,
  z:front.mz+front.uz*a+front.nz*b
 });
 const roads=preExistingCarriageways.filter(r=>
  Array.isArray(r?.points)&&r.points.length>1&&
  finite(r.width)&&r.width>2.4&&r.width<16);
 if(!roads.some(r=>String(r.id)===src.streetWay))roads.push(street);
 let minRoad=Infinity,minWalk=Infinity;
 const segments=8,strokes=[];
 // Varying depth and along creates two diagonal bands; their paint
 // thickness is perpendicular to the stroke, not the building wall.
 for(const direction of [1,-1]){
  const alongStart=entryAlong-direction*alongHalf;
  const alongEnd=entryAlong+direction*alongHalf;
  const da=alongEnd-alongStart,db=depthFar-depthNear;
  const hyp=Math.hypot(da,db),half=width/2;
  const normalA=-db/hyp*half,normalB=da/hyp*half;
  const samples=[];
  for(let i=0;i<=segments;i++){
   const t=i/segments,a=alongStart+da*t,b=depthNear+db*t;
   for(const side of [-1,1]){
    const u=a+normalA*side,v=b+normalB*side;
    if(!safePaving(u,v))return null;
    const p=toWorld(u,v);
    const foot=lineDistance(p,footway.points);
    const clearance=Math.min(...roads.map(road=>
     lineDistance(p,road.points)-road.width*.5));
    if(foot<1.5||clearance<.45)return null;
    minRoad=Math.min(minRoad,clearance);
    minWalk=Math.min(minWalk,foot);
    samples.push(p);
   }
  }
  strokes.push({direction,segments,width,samples});
 }
 return {
  version:'5.127',osmClinicId:src.clinicWay,
  streetWayId:src.streetWay,footwayId:src.footway,
  photoSource:src.clinicPhoto,photoEvidence:src.evidence,
  yellowXActuallyPhotoObserved:true,
  exactPaintLocationKnown:false,exactSizeKnown:false,
  legallyRestrictedAreaClaimed:false,
  markingLegalPurposeKnown:false,
  modelledCrossCount:1,paintedDiagonalCount:2,
  strokesPerCross:2,paintWidthEstimated:true,
  centreAlongApproxMetres:+entryAlong.toFixed(3),
  nearFacadeMetres:depthNear,farFacadeMetres:depthFar,
  minRoadClearance:+minRoad.toFixed(2),
  minFootwayDistance:+minWalk.toFixed(2),
  pavingCellsPreserved:true,existingOSMUnmodified:true,
  originalStreetGeometryUnmodified:true,
  drawMeshes:1,triangleCount:strokes.length*segments*2,
  newRoads:0,newFootways:0,newParkingBays:0,
  newLegalRoadMarkings:0,newCrosswalks:0,newSigns:0,
  newTrees:0,newStreetFurniture:0,
  painterlySourceApproximation:true,
  strokes
 };
}
