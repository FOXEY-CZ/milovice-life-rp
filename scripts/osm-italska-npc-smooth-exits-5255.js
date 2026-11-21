/**
 * Milovice 5.255: smooth only SOURCE-LOCKED normal NPC exits from the modeled
 * 5 m Italska road OSM 8590284 to its original mapped named-road segments.
 * Verify a conservative static car envelope before choosing a cubic turn.
 * This is a rendering/traffic curve, NOT surveyed kerbs, steering physics,
 * or a claim about traffic permissions.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';

export const ITALSKA_SMOOTH_EXIT_5255=Object.freeze({
 sourceRoadId:'8590284',
 junctionRoadIds:Object.freeze(['8585601','1107814416']),
 targetMetres:4,controlMetres:2,
 exteriorWidthMetres:2*(1.81*.56+.03),
 conservativeCarLengthMetres:5.08,
 edgeMarginMetres:.10,samples:48
});
const finite=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const along=(a,u,d)=>({x:a.x+u.x*d,y:a.y+u.y*d});
const normalized=(a,b,d)=>{
 const x=(b.x-a.x)*d,y=(b.y-a.y)*d,n=Math.hypot(x,y);
 return n>.01?{x:x/n,y:y/n}:null;
};
const left=u=>({x:-u.y,y:u.x});
const shifted=(point,u,width)=>along(point,left(u),width*.25);
const bezier=(p,t)=>{
 const q=1-t;
 return {x:q*q*q*p[0].x+3*q*q*t*p[1].x+3*q*t*t*p[2].x+t*t*t*p[3].x,
  y:q*q*q*p[0].y+3*q*q*t*p[1].y+3*q*t*t*p[2].y+t*t*t*p[3].y};
};
const derivative=(p,t)=>{
 const q=1-t;
 return {x:3*q*q*(p[1].x-p[0].x)+6*q*t*(p[2].x-p[1].x)+3*t*t*(p[3].x-p[2].x),
  y:3*q*q*(p[1].y-p[0].y)+6*q*t*(p[2].y-p[1].y)+3*t*t*(p[3].y-p[2].y)};
};
const pointToSegment=(p,s)=>{
 const dx=s.b.x-s.a.x,dy=s.b.y-s.a.y,n=dx*dx+dy*dy;
 const t=n>1e-8?Math.max(0,Math.min(1,
  ((p.x-s.a.x)*dx+(p.y-s.a.y)*dy)/n)):0;
 return Math.hypot(p.x-s.a.x-dx*t,p.y-s.a.y-dy*t);
};
function envelopeFits(points,from,to,c){
 for(let i=0;i<=c.samples;i++){
  const t=i/c.samples,center=bezier(points,t),v=derivative(points,t);
  const norm=Math.hypot(v.x,v.y);
  if(norm<.03)return false;
  const u={x:v.x/norm,y:v.y/norm},n=left(u);
  for(const side of [-1,1])for(const alongAxis of [-1,1]){
   const x=center.x+n.x*side*c.exteriorWidthMetres/2+
    u.x*alongAxis*c.conservativeCarLengthMetres/2;
   const y=center.y+n.y*side*c.exteriorWidthMetres/2+
    u.y*alongAxis*c.conservativeCarLengthMetres/2;
   const corner={x,y};
   // Union of buffered SOURCE centrelines; no new ground is rendered.
   const clearance=Math.min(
    pointToSegment(corner,from)-from.width/2,
    pointToSegment(corner,to)-to.width/2);
   if(clearance> -c.edgeMarginMetres+1e-5)return false;
  }
 }
 return true;
}
export function planItalskaSmoothNpcExit5255({
 roadPlan,from,direction,to,nextDirection,car
}={}){
 const c=ITALSKA_SMOOTH_EXIT_5255;
 if(!narrowItalskaRoad5253(roadPlan,from)||
  !finite(from?.a)||!finite(from?.b)||!finite(to?.a)||!finite(to?.b)||
  !Number.isFinite(from?.len)||!Number.isFinite(to?.len)||
  ![1,-1].includes(direction)||![1,-1].includes(nextDirection)||
  !c.junctionRoadIds.includes(String(to?.osmId))||
  to.kind!=='residential'||!(to.width>=6)||
  !(from.len>=5)||!(to.len>=c.targetMetres+2)||
  car?.service||car?.wideModel5254===true||
  car?.driven===true||car?.parked===true)return null;
 const fromNode=direction===1?from.b:from.a;
 const toNode=nextDirection===1?to.a:to.b;
 if(distance(fromNode,toNode)>.05)return null;
 const incoming=normalized(from.a,from.b,direction);
 const outgoing=normalized(to.a,to.b,nextDirection);
 if(!incoming||!outgoing)return null;
 const dot=Math.max(-1,Math.min(1,incoming.x*outgoing.x+
  incoming.y*outgoing.y));
 const angle=Math.acos(dot)*180/Math.PI;
 if(angle<65||angle>120)return null;
 const start=shifted(fromNode,incoming,from.width);
 const finish=along(shifted(toNode,outgoing,to.width),
  outgoing,c.targetMetres);
 const controls=[start,along(start,incoming,c.controlMetres),
  along(finish,outgoing,-c.controlMetres),finish];
 if(!envelopeFits(controls,from,to,c))return null;
 const arc=[{t:0,metres:0}],N=64;
 let length=0,last=start;
 for(let i=1;i<=N;i++){
  const t=i/N,p=bezier(controls,t);
  length+=distance(p,last);arc.push({t,metres:length});last=p;
 }
 if(!(length>1&&length<15))return null;
 return {version:'5.255',fromOSMId:c.sourceRoadId,
  toOSMId:String(to.osmId),angleDegrees:+angle.toFixed(2),
  controls,arc,totalMetres:length,travelledMetres:0,
  destinationProgress:nextDirection===1?
   c.targetMetres/to.len:1-c.targetMetres/to.len,
  sourceLocked:true,modelEnvelopeChecked:true,
  sweptDynamicsValidated:false,originalGPSUnchanged:true,
  laneWidthUnsurveyed:true};
}
export function advanceItalskaSmoothNpcExit5255(plan,metres){
 if(plan?.version!=='5.255'||!Array.isArray(plan.arc)||
  !Number.isFinite(metres)||metres<0)return null;
 const previous=plan.travelledMetres;
 plan.travelledMetres=Math.min(plan.totalMetres,previous+metres);
 const nodes=plan.arc;
 let i=1;
 while(i<nodes.length-1&&nodes[i].metres<plan.travelledMetres)i++;
 const a=nodes[i-1],b=nodes[i];
 const t=a.t+(b.t-a.t)*(b.metres>a.metres?
  (plan.travelledMetres-a.metres)/(b.metres-a.metres):0);
 const p=bezier(plan.controls,t),d=derivative(plan.controls,t),
  heading=Math.atan2(-d.x,-d.y);
 return {x:p.x,z:p.y,yaw:heading,
  metresMoved:plan.travelledMetres-previous,
  finished:plan.travelledMetres>=plan.totalMetres-1e-7,
  destinationProgress:plan.destinationProgress};
}
export function inspectItalskaSmoothNpcExits5255({roadPlan,segments}={}){
 const c=ITALSKA_SMOOTH_EXIT_5255,all=Array.isArray(segments)?segments:[];
 const narrow=all.filter(s=>narrowItalskaRoad5253(roadPlan,s));
 const probes=[],ends=[{s:narrow[0],direction:-1,roadId:c.junctionRoadIds[0]},
  {s:narrow[narrow.length-1],direction:1,roadId:c.junctionRoadIds[1]}];
 for(const end of ends){
  if(!end.s)continue;
  const node=end.direction===1?end.s.b:end.s.a;
  for(const next of all){
   if(String(next?.osmId)!==end.roadId||!finite(next.a)||!finite(next.b))continue;
   const dir=distance(next.a,node)<.05?1:
    distance(next.b,node)<.05?-1:0;
   if(!dir)continue;
   const planned=planItalskaSmoothNpcExit5255({
    roadPlan,from:end.s,direction:end.direction,to:next,
    nextDirection:dir,car:{wideModel5254:false,service:null}});
   probes.push({toOSMId:end.roadId,angleDegrees:planned?.angleDegrees??null,
    safeCurve:Boolean(planned)});
  }
 }
 return {version:'5.255',ready:narrow.length===8&&probes.length===4&&
  probes.filter(p=>p.safeCurve).length>=2,mappedNarrowSegments:narrow.length,
  testedExits:probes.length,safeModelExits:probes.filter(p=>p.safeCurve).length,
  unverifiedExits:probes.filter(p=>!p.safeCurve).length,
  noNewRoads:true,originalGPSUnchanged:true,playerDrivingUnchanged:true,
  sourceModelWidthNotSurveyed:true,actualCollisionMeshNotValidated:true,
  physicalSteeringNotValidated:true,probes};
}
