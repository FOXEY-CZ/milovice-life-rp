/**
 * Milovice RP 5.139 — Průběžná/Sportovní 2025 street-wide paving pass:
 * one ORIGINAL, 24-node, 162.9m OSM north-side pedestrian sidewalk.
 *
 * The 2025 city tender explicitly covers sidewalk surfaces in BOTH
 * Průběžná and Sportovní, replacing worn surfaces with concrete pavers.
 * It does NOT give photo-surveyed exact as-built colour, individual
 * renovated segments or per-footway boundaries. This is therefore
 * a clearly marked MODEL material proposal only; do not reinterpret
 * older OSM surface=asphalt as definitive 2026 conditions.
 *
 * No guessed pedestrian geometry, kerbs, crossings or street furniture.
 */
export const SPORTOVNI_5139_SOURCE=Object.freeze({
 tender:'https://zakazky.mesto-milovice.cz/contract_display_51.html',
 footwayId:'1278749454',
 footwayHash:'91a94541',
 footwayNodes:24,
 footwayMetres:162.9,
 sourceStart:Object.freeze([50.2302267,14.8640521]),
 sourceEnd:Object.freeze([50.2302332,14.8633758]),
 pairedOneWayId:'83076186',
 pairedRoadHash:'0b8d70e2',
 untouchedUnmarkedCrossings:Object.freeze(['1278749453','1278749455'])
});
const hash=geometry=>{
 let n=2166136261;
 const text=geometry.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const char of text){n^=char.charCodeAt(0);n=Math.imul(n,16777619)}
 return (n>>>0).toString(16).padStart(8,'0');
};
const good=geometry=>Array.isArray(geometry)&&
 geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon));
const meters=(a,b)=>Math.hypot((a.lat-b.lat)*111194,(a.lon-b.lon)*71435);
const pathLength=geo=>geo.slice(1).reduce((total,p,i)=>total+meters(geo[i],p),0);
const matchSidewalk=w=>w?.tags?.highway==='footway'&&
 w.tags.footway==='sidewalk'&&w.tags.surface==='asphalt'&&
 w.tags.horse==='no'&&w.tags.incline==='0%'&&
 w.tags.access!=='private'&&good(w.geometry)&&
 w.geometry.length===SPORTOVNI_5139_SOURCE.footwayNodes&&
 hash(w.geometry)===SPORTOVNI_5139_SOURCE.footwayHash&&
 Math.abs(pathLength(w.geometry)-SPORTOVNI_5139_SOURCE.footwayMetres)<.1;
const matchCrossing=w=>w?.tags?.highway==='footway'&&
 w.tags.footway==='crossing'&&w.tags.crossing==='unmarked'&&
 w.tags['crossing:markings']==='no'&&good(w.geometry)&&
 w.geometry.length===3;
export function planSportovni2025Sidewalk({regionId,ways}={}){
 if(regionId!=='mlada'||!Array.isArray(ways))return null;
 const select=id=>ways.filter(w=>String(w?.id)===id);
 const foot=select(SPORTOVNI_5139_SOURCE.footwayId),
  street=select(SPORTOVNI_5139_SOURCE.pairedOneWayId);
 if(foot.length!==1||!matchSidewalk(foot[0])||
  street.length!==1||street[0]?.tags?.highway!=='residential'||
  street[0]?.tags?.name!=='Sportovní'||street[0]?.tags?.oneway!=='yes'||
  !good(street[0]?.geometry)||street[0].geometry.length!==16||
  hash(street[0].geometry)!==SPORTOVNI_5139_SOURCE.pairedRoadHash)return null;
 for(const id of SPORTOVNI_5139_SOURCE.untouchedUnmarkedCrossings){
  const crossing=select(id);
  if(crossing.length!==1||!matchCrossing(crossing[0]))return null;
 }
 return {
  version:'5.139',sourceTender:SPORTOVNI_5139_SOURCE.tender,
  sourceFootwayId:SPORTOVNI_5139_SOURCE.footwayId,
  sourceOSMHash:SPORTOVNI_5139_SOURCE.footwayHash,
  sourcePairedOneWayId:SPORTOVNI_5139_SOURCE.pairedOneWayId,
  sourceOSMVertices:24,sourceOSMSegments:23,
  sourceOSMMeters:+pathLength(foot[0].geometry).toFixed(1),
  originalOSMSurface:'asphalt',proposedVisualMaterial:'prubezna-concrete',
  cityProjectMentionsSportovniSidewalks:true,
  actualSpecificPathAsBuiltPhotographed:false,
  exactRenovationExtentSurveyed:false,
  modelConcretePaverColourEstimated:true,
  mappedFootwayUnchanged:true,roadOneWayUnchanged:true,
  originalCrossingsUnmarked:true,
  unchangedCrossingIDs:[...SPORTOVNI_5139_SOURCE.untouchedUnmarkedCrossings],
  existingOSMGeometryOnly:true,renderedFootwayPieces:0,
  newFootways:0,newRoads:0,newColliders:0,
  newZebraCrossings:0,newStreetLamps:0,newCurbs:0,
  newParkingSpaces:0
 };
}
export function isSportovni2025Sidewalk(plan,way){
 return plan?.version==='5.139'&&
  String(way?.id)===plan.sourceFootwayId&&matchSidewalk(way);
}
