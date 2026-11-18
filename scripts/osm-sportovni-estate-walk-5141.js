/**
 * Milovice RP 5.141 — five original OSM pedestrian links around the
 * Sportovní / Průběžná apartment estate. Repair only small INNER
 * miter wedges between already painted, mapped sidewalk/path strips.
 *
 * Reuse the well-tested 5.106 pedestrian-bend triangulation and the
 * SAME road and building clearance indices as the game's street pass.
 * All source ways are guarded by exact 7-decimal GPS fingerprints.
 * Existing 5.134/5.139 paver proposals remain visual-only; each new
 * corner shares the corresponding OLD way's material and elevation.
 */
import {planMladaFootwayCorners} from './osm-mlada-footway-joins-5106.js';
export const SPORTOVNI_ESTATE_WALK_5141=Object.freeze({
 region:'mlada',anchorId:'1046197811',anchorHash:'57d493a7',
 sources:Object.freeze([
  Object.freeze({id:'1046197807',nodes:22,hash:'fcac836d',
   kind:'footway',footway:'sidewalk',surface:'paving_stones',
   vertices:Object.freeze([8,9,10]),proposedPavers:false}),
  Object.freeze({id:'1046197808',nodes:10,hash:'e45ae8d5',
   kind:'footway',footway:null,surface:null,
   vertices:Object.freeze([6,7,8]),proposedPavers:true}),
  Object.freeze({id:'1046197810',nodes:4,hash:'968b1781',
   kind:'path',footway:null,surface:null,
   vertices:Object.freeze([2]),proposedPavers:false}),
  Object.freeze({id:'1278749454',nodes:24,hash:'91a94541',
   kind:'footway',footway:'sidewalk',surface:'asphalt',
   vertices:Object.freeze([8,9]),proposedPavers:true}),
  Object.freeze({id:'1278749456',nodes:12,hash:'f020c8de',
   kind:'footway',footway:null,surface:'asphalt',
   vertices:Object.freeze([1]),proposedPavers:false})
 ]),
 unmarkedCrossings:Object.freeze([
  Object.freeze({id:'1278749453',hash:'957a9958'}),
  Object.freeze({id:'1278749455',hash:'c1f4df35'})
 ])
});
function hashGPS(geo){
 let h=2166136261;
 const s=geo.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';');
 for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16).padStart(8,'0');
}
const goodGPS=geo=>Array.isArray(geo)&&geo.every(p=>
 Number.isFinite(p?.lat)&&Number.isFinite(p?.lon));
function matching(w,s){
 return w&&String(w.id)===s.id&&w.tags?.highway===s.kind&&
  (w.tags?.footway||null)===s.footway&&
  (w.tags?.surface||null)===s.surface&&
  !['private','no','customers'].includes(w.tags?.access)&&
  goodGPS(w.geometry)&&w.geometry.length===s.nodes&&
  hashGPS(w.geometry)===s.hash;
}
export function planSportovniEstateWalkCorners({
 regionId,ways,roads,buildings,toWorld
}={}){
 if(regionId!=='mlada'||!Array.isArray(ways)||
  typeof roads?.isClear!=='function'||
  typeof buildings?.isClear!=='function'||
  typeof toWorld!=='function')return null;
 const single=id=>{
  const match=ways.filter(w=>String(w?.id)===id);
  return match.length===1?match[0]:null;
 };
 const anchor=single(SPORTOVNI_ESTATE_WALK_5141.anchorId);
 if(!anchor||anchor.tags?.highway!=='footway'||
  !goodGPS(anchor.geometry)||anchor.geometry.length!==3||
  hashGPS(anchor.geometry)!==SPORTOVNI_ESTATE_WALK_5141.anchorHash)
  return null;
 for(const spec of SPORTOVNI_ESTATE_WALK_5141.unmarkedCrossings){
  const way=single(spec.id);
  if(way?.tags?.highway!=='footway'||
   way.tags.footway!=='crossing'||
   way.tags.crossing!=='unmarked'||
   way.tags['crossing:markings']!=='no'||
   !goodGPS(way.geometry)||way.geometry.length!==3||
   hashGPS(way.geometry)!==spec.hash)return null;
 }
 const selected=[];
 for(const spec of SPORTOVNI_ESTATE_WALK_5141.sources){
  const way=single(spec.id);
  if(!matching(way,spec))return null;
  selected.push({
   id:way.id,tags:way.tags,points:way.geometry.map(toWorld)
  });
 }
 const anchorWorld=toWorld(anchor.geometry[0]);
 if(!Number.isFinite(anchorWorld?.x)||
  !Number.isFinite(anchorWorld?.z??anchorWorld?.y))return null;
 const anchorPoint={x:anchorWorld.x,z:anchorWorld.z??anchorWorld.y,
  sourceId:SPORTOVNI_ESTATE_WALK_5141.anchorId};
 const base=planMladaFootwayCorners(selected,{
  anchor:anchorPoint,maxDistance:250,maxTriangles:60,roads,buildings
 });
 const specs=new Map(SPORTOVNI_ESTATE_WALK_5141.sources.map(s=>[s.id,s]));
 const triangles=base.triangles.filter(t=>
  specs.get(t.sourceWayId)?.vertices.includes(t.atNode))
  .map(t=>({...t,
   originalMappedWayId:t.sourceWayId,
   materialKind:specs.get(t.sourceWayId).proposedPavers?
    'prubezna-concrete':null,
   unchangedOldOSMSegment:true
  }));
 const byWay=Object.fromEntries(SPORTOVNI_ESTATE_WALK_5141.sources.map(
  s=>[s.id,triangles.filter(t=>t.sourceWayId===s.id).length]));
 return {
  version:'5.141',sourceRegionId:'mlada',
  originOSMFootwayId:SPORTOVNI_ESTATE_WALK_5141.anchorId,
  checkedSourceFootwayIDs:SPORTOVNI_ESTATE_WALK_5141.sources.map(s=>s.id),
  protectedUnmarkedCrossings:SPORTOVNI_ESTATE_WALK_5141.unmarkedCrossings.map(x=>x.id),
  allOSMVerticesExactlyMatched:true,protectedOriginalOneWay:true,
  mappedSourceWays:5,triangles,plannedSealedCorners:triangles.length,
  byWay,roadOrBuildingGuardApplied:true,
  originalSourceOSMPathsPreserved:true,originalPedestrianGraphPreserved:true,
  noSyntheticPathLength:true,estimatedFootwayWidths:true,
  paverVisualProposalsNotAsBuiltVerified:true,
  areaSquareMeters:+triangles.reduce((n,t)=>n+t.area,0).toFixed(3),
  roadConflictsAvoided:base.skippedNearCarriageway,
  buildingsAvoided:base.skippedNearBuilding,
  privateOrCrossingsSkipped:base.skippedPhotoOrPrivate+base.skippedCrossings,
  generatedStandaloneDrawMeshes:0,renderedCornerTriangles:0,
  inventedFootways:0,inventedRoads:0,inventedGrassPolygons:0,
  inventedTrees:0,inventedZebraCrossings:0,
  inventedStreetLamps:0,inventedCurbs:0,inventedParking:0
 };
}
