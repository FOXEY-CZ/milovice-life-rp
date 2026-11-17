// Milovice RP 5.112 — restrained street-facing facade safety for 12
// REAL RÚIAN-listed two-level, one-flat houses near OSM Slepá 202375817.
// Entrance position, window bays and paint colors remain model estimates.
// Never invent a garden gate, terrace, hedge, balcony or glass awning.
const STREET_ID='202375817',AREAS=new Set(['mlada','vrutice']);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
function distanceToSegment(p,a,b){
 const dx=X(b)-X(a),dz=Z(b)-Z(a),l2=dx*dx+dz*dz;
 if(l2<.04)return Infinity;
 const t=Math.max(0,Math.min(1,
  ((X(p)-X(a))*dx+(Z(p)-Z(a))*dz)/l2));
 return Math.hypot(X(p)-X(a)-t*dx,Z(p)-Z(a)-t*dz);
}
export function planSlepaHouseFrontage({
 id,regionId,tags={},points=[],height,streetWayId,streetPoints=[],
 photoReviewed=false,approvedArchitecture=false
}={}){
 if(!AREAS.has(regionId)||String(streetWayId)!==STREET_ID||
  tags?.building!=='house'||tags?.['building:levels']!=='2'||
  tags?.['building:flats']!=='1'||
  tags?.['building:ruian:type']!=='7'||
  tags?.source!=='cuzk:ruian'||
  ['private','no'].includes(tags?.access)||
  photoReviewed||approvedArchitecture||
  !Array.isArray(points)||points.length<4||points.length>100||
  !points.every(finite)||!Array.isArray(streetPoints)||
  streetPoints.length!==2||!streetPoints.every(finite)||
  !Number.isFinite(height)||height<5.0||height>9.0)return null;
 const open=points.slice();
 if(Math.hypot(X(open[0])-X(open.at(-1)),
  Z(open[0])-Z(open.at(-1)))<.06)open.pop();
 if(open.length<3)return null;
 const near=Math.min(...open.map(p=>distanceToSegment(
  p,streetPoints[0],streetPoints[1])));
 if(near>100)return null;
 return {
  sourceStreetId:STREET_ID,sourceBuildingId:String(id),
  mappedLevels:2,mappedFlats:1,height,
  nearStreetMeters:+near.toFixed(1),
  doorWidth:1.28,modelWindowWidth:1.4,openingMargin:.21,
  removeUnverifiedGlassAwning:true,
  modeledDoorPositionNotSurveyed:true,
  windowsPhotoVerified:false,roofPhotoVerified:false,
  inferredWindowGrid:true,photoApproved:false,
  newRoofPieces:0,newHouses:0,footprintChanged:false,
  cadastralGardenBoundariesChanged:false
 };
}
export function slepaHouseWindowDoorConflict({
 plan,entranceEdge,windowEdge,fraction,edgeLength,floor
}={}){
 if(!plan||!Number.isInteger(entranceEdge)||
  !Number.isInteger(windowEdge)||!Number.isFinite(fraction)||
  fraction<=0||fraction>=1||!Number.isFinite(edgeLength)||
  edgeLength<4||!Number.isInteger(floor)||floor<0)return false;
 // Opening only on modelled entrance facade and GROUND floor.
 // 3D door is centred on the same OSM wall and its current yaw.
 if(floor!==0||entranceEdge!==windowEdge)return false;
 const along=(fraction-.5)*edgeLength;
 const safeHalf=plan.doorWidth*.5+plan.modelWindowWidth*.5+
  plan.openingMargin;
 return Math.abs(along)<safeHalf;
}
