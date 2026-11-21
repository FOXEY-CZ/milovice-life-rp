/** 5.256: source-locked PLAN-VIEW safety audit against actual osmStrip
 * rectangle footprints, not the wider rounded centreline buffer in 5.255.
 * Does NOT validate DEM altitude, curbs, steering, or moving collisions.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
import {planItalskaNpcTurn5255,sampleItalskaNpcTurn5255}
 from './osm-italska-junction-smoothing-5255.js';
const IDS=new Set(['8590284','8585601','1107814416']);
const NAMED=new Set(['8585601','1107814416']);
export const ITALSKA_STRIP_SAFETY_5256=Object.freeze({
 bodyLength:5.08,bodyWidth:2*(1.81*.56+.03),
 bodyGridStep:.52,orientationSamples:31,
 // A strictly interior planar footprint, not a rounded road end-cap.
 edgeReserve:0
});
function point(p){return Number.isFinite(p?.x)&&Number.isFinite(p?.y)}
function validStrip(seg){
 if(!IDS.has(String(seg?.osmId))||seg?.kind!=='residential'||
  !point(seg.a)||!point(seg.b)||!(seg.len>=2.5&&seg.len<=175))return false;
 const expected=String(seg.osmId)==='8590284'?5:7.8;
 return seg.width===expected&&
  Math.abs(Math.hypot(seg.b.x-seg.a.x,seg.b.y-seg.a.y)-seg.len)<.025;
}
// Mirrors osmStrip's rectangular XZ footprint. Its DEM tessellation never
// changes horizontal vertices, but triangles/vertical alignment are NOT raycast.
export function pointInsideItalskaStrip5256(x,z,seg,reserve=0){
 if(!validStrip(seg)||![x,z,reserve].every(Number.isFinite)||
  reserve<0)return false;
 const dx=(seg.b.x-seg.a.x)/seg.len,dz=(seg.b.y-seg.a.y)/seg.len;
 const vx=x-seg.a.x,vz=z-seg.a.y;
 const u=vx*dx+vz*dz,lateral=vx*-dz+vz*dx;
 return u>=reserve-1e-6&&u<=seg.len-reserve+1e-6&&
  Math.abs(lateral)<=seg.width*.5-reserve+1e-6;
}
export function inspectItalskaStripCoverage5256({
 roadPlan,segments,turn
}={}){
 const sourceLocked=narrowItalskaRoad5253(roadPlan,turn?.from)&&
  NAMED.has(String(turn?.to?.osmId))&&
  turn.to?.width===7.8&&turn.to?.kind==='residential';
 const strips=Array.isArray(segments)?segments.filter(validStrip):[];
 if(!sourceLocked||!strips.includes(turn.from)||!strips.includes(turn.to)||
  strips.filter(s=>String(s.osmId)==='8590284').length!==8)
  return {safe:false,sourceLocked:false,reason:'source-or-road-strip-drift',
   checkedPoints:0,outsidePoints:0};
 const p=ITALSKA_STRIP_SAFETY_5256;
 const nx=Math.ceil(p.bodyLength/p.bodyGridStep);
 const nz=Math.ceil(p.bodyWidth/p.bodyGridStep);
 let outsidePoints=0,firstOutside=null;
 for(let i=0;i<p.orientationSamples;i++){
  const t=i/(p.orientationSamples-1);
  const progress=turn.toDirection===1?
   t*turn.metres/turn.to.len:1-t*turn.metres/turn.to.len;
  const pose=sampleItalskaNpcTurn5255(
   turn,turn.to,progress,turn.toDirection);
  if(!pose)return {safe:false,sourceLocked:true,reason:'invalid-pose',
   checkedPoints:i*(nx+1)*(nz+1),outsidePoints:1};
  const fx=-Math.sin(pose.heading),fz=-Math.cos(pose.heading);
  for(let a=0;a<=nx;a++)for(let b=0;b<=nz;b++){
   const long=(a/nx-.5)*p.bodyLength;
   const lat=(b/nz-.5)*p.bodyWidth;
   const x=pose.x+fx*long-fz*lat;
   const z=pose.z+fz*long+fx*lat;
   if(!strips.some(s=>pointInsideItalskaStrip5256(x,z,s,p.edgeReserve))){
    outsidePoints++;
    if(!firstOutside)firstOutside={timeFraction:+t.toFixed(3),
     bodyLongitudinalMetres:+long.toFixed(3),
     bodyLateralMetres:+lat.toFixed(3)};
   }
  }
 }
 return {safe:outsidePoints===0,sourceLocked:true,
  checkedPoints:p.orientationSamples*(nx+1)*(nz+1),
  outsidePoints,firstOutside,planViewStripFootprintChecked:true,
  exactOSMRoadCentersUnchanged:true,realWorldKerbsNotVerified:true,
  DEMHeightAndPhysicalSteeringNotVerified:true,
  dynamicCarCollisionsNotVerified:true};
}
export function inspectItalskaRenderedTurnSafety5256({
 roadPlan,segments
}={}){
 const all=Array.isArray(segments)?segments:[];
 const narrow=all.filter(s=>narrowItalskaRoad5253(roadPlan,s));
 let arms=0,accepted=0,declined=0,inspectedPoints=0;
 const byJunction=[];
 for(const from of narrow)for(const d of [-1,1]){
  const join=d===1?from.b:from.a;
  for(const to of all){
   if(!NAMED.has(String(to?.osmId)))continue;
   for(const direction of [-1,1]){
    const start=direction===1?to.a:to.b;
    if(!point(start)||Math.hypot(join.x-start.x,join.y-start.y)>.05)
     continue;
    arms++;
    let checked=0;
    const plan=planItalskaNpcTurn5255({
     roadPlan,from,fromDirection:d,to,toDirection:direction,
     car:{driven:false,parked:false,wideModel5254:false},
     candidateGate:attempt=>{
      const probe=inspectItalskaStripCoverage5256({
       roadPlan,segments:all,turn:attempt});
      checked+=probe.checkedPoints;
      return probe.safe;
     }
    });
    inspectedPoints+=checked;
    if(plan)accepted++;
    else declined++;
    byJunction.push({neighborId:String(to.osmId),
     admitted:!!plan});
   }
  }
 }
 return {version:'5.256',sourceOSMId:'8590284',
  mappedOutboundTurnArms:arms,planarStripAccepted:accepted,
  planarStripRejected:declined,checkedBodyPoints:inspectedPoints,
  byJunction,originalOSMGpsUnchanged:true,newRoadMeshes:0,
  roadAndSidewalkMeshesUnchanged:true,playerSteeringUnchanged:true,
  visuallyContinuousTurningFullyVerified:false,
  exactRenderedStripPlanarFormulaChecked:true,
  roadTriangleRaycastNotPerformed:true,DEMHeightNotChecked:true,
  realKerbsAndDynamicCollisionNotVerified:true,
  ready:narrow.length===8&&arms===4&&accepted+declined===4};
}
