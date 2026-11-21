/** Milovice RP 5.239 — original two-storey 38-flat RUIAN block,
 *  immediately west/southwest of the mapped Italska tower. This module
 *  models only unsurveyed window surfaces on the existing game shell.
 *  Photo verification of window grid, materials or entrances: NONE.
 */
export const ITALSKA_WEST_BLOCK_5239=Object.freeze({
 id:'53865932',region:'mlada',ruian:'25789767',source:'cuzk:ruian',
 levels:2,flats:38,ruianType:'6',startDate:'2006-02-06',
 nodes:17,hash:'f43298dc',area:1258.816,
 facades:Object.freeze([[1,18.892,4],[5,24.053,6],[9,19.069,4],
  [11,23.128,6],[15,58.165,14]]),
 windows:68,photoVerified:false
});
const pointKey=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=points=>{
 let h=2166136261;
 for(const c of points.map(pointKey).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
export function planItalskaWestBlock5239({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=ITALSKA_WEST_BLOCK_5239;
 if(String(id)!==c.id||regionId!==c.region||
  photoReviewed!==false||approvedArchitecture!==false||
  !tags||Object.keys(tags).length!==7||
  tags.building!=='residential'||tags['building:levels']!==String(c.levels)||
  tags['building:flats']!==String(c.flats)||
  tags['building:ruian:type']!==c.ruianType||
  tags['ref:ruian:building']!==c.ruian||
  tags.source!==c.source||tags.start_date!==c.startDate||
  modelFloors!==c.levels||!Number.isFinite(modelHeight)||
  Math.abs(modelHeight-c.levels*3.05)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  pointKey(geometry[0])!==pointKey(geometry.at(-1))||
  fingerprint(geometry)!==c.hash)return null;
 const coords=geometry.map(p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
  z:-p.lat*111320}));
 let doubleArea=0;
 for(let i=0;i<coords.length-1;i++){
  const a=coords[i],b=coords[i+1];
  doubleArea+=a.x*b.z-a.z*b.x;
 }
 if(!Number.isFinite(doubleArea)||Math.abs(Math.abs(doubleArea)/2-c.area)>.8)
  return null;
 const facades=[];
 for(const [edge,length,bays] of c.facades){
  const a=coords[edge],b=coords[edge+1];
  if(!a||!b)return null;
  const actual=Math.hypot(b.x-a.x,b.z-a.z);
  if(Math.abs(actual-length)>.13||actual/bays<2.2)return null;
  facades.push({edgeIndex:edge,sourceLengthMetres:+actual.toFixed(3),
   bays,windowWidthMetres:1.46});
 }
 const estimatedWindows=facades.reduce((sum,f)=>sum+f.bays*c.levels,0);
 if(estimatedWindows!==c.windows)return null;
 return {
  version:'5.192',sourceFacadeVersion:'5.239',sourceOSMId:c.id,
  sourceRUIANId:c.ruian,sourceName:'Italská area RÚIAN '+c.ruian,
  sourceGeometry:geometry,sourceHash:c.hash,sourceNodes:c.nodes,
  sourceReportedFloors:c.levels,sourceReportedFlats:c.flats,
  modelHeightMeters:modelHeight,facades,
  modelWindowWidthMetres:1.46,modelWindowHeightMetres:1.52,
  expectedLongFacadeCount:facades.length,estimatedWindows,
  suppressedGenericFacadeEdges:c.nodes-1,
  sourceGeometryUnchanged:true,exactWindowsPhotoVerified:false,
  materialsPhotoVerified:false,inventedEntrances:0,inventedBalconies:0,
  newRoofs:0,newBuildingVolumes:0,newColliders:0,newRoads:0,newFootways:0
 };
}
