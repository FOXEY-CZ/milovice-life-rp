/**
 * Milovice RP 5.137 — two pre-existing OSM pedestrian links inside the
 * Průběžná/Sportovní housing estate. These are NOT new pedestrian routes.
 *
 * The 2025 city works describe replacing asphalt/concrete walking surfaces
 * with concrete pavers and linking housing blocks. This is a conservative
 * VISUAL materials proposal for exactly two older OSM asphalt sidewalk ways,
 * not as-built proof that each of their stones was repaved. Neither width,
 * GPS geometry, crossings, driving graph nor street furniture is changed.
 */
import {planPrubeznaRoadRenewal} from './osm-prubezna-road-5135.js';
export const PRUBEZNA_5137_SOURCE=Object.freeze({
 tender:'https://zakazky.mesto-milovice.cz/contract_display_51.html',
 mainRoadId:'83076189',
 ways:Object.freeze([
  Object.freeze({id:'1282219855',first:Object.freeze([50.2298619,14.861821]),
   last:Object.freeze([50.2300074,14.8620068]),meters:20.9}),
  Object.freeze({id:'1282219856',first:Object.freeze([50.2298232,14.8625736]),
   last:Object.freeze([50.2300132,14.8628283]),meters:27.9})
 ])
});
const metres=(a,b)=>Math.hypot((a.lat-b.lat)*111194,(a.lon-b.lon)*71435);
function matches(way,source){
 const tags=way?.tags||{},geo=way?.geometry;
 return String(way?.id)===source.id&&tags.highway==='footway'&&
  tags.footway==='sidewalk'&&tags.surface==='asphalt'&&
  tags.access!=='private'&&Array.isArray(geo)&&geo.length===2&&
  geo.every(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon))&&
  [source.first,source.last].every(([lat,lon],i)=>
   Math.abs(geo[i].lat-lat)<1e-7&&Math.abs(geo[i].lon-lon)<1e-7)&&
  Math.abs(metres(geo[0],geo[1])-source.meters)<.15;
}
export function planPrubeznaPedestrianLinks({regionId,ways}={}){
 if(regionId!=='mlada'||!Array.isArray(ways)||
  !planPrubeznaRoadRenewal({regionId,ways}))return null;
 const sourceWays=[];
 for(const source of PRUBEZNA_5137_SOURCE.ways){
  const matchesById=ways.filter(w=>String(w?.id)===source.id);
  if(matchesById.length!==1||!matches(matchesById[0],source))return null;
  sourceWays.push({id:source.id,sourceSurface:'asphalt',
   mappedMetres:+metres(...matchesById[0].geometry).toFixed(1),
   unchangedOSMVertices:2});
 }
 return {
  version:'5.137',sourceURL:PRUBEZNA_5137_SOURCE.tender,
  sourceMainRoadId:PRUBEZNA_5137_SOURCE.mainRoadId,
  sourceFootways:sourceWays,
  sourceFootwayIds:sourceWays.map(w=>w.id),
  originalFootwayMetres:+sourceWays.reduce((s,w)=>s+w.mappedMetres,0).toFixed(1),
  material:'prubezna-concrete',appearanceEstimated:true,
  actualRepavingOfTheseExactLinksPhotographed:false,
  streetPlanC3Georeferenced:false,
  originalFootwayOSMGeometryPreserved:true,originalRoadWidthPreserved:true,
  originalOneWayTrafficPreserved:true,
  sourceFootwayCount:2,renderedExistingSegments:0,
  addedFootways:0,addedColliders:0,addedParkingSpots:0,
  addedLightingPoles:0,addedCrossings:0,addedCurbs:0
 };
}
export function isPrubeznaPedestrianLink(plan,way){
 return plan?.version==='5.137'&&
  plan.sourceFootwayIds.includes(String(way?.id))&&
  PRUBEZNA_5137_SOURCE.ways.some(source=>matches(way,source));
}
