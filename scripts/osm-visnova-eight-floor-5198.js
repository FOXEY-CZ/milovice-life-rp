/** Milovice RP 5.198 — eight-floor neighbouring block in the Višňová area.
 * Use the existing RUIAN shell, original polygon edges, estimated window
 * positions, and shared four-batch renderer. Not a photo-based facade survey.
 */
export const VISNOVA_EIGHT_FLOOR_5198=Object.freeze({
 region:'mlada',id:'53865850',ruian:'25442961',
 originalHash:'8d9f363f',nodes:17,levels:8,flats:'55',
 originalEdges:Object.freeze([3,13,14,15]),
 expectedLengths:Object.freeze([12.019,48.439,15.322,29.987]),
 windowWidthMeters:1.46,windowHeightMeters:1.52,
 modelBaySpacing:3.6,photoVerified:false
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320
});
export function planVisnovaEightFloor5198({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_EIGHT_FLOOR_5198;
 if(regionId!==c.region||String(id)!==c.id||photoReviewed||
  approvedArchitecture||tags?.building!=='residential'||
  tags['ref:ruian:building']!==c.ruian||
  tags['building:levels']!==String(c.levels)||
  tags['building:flats']!==c.flats||
  tags.source!=='cuzk:ruian'||tags.height!==undefined||
  modelFloors!==c.levels||Math.abs(modelHeight-c.levels*3.05)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  hash(geometry)!==c.originalHash||
  geometry[0].lat!==geometry.at(-1).lat||
  geometry[0].lon!==geometry.at(-1).lon)return null;
 const coords=geometry.map(xy);
 const area=coords.slice(0,-1).reduce((s,p,i)=>{
  const q=coords[i+1];return s+p.x*q.z-p.z*q.x;
 },0)/2;
 if(!(area>700&&area<810))return null;
 const facades=[];
 for(let i=0;i<c.originalEdges.length;i++){
  const edgeIndex=c.originalEdges[i];
  const a=coords[edgeIndex],b=coords[edgeIndex+1];
  const length=Math.hypot(a.x-b.x,a.z-b.z);
  if(Math.abs(length-c.expectedLengths[i])>.15)return null;
  const bays=Math.round(length/c.modelBaySpacing);
  if(bays<3||bays>16||length/bays<c.windowWidthMeters+.65)return null;
  facades.push({edgeIndex,sourceLengthMetres:+length.toFixed(3),
   bays,windowWidthMetres:c.windowWidthMeters});
 }
 return {
  version:'5.192',facadeCompletionVersion:'5.198',
  sourceOSMId:c.id,sourceRUIANId:c.ruian,
  sourceName:'RÚIAN obytný blok 53865850',
  sourceHash:c.originalHash,sourceNodes:c.nodes,
  sourceGeometry:geometry,sourceReportedFloors:c.levels,
  modelHeightMeters:modelHeight,facades,
  modelWindowWidthMetres:c.windowWidthMeters,
  modelWindowHeightMetres:c.windowHeightMeters,
  expectedLongFacadeCount:facades.length,
  estimatedWindows:facades.reduce((sum,f)=>sum+f.bays*c.levels,0),
  suppressedGenericFacadeEdges:c.nodes-1,
  exactWindowPositionsVerified:false,facadeColorsPhotoVerified:false,
  exactRoofShapePhotoVerified:false,photoVerifiedWindows:false,
  sourceWallGeometryUntouched:true,modelUsesOriginalRUIANFootprint:true,
  inventedEntrances:0,inventedBalconies:0,newBuildingVolumes:0,
  newFootways:0,newRoads:0,newColliders:0
 };
}
