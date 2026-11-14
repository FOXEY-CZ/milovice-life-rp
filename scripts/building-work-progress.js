// Milovice RP 5.53: stable OSM-ID street progress, no repeated houses.
// Photo camera angle is candidate evidence, NOT architectural verification.
const angleDiff=(a,b)=>Math.abs(((a-b+540)%360)-180);
const validInteger=x=>Number.isSafeInteger(x)&&x>0;
export function photoCandidateBearing(item,way){
 if(!item?.viewpoint||!Array.isArray(way?.geometry)||way.geometry.length<3)return null;
 const {lat,lon,headingDeg}=item.viewpoint;
 if(![lat,lon,headingDeg].every(Number.isFinite))return null;
 const g=way.geometry,centroid={
  lat:g.reduce((a,p)=>a+p.lat,0)/g.length,
  lon:g.reduce((a,p)=>a+p.lon,0)/g.length
 };
 const east=(centroid.lon-lon)*111320*Math.cos(lat*Math.PI/180);
 const north=(centroid.lat-lat)*111320;
 const bearing=(Math.atan2(east,north)*180/Math.PI+360)%360;
 return {bearing,distanceMetres:Math.hypot(east,north),
  deviationDegrees:angleDiff(bearing,headingDeg),
  evidenceStatus:'candidate-only'};
}
export function nextUnworkedStreetBuilding(osm,worklog){
 if(!Array.isArray(osm?.elements)||worklog?.schema!=='milovice-rp-building-worklog-v1'||
  !Array.isArray(worklog?.worked)||!Array.isArray(worklog?.accepted)||
  !Array.isArray(worklog?.candidates)||!worklog?.rules?.doNotRepeatWorked)
  return null;
 const ids=new Set(osm.elements.filter(e=>e.tags?.building&&e.geometry?.length>=3).map(e=>e.id));
 const already=new Set([...worklog.accepted,...worklog.worked].map(e=>e.osmId));
 for(const candidate of [...worklog.candidates].sort((a,b)=>a.priority-b.priority)){
  if(!validInteger(candidate.osmId)||!ids.has(candidate.osmId)||
   already.has(candidate.osmId)||candidate.visualEditsApproved===true)continue;
  const way=osm.elements.find(e=>e.id===candidate.osmId);
  const sightline=photoCandidateBearing(candidate,way);
  return {osmId:candidate.osmId,status:candidate.status,
   canBuildFromPhoto:false,requiresPhotoIdentityReview:true,
   bearing:sightline,source:candidate.source||null};
 }
 return null;
}
