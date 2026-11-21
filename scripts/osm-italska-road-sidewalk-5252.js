/** Milovice RP 5.252 — fix an over-wide MODEL carriageway hiding the
 * ORIGINAL mapped pavement along the Italská–Rakouská block.
 *
 * The unlabelled residential spur OSM 8590284 has no width=* tag, and
 * defaults to 7.8m in the renderer. This overlaps 52m of mapped sidewalk
 * OSM 1484073943 so its road-safe paving renderer draws NOTHING.
 * With an explicit conservative MODEL width 5.0m (NOT surveyed), the
 * standard unchanged road-clearance renderer can reveal approximately 30m
 * of that original sidewalk; the unsafe 22m remain clipped.
 * Never modify any GPS, fake a kerb, move a path or paint a crossing.
 */
export const ITALSKA_ROAD_SIDEWALK_5252=Object.freeze({
 region:'mlada',
 roadId:'8590284',roadNodes:9,roadHash:'233aae3b',
 roadTags:Object.freeze({highway:'residential',noname:'yes'}),
 sidewalkId:'1484073943',sidewalkNodes:7,
 sidewalkHash:'7d8bc0e5',
 sidewalkTags:Object.freeze({highway:'footway',footway:'sidewalk'}),
 originalModelWidth:7.8,correctedModelWidth:5.0,
 sourceFirstSidewalkMetres:51.968,
 roadwayWidthPhotoMeasured:false,
 crossingPaintAdded:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
function fnv(g){
 let h=2166136261;
 for(const ch of g.map(key).join(';')){
  h^=ch.charCodeAt(0);
  h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
const strictTags=(t,expected)=>!!t&&
 Object.keys(t).length===Object.keys(expected).length&&
 Object.entries(expected).every(([k,v])=>t[k]===v);
const valid=(way,id,nodes,hash,tags)=>String(way?.id)===id&&
 strictTags(way.tags,tags)&&Array.isArray(way.geometry)&&
 way.geometry.length===nodes&&
 way.geometry.every(p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon))&&
 fnv(way.geometry)===hash;
const project=p=>({x:p.lon*111320*Math.cos(50.226*Math.PI/180),
 z:-p.lat*111320});
export function planItalskaRoadSidewalk5252({
 regionId,road,sidewalk,defaultWidth
}={}){
 const c=ITALSKA_ROAD_SIDEWALK_5252;
 if(regionId!==c.region||String(road?.id)!==c.roadId||
  defaultWidth!==c.originalModelWidth||
  !valid(road,c.roadId,c.roadNodes,c.roadHash,c.roadTags)||
  !valid(sidewalk,c.sidewalkId,c.sidewalkNodes,c.sidewalkHash,c.sidewalkTags))
  return null;
 const points=sidewalk.geometry.map(project);
 const firstEdgeMetres=Math.hypot(points[1].x-points[0].x,
  points[1].z-points[0].z);
 if(Math.abs(firstEdgeMetres-c.sourceFirstSidewalkMetres)>.025)return null;
 // The road touches OSM Italská at the southern shared map junction;
 // do not remap that junction or claim an exact asphalt width.
 if(key(road.geometry[0])!=='50.2246434,14.8738288'||
  key(sidewalk.geometry[1])!=='50.2247188,14.8738036')return null;
 return {version:'5.252',sourceRoadOSMId:c.roadId,
  sourceSidewalkOSMId:c.sidewalkId,
  originalRoadGPSVertices:c.roadNodes,originalFootwayGPSVertices:c.sidewalkNodes,
  roadGeometryHash:c.roadHash,sidewalkGeometryHash:c.sidewalkHash,
  priorModelRoadWidthMetres:c.originalModelWidth,
  modelWidthMetres:c.correctedModelWidth,
  sourceFirstSidewalkMetres:+firstEdgeMetres.toFixed(3),
  modelWidthInferredFromMappedFootway:true,photoMeasuredRoadWidth:false,
  clearanceRenderingReused:true,
  originalGPSUnchanged:true,allRoadIndexWidthsConsistent:true,
  unmarkedCrossingWayIds:['1484073944','1484073946'],
  newFootways:0,newCrossings:0,newZebras:0,
  newBuildings:0,newEntrances:0,newParking:0,newColliders:0};
}
