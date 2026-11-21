/** Milovice RP 5.221 — further ORIGINAL seven-floor RÚIAN apartment
 * building on north-east Višňová. Only visual, estimated glazing/plinth
 * on the EXISTING OSM shell. Not a photo survey; no doors, balconies,
 * new wall/roof volumes, invented paths, street furniture or colliders.
 */
export const VISNOVA_NORTH_BLOCK_5221=Object.freeze({
 region:'mlada',id:'53866112',ruian:'27246191',
 hash:'4328a486',nodes:5,levels:'7',flats:'69',
 startDate:'2009-03-25',source:'cuzk:ruian',
 originalAreaSquareMetres:1790.879,
 expectedEdgeLengths:Object.freeze([42.084,42.496,42.334,42.363]),
 modelWindowBays:Object.freeze([12,12,12,12]),
 modelFloorHeight:3.05,modelWindowWidth:1.46,modelWindowHeight:1.52,
 photoVerified:false
});
const canonical=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(canonical).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({
 x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320
});
export function planVisnovaNorthBlock5221({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=VISNOVA_NORTH_BLOCK_5221;
 if(regionId!==c.region||String(id)!==c.id||
  photoReviewed!==false||approvedArchitecture!==false||
  tags?.building!=='residential'||
  tags['building:flats']!==c.flats||
  tags['building:levels']!==c.levels||
  tags['ref:ruian:building']!==c.ruian||
  tags.source!==c.source||tags.start_date!==c.startDate||
  Object.keys(tags).length!==6||tags.height!==undefined||
  modelFloors!==Number(c.levels)||!Number.isFinite(modelHeight)||
  Math.abs(modelHeight-modelFloors*c.modelFloorHeight)>.005||
  !Array.isArray(geometry)||geometry.length!==c.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  canonical(geometry[0])!==canonical(geometry.at(-1))||
  hash(geometry)!==c.hash)return null;
 const coords=geometry.map(xy);
 const area=coords.slice(0,-1).reduce((sum,p,i)=>{
  const b=coords[i+1];return sum+p.x*b.z-p.z*b.x;
 },0)/2;
 if(!Number.isFinite(area)||
  Math.abs(area-c.originalAreaSquareMetres)>.8)return null;
 const facades=[];
 for(let edgeIndex=0;edgeIndex<c.nodes-1;edgeIndex++){
  const a=coords[edgeIndex],b=coords[edgeIndex+1];
  const len=Math.hypot(b.x-a.x,b.z-a.z);
  if(Math.abs(len-c.expectedEdgeLengths[edgeIndex])>.15)return null;
  const bays=c.modelWindowBays[edgeIndex];
  if(bays<1||bays>16||len/bays<c.modelWindowWidth+.7)return null;
  facades.push({edgeIndex,sourceLengthMetres:+len.toFixed(3),
   bays,windowWidthMetres:c.modelWindowWidth});
 }
 const estimatedWindows=facades.reduce((n,f)=>n+f.bays*modelFloors,0);
 if(estimatedWindows!==336)return null;
 return {
  version:'5.192',facadeCompletionVersion:'5.221',
  sourceOSMId:c.id,sourceRUIANId:c.ruian,
  sourceName:'Višňová: source-locked RÚIAN 27246191',
  sourceHash:c.hash,sourceNodes:c.nodes,sourceGeometry:geometry,
  originalAreaSquareMetres:area,sourceReportedFloors:modelFloors,
  sourceReportedFlats:Number(c.flats),modelHeightMeters:modelHeight,
  facades,modelWindowWidthMetres:c.modelWindowWidth,
  modelWindowHeightMetres:c.modelWindowHeight,
  expectedLongFacadeCount:4,estimatedWindows,
  suppressedGenericFacadeEdges:4,
  exactWindowPositionsVerified:false,windowCountsPhotoVerified:false,
  facadeShapesPhotoVerified:false,facadeColorsPhotoVerified:false,
  sourceOSMGeometryUntouched:true,modelUsesOriginalRUIANFootprint:true,
  inventedEntrances:0,inventedBalconies:0,
  newBuildingVolumes:0,newRoads:0,newFootways:0,newColliders:0,
  changedRoofForm:0,changedFloorCounts:0,changedOriginalOSMWays:0
 };
}
