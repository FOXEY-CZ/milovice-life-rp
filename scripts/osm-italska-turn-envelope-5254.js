/** 5.254: conservative static sweep of existing NPC render poses
 * near bends of the unchanged source-locked Italska road.
 * NOT a physical steering simulation or real road survey.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const distSeg=(p,a,b)=>{
 const vx=b.x-a.x,vy=b.y-a.y;
 const len2=vx*vx+vy*vy;
 const t=len2>1e-9?Math.max(0,Math.min(1,((p.x-a.x)*vx+(p.y-a.y)*vy)/len2)):0;
 return Math.hypot(p.x-a.x-vx*t,p.y-a.y-vy*t);
};
function corners(center,tangent,width,length){
 const nx=-tangent.y,ny=tangent.x;
 const result=[];
 for(const longitudinal of [-length/2,length/2])
  for(const lateral of [-width/2,width/2])
   result.push({x:center.x+tangent.x*longitudinal+nx*lateral,
    y:center.y+tangent.y*longitudinal+ny*lateral});
 return result;
}
function pose(seg,progress,direction){
 const dx=seg.b.x-seg.a.x,dy=seg.b.y-seg.a.y,len=Math.hypot(dx,dy);
 if(len<.1)return null;
 const tx=dx/len,ty=dy/len,offset=direction*Math.min(2.25,seg.width*.25);
 return {center:{x:seg.a.x+dx*progress-ty*offset,
   y:seg.a.y+dy*progress+tx*offset},
  tangent:{x:tx*direction,y:ty*direction}};
}
function safePose(p,road,width,length,margin){
 const pts=corners(p.center,p.tangent,width,length);
 const clearance=pts.map(c=>Math.min(...road.map(seg=>distSeg(c,seg.a,seg.b)) ));
 const maxCornerDistance=Math.max(...clearance);
 return {maxCornerDistance,passes:maxCornerDistance+margin<=2.5};
}
// The 5m road itself is nearly straight. Its source-locked connections
// to mapped Italska and Kastanova are the actual high-angle turns.
// This is a topology/angle audit, NOT swept-body or curb validation.
export function inspectItalskaJunctionAngles5254({roadPlan,segments}={}){
 const all=Array.isArray(segments)?segments:[];
 const road=all.filter(s=>narrowItalskaRoad5253(roadPlan,s)&&
  finite(s.a)&&finite(s.b));
 if(!road.length)return {ready:false,sourceLocked:false,
  mappedTurnOptions:0,originalGpsUnchanged:true};
 const ends=[
  {street:'Italská',neighborId:'8585601',
   junction:road[0].a,inward:road[0].b},
  {street:'Kaštanová',neighborId:'1107814416',
   junction:road[road.length-1].b,inward:road[road.length-1].a}
 ];
 const arms=[];
 for(const end of ends){
  const vx=end.inward.x-end.junction.x;
  const vy=end.inward.y-end.junction.y;
  const len=Math.hypot(vx,vy);
  if(len<.1)continue;
  for(const seg of all){
   if(String(seg?.osmId)!==end.neighborId||
      seg?.kind!=='residential'||!finite(seg.a)||!finite(seg.b))
    continue;
   let outside=null;
   if(Math.hypot(seg.a.x-end.junction.x,seg.a.y-end.junction.y)<.05)
    outside=seg.b;
   else if(Math.hypot(seg.b.x-end.junction.x,seg.b.y-end.junction.y)<.05)
    outside=seg.a;
   if(!outside)continue;
   const ux=outside.x-end.junction.x,uy=outside.y-end.junction.y;
   const ul=Math.hypot(ux,uy);
   if(ul<.1)continue;
   const cosine=Math.max(-1,Math.min(1,(vx*ux+vy*uy)/(len*ul)));
   const turn=180-Math.acos(cosine)*180/Math.PI;
   arms.push({street:end.street,neighborOSMId:end.neighborId,
    turnAngleDegrees:+turn.toFixed(2)});
  }
 }
 return {ready:arms.length===4,sourceLocked:true,
  sourceRoadOSMId:'8590284',originalGpsUnchanged:true,
  mappedTurnOptions:arms.length,
  turnsOver75Degrees:arms.filter(a=>a.turnAngleDegrees>75).length,
  maxTurnDegrees:Math.max(0,...arms.map(a=>a.turnAngleDegrees)),
  arms,physicalSteeringVerified:false,
  intersectionClearanceVerified:false};
}
export function inspectItalskaTurnEnvelope5254({
 roadPlan,segments,modelWidth=2*(1.81*.56+.03),modelLength=5.08,
 margin=0.10
}={}){
 const road=Array.isArray(segments)?segments.filter(s=>
  narrowItalskaRoad5253(roadPlan,s)&&finite(s.a)&&finite(s.b)):[];
 if(!road.length||!(modelWidth>0)||!(modelLength>0)||!(margin>=0))
  return {ready:false,reason:'source-or-model-missing',sourceLocked:true,
   physicalSteeringVerified:false};
 const samples=[],joins=[];
 // Sample actual current discrete NPC snap poses near both sides of each bend.
 // A wider 5.08m body is deliberately conservative against the sedan model.
 for(let i=0;i<road.length-1;i++){
  const a=road[i],b=road[i+1];
  if(Math.hypot(a.b.x-b.a.x,a.b.y-b.a.y)>.05)continue;
  const al=Math.hypot(a.b.x-a.a.x,a.b.y-a.a.y);
  const bl=Math.hypot(b.b.x-b.a.x,b.b.y-b.a.y);
  if(al<.1||bl<.1)continue;
  joins.push(i);
  for(const direction of [-1,1]){
   for(const [seg,side] of [[a,'approach'],[b,'departure']]){
    const seglen=Math.hypot(seg.b.x-seg.a.x,seg.b.y-seg.a.y);
    for(const metersFromJoin of [0,0.5,1.5,3]){
     const along=side==='approach'?Math.max(0,1-metersFromJoin/seglen):
      Math.min(1,metersFromJoin/seglen);
     // For reverse direction the actual near-node side is swapped;
     // still test both segment endpoints in both lanes.
     const p=pose(seg,along,direction);
     if(!p)continue;
     const check=safePose(p,road,modelWidth,modelLength,margin);
     samples.push({jointIndex:i,direction,side,metersFromJoin,
      clear:check.passes,maxCornerDistance:+check.maxCornerDistance.toFixed(3)});
    }
   }
  }
 }
 const failing=samples.filter(s=>!s.clear);
 return {ready:true,sourceLocked:true,sourceRoadOSMId:'8590284',
  originalGpsUnchanged:true,segmentCount:road.length,joinCount:joins.length,
  poseSamples:samples.length,failingPoseSamples:failing.length,
  worstCornerDistanceMetres:+Math.max(0,...samples.map(s=>s.maxCornerDistance)).toFixed(3),
  firstFailure:failing[0]||null,modelWidthMetres:modelWidth,
  modelLengthMetres:modelLength,safetyMarginMetres:margin,
  modelCorridorHalfWidthMetres:2.5,
  junctions:inspectItalskaJunctionAngles5254({roadPlan,segments}),
  // Circular buffered-centerline corridor is more permissive than square
  // mesh joins, so passing is only a candidate, never a certification.
  centerlineBufferProxyOnly:true,actualRoadMeshNotVerified:true,
  continuousTurnSweepNotVerified:true,physicalSteeringVerified:false};
}
