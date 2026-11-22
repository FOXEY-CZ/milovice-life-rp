/** Milovice RP 5.273 — source-locked visual seam of a compacted OSM track
 * joining Pod Lesem near Armádní. Only the first painted track rectangle is
 * trimmed to the edge of the already-rendered six-metre asphalt road.
 * OSM nodes, road graph, accessibility, vehicles and colliders stay intact.
 * The precise real-world verge and kerb have NOT been surveyed.
 */
export const POD_LESEM_TRACK_5273=Object.freeze({
 region:'mlada',
 trackId:'1011197688',trackHash:'00b3e58a',trackNodes:11,
 roadId:'128087258',roadHash:'6e14ec02',roadNodes:4,
 junctionKey:'50.2285270,14.8726788',
 roadWidthMetres:6,modelTrackWidthMetres:3.2,
 minModelGapMetres:0.05,
 source:'https://www.openstreetmap.org/way/1011197688',
 surveyedVerge:false
});
const key=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const hash=g=>{
 let h=2166136261;
 for(const ch of g.map(key).join(';')){
  h^=ch.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
};
const exact=(t,e)=>t&&Object.keys(t).length===Object.keys(e).length&&
 Object.entries(e).every(([k,v])=>t[k]===v);
const toWorld=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
export function planPodLesemTrack5273({regionId,ways,widths}={}){
 const S=POD_LESEM_TRACK_5273;
 if(regionId!==S.region||!Array.isArray(ways)||!(widths instanceof Map))
  return null;
 const unique=id=>{
  const list=ways.filter(w=>String(w?.id)===id);
  return list.length===1?list[0]:null;
 };
 const track=unique(S.trackId),road=unique(S.roadId);
 if(!track||!road||track.type!=='way'||road.type!=='way')return null;
 for(const [way,n,sha] of [[track,S.trackNodes,S.trackHash],
  [road,S.roadNodes,S.roadHash]]){
  if(!Array.isArray(way.geometry)||way.geometry.length!==n||
   !way.geometry.every(p=>Number.isFinite(p?.lat)&&
     Number.isFinite(p?.lon))||hash(way.geometry)!==sha)return null;
 }
 if(!exact(track.tags,{highway:'track',lit:'no',surface:'compacted',
   tracktype:'grade1'})||
  !exact(road.tags,{highway:'residential',lane_markings:'no',
   motor_vehicle:'no',name:'Pod Lesem',surface:'asphalt',width:'6'})||
  widths.get(S.trackId)!==S.modelTrackWidthMetres||
  widths.get(S.roadId)!==S.roadWidthMetres||
  key(track.geometry[0])!==S.junctionKey||
  key(road.geometry[1])!==S.junctionKey)return null;
 // Track starts at the ORIGINAL midpoint vertex on the asphalt.
 // Clip its VISUAL compacted material at the modeled asphalt ribbon edge,
 // not at a made-up property line or the real-world curb.
 const [a,b]=road.geometry.slice(0,2).map(toWorld);
 const [start,firstEnd]=track.geometry.slice(0,2).map(toWorld);
 const rdx=b.x-a.x,rdz=b.z-a.z,tdx=firstEnd.x-start.x,
  tdz=firstEnd.z-start.z;
 const roadLength=Math.hypot(rdx,rdz),trackLength=Math.hypot(tdx,tdz);
 if(roadLength<20||trackLength<4||trackLength>8)return null;
 const normal=Math.abs((rdx*tdz-rdz*tdx)/(roadLength*trackLength));
 // Refuse an oblique junction: we could otherwise trim most of a real track.
 if(normal<.96)return null;
 const visualTrimMetres=(S.roadWidthMetres*.5+S.minModelGapMetres)/normal;
 if(visualTrimMetres<2.8||visualTrimMetres>trackLength-.7)return null;
 const renderStart={
  x:start.x+tdx/trackLength*visualTrimMetres,
  z:start.z+tdz/trackLength*visualTrimMetres
 };
 return {version:'5.273',sourceTrackId:S.trackId,
  sourceRoadId:S.roadId,sourceTrackHash:S.trackHash,
  trackSurface:'compacted',roadSurface:'asphalt',
  originalTrackSegments:track.geometry.length-1,
  originalRoadNodes:road.geometry.length,
  firstTrackOriginalMetres:+trackLength.toFixed(4),
  firstTrackVisibleMetres:+(trackLength-visualTrimMetres).toFixed(4),
  visualTrimMetres:+visualTrimMetres.toFixed(4),
  renderStart,sourceFirstEnd:firstEnd,sourceJunctionGPS:{...track.geometry[0]},
  existingRoadWidthMetres:S.roadWidthMetres,
  existingTrackModelWidthMetres:S.modelTrackWidthMetres,
  edgeClearanceMetres:S.minModelGapMetres,
  source:S.source,realKerbPositionVerified:false,
  unchangedTrackGraph:true,unchangedTrackGPS:true,unchangedRoadGPS:true,
  unchangedVehicleAccess:true,unchangedNPCGraph:true,
  newRoads:0,newTrackWays:0,newCrossings:0,newKerbs:0,
  newColliders:0,newTextures:0};
}
