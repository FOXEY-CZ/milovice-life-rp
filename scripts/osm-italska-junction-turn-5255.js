/** 5.255 experimental visual NPC turn continuity only at original mapped
 * Italska (8590284) connections. A local 2D lane-tube proxy guards every
 * sampled body corner; when it fails, KEEP the original NPC path and heading.
 * Never claim actual surveyed kerbs, swept-wheel physics or legal speed limits.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
const NEIGHBORS=new Set(['8585601','1107814416']);
const EXTERIOR_WIDTH=2*(1.81*.56+.03);
const MAX_LENGTH=5.08,TURN_METRES=4,APPROACH_METRES=6;
// Exact makeRoadCar variant index%8 lengths, source-checked in unit tests.
const MODEL_LENGTHS=Object.freeze([4.45,4.15,4.75,4.28,4.62,4.86,5.08,4.34]);
const MODEL_TURN_SPEED_MPS=2.6;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const point=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const heading=(seg,dir)=>{
 const dx=(seg.b.x-seg.a.x)*dir,dy=(seg.b.y-seg.a.y)*dir;
 return Math.atan2(-dx,-dy);
};
const traveled=(seg,dir,progress)=>(dir===1?progress:1-progress)*seg.len;
const laneAnchor=(seg,dir,at)=>{
 const dx=(seg.b.x-seg.a.x)/seg.len,dy=(seg.b.y-seg.a.y)/seg.len;
 const offset=dir*Math.min(2.25,seg.width*.25);
 return {x:at.x-dy*offset,y:at.y+dx*offset};
};
const angleDelta=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));
const distToSegment=(p,s)=>{
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y;
 const scale=dx*dx+dy*dy;
 const t=scale>1e-8?clamp(((p.x-s.a.x)*dx+(p.y-s.a.y)*dy)/scale,0,1):0;
 return Math.hypot(p.x-s.a.x-dx*t,p.y-s.a.y-dy*t);
};
export function isItalskaSourceTurn5255({roadPlan,from,direction,to,nextDirection}={}){
 if(!from||!to||![1,-1].includes(direction)||
    ![1,-1].includes(nextDirection)||from===to)return false;
 const narrowFrom=narrowItalskaRoad5253(roadPlan,from);
 const narrowTo=narrowItalskaRoad5253(roadPlan,to);
 const namedFrom=NEIGHBORS.has(String(from.osmId))&&from.kind==='residential';
 const namedTo=NEIGHBORS.has(String(to.osmId))&&to.kind==='residential';
 if(!(narrowFrom&&namedTo||narrowTo&&namedFrom))return false;
 if(!point(from.a)||!point(from.b)||!point(to.a)||!point(to.b)||
  !(from.len>2.5)||!(to.len>5)||!(from.width>=5)||!(to.width>=5))return false;
 const end=direction===1?from.b:from.a,start=nextDirection===1?to.a:to.b;
 if(Math.hypot(end.x-start.x,end.y-start.y)>.05)return false;
 const ux=(from.b.x-from.a.x)*direction/from.len;
 const uy=(from.b.y-from.a.y)*direction/from.len;
 const vx=(to.b.x-to.a.x)*nextDirection/to.len;
 const vy=(to.b.y-to.a.y)*nextDirection/to.len;
 const angle=Math.acos(clamp(ux*vx+uy*vy,-1,1))*180/Math.PI;
 return angle>=70&&angle<=120;
}
export function capItalskaApproach5255({
 roadPlan,from,direction,progress,decision,driven=false
}={}){
 if(driven||!decision||decision.mode!=='connected')return Infinity;
 const distToJunction=(direction===1?1-progress:progress)*from?.len;
 if(!(distToJunction>=0&&distToJunction<=APPROACH_METRES))return Infinity;
 return isItalskaSourceTurn5255({roadPlan,from,direction,
  to:decision.segment,nextDirection:decision.direction})?
  MODEL_TURN_SPEED_MPS:Infinity;
}
const straightPose=(seg,dir,metres)=>{
 const endpoint=dir===1?seg.a:seg.b;
 const vx=(seg.b.x-seg.a.x)*dir/seg.len,vy=(seg.b.y-seg.a.y)*dir/seg.len;
 const a=laneAnchor(seg,dir,endpoint);
 return {x:a.x+vx*metres,y:a.y+vy*metres,yaw:heading(seg,dir)};
};
function blendPose(turn,metres){
 // A cubic Hermite-like Bezier has the *actual incoming tangent* at its
 // first point and the mapped departing tangent at its final point.
 // It prevents the heading/velocity disagreement of linear lane snapping.
 const t=clamp(metres/TURN_METRES,0,1),q=1-t;
 const [p0,p1,p2,p3]=turn.bezier;
 const x=q*q*q*p0.x+3*q*q*t*p1.x+3*q*t*t*p2.x+t*t*t*p3.x;
 const y=q*q*q*p0.y+3*q*q*t*p1.y+3*q*t*t*p2.y+t*t*t*p3.y;
 const vx=3*q*q*(p1.x-p0.x)+6*q*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x);
 const vy=3*q*q*(p1.y-p0.y)+6*q*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y);
 return {x,y,yaw:Math.atan2(-vx,-vy)};
}
function cornersClear(pose,from,to,width,length,margin){
 const forward={x:-Math.sin(pose.yaw),y:-Math.cos(pose.y)};
 const sideways={x:-forward.y,y:forward.x};
 for(const a of [-length*.5,length*.5])
  for(const b of [-width*.5,width*.5]){
   const p={x:pose.x+forward.x*a+sideways.x*b,
    y:pose.y+forward.y*a+sideways.y*b};
   if(![from,to].some(s=>distToSegment(p,s)+margin<=s.width*.5))
    return false;
  }
 return true;
}
export function planItalskaTurn5255({
 roadPlan,from,direction,to,nextDirection,driven=false,
 modelWidth=EXTERIOR_WIDTH,modelLength=MAX_LENGTH
}={}){
 if(driven||!isItalskaSourceTurn5255({
  roadPlan,from,direction,to,nextDirection}))return null;
 const end=direction===1?from.b:from.a;
 const start=nextDirection===1?to.a:to.b;
 const candidate={sourceLocked:true,originalGPSUnchanged:true,
  from,to,direction,nextDirection,modelWidth,modelLength,
  fromYaw:heading(from,direction),toYaw:heading(to,nextDirection),
  oldAnchor:laneAnchor(from,direction,end),
  newAnchor:laneAnchor(to,nextDirection,start),
  turnMetres:TURN_METRES,speedCapMps:MODEL_TURN_SPEED_MPS,
  physicalSteeringVerified:false,roadMeshCollisionVerified:false,
  renderedCurveOnly:true};
 const destinationPose=straightPose(to,nextDirection,TURN_METRES);
 const incoming={x:(from.b.x-from.a.x)*direction/from.len,
  y:(from.b.y-from.a.y)*direction/from.len};
 const outgoing={x:(to.b.x-to.a.x)*nextDirection/to.len,
  y:(to.b.y-to.a.y)*nextDirection/to.len};
 const tangentialMetres=1.8; // estimated visual control, NOT surveyed radius
 candidate.bezier=[
  {x:candidate.oldAnchor.x,y:candidate.oldAnchor.y},
  {x:candidate.oldAnchor.x+incoming.x*tangentialMetres,
   y:candidate.oldAnchor.y+incoming.y*tangentialMetres},
  {x:destinationPose.x-outgoing.x*tangentialMetres,
   y:destinationPose.y-outgoing.y*tangentialMetres},
  {x:destinationPose.x,y:destinationPose.y}
 ];
 if(!(modelWidth>0&&modelWidth<=2.4&&modelLength>=3.5&&modelLength<=5.1))
  return {...candidate,visualBlendSafe:false,checkedBodySamples:0};
 const n=24;
 let passed=true,checked=0,arc=0,previous=null;
 for(let i=0;i<=n;i++){
  const pose=blendPose(candidate,TURN_METRES*i/n);
  if(previous)arc+=Math.hypot(pose.x-previous.x,pose.y-previous.y);
  previous=pose;checked++;
  if(!cornersClear(pose,from,to,modelWidth,modelLength,.1)){
   passed=false;break;
  }
 }
 return {...candidate,visualBlendSafe:passed,
  checkedBodySamples:checked,
  visualPathLengthMetres:passed?arc:null,
  modelRoadTubeProxyOnly:true};
}
export function sampleItalskaTurn5255({turn,segment,direction,progress}={}){
 if(!turn?.visualBlendSafe||turn.to!==segment||
  turn.nextDirection!==direction)return null;
 const distance=traveled(segment,direction,progress);
 if(!(distance>=0&&distance<TURN_METRES))return null;
 return blendPose(turn,distance);
}
export function capItalskaExit5255({turn,segment,direction,progress}={}){
 if(!turn?.sourceLocked||turn.to!==segment||
  turn.nextDirection!==direction)return Infinity;
 const distance=traveled(segment,direction,progress);
 if(!(distance>=0&&distance<=APPROACH_METRES))return Infinity;
 // The Bezier arc can be longer than the four metres of road progress;
 // scale the exit rate to keep the actual visual motion <= model cap.
 if(distance<TURN_METRES&&turn.visualBlendSafe&&
   turn.visualPathLengthMetres>TURN_METRES)
  return MODEL_TURN_SPEED_MPS*TURN_METRES/turn.visualPathLengthMetres;
 return MODEL_TURN_SPEED_MPS;
}
export const ITALSKA_TURN_MOTION_5255=Object.freeze({
 speedCapMps:MODEL_TURN_SPEED_MPS,turnMetres:TURN_METRES,
 approachMetres:APPROACH_METRES,modelExteriorWidthMetres:EXTERIOR_WIDTH,
 modelMaxBodyLengthMetres:MAX_LENGTH,
 modelBodyLengthsMetres:MODEL_LENGTHS,
 mappedJunctionWayIds:['8585601','1107814416']
});
