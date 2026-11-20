/** Milovice RP 5.197: mapped neighbouring eleven-floor apartment block.
 * One original RUIAN/OSM footprint; no fabricated windows are claimed to be
 * photo-surveyed. Only original wall edges >= 8m receive estimated glazing.
 * Reuse the same four-mesh batched renderer as Višňová 572 and 573.
 */
export const VISNOVA_NEIGHBOR_5197=Object.freeze({
 id:'202399859',ruian:'25013360',region:'mlada',
 hash:'22bf1447',nodes:15,levels:11,flats:'55',
 edges:Object.freeze([0,2,3,4,5,10,11,12]),
 estimatedWindowWidth:1.46,estimatedWindowHeight:1.52,
 photoVerified:false
});
const sourceHash=geo=>{
 let h=2166136261;
 for(const p of geo){
  for(const c of p.lat.toFixed(7)+','+p.lon.toFixed(7)+';'){
   h^=c.charCodeAt(0);h=Math.imul(h,16777619);
  }
 }
 // The source hash joins coordinates with semicolons but has no trailing ';'.
 return(h>>>0).toString(16).padStart(8,'0');
};
const canonicalHash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const world=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320
});
export function planVisnovaNeighbor5197({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_NEIGHBOR_5197;
 if(String(id)!==c.id||regionId!==c.region||photoReviewed||
  approvedArchitecture||tags?.building!=='residential'||
  tags['ref:ruian:building']!==c.ruian||
  tags['building:flats']!==c.flats||
  tags['building:levels']!==String(c.levels)||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  modelFloors!==c.levels||Math.abs(modelHeight-3.05*c.levels)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  canonicalHash(geometry)!==c.hash||
  geometry[0].lat!==geometry.at(-1).lat||
  geometry[0].lon!==geometry.at(-1).lon)return null;
 const coords=geometry.map(world);
 const area=coords.slice(0,-1).reduce((sum,p,i)=>{
  const q=coords[i+1];return sum+p.x*q.z-p.z*q.x;
 },0)/2;
 if(area<650||area>800)return null;
 const facades=[];
 for(const edgeIndex of c.edges){
  const a=coords[edgeIndex],b=coords[edgeIndex+1];
  const length=Math.hypot(b.x-a.x,b.z-a.z);
  if(length<8||length>36)return null;
  const bays=Math.round(length/3.6);
  if(bays<2||bays>12||length/bays<c.estimatedWindowWidth+.7)return null;
  facades.push({edgeIndex,sourceLengthMetres:+length.toFixed(3),
   bays,windowWidthMetres:c.estimatedWindowWidth});
 }
 return {
  version:'5.192',facadeCompletionVersion:'5.197',
  sourceOSMId:c.id,sourceRUIANId:c.ruian,
  sourceName:'RÚIAN obytný blok 202399859',
  sourceHash:c.hash,sourceNodes:c.nodes,
  sourceGeometry:geometry,sourceReportedFloors:c.levels,
  modelHeightMeters:modelHeight,facades,
  modelWindowWidthMetres:c.estimatedWindowWidth,
  modelWindowHeightMetres:c.estimatedWindowHeight,
  expectedLongFacadeCount:facades.length,
  estimatedWindows:facades.reduce((n,f)=>n+f.bays*c.levels,0),
  suppressedGenericFacadeEdges:c.nodes-1,
  exactWindowPositionsVerified:false,facadeColorsPhotoVerified:false,
  exactRoofShapePhotoVerified:false,sourceWallGeometryUntouched:true,
  modelUsesOriginalRUIANFootprint:true,photoVerifiedWindows:false,
  inventedEntrances:0,inventedBalconies:0,newBuildingVolumes:0,
  newFootways:0,newRoads:0,newColliders:0
 };
}
