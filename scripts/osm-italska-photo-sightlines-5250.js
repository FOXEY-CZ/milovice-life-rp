/** Milovice RP 5.250: self-occlusion of historical Italska source walls.
 * Source-only 2D line-of-sight from two open-licensed 2025 photo GPS points.
 * The result is a modelled visibility estimate, NOT measured facade detail.
 */
import {ITALSKA_VOJENSKE_ZATISI_5249 as source}
 from './osm-italska-vojen-zatisi-5249.js';

const valid=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lon);
const fmt=p=>p.lat.toFixed(7)+','+p.lon.toFixed(7);
const fingerprint=geometry=>{
 let h=2166136261;
 for(const c of geometry.map(fmt).join(';')){
  h^=c.charCodeAt(0);h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16).padStart(8,'0');
};
const project=p=>({
 x:(p.lon-14.889)*111320*Math.cos(50.226*Math.PI/180),
 z:-(p.lat-50.226)*111320
});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const orient=(a,b,c)=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
const blocks=(a,b,c,d)=>{
 const u=orient(a,b,c),v=orient(a,b,d);
 const w=orient(c,d,a),t=orient(c,d,b);
 return u*v< -1e-7&&w*t< -1e-7;
};
export function filterItalskaPhotoSightlines5250({plan,geometry}={}){
 if(plan?.sourceOsmId!==source.osmId||
  plan?.sourceHash!==source.sourceHash||
  plan?.originalVertices!==source.vertices||
  !Array.isArray(plan.visibleEdges)||!plan.visibleEdges.length||
  !Array.isArray(geometry)||geometry.length!==source.vertices||
  !geometry.every(valid)||fmt(geometry[0])!==fmt(geometry.at(-1))||
  fingerprint(geometry)!==source.sourceHash)return null;
 const outline=geometry.slice(0,-1).map(project);
 const cameras=source.cameras.map(project);
 const kept=[],seen=new Set();
 let occluded=0,checked=0;
 for(const edge of plan.visibleEdges){
  const i=edge?.edge;
  if(!Number.isInteger(i)||i<0||i>=outline.length||seen.has(i)||
   !Number.isFinite(edge?.nx)||!Number.isFinite(edge?.nz)||
   !Number.isFinite(edge?.len)||!edge.a||!edge.b||
   !Number.isFinite(edge.a.x)||!Number.isFinite(edge.a.z)||
   !Number.isFinite(edge.b.x)||!Number.isFinite(edge.b.z)||
   dist(edge.a,outline[i])>.001||
   dist(edge.b,outline[(i+1)%outline.length])>.001)return null;
  seen.add(i);
  const mid={x:(edge.a.x+edge.b.x)/2,z:(edge.a.z+edge.b.z)/2};
  let clear=0;
  for(const camera of cameras){
   const dx=camera.x-mid.x,dz=camera.z-mid.z,d=Math.hypot(dx,dz);
   if(!(d>3&&d<95&&(dx*edge.nx+dz*edge.nz)/d>.25))continue;
   checked++;
   let blocked=false;
   for(let j=0;j<outline.length;j++){
    if(j===i)continue;
    if(blocks(camera,mid,outline[j],outline[(j+1)%outline.length])){
     blocked=true;break;
    }
   }
   if(!blocked)clear++;
  }
  if(!clear){occluded++;continue}
  kept.push({...edge,photoCameraCount:clear,
   sightlineUnobstructed5250:true});
 }
 if(!kept.length)return null;
 return {...plan,version:'5.250',visibleEdges:kept,
  photoFacingCandidates5250:plan.visibleEdges.length,
  occludedOriginalWallEdges5250:occluded,
  checkedCameraRays5250:checked,
  modelVisibilityApproximate:true,
  photoMeasuredDetails:false,
  originalFootprintPreserved:true};
}
