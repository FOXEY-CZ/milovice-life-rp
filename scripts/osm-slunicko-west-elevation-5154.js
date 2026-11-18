/** Milovice RP 5.154. 2020 public scaffold budget for the school WEST
 * facade gives 44.00m length and a 13.15m vertical reference.
 * This is a source-informed visual approximation, NOT surveyed roof height. */
export const WEST_ELEVATION_5154=Object.freeze({
 source:'https://www.e-zakazky.cz/stazenisouboru/61b37d16-23a5-4b6b-ae61-13e546a3e2ad',
 sourceDate:'2020-05-21',page:5,osmId:'53865699',ruian:'26092069',
 originalHash:'912f8e04',westEdge:1,westProjectLength:44,
 projectVerticalReference:13.15,originalModelHeight:12.2,
 scaffoldExpression:'(44+2*0.9)*(13.15+0.5-1.8)',
 blindsInBill:55,blindsInstallationVerified:false
});
function fingerprint(geo){
 let hash=2166136261;
 for(const c of geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619);
 }
 return (hash>>>0).toString(16).padStart(8,'0');
}
const meters=(a,b)=>Math.hypot(
 (a.lon-b.lon)*111320*Math.cos(50.226*Math.PI/180),
 (a.lat-b.lat)*111320);
export function planSlunickoWestElevation5154({basePlan,geometry}={}){
 const s=WEST_ELEVATION_5154;
 if(basePlan?.version!=='5.153'||basePlan.sourceOSMId!==s.osmId||
  basePlan.sourceRUIANId!==s.ruian||
  basePlan.originalOSMHash!==s.originalHash||
  basePlan.modelHeightMeters!==s.originalModelHeight||
  !Array.isArray(geometry)||geometry.length!==9||
  geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(geometry)!==s.originalHash)
  return null;
 if(meters(geometry[0],geometry.at(-1))>.001)return null;
 const west=meters(geometry[1],geometry[2]);
 const east=meters(geometry[7],geometry[0]);
 const wLon=(geometry[1].lon+geometry[2].lon)/2;
 const eLon=(geometry[7].lon+geometry[0].lon)/2;
 if(Math.abs(west-44.429)>.10||Math.abs(east-44.299)>.10||
  wLon>=eLon||Math.abs(west-s.westProjectLength)>1)return null;
 return {
  version:'5.154',sourceOSMId:s.osmId,sourceRUIANId:s.ruian,
  westEdgeIndex:s.westEdge,westEdgeMeters:+west.toFixed(3),
  eastEdgeMeters:+east.toFixed(3),projectFacadeMeters:44,
  projectVerticalReferenceMeters:s.projectVerticalReference,
  modelHeightMeters:s.projectVerticalReference,
  previousModelHeightMeters:s.originalModelHeight,
  increaseMeters:+(s.projectVerticalReference-s.originalModelHeight).toFixed(2),
  publicDocument:s.source,page:s.page,documentDate:s.sourceDate,
  originalOSMGeometryUntouched:true,originalOSMLevelsUntouched:true,
  roofHeightNotSurveyed:true,elevationFromScaffoldBudget:true,
  installedShadesNotVerified:true,newShades:0,newDoors:0,
  newBuildings:0,newRoads:0,newFootways:0,newColliders:0,
  newTrees:0,newLamps:0,newParking:0
 };
}
