/**
 * Milovice RP 5.134 — Průběžná 2025, documented pedestrian paving.
 *
 * A 2023 city building permit specifies concrete paver sidewalks and
 * draining-paver parking within the Průběžná/Sportovní project. A separately
 * awarded 2025 road+sidewalk renovation covers Průběžná from Tyršova to
 * Sportovní (~400m in the city's contract description).
 *
 * OSM is older: one relevant actual footway has no surface tag and the
 * adjoining short one says asphalt. Treat this as a conservative 2025
 * *visual reconstruction* for TWO existing OSM paths only, not as a claim
 * that 2025 as-built stone colour, paver layout, geometry or project
 * boundary was photographed/surveyed. In particular, DO NOT fabricate
 * 109 parking bays, accessible markings, 22 lamps, or an illuminated
 * crossing from aggregate permit quantities.
 */
export const PRUBEZNA_2025=Object.freeze({
 permit:'https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=14345&id_org=9519',
 tender:'https://zakazky.mesto-milovice.cz/contract_display_51.html',
 roadId:'83076189',
 mappedPedestrianWayIds:Object.freeze(['1046197808','1278746581']),
 // Official permitted project, NOT a GPS inventory and NOT as-built counts.
 plannedParkingTotal:109,plannedAngleParking:94,plannedPerpendicularParking:15,
 plannedAccessibleSpaces:6,plannedNewLights:22,
 plannedSpaceWidthMeters:2.5,plannedWalkwayWidthRangeMeters:[1,2.1],
 parkingSurface:'concrete drainage pavers',sidewalkSurface:'concrete pavers',
 existingRoadSurface:'asphalt',roadRenovationLengthApproxMeters:400
});
const good=(p)=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&
 p.lat>50.2288&&p.lat<50.231&&p.lon>14.860&&p.lon<14.865;
const meters=(a,b)=>Math.hypot((a.lat-b.lat)*111194,(a.lon-b.lon)*71440);
function pathLength(points){
 let sum=0;
 for(let i=1;i<points.length;i++)sum+=meters(points[i-1],points[i]);
 return sum;
}
function footwayOK(e,id){
 if(String(e?.id)!==id||e.tags?.highway!=='footway'||
  e.tags?.footway==='crossing'||e.tags?.access==='private'||
  !Array.isArray(e.geometry)||e.geometry.some(p=>!good(p)))return false;
 const a=e.geometry[0],b=e.geometry.at(-1);
 if(id==='1046197808'){
  if(e.geometry.length!==10||e.tags?.surface!==undefined||
    e.tags?.lit!=='yes'||meters(a,{lat:50.2296183,lon:14.8640556})>.35||
    meters(b,{lat:50.2299581,lon:14.8609678})>.35)return false;
 }else if(id==='1278746581'){
  if(e.geometry.length!==7||e.tags?.footway!=='sidewalk'||
    e.tags?.surface!=='asphalt'||
    meters(a,{lat:50.2298687,lon:14.8610031})>.35||
    meters(b,{lat:50.2301005,lon:14.8615229})>.35)return false;
 }else return false;
 const length=pathLength(e.geometry);
 return length>(id==='1046197808'?245:45)&&
  length<(id==='1046197808'?258:55);
}
export function planPrubezna2025Pavers({regionId,ways}={}){
 if(regionId!=='mlada'||!Array.isArray(ways))return null;
 const road=ways.find(w=>String(w.id)===PRUBEZNA_2025.roadId);
 if(!road||road.tags?.highway!=='residential'||
  road.tags?.name!=='Průběžná'||road.tags?.oneway!=='yes'||
  road.geometry?.length!==13||road.geometry.some(p=>!good(p)))return null;
 const selected=[];
 for(const id of PRUBEZNA_2025.mappedPedestrianWayIds){
  const footway=ways.find(w=>String(w.id)===id);
  if(!footwayOK(footway,id))return null;
  selected.push({
   id,meters:+pathLength(footway.geometry).toFixed(1),
   osmSurfaceTag:footway.tags.surface||null,originalVertexCount:footway.geometry.length,
   paintedUsingExistingOSMFootway:true
  });
 }
 return {
  version:'5.134',sourceRoadId:PRUBEZNA_2025.roadId,
  sourceFootwayIds:selected.map(w=>w.id),sourceFootways:selected,
  originalOSMFootwayLengthMeters:+selected.reduce((sum,w)=>sum+w.meters,0).toFixed(1),
  proposedMaterial:'concrete paver visual',
  sourcePermit:PRUBEZNA_2025.permit,sourceTender:PRUBEZNA_2025.tender,
  documentedRoadRenovationLengthApproxMeters:400,
  plannedParkingTotal:109,plannedAngleParking:94,
  plannedPerpendicularParking:15,plannedAccessibleSpaces:6,plannedLights:22,
  actualParkingPositionsSurveyed:false,actualLuminairePositionsSurveyed:false,
  exactRenovationBoundariesSurveyed:false,asBuiltPhotographicMatch:false,
  concretePaverColorEstimated:true,existingOSMGeometryPreserved:true,
  mappedStreetOneWayPreserved:true,originalRoadWidthPreserved:true,
  newParkingBays:0,newLightPoles:0,newFootways:0,newColliders:0,
  updatedSurfaceWayCount:2,appliedVisualSegments:0,
  existingFootwaysOnly:true
 };
}
export function isPrubezna2025PaverWay(plan,way){
 return plan?.version==='5.134'&&
  plan.sourceFootwayIds.includes(String(way?.id));
}
