/** Milovice RP 5.191 — two physical zebra approaches to the explicitly
 * mapped Armádní crossing:island=yes at OSM middle node.
 *
 * 5.190 correctly put a raised refuge at the OSM road/crossing junction.
 * The old zebra drawer nonetheless ignored the third crossing node and
 * painted one continuous set of bars through the refuge. Split only this
 * source-locked crossing into two painted approaches, with an unpainted
 * clearance over the (estimated-size) centre island.
 *
 * OSM axes, original pedestrian route and road geometry are NOT changed.
 * The exact painted bar spacing is a game-art estimate, not photo surveyed.
 */
export const ARMADNI_ZEBRA_ARMS_5191=Object.freeze({
 crossingId:'1316882855',crossingHash:'c236e738',
 refugeRoadId:'1331897683',
 midpointIndex:1,unpaintedSideBufferMetres:.08,
 paintNotPhotoVerified:true
});
function fingerprint(g){
 let h=2166136261;
 for(const c of g.map(p=>p.lat.toFixed(7)+','+p.lon.toFixed(7)).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return(h>>>0).toString(16).padStart(8,'0');
}
export function planArmadniZebraArms5191({
 islandPlan,crossing,toWorld,carriageway,planZebraPieces
}={}){
 const c=ARMADNI_ZEBRA_ARMS_5191;
 if(islandPlan?.version!=='5.190'||
  islandPlan.crossingId!==c.crossingId||
  islandPlan.roadId!==c.refugeRoadId||
  islandPlan.sourceCrossingHash!==c.crossingHash||
  islandPlan.sourceCrossingHasIsland!==true||
  islandPlan.centerPointSourceVerified!==true||
  islandPlan.shapeDimensionsEstimated!==true||
  !Number.isFinite(islandPlan.modelWidthMeters)||
  islandPlan.modelWidthMeters<.3||islandPlan.modelWidthMeters>1.5||
  String(crossing?.id)!==c.crossingId||
  crossing?.tags?.highway!=='footway'||
  crossing.tags.footway!=='crossing'||
  crossing.tags.crossing!=='marked'||
  crossing.tags['crossing:markings']!=='zebra'||
  crossing.tags['crossing:island']!=='yes'||
  crossing.tags.surface!=='asphalt'||
  !Array.isArray(crossing.geometry)||crossing.geometry.length!==3||
  crossing.geometry.some(p=>!Number.isFinite(p?.lat)||!Number.isFinite(p?.lon))||
  fingerprint(crossing.geometry)!==c.crossingHash||
  crossing.geometry[1].lat!==islandPlan.centerGPS?.lat||
  crossing.geometry[1].lon!==islandPlan.centerGPS?.lon||
  typeof toWorld!=='function'||
  typeof carriageway?.nearest!=='function'||
  typeof planZebraPieces!=='function')return null;
 const pts=crossing.geometry.map(toWorld);
 if(pts.some(p=>!Number.isFinite(p?.x)||
   !Number.isFinite(p?.y??p?.z)))return null;
 const xyz=p=>({x:p.x,z:p.z??p.y});
 const [a,m,b]=pts.map(xyz);
 const d1=Math.hypot(a.x-m.x,a.z-m.z);
 const d2=Math.hypot(b.x-m.x,b.z-m.z);
 if(d1<3||d2<3||d1>12||d2>12)return null;
 const dir=islandPlan.pedestrianAxis;
 if(!Number.isFinite(dir?.x)||!Number.isFinite(dir?.z)||
  Math.abs(Math.hypot(dir.x,dir.z)-1)>.001)return null;
 const approach=[{name:'north',points:[a,m]},{name:'south',points:[m,b]}];
 const groups=approach.map(arm=>{
  const bars=planZebraPieces(arm.points,carriageway);
  if(!Array.isArray(bars))return null;
  const retained=[],removed=[];
  for(const bar of bars){
   if(!Number.isFinite(bar?.width)||bar.width<=0||
    ![bar?.a?.x,bar?.a?.z,bar?.b?.x,bar?.b?.z].every(Number.isFinite))
    return null;
   const cx=(bar.a.x+bar.b.x)*.5,cz=(bar.a.z+bar.b.z)*.5;
   const distance=Math.abs((cx-m.x)*dir.x+(cz-m.z)*dir.z);
   // No edge of a painted stripe reaches the model island. We don't
   // invent a new raised road strip or alter the drivable network.
   const clearRadius=islandPlan.modelWidthMeters*.5+
    bar.width*.5+c.unpaintedSideBufferMetres;
   (distance>=clearRadius?retained:removed).push(bar);
  }
  return {name:arm.name,retained,removed};
 });
 if(groups.some(g=>!g||g.retained.length===0))return null;
 const pieces=groups.flatMap(g=>g.retained);
 const centers=pieces.map(bar=>{
  const x=(bar.a.x+bar.b.x)*.5,z=(bar.a.z+bar.b.z)*.5;
  return Math.abs((x-m.x)*dir.x+(z-m.z)*dir.z)-bar.width*.5;
 });
 const minimumEdgeGap=Math.min(...centers);
 return {
  version:'5.191',sourceCrossingId:c.crossingId,
  sourceRoadId:islandPlan.roadId,sourceCrossingHash:c.crossingHash,
  northBars:groups[0].retained.length,
  southBars:groups[1].retained.length,
  removedFromIslandArea:groups.reduce((n,g)=>n+g.removed.length,0),
  allBarsOnApproaches:true,
  minimumPaintEdgeGapMetres:+minimumEdgeGap.toFixed(3),
  islandHalfWidthMetres:islandPlan.modelWidthMeters*.5,
  twoOriginalCrossingArms:true,sourceMidpointGPS:{...islandPlan.centerGPS},
  pieces,paintSpacingNotPhotoVerified:true,
  noNewPedestrianRoutes:true,originalCrossingVerticesPreserved:true,
  newOSMWays:0,newRoads:0,newColliders:0
 };
}
