/** Milovice RP 5.193: complete BOTH source-mapped apartment blocks.
 * The 5.192 model deliberately covered long walls but left four prominent
 * real RÚIAN end walls blank. This expands only the four ORIGINAL polygon
 * edges, without changing the source wall/roof/collision geometry.
 *
 * New window positions/bay counts, frame materials remain purely modeled.
 * No photo/survey exists that proves openings on these end faces.
 */
export const VISNOVA_END_FACADES_5193=Object.freeze({
 originalSourceRegion:'mlada',
 targets:Object.freeze([
  Object.freeze({
   sourceOSMId:'53865847',sourceHash:'750bac6c',
   levels:11,originalFaces:[0,5,9,15],originalWindowCount:330,
   addedEdges:[12,20],edgeMeters:[15.953,15.793],addedBays:[4,4]
  }),
  Object.freeze({
   sourceOSMId:'53865848',sourceHash:'ff594686',
   levels:5,originalFaces:[2,4],originalWindowCount:190,
   addedEdges:[0,3],edgeMeters:[17.124,17.133],addedBays:[5,5]
  })
 ]),
 photoVerifiedWindowCoordinates:false
});
const hash=geo=>{
 let h=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const xy=p=>({x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320});
export function completeVisnovaEndFacades5193({basePlan}={}){
 const cfg=VISNOVA_END_FACADES_5193.targets.find(x=>
  x.sourceOSMId===basePlan?.sourceOSMId);
 if(!cfg||basePlan.version!=='5.192'||
  basePlan.sourceHash!==cfg.sourceHash||
  basePlan.sourceReportedFloors!==cfg.levels||
  basePlan.estimatedWindows!==cfg.originalWindowCount||
  basePlan.sourceWallGeometryUntouched!==true||
  basePlan.modelUsesOriginalRUIANFootprint!==true||
  basePlan.exactWindowPositionsVerified!==false||
  basePlan.inventedEntrances!==0||basePlan.inventedBalconies!==0||
  !Array.isArray(basePlan.sourceGeometry)||
  hash(basePlan.sourceGeometry)!==cfg.sourceHash||
  !Array.isArray(basePlan.facades)||
  basePlan.facades.length!==cfg.originalFaces.length||
  basePlan.facades.some((f,i)=>f.edgeIndex!==cfg.originalFaces[i])||
  !Number.isFinite(basePlan.modelWindowWidthMetres)||
  basePlan.modelWindowWidthMetres<1.0||basePlan.modelWindowWidthMetres>2.0)
  return null;
 const g=basePlan.sourceGeometry;
 const added=[];
 for(let i=0;i<cfg.addedEdges.length;i++){
  const edge=cfg.addedEdges[i];
  const a=g[edge],b=g[edge+1];
  if(!a||!b)return null;
  const x=xy(a),y=xy(b);
  const len=Math.hypot(y.x-x.x,y.z-x.z);
  const bays=cfg.addedBays[i];
  if(Math.abs(len-cfg.edgeMeters[i])>.14||
   len/bays<basePlan.modelWindowWidthMetres+.65||
   basePlan.facades.some(f=>f.edgeIndex===edge))return null;
  added.push({
   edgeIndex:edge,sourceLengthMetres:+len.toFixed(3),
   bays,windowWidthMetres:basePlan.modelWindowWidthMetres,
   completion:'5.193',windowPositionsNotPhotographed:true
  });
 }
 const all=[...basePlan.facades,...added].sort((a,b)=>a.edgeIndex-b.edgeIndex);
 if(new Set(all.map(f=>f.edgeIndex)).size!==all.length)return null;
 const addedWindows=added.reduce((sum,f)=>sum+f.bays*cfg.levels,0);
 return {
  ...basePlan,
  // Keep the 5.192 renderer/strict geometry provenance compatible.
  version:'5.192',
  facadeCompletionVersion:'5.193',
  sourceEndFaceEvidence:'original RUIAN/OSM polygon edges',
  facades:all,
  expectedLongFacadeCount:all.length,
  estimatedWindows:basePlan.estimatedWindows+addedWindows,
  endFacesAdded:added.length,
  endFaceModelWindowsAdded:addedWindows,
  endFaceEdges:added.map(f=>f.edgeIndex),
  originalModelWindowsBeforeCompletion:cfg.originalWindowCount,
  noNewOSMBuildings:true,noNewBuildingVolumes:true,
  fullBlockLongExteriorsNowModeled:true,
  originalSourceGeometryUntouched:true,
  photoVerifiedWindows:false,
  inventedEntrances:0,inventedBalconies:0,
  newBuildingVolumes:0,newFootways:0,newRoads:0,newColliders:0
 };
}
