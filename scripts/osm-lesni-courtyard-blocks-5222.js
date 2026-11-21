/** Milovice RP 5.222 — two ORIGINAL RÚIAN residential footprints
 * along the Lesní service court east of Višňová (Mladá region).
 * The source-backed facts are footprints, floors, flats and dates.
 * Estimated facade windows and low plinth are visual placeholders,
 * not photo-verified architecture. Existing shells/roofs/terrain,
 * roads, paths and colliders remain untouched.
 */
export const LESNI_COURTYARD_BLOCKS_5222=Object.freeze({
 region:'mlada',source:'cuzk:ruian',nominalFloorHeight:3.05,
 modelWindowWidth:1.46,modelWindowHeight:1.52,photoVerified:false,
 buildings:Object.freeze([
  Object.freeze({
   id:'53866101',ruian:'25789848',levels:2,flats:12,nodes:13,
   hash:'88bbda35',area:337.473,startDate:'2005-07-13',
   edges:Object.freeze([24.858,14.007,6.368,1.285,3.521,1.280,
    4.721,1.358,3.761,1.438,6.346,13.959]),
   // Model glazing ONLY on 5 original larger facades, avoiding jogs.
   modelFacades:Object.freeze([[0,7],[1,4],[2,2],[10,2],[11,4]])
  }),
  Object.freeze({
   id:'194679566',ruian:'27382141',levels:4,flats:26,nodes:29,
   hash:'88a04945',area:583.827,startDate:'2009-09-21',
   edges:Object.freeze([.601,6.501,1.649,5.502,1.649,9.504,
    17.372,12.513,.607,2.510,.594,6.501,.601,2.506,
    .607,10.503,3.141,.570,2.094,.604,6.893,.602,
    2.103,.606,3.148,10.505,.594,2.506]),
   // Short recesses and sub-metre RÚIAN facade jogs get NO windows.
   modelFacades:Object.freeze([[5,3],[6,5],[7,3],[15,3],[25,3]])
  })
 ])
});
const canonical=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const c of g.map(canonical).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320});
export function planLesniCourtyardBlock5222({
 id,regionId,tags,geometry,modelFloors,modelHeight,
 photoReviewed=false,approvedArchitecture=false
}={}){
 const c=LESNI_COURTYARD_BLOCKS_5222;
 const spec=c.buildings.find(b=>b.id===String(id));
 if(!spec||regionId!==c.region||photoReviewed!==false||
  approvedArchitecture!==false||
  tags?.building!=='residential'||
  tags?.['ref:ruian:building']!==spec.ruian||
  tags?.['building:levels']!==String(spec.levels)||
  tags?.['building:flats']!==String(spec.flats)||
  tags?.source!==c.source||tags?.start_date!==spec.startDate||
  Object.keys(tags).length!==6||
  modelFloors!==spec.levels||!Number.isFinite(modelHeight)||
  Math.abs(modelHeight-modelFloors*c.nominalFloorHeight)>.005||
  !Array.isArray(geometry)||geometry.length!==spec.nodes||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  canonical(geometry[0])!==canonical(geometry.at(-1))||
  hash(geometry)!==spec.hash)return null;
 const projected=geometry.map(xy);
 const area=projected.slice(0,-1).reduce((sum,p,i)=>{
  const b=projected[i+1];return sum+p.x*b.z-p.z*b.x;
 },0)/2;
 if(!Number.isFinite(area)||Math.abs(area-spec.area)>.8)return null;
 // Verify ALL original edges, including the tiny recesses, before
 // placing any visual detail. A changed source must fail closed.
 for(let edge=0;edge<spec.edges.length;edge++){
  const a=projected[edge],b=projected[edge+1];
  const len=Math.hypot(a.x-b.x,a.z-b.z);
  if(!Number.isFinite(len)||Math.abs(len-spec.edges[edge])>.15)
   return null;
 }
 const facades=[];
 for(const [edgeIndex,bays] of spec.modelFacades){
  const len=spec.edges[edgeIndex];
  if(bays<1||bays>16||len/bays<c.modelWindowWidth+.7)
   return null;
  facades.push({
   edgeIndex,sourceLengthMetres:len,bays,
   windowWidthMetres:c.modelWindowWidth
  });
 }
 const estimatedWindows=facades.reduce((n,f)=>n+f.bays*modelFloors,0);
 if(estimatedWindows!==(spec.id==='53866101'?38:68))return null;
 return {
  version:'5.192',facadeCompletionVersion:'5.222',
  sourceOSMId:spec.id,sourceRUIANId:spec.ruian,
  sourceName:'Lesní: RÚIAN building '+spec.ruian,
  sourceHash:spec.hash,sourceNodes:spec.nodes,
  sourceGeometry:geometry,originalAreaSquareMetres:area,
  sourceReportedFloors:modelFloors,sourceReportedFlats:spec.flats,
  modelHeightMeters:modelHeight,facades,
  modelWindowWidthMetres:c.modelWindowWidth,
  modelWindowHeightMetres:c.modelWindowHeight,
  expectedLongFacadeCount:facades.length,estimatedWindows,
  suppressedGenericFacadeEdges:spec.nodes-1,
  exactWindowPositionsVerified:false,windowCountsPhotoVerified:false,
  facadeColorsPhotoVerified:false,facadeShapesPhotoVerified:false,
  sourceOSMGeometryUntouched:true,modelUsesOriginalRUIANFootprint:true,
  inventedEntrances:0,inventedBalconies:0,newBuildingVolumes:0,
  newRoads:0,newFootways:0,newColliders:0,
  changedRoofForm:0,changedFloorCounts:0,changedOriginalOSMWays:0
 };
}
