// Milovice RP 5.117 — four additional *documented* small substations
// in the Slepá / Armádní neighbourhood, distinct from the 5.113 trio.
// They are not houses. Their precise OSM footprints are retained;
// dimensions/flat roofs/plain walls are only graphical estimates.
const REGIONS=new Set(['mlada','vrutice']);
const SOURCE=new Map([
 ['762867641',{evidence:'RÚIAN type 16 and named CEZ operator'}],
 ['1082018176',{evidence:'OSM minor_distribution / NB 0459'}],
 ['1272167313',{evidence:'OSM minor_distribution / NB 1057'}],
 ['1468803930',{evidence:'OSM power=substation and named CEZ operator'}]
]);
const X=p=>p?.x,Z=p=>p?.z??p?.y;
export function planSlepaDistrictSubstation({
 id,regionId,tags={},points=[],
 photoReviewed=false,approvedArchitecture=false
}={}){
 const sourceId=String(id??'');
 const known=SOURCE.get(sourceId);
 if(!known||!REGIONS.has(regionId)||photoReviewed||
  approvedArchitecture||tags?.power!=='substation'||
  tags.building!=='yes'||tags['building:levels']!==undefined||
  tags.height!==undefined||tags['building:part']!==undefined||
  ['private','no'].includes(tags.access)||
  !Array.isArray(points)||points.length<4||points.length>14||
  !points.every(p=>Number.isFinite(X(p))&&Number.isFinite(Z(p))))return null;
 const minor=tags.substation==='minor_distribution';
 const op=tags.operator==='ČEZ Distribuce';
 const cadastral=tags['building:ruian:type']==='16';
 const valid=sourceId==='762867641'?(cadastral&&op):
  sourceId==='1468803930'?op:minor;
 if(!valid)return null;
 const ring=points.slice();
 if(Math.hypot(X(ring[0])-X(ring.at(-1)),
  Z(ring[0])-Z(ring.at(-1)))<.1)ring.pop();
 if(ring.length<3)return null;
 let twice=0;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];
  twice+=X(a)*Z(b)-X(b)*Z(a);
 }
 const area=Math.abs(twice)*.5;
 if(!Number.isFinite(area)||area<5||area>20)return null;
 return {
  sourceBuildingId:sourceId,kind:'electric-substation',
  tagEvidence:known.evidence,
  osmAreaSquareMeters:+area.toFixed(2),
  levelCount:1,modelHeightMeters:2.65,
  flatRoofProvisional:true,exactHeightKnown:false,
  glassWindows:0,inventedEntrances:0,glassAwnings:0,newWasteBins:0,
  sourceGeometryUnchanged:true,photoApproved:false
 };
}
