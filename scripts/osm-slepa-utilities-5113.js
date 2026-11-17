// Milovice RP 5.113 — exact OSM utility buildings near Slepá.
// The tags prove WHAT is here, not its colour, wall design, openings,
// roof shape or surveyed height. Do not invent bins, windows or doors.
const AREAS=new Set(['mlada','vrutice']);
const SUBSTATIONS=new Set(['1079135294','1283868024']);
const SHELTER='1079135295';
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.z??p?.y);
export function planSlepaUtility({id,regionId,tags={},points=[],
 photoReviewed=false,approvedArchitecture=false}={}){
 const sourceId=String(id??'');
 if(!AREAS.has(regionId)||photoReviewed||approvedArchitecture||
  tags?.building!=='yes'||!Array.isArray(points)||
  points.length<4||points.length>14||!points.every(finite))return null;
 const shelter=sourceId===SHELTER&&tags.amenity==='shelter'&&
  /přístřešek pro kontejnery na směsný odpad/i.test(tags.note??'');
 const substation=SUBSTATIONS.has(sourceId)&&
  tags.power==='substation'&&tags.substation==='minor_distribution';
 if(!shelter&&!substation)return null;
 const ring=points.slice(),last=ring.at(-1),first=ring[0];
 if(Math.hypot(first.x-last.x,(first.z??first.y)-(last.z??last.y))<.10)ring.pop();
 if(ring.length<3)return null;
 let area=0;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];
  area+=a.x*(b.z??b.y)-b.x*(a.z??a.y);
 }
 area=Math.abs(area)*.5;
 if(!Number.isFinite(area)||area<4||area>70)return null;
 return {
  sourceBuildingId:sourceId,kind:shelter?'waste-container-shelter':'electric-substation',
  osmAreaSquareMeters:+area.toFixed(1),levelCount:1,
  // Deliberately provisional; source has no building:levels or height.
  modelHeightMeters:2.7,flatRoofProvisional:true,
  glassWindows:0,inventedEntrances:0,glassAwnings:0,
  newWasteBins:0,sourceGeometryUnchanged:true,
  photoApproved:false,exactHeightKnown:false
 };
}
