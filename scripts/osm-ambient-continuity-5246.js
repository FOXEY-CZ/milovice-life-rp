/** Milovice RP 5.246 — continue ambient walkers across ADJACENT edges of
 * the SAME original OSM footway. The 1.1 m buffer on either side of an
 * original vertex is crossed along the two original centreline rays, never
 * by teleport or by a new diagonal path. Disallow road/building gaps.
 */
const valid=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const KINDS=new Set(['footway','path','pedestrian']);
function inspectGap(a,b,clearRoad,clearBuilding){
 const d=distance(a,b);
 if(!Number.isFinite(d)||d<.96||d>1.24||!clearBuilding(a,b))return false;
 const steps=Math.max(1,Math.ceil(d/.2));
 for(let i=0;i<=steps;i++){
  const t=i/steps;
  if(!clearRoad.isClear(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,.25,.08))return false;
 }
 return true;
}
export function planMappedAmbientConnections5246({
 segments,ways,toWorld,carriageway,buildingClearance
}={}){
 const links=new Map();
 if(!Array.isArray(segments)||!Array.isArray(ways)||
  typeof toWorld!=='function'||
  typeof carriageway?.isClear!=='function'||
  typeof buildingClearance!=='function')return links;
 const indexed=new Map();
 for(const s of segments){
  if(s?.kind!=='mapped-footway'||
   s.fullBoundaryClearance5245!==true||
   s.clippedFromOriginalRoadSafePiece!==true||
   s.noMappedBuildingOverlap!==true||s.roadShoulder!==false||
   !KINDS.has(s.sourceHighway)||
   !Number.isInteger(s.sourceEdgeIndex)||s.sourceEdgeIndex<0||
   !Number.isFinite(s.len)||s.len<9.5||
   !valid(s.a)||!valid(s.b)||!s.sourceOSMWayId)continue;
  const key=`${s.sourceOSMWayId}:${s.sourceEdgeIndex}`;
  if(!indexed.has(key))indexed.set(key,[]);
  indexed.get(key).push(s);
 }
 for(const way of ways){
  if(!way?.geometry||!Array.isArray(way.geometry)||
   way.geometry.length<3||!KINDS.has(way.tags?.highway))continue;
  const id=String(way.id);
  for(let i=1;i<way.geometry.length-1;i++){
   const before=indexed.get(`${id}:${i-1}`)||[];
   const after=indexed.get(`${id}:${i}`)||[];
   // Clipping can yield multiple disconnected pieces: never guess which
   // piece reaches an original node, or route through an ambiguous fork.
   if(before.length!==1||after.length!==1)continue;
   const prev=before[0],next=after[0];
   if(prev===next||prev.regionId!==next.regionId||
    prev.sourceHighway!==way.tags.highway||
    next.sourceHighway!==way.tags.highway)continue;
   const node=toWorld(way.geometry[i]);
   if(!valid(node))continue;
   const prevEnd=prev.b,nextStart=next.a;
   const prevLen=distance(prev.a,prev.b),nextLen=distance(next.a,next.b);
   if(Math.abs(prev.len-prevLen)>.03||Math.abs(next.len-nextLen)>.03)continue;
   const incoming={x:(prev.b.x-prev.a.x)/prevLen,
    y:(prev.b.y-prev.a.y)/prevLen};
   const outgoing={x:(next.b.x-next.a.x)/nextLen,
    y:(next.b.y-next.a.y)/nextLen};
   // The original 5.243 planner trims exactly 1.1 metres from each
   // endpoint. This verifies the road-clipped piece actually reaches the
   // ORIGINAL node; clipped corners must not be stitched together.
   if(distance({x:prevEnd.x+incoming.x*1.1,
     y:prevEnd.y+incoming.y*1.1},node)>.045||
    distance({x:nextStart.x-outgoing.x*1.1,
     y:nextStart.y-outgoing.y*1.1},node)>.045)continue;
   if(!inspectGap(prevEnd,node,carriageway,buildingClearance)||
    !inspectGap(node,nextStart,carriageway,buildingClearance))continue;
   const first=distance(prevEnd,node),second=distance(node,nextStart);
   links.set(prev,{...links.get(prev),forward:{segment:next,
    distanceToNode:first,distanceFromNode:second}});
   links.set(next,{...links.get(next),backward:{segment:prev,
    distanceToNode:second,distanceFromNode:first}});
  }
 }
 return links;
}

// A small distance budget per frame means no more than one original junction
// can be crossed in one update (source fragments are at least 9.5 m long).
export function advanceMappedAmbientWalker5246({
 segment,progress,direction,stepMetres,connections
}={}){
 if(!segment||!Number.isFinite(segment.len)||segment.len<9.5||
  !Number.isFinite(progress)||Math.abs(progress)>2||
  ![1,-1].includes(direction)||
  !Number.isFinite(stepMetres)||stepMetres<0||stepMetres>3||
  !(connections instanceof Map))return null;
 const moved=progress*segment.len+direction*stepMetres;
 if(direction===1){
  const next=connections.get(segment)?.forward;
  if(next&&moved>segment.len+next.distanceToNode){
   const remainder=moved-segment.len-next.distanceToNode;
   return {segment:next.segment,
    progress:(remainder-next.distanceFromNode)/next.segment.len,
    direction,transitioned:true};
  }
  if(moved>=segment.len&&!next)
   return {segment,progress:1,direction:-1,transitioned:false};
 }else{
  const next=connections.get(segment)?.backward;
  if(next&&moved < -next.distanceToNode){
   const remainder=-next.distanceToNode-moved;
   return {segment:next.segment,
    progress:1+(next.distanceFromNode-remainder)/next.segment.len,
    direction,transitioned:true};
  }
  if(moved<=0&&!next)
   return {segment,progress:0,direction:1,transitioned:false};
 }
 return {segment,progress:moved/segment.len,direction,transitioned:false};
}
