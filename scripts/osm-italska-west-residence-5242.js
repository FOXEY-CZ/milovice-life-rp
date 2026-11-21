/** Milovice RP 5.242 — source-locked original 2-floor/10-flat RUIAN
 * residence west of the Italska tower. Only the two original long
 * exterior sides get approximate glazing; actual window positions,
 * window counts, materials and entrances are NOT photo verified.
 * No changes to the existing wall, roof, footprint or collisions.
 */
export const ITALSKA_WEST_RESIDENCE_5242=Object.freeze({
 id:'53865923',ruian:'25610473',region:'mlada',
 source:'cuzk:ruian',ruianType:'6',startDate:'2004-07-02',
 levels:2,flats:10,nodes:13,hash:'a07f4ddc',area:544.506,
 facades:Object.freeze([[1,32.473,8],[7,33.051,8]]),
 estimatedWindows:32,photoVerified:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=geometry=>{
 let h=2166136261;
 for(const c of geometry.map(key).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
export function planItalskaWestResidence5242({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ITALSKA_WEST_RESIDENCE_5242;
 if(String(id)!==c.id||regionId!==c.region||
  photoReviewed!==false||approvedArchitecture!==false||
  !tags||Object.keys(tags).length!==7||
  tags.building!=='residential'||
  tags['building:levels']!==String(c.levels)||
  tags['building:flats']!==String(c.flats)||
  tags['building:ruian:type']!==c.ruianType||
  tags['ref:ruian:building']!==c.ruian||
  tags.source!==c.source||tags.start_date!==c.startDate||
  modelFloors!==c.levels||!Number.isFinite(modelHeight)||
  Math.abs(modelHeight-c.levels*3.05)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  key(geometry[0])!==key(geometry.at(-1))||
  hash(geometry)!==c.hash)return null;
 const xy=geometry.map(p=>({
  x:p.lon*111320*Math.cos(50.226*Math.PI/180),z:-p.lat*111320
 }));
 let doubleArea=0;
 for(let i=1;i<xy.length;i++)
  doubleArea+=xy[i-1].x*xy[i].z-xy[i-1].z*xy[i].x;
 if(!Number.isFinite(doubleArea)||Math.abs(Math.abs(doubleArea)/2-c.area)>.8)
  return null;
 const facades=[];
 for(const [edge,expected,bays] of c.facades){
  const a=xy[edge],b=xy[edge+1];if(!a||!b)return null;
  const len=Math.hypot(b.x-a.x,b.z-a.z);
  if(Math.abs(len-expected)>.13||len/bays<2.16)return null;
  facades.push({edgeIndex:edge,sourceLengthMetres:+len.toFixed(3),
   bays,windowWidthMetres:1.46});
 }
 const estimatedWindows=facades.reduce((n,f)=>n+f.bays*c.levels,0);
 if(estimatedWindows!==c.estimatedWindows)return null;
 return {
  version:'5.192',sourceFacadeVersion:'5.242',
  sourceOSMId:c.id,sourceRUIANId:c.ruian,
  sourceName:'RÚIAN '+c.ruian+' · Italská vicinity',
  sourceHash:c.hash,sourceNodes:c.nodes,sourceGeometry:geometry,
  originalAreaSquareMetres:+(Math.abs(doubleArea)/2).toFixed(3),
  sourceReportedFloors:c.levels,sourceReportedFlats:c.flats,
  modelHeightMeters:modelHeight,facades,estimatedWindows,
  modelWindowWidthMetres:1.46,modelWindowHeightMetres:1.52,
  expectedLongFacadeCount:facades.length,
  suppressedGenericFacadeEdges:c.nodes-1,
  originalWallGeometryUnchanged:true,sourceGeometryUnchanged:true,
  exactWindowsPhotoVerified:false,materialsPhotoVerified:false,
  actualEntrancesPhotoVerified:false,inventedEntrances:0,
  inventedBalconies:0,newRoofs:0,newBuildingVolumes:0,
  newColliders:0,newRoads:0,newFootways:0
 };
}
