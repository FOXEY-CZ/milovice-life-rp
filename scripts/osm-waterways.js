// Milovice RP 5.96: visible mapped streams and open drainage lines.
// Only source OSM waterway ways. Width and flat water material are estimates,
// not a survey of shorelines, water levels or present-day flow.
// Underpasses, culverts and underground ways stay entirely invisible.
import {safePedestrianPieces} from './reality-walkways.js';

const WIDTHS={stream:1.6,drain:0.85,ditch:1.0,river:4.5};
const X=p=>p.x,Z=p=>p.z??p.y;
const isFinitePoint=p=>p&&Number.isFinite(X(p))&&Number.isFinite(Z(p));

export function classifyVisibleWaterway(tags={}){
 if(!tags||!Object.hasOwn(WIDTHS,tags.waterway))return null;
 if(tags.tunnel&&tags.tunnel!=='no')return null;
 if(tags.covered==='yes'||tags.location==='underground'||
    (tags.layer!==undefined&&Number(tags.layer)<0)||
    tags.intermittent==='yes'||tags.seasonal==='yes'||
    tags.access==='private')return null;
 const exact=typeof tags.width==='string'&&
  /^\s*(?:\d+(?:\.\d+)?|\.\d+)\s*(?:m)?\s*$/.test(tags.width)?
  Number.parseFloat(tags.width):null;
 const measured=exact!==null&&Number.isFinite(exact)&&exact>=.5&&exact<=12;
 return {kind:tags.waterway,width:measured?exact:WIDTHS[tags.waterway],
  widthEstimated:!measured,alignment:'OSM mapped centreline',
  actualBanksVerified:false,waterLevelSurveyed:false};
}

// Liang–Barsky clipping keeps long source ways local to the streamed OSM area.
// We keep a small margin around neighbouring parts of town, not all 9 km of
// Mlynařice when a player enters one 3D region.
export function clipMappedWaterSegment(a,b,bounds,margin=180){
 if(!isFinitePoint(a)||!isFinitePoint(b))return null;
 const p={x:X(a),z:Z(a)},q={x:X(b),z:Z(b)};
 if(!bounds)return [p,q];
 if(![bounds.minX,bounds.maxX,bounds.minZ,bounds.maxZ,margin].every(Number.isFinite)||
  bounds.minX>bounds.maxX||bounds.minZ>bounds.maxZ||margin<0||margin>300)return null;
 const dx=q.x-p.x,dz=q.z-p.z;
 let lo=0,hi=1;
 for(const [den,numerator] of [
  [-dx,p.x-bounds.minX+margin],[dx,bounds.maxX+margin-p.x],
  [-dz,p.z-bounds.minZ+margin],[dz,bounds.maxZ+margin-p.z]
 ]){
  if(Math.abs(den)<1e-10){if(numerator<0)return null;continue}
  const t=numerator/den;
  if(den<0){if(t>hi)return null;lo=Math.max(lo,t)}
  else{if(t<lo)return null;hi=Math.min(hi,t)}
 }
 if(lo>=hi)return null;
 const at=t=>({x:p.x+dx*t,z:p.z+dz*t});
 return [at(lo),at(hi)];
}

export function planMappedWaterway({tags={},points,roads,buildings,bounds,
 resolution=1.6}={}){
 const source=classifyVisibleWaterway(tags);
 const empty={pieces:[],meters:0,source,sourceGeometryMoved:false,
  actualBankWidthsKnown:false,syntheticWaterways:0};
 if(!source||!Array.isArray(points)||points.length<2||points.length>256||
  !roads||typeof roads.isClear!=='function'||
  !buildings||typeof buildings.isClear!=='function'||
  !Number.isFinite(resolution)||resolution<.7||resolution>4)return empty;
 const pieces=[];
 // Any existing mapped road, footway or building interrupts the surface.
 // The actual mapped waterway is unchanged; hidden culverts are not painted
 // over asphalt and a drawn stream never opens a physical pedestrian road.
 const guard={isClear:(x,z,radius,buffer)=>roads.isClear(x,z,radius,buffer)&&
  buildings.isClear(x,z,radius+Math.max(.2,buffer))};
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];if(!isFinitePoint(a)||!isFinitePoint(b))continue;
  const clipped=clipMappedWaterSegment(a,b,bounds);if(!clipped)continue;
  const [from,to]=clipped,len=Math.hypot(to.x-from.x,to.z-from.z);
  if(len<.25)continue;
  // Long mapped line spans still get segment-limited safety sampling.
  const steps=Math.ceil(len/220);
  for(let j=0;j<steps;j++){
   const lerp=t=>({x:from.x+(to.x-from.x)*t,z:from.z+(to.z-from.z)*t});
   const start=lerp(j/steps),end=lerp((j+1)/steps);
   for(const p of safePedestrianPieces(start,end,source.width,guard,{
    resolution,buffer:.13
   })){
    const meters=Math.hypot(p.b.x-p.a.x,p.b.z-p.a.z);
    if(meters<1.4)continue; // Reject tiny floating water tiles at crossings.
    pieces.push({...p,meters,width:source.width});
   }
  }
 }
 return {...empty,pieces,meters:pieces.reduce((sum,p)=>sum+p.meters,0)};
}
