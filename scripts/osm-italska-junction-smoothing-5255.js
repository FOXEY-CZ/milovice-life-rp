/** 5.255: bounded visual NPC car turning on original OSM 8590284.
 * This is a model centreline-buffer proxy, NOT real asphalt/collision physics.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
const named=new Set(['8585601','1107814416']);
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const dist=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y);
const add=(p,v,k)=>({x:p.x+v.x*k,y:p.y+v.y*k});
const forward=(s,d)=>({x:d*(s.b.x-s.a.x)/s.len,y:d*(s.b.y-s.a.y)/s.len});
const lane=(s,d,at)=>{
 const f=forward(s,d),side=d*Math.min(2.25,s.width*.25);
 return {x:s.a.x+(s.b.x-s.a.x)*at-f.y*d*side,
  y:s.a.y+(s.b.y-s.a.y)*at+f.x*d*side};
};
const curve=(p,t)=>{
 const u=1-t,{p0,p1,p2,p3}=p;
 return {x:p0.x*u*u*u+3*p1.x*u*u*t+3*p2.x*u*t*t+p3.x*t*t*t,
  y:p0.y*u*u*u+3*p1.y*u*u*t+3*p2.y*u*t*t+p3.y*t*t*t};
};
const tangent=(p,t)=>{
 const u=1-t,{p0,p1,p2,p3}=p;
 const x=3*(p1.x-p0.x)*u*u+6*(p2.x-p1.x)*u*t+3*(p3.x-p2.x)*t*t;
 const y=3*(p1.y-p0.y)*u*u+6*(p2.y-p1.y)*u*t+3*(p3.y-p2.y)*t*t;
 const len=Math.hypot(x,y);
 return len>.00001?{x:x/len,y:y/len}:null;
};
function segmentDistance(p,s){
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y;
 const t=Math.max(0,Math.min(1,((p.x-s.a.x)*dx+(p.y-s.a.y)*dy)/(dx*dx+dy*dy)));
 return Math.hypot(p.x-s.a.x-dx*t,p.y-s.a.y-dy*t);
}
// Sample 31 orientations x 4 body corners, and require 10cm of model
// buffer reserve for every point. Caps are still rounded, not real asphalt.
export function inspectItalskaCurveSweep5255(p){
 if(!p)return {accepted:false,samples:0};
 let maxOverflow=-Infinity;
 for(let i=0;i<=30;i++){
  const t=i/30,center=curve(p,t),f=tangent(p,t);
  if(!f)return {accepted:false,samples:i};
  for(const longitudinal of [-2.54,2.54])
   for(const lateral of [-1.0436,1.0436]){
    const corner={x:center.x+f.x*longitudinal-f.y*lateral,
     y:center.y+f.y*longitudinal+f.x*lateral};
    maxOverflow=Math.max(maxOverflow,Math.min(
     segmentDistance(corner,p.from)-p.from.width*.5,
     segmentDistance(corner,p.to)-p.to.width*.5));
   }
 }
 return {accepted:maxOverflow<=-.1,samples:31,
  reserveMetres:+(-maxOverflow).toFixed(3),
  centerlineBufferProxyOnly:true,actualAsphaltMeshVerified:false,
  physicalSteeringVerified:false};
}
export function planItalskaNpcTurn5255({roadPlan,from,fromDirection,to,toDirection,car,candidateGate=null}={}){
 if(candidateGate!==null&&typeof candidateGate!=='function')return null;
 if(!car||car.driven!==false||car.parked===true||
  car.service||car.wideModel5254===true||
  !narrowItalskaRoad5253(roadPlan,from)||
  !named.has(String(to?.osmId))||to.kind!=='residential'||
  !(to.width>=7)||!finite(from?.a)||!finite(from?.b)||
  !finite(to?.a)||!finite(to?.b)||
  !(from.len>=5)||!(to.len>=5)||
  ![1,-1].includes(fromDirection)||![1,-1].includes(toDirection))return null;
 const node=fromDirection===1?from.b:from.a;
 if(dist(node,toDirection===1?to.a:to.b)>.05)return null;
 const incoming=forward(from,fromDirection),outgoing=forward(to,toDirection);
 const angle=Math.acos(Math.max(-1,Math.min(1,
  incoming.x*outgoing.x+incoming.y*outgoing.y)))*180/Math.PI;
 if(angle<55||angle>145)return null;
 const p0=lane(from,fromDirection,fromDirection===1?1:0);
 let best=null,mostReserve=-Infinity;
 for(const part of [.45,.5,.7]){
  const metres=Math.min(5,from.len*part,to.len*part);
  if(metres<2.6)continue;
  const p3=lane(to,toDirection,toDirection===1?
   metres/to.len:1-metres/to.len);
  for(const gain of [.45,.55]){
   const attempt={from,to,toDirection,metres,p0,p3,
    p1:add(p0,incoming,metres*gain),p2:add(p3,outgoing,-metres*gain)};
   const check=inspectItalskaCurveSweep5255(attempt);
   if(check.accepted&&check.reserveMetres>mostReserve&&
   (!candidateGate||candidateGate(attempt))){
    mostReserve=check.reserveMetres;
    best={...attempt,sourceOSMId:'8590284',
     namedOSMId:String(to.osmId),angleDegrees:+angle.toFixed(2),
     modelBufferReserveMetres:check.reserveMetres,
     centerlineBufferProxyOnly:true,physicalSteeringVerified:false};
   }
  }
 }
 return best;
}
export function sampleItalskaNpcTurn5255(turn,segment,progress,direction){
 if(!turn||turn.to!==segment||turn.toDirection!==direction||
  !Number.isFinite(progress))return null;
 const walked=(direction===1?progress:1-progress)*segment.len;
 if(walked<0||walked>turn.metres+1e-5)return null;
 const t=Math.max(0,Math.min(1,walked/turn.metres));
 const at=curve(turn,t),f=tangent(turn,t);
 return f?{x:at.x,z:at.y,heading:Math.atan2(-f.x,-f.y),t}:null;
}
export function inspectItalskaSmoothTurns5255({roadPlan,segments}={}){
 const all=Array.isArray(segments)?segments:[];
 const narrow=all.filter(s=>narrowItalskaRoad5253(roadPlan,s)&&finite(s.a)&&finite(s.b));
 let arms=0,allowed=0,reserve=Infinity;
 for(const from of narrow)for(const fromDirection of [-1,1]){
  const node=fromDirection===1?from.b:from.a;
  for(const to of all){
   if(!named.has(String(to.osmId)))continue;
   for(const toDirection of [-1,1]){
    if(dist(node,toDirection===1?to.a:to.b)>.05)continue;
    arms++;
    const p=planItalskaNpcTurn5255({
     roadPlan,from,fromDirection,to,toDirection,car:{driven:false}});
    if(p){allowed++;reserve=Math.min(reserve,p.modelBufferReserveMetres);}
   }
  }
 }
 return {version:'5.255',sourceOSMId:'8590284',
  connectedSharpTurnArms:arms,modelBufferedCurvesAccepted:allowed,
  minimumModelReserveMetres:Number.isFinite(reserve)?reserve:null,
  originalOSMGpsUnchanged:true,playerSteeringUnchanged:true,
  roadAndSidewalkMeshesUnchanged:true,actualAsphaltMeshVerified:false,
  physicalSteeringVerified:false,
  ready:narrow.length===8&&arms===4&&allowed===4};
}
