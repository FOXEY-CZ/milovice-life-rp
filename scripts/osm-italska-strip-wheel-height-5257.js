/** 5.257: the existing DEM road-strip triangles, only for the source-locked
 * Italská/Kaštanová NPC visual wheels. NOT a real kerb/contact physics survey.
 */
import {narrowItalskaRoad5253} from './osm-italska-narrow-npc-5253.js';
import {pointInsideItalskaStrip5256} from './osm-italska-rendered-strip-safety-5256.js';
const IDS=new Set(['8590284','8585601','1107814416']);
export const ITALSKA_ROAD_WHEEL_5257=Object.freeze({
 roadMeshOffset:.17,localTyreBottom:.045,visualAir:.006,
 wheelSide:.87,axleFraction:.32,maxElevationSpan:.14,
 carLengths:[4.45,4.15,4.75,4.28,4.62,4.86,5.08,4.34]
});
const valid=s=>s&&IDS.has(String(s.osmId))&&s.kind==='residential'&&
 Number.isFinite(s.a?.x)&&Number.isFinite(s.a?.y)&&
 Number.isFinite(s.b?.x)&&Number.isFinite(s.b?.y)&&
 s.width===(String(s.osmId)==='8590284'?5:7.8)&&
 s.len>=2.5&&s.len<=175&&
 Math.abs(Math.hypot(s.b.x-s.a.x,s.b.y-s.a.y)-s.len)<.025;
function createStrip(s,terrainAt){
 const along=Math.max(1,Math.ceil(s.len/4)),across=4;
 const dx=(s.b.x-s.a.x)/s.len,dz=(s.b.y-s.a.y)/s.len;
 const nx=-dz,nz=dx,y=[];
 for(let i=0;i<=along;i++)for(let j=0;j<=across;j++){
  const t=i/along*s.len,l=(j/across-.5)*s.width;
  const h=terrainAt(s.a.x+dx*t+nx*l,s.a.y+dz*t+nz*l);
  if(!Number.isFinite(h))return null;
  y.push(h+ITALSKA_ROAD_WHEEL_5257.roadMeshOffset);
 }
 return {s,along,across,dx,dz,nx,nz,y};
}
// Same two indexed triangles as osmStrip: (k,k+1,next),(k+1,next+1,next).
function sampleStrip(strip,x,z){
 const {s,along,across,dx,dz,nx,nz,y}=strip;
 if(!pointInsideItalskaStrip5256(x,z,s))return null;
 const rx=x-s.a.x,rz=z-s.a.y;
 const u=Math.max(0,Math.min(1,(rx*dx+rz*dz)/s.len))*along;
 const v=Math.max(0,Math.min(1,(rx*nx+rz*nz)/s.width+.5))*across;
 const i=Math.min(along-1,Math.floor(u)),j=Math.min(across-1,Math.floor(v));
 const t=u-i,q=v-j,k=i*(across+1)+j;
 const a=y[k],b=y[k+1],c=y[k+across+1],d=y[k+across+2];
 return t+q<=1?a+(b-a)*q+(c-a)*t:
  d+(b-d)*(1-t)+(c-d)*(1-q);
}
export function createItalskaRoadHeight5257({roadPlan,segments,terrainAt}={}){
 if(!Array.isArray(segments)||typeof terrainAt!=='function')return null;
 const narrow=segments.filter(s=>String(s?.osmId)==='8590284');
 if(narrow.length!==8||!narrow.every(s=>valid(s)&&
  narrowItalskaRoad5253(roadPlan,s)))return null;
 const candidates=segments.filter(s=>IDS.has(String(s?.osmId)));
 if(candidates.some(s=>!valid(s))||
  !['8585601','1107814416'].every(id=>
   candidates.some(s=>String(s.osmId)===id)))return null;
 const strips=candidates.map(s=>createStrip(s,terrainAt));
 if(strips.some(s=>!s))return null;
 function sample(x,z){
  if(!Number.isFinite(x)||!Number.isFinite(z))return null;
  let high=null;
  for(const strip of strips){
   const y=sampleStrip(strip,x,z);
   if(y!==null&&(high===null||y>high))high=y;
  }
  return high;
 }
 function wheelSupport({x,z,heading,length}={}){
  if(![x,z,heading,length].every(Number.isFinite)||
   length<3||length>5.5)return null;
  const c=ITALSKA_ROAD_WHEEL_5257,fx=-Math.sin(heading),
   fz=-Math.cos(heading),samples=[];
  for(const a of [-length*c.axleFraction,length*c.axleFraction])
   for(const b of [-c.wheelSide,c.wheelSide]){
    const y=sample(x+fx*a-fz*b,z+fz*a+fx*b);
    if(y===null)return null;
    samples.push(y);
   }
  const span=Math.max(...samples)-Math.min(...samples);
  if(span>c.maxElevationSpan)return null;
  return {groupY:Math.max(...samples)+c.visualAir-c.localTyreBottom,
   surfaceSpan:span,minWheelGap:c.visualAir,maxWheelGap:span+c.visualAir,
   tyreSamples:4,demTriangleSurface:true,realKerbsNotVerified:true};
 }
 return {ready:true,version:'5.257',narrowSegments:narrow.length,
  sourceStripCount:strips.length,
  roadVertices:strips.reduce((n,s)=>n+s.y.length,0),
  sample,wheelSupport,originalStripHeight:(s,x,z)=>{
   const strip=strips.find(t=>t.s===s);
   return strip?sampleStrip(strip,x,z):null;
  },
  oldWheelBottomAt:(x,z)=>terrainAt(x,z)+.045+.045,
  originalOSMGpsUntouched:true,roadMeshesUntouched:true};
}
export function inspectItalskaRoadHeight5257(model,segments){
 if(!model?.ready)return {version:'5.257',ready:false,
  reason:'source-road-or-DEM-missing'};
 let wheelProbes=0,oldEmbedding=0,maxGap=0;
 for(const s of segments.filter(s=>String(s.osmId)==='8590284')){
  const x=(s.a.x+s.b.x)*.5,z=(s.a.y+s.b.y)*.5;
  const heading=Math.atan2(-(s.b.x-s.a.x),-(s.b.y-s.a.y));
  const w=model.wheelSupport({x,z,heading,length:4.45});
  const roadY=model.sample(x,z);
  if(!w||roadY===null)continue;
  wheelProbes++;
  oldEmbedding=Math.max(oldEmbedding,roadY-model.oldWheelBottomAt(x,z));
  maxGap=Math.max(maxGap,w.maxWheelGap);
 }
 return {version:'5.257',ready:wheelProbes>=2,
  narrowSegments:model.narrowSegments,sourceStripCount:model.sourceStripCount,
  roadVertices:model.roadVertices,wholeWheelProbeCount:wheelProbes,
  baselineWheelEmbeddingMetres:+oldEmbedding.toFixed(3),
  maximumModelGapMetres:+maxGap.toFixed(3),
  plannedVisualAirMetres:ITALSKA_ROAD_WHEEL_5257.visualAir,
  roadStripTrianglesInterpolated:true,realMeshRaycast:false,
  realKerbsUnsurveyed:true,carSuspensionUnsimulated:true,
  originalOSMGpsUntouched:true,playerTrafficUnchanged:true,
  roadAndSidewalkMeshesUntouched:true};
}
