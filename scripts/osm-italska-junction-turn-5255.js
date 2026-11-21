/** 5.255 experimental visual NPC turn continuity only at original mapped
 * Italska (8590284) connections. A local 2D lane-tube proxy guards every
 * sampled body corner; when it fails, KEEP the original NPC path and heading.
 * Never claim actual surveyed kerbs, swept-wheel physics or legal speed limits.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
const NEIGHBORS=new Set(['8585601','1107814416']);
const EXTERIOR_WIDTH=2*(1.81*.56+.03);
const MAX_LENGTH=5.08,TURN_METRES=4,APPROACH_METRES=6;
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
 const d=clamp(metres,0,TURN_METRES),t=d/TURN_METRES;
 const ease=t*t*(3-2*t);
 const next=straightPose(turn.to,turn.nextDirection,d);
 return {x:next.x+(turn.oldAnchor.x-turn.newAnchor.x)*(1-ease),
  y:next.y+(turn.oldAnchor.y-turn.newAnchor.y)*(1-ease),
  yaw:turn.fromYaw+angleDelta(turn.fromYaw,turn.toYaw)*ease};
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
 if(!(modelWidth>0&&modelWidth<=2.4&&modelLength>=3.5&&modelLength<=5.1))
  return {...candidate,visualBlendSafe:false,checkedBodySamples:0};
 const n=24;
 let passed=true;
 for(let i=0;i<=n;i++){
  const pose=blendPose(candidate,TURN_METRES*i/n);
  if(!cornersClear(pose,from,to,modelWidth,modelLength,.1)){
   passed=false;break;
  }
 }
 return {...candidate,visualBlendSafe:passed,
  checkedBodySamples:n+1,
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
 return distance>=0&&distance<=APPROACH_METRES?
  MODEL_TURN_SPEED_MPS:Infinity;
}
export const ITALSKA_TURN_MOTION_5255=Object.freeze({
 speedCapMps:MODEL_TURN_SPEED_MPS,turnMetres:TURN_METRES,
 approachMetres:APPROACH_METRES,modelExteriorWidthMetres:EXTERIOR_WIDTH,
 modelMaxBodyLengthMetres:MAX_LENGTH,
 mappedJunctionWayIds:['8585601','1107814416']
});
