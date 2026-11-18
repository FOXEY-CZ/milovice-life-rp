/**
 * Milovice RP 5.135 — Průběžná surface renovation, OSM way 83076189.
 *
 * The city's 2025 contract confirms renewing the wearing course of
 * Průběžná between Tyršova and Sportovní, approximately 400m long,
 * with exclusions where asphalt was recently repaired.
 *
 * The referenced 13-vertex OSM one-way road is ONLY ~256.6m of that
 * project. We update its ALREADY EXISTING material only (a subtle
 * cleaner-asphalt tint on the shared road texture), leaving original
 * centreline, drive graph, width, elevation and collision untouched.
 * We cannot survey exactly where construction joints/exclusions were.
 */
export const PRUBEZNA_5135_SOURCE=Object.freeze({
 roadId:'83076189',
 tender:'https://zakazky.mesto-milovice.cz/contract_display_51.html',
 contractedApproxRoadMetres:400,
 confirmedStreet:'Průběžná',
 oldOSMOneWay:'yes',
 reconstructionDescription:'2025 wearing-course surface renewal',
 expectedPointCount:13,
 sourceOSMStart:Object.freeze({lat:50.2302093,lon:14.864159}),
 sourceOSMEnd:Object.freeze({lat:50.2301766,lon:14.8605686})
});
const d=(a,b)=>Math.hypot((a.lat-b.lat)*111194,(a.lon-b.lon)*71435);
function length(points){
 let sum=0;
 for(let i=1;i<points.length;i++)sum+=d(points[i-1],points[i]);
 return sum;
}
function valid(way){
 if(!way||String(way.id)!==PRUBEZNA_5135_SOURCE.roadId)return false;
 const t=way.tags||{},p=way.geometry;
 if(t.highway!=='residential'||t.name!=='Průběžná'||
  t.oneway!=='yes'||(t.surface&&t.surface!=='asphalt')||
  !Array.isArray(p)||p.length!==13||
  p.some(x=>!Number.isFinite(x.lat)||!Number.isFinite(x.lon)))return false;
 if(d(p[0],PRUBEZNA_5135_SOURCE.sourceOSMStart)>.22||
  d(p.at(-1),PRUBEZNA_5135_SOURCE.sourceOSMEnd)>.22)return false;
 const metres=length(p);
 // Fail closed if any real mapped vertex moves off the expected route.
 if(metres<254||metres>260)return false;
 for(let i=1;i<p.length;i++){
  const gap=d(p[i-1],p[i]);
  if(gap<3||gap>75)return false;
 }
 return true;
}
export function planPrubeznaRoadRenewal({regionId,ways}={}){
 if(regionId!=='mlada'||!Array.isArray(ways))return null;
 const original=ways.find(w=>String(w.id)===PRUBEZNA_5135_SOURCE.roadId);
 if(!valid(original))return null;
 return {
  version:'5.135',sourceRoadId:PRUBEZNA_5135_SOURCE.roadId,
  sourceURL:PRUBEZNA_5135_SOURCE.tender,
  sourceOSMVertices:13,sourceOSMSegments:12,
  sourceOSMMetres:+length(original.geometry).toFixed(1),
  documentedTotalRenovationApproxMetres:400,
  visualMaterial:'prubezna-repaired-asphalt',
  visualSubtleAsphaltTint:true,
  modelIncludesOnlyMappedRoad:true,
  preciseResurfacingBoundarySurveyed:false,
  roadWideningOrNarrowingSurveyed:false,
  oldOSMOneWayPreserved:true,
  originalRoadWidthPreserved:true,
  originalVertexGeometryPreserved:true,
  originalPedestrianPathsPreserved:true,
  originalTrafficGraphPreserved:true,
  newRoadSegments:0,addedMeshes:0,addedColliders:0,
  inventedPaintedLines:0,inventedParkingSpaces:0,
  inventedStreetLights:0,newCurbs:0,
  renderedExistingSegments:0
 };
}
export function isPrubeznaRenovatedRoad(plan,way){
 return plan?.version==='5.135'&&
  String(way?.id)===plan.sourceRoadId&&valid(way);
}
