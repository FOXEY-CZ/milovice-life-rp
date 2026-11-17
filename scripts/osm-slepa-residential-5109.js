// Milovice RP 5.109 — guarded facade-grid completion for OSM mapped
// four-storey residential buildings facing Slepá, on the Mladá/Vrutice
// overlapping export. Real buildings and storeys, NOT photo-confirmed panes.
// This planner changes NO footprint, road, entrance, roof or landuse geometry.
const STREET_ID='202375817';
const REGIONS=new Set(['mlada','vrutice']);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
function distancePointToLine(p,a,b){
 const dx=X(b)-X(a),dz=Z(b)-Z(a),length2=dx*dx+dz*dz;
 if(length2<.1)return Infinity;
 const t=Math.max(0,Math.min(1,
  ((X(p)-X(a))*dx+(Z(p)-Z(a))*dz)/length2));
 return Math.hypot(X(p)-X(a)-dx*t,Z(p)-Z(a)-dz*t);
}
export function planSlepaResidentialPanel({
 id,regionId,tags={},points=[],height,streetWayId,streetPoints=[],
 photoReviewed=false,approvedArchitecture=false
}={}){
 if(!REGIONS.has(regionId)||String(streetWayId)!==STREET_ID||
  tags?.building!=='residential'||tags?.access==='private'||
  !Array.isArray(streetPoints)||streetPoints.length!==2||
  !streetPoints.every(finite)||!Array.isArray(points)||
  points.length<4||points.length>100||!points.every(finite)||
  photoReviewed||approvedArchitecture||!Number.isFinite(height))
  return null;
 const floors=Number(tags['building:levels']);
 if(floors!==4||String(tags['building:levels'])!=='4'||
  height<10||height>16)return null;
 // Source way is a real 88.5 m residential road in both region exports.
 // The nearest point of a mapped building polygon must remain within 75 m.
 const open=points.slice();
 if(Math.hypot(X(open[0])-X(open.at(-1)),
  Z(open[0])-Z(open.at(-1)))<.05)open.pop();
 if(open.length<3)return null;
 const a=streetPoints[0],b=streetPoints[1];
 const distance=Math.min(...open.map(p=>distancePointToLine(p,a,b)));
 if(distance>75)return null;
 const flatsRaw=tags['building:flats'],flatsN=Number(flatsRaw);
 const flats=flatsRaw!==undefined&&flatsRaw!==null&&
  Number.isInteger(flatsN)&&flatsN>0&&flatsN<=250?
  flatsN:null;
 return {
  id:String(id),regionId,floors,flats,
  mappedLevels:true,mappedFlats:flats!==null,
  height,floorHeight:height/floors,
  nearStreetMeters:+distance.toFixed(1),
  sourceStreetId:STREET_ID,sourcePlaygroundId:null,
  inferredWindowSpacing:true,inferredPanelJoints:true,
  photographedFacade:false,
  footprintChanged:false,roofShapeChanged:false,buildingCountChanged:false
 };
}
