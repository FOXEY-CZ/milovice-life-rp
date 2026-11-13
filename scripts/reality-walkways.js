// Milovice RP 5.27 — photo-first sidewalks and both OSM-mapped station portals,
// and station portal placement tied to the ACTUAL mapped incoming footpath.
//
// Roads are indexed before pedestrian meshes are drawn. Pavement never
// overlays modeled carriageway (including adjacent roads and intersections).
// No random dual sidewalk bands are placed on unknown sides of every road.
// This does not prove every OSM footpath or building doorway is accurate.
const X=p=>p.x,Z=p=>p.z??p.y;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export function isCarriageway(kind){
 return ['primary','secondary','tertiary','residential','unclassified',
  'living_street','service','trunk','trunk_link','primary_link','secondary_link','road'].includes(kind);
}
export function isPedestrianWay(kind){
 return ['footway','path','pedestrian','steps','cycleway'].includes(kind);
}
// Split at 0.7 m intervals, render only CONTIGUOUS safe stretches.
// Merge adjacent lengths: no explosion in mobile draw calls.
export function safePedestrianPieces(a,b,width,carriageway,{resolution=.7,buffer=.08}={}){
 if(!carriageway||!a||!b)return [];
 const ax=X(a),az=Z(a),bx=X(b),bz=Z(b);
 const len=Math.hypot(bx-ax,bz-az);
 if(!Number.isFinite(len)||len<.15||len>800)return [];
 const chunks=Math.max(1,Math.ceil(len/resolution));
 let start=-1,end=-1,parts=[];
 const point=t=>({x:ax+(bx-ax)*t,z:az+(bz-az)*t});
 for(let i=0;i<chunks;i++){
  const p=point((i+.5)/chunks);
  const ok=carriageway.isClear(p.x,p.z,width*.5,buffer);
  if(ok){if(start<0)start=i;end=i+1}
  else if(start>=0){parts.push({a:point(start/chunks),b:point(end/chunks)});start=end=-1}
 }
 if(start>=0)parts.push({a:point(start/chunks),b:point(end/chunks)});
 return parts.filter(({a,b})=>Math.hypot(b.x-a.x,b.z-a.z)>.13);
}
// Use a 0.5m precision key to reject exact duplicate OSM pedestrian edges.
export function pedestrianPieceKey({a,b},width){
 const point=p=>Math.round(X(p)*2)+','+Math.round(Z(p)*2);
 const ends=[point(a),point(b)].sort();
 return ends.join(':')+'@'+Math.round(width*2);
}
// Local station passage: select a physical longitudinal strip THROUGH two
// opposing station outer walls, biased toward endpoint of footway 549346217.
// The former passage s=0 missed mapped incoming sidewalk by ~8.8m.
export function planStationPassage({footprint,footway,indoorFootway=null,halfOpening=1.75}={}){
 if(!Array.isArray(footprint)||footprint.length<4||!Array.isArray(footway)||footway.length<2)return null;
 const exact=planMappedStationPassage({footprint,footway,indoorFootway,halfOpening});
 if(exact)return exact;
 const pts=footprint.map(p=>({x:X(p),z:Z(p)}));
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.15)pts.pop();
 const cx=pts.reduce((v,p)=>v+p.x,0)/pts.length;
 const cz=pts.reduce((v,p)=>v+p.z,0)/pts.length;
 let xx=0,zz=0,xz=0;
 for(const p of pts){const dx=p.x-cx,dz=p.z-cz;xx+=dx*dx;zz+=dz*dz;xz+=dx*dz}
 const theta=.5*Math.atan2(2*xz,xx-zz),ax=Math.cos(theta),az=Math.sin(theta);
 const projected=p=>({s:(X(p)-cx)*ax+(Z(p)-cz)*az,
  t:-(X(p)-cx)*az+(Z(p)-cz)*ax});
 const foot=footway.map(p=>({p,coords:projected(p)})).
  sort((a,b)=>Math.hypot(X(a.p)-cx,Z(a.p)-cz)-Math.hypot(X(b.p)-cx,Z(b.p)-cz))[0];
 const footSide=Math.sign(foot.coords.t)||1,margin=halfOpening+.22;
 const candidates=[];
 const edges=pts.map((p,i)=>{
  const q=pts[(i+1)%pts.length],a=projected(p),b=projected(q);
  return {index:i,lo:Math.min(a.s,b.s)+margin,hi:Math.max(a.s,b.s)-margin,
   sSpan:Math.abs(b.s-a.s),t:(a.t+b.t)*.5,tSpread:Math.abs(b.t-a.t)};
 }).filter(e=>e.sSpan>=halfOpening*2+1.2&&e.tSpread<2.5&&e.hi>e.lo);
 for(const f of edges.filter(e=>Math.sign(e.t)===footSide)){
  for(const back of edges.filter(e=>Math.sign(e.t)===-footSide)){
   const lo=Math.max(f.lo,back.lo),hi=Math.min(f.hi,back.hi);
   if(hi<lo)continue;
   const s=clamp(foot.coords.s,lo,hi),offset=Math.abs(s-foot.coords.s);
   const streetOffset=Math.abs(f.t-foot.coords.t);
   candidates.push({s,offset,streetOffset,streetEdge:f.index,railEdge:back.index,
    minClearance:margin,footS:foot.coords.s,streetSide:footSide});
  }
 }
 candidates.sort((a,b)=>a.offset-b.offset||a.streetOffset-b.streetOffset);
 if(!candidates.length)return null;
 return {...candidates[0],sourceFootwayId:549346217,alignedFromMappedFootway:true,
  modelledNotSurveyed:true,footwayEndpoint:{x:X(foot.p),z:Z(foot.p)}};
}
// OSM 1550920096 is a pedestrian route whose BOTH endpoints coincide with
// the two OSM train-station facade edges. The earlier station model did not
// consume this geometry: it moved the real arch 1.97 m along the building,
// leaving the access pavement visibly disconnected. No photograph alone
// supplies a metre-accurate doorway; this is mapped topological evidence.
export function planMappedStationPassage({footprint,footway,indoorFootway,halfOpening=1.75}={}){
 if(!Array.isArray(footprint)||footprint.length<4||
    !Array.isArray(footway)||footway.length<2||
    !Array.isArray(indoorFootway)||indoorFootway.length!==2||
    !(halfOpening>.6&&halfOpening<3))return null;
 const pts=footprint.map(p=>({x:X(p),z:Z(p)}));
 if(Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.15)pts.pop();
 const cx=pts.reduce((v,p)=>v+p.x,0)/pts.length;
 const cz=pts.reduce((v,p)=>v+p.z,0)/pts.length;
 let xx=0,zz=0,xz=0;
 for(const p of pts){const dx=p.x-cx,dz=p.z-cz;xx+=dx*dx;zz+=dz*dz;xz+=dx*dz}
 const theta=.5*Math.atan2(2*xz,xx-zz),ax=Math.cos(theta),az=Math.sin(theta);
 const project=p=>({s:(X(p)-cx)*ax+(Z(p)-cz)*az,
  t:-(X(p)-cx)*az+(Z(p)-cz)*ax});
 const endpoints=indoorFootway.map(p=>({point:{x:X(p),z:Z(p)},coords:project(p)}));
 const distEdge=p=>Math.min(...pts.map((a,i)=>{
  const b=pts[(i+1)%pts.length],dx=b.x-a.x,dz=b.z-a.z;
  const q=clamp(((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz||1),0,1);
  return Math.hypot(p.x-a.x-q*dx,p.z-a.z-q*dz);
 }));
 if(endpoints.some(p=>distEdge(p.point)>.55))return null;
 const streetFoot=footway.map(p=>({x:X(p),z:Z(p)}));
 const minApproach=p=>Math.min(...streetFoot.map(f=>Math.hypot(p.x-f.x,p.z-f.z)));
 const ordered=endpoints.slice().sort((a,b)=>minApproach(a.point)-minApproach(b.point));
 const [street,rail]=ordered;
 if(minApproach(street.point)>.65||
    Math.sign(street.coords.t)===Math.sign(rail.coords.t)||
    Math.abs(street.coords.t-rail.coords.t)<4||
    Math.abs(street.coords.s-rail.coords.s)>1.2)return null;
 const passageS=(street.coords.s+rail.coords.s)*.5,range=[passageS-halfOpening,passageS+halfOpening];
 const cuts=[],coverage={street:0,rail:0};
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length],p=project(a),q=project(b);
  const side=Math.abs((p.t+q.t)*.5-street.coords.t)<1.5?'street':
   Math.abs((p.t+q.t)*.5-rail.coords.t)<1.5?'rail':null;
  if(!side||Math.max(p.t,q.t)-Math.min(p.t,q.t)>1.4)continue;
  const min=Math.min(p.s,q.s),max=Math.max(p.s,q.s);
  const lo=Math.max(min,range[0]),hi=Math.min(max,range[1]);
  if(hi<lo-.005)continue;
  const ds=q.s-p.s;
  // Tiny facade kinks at the entrance must not leave an invisible 0.3m wall
  // in the opening. Remove them only if the entire edge lies in the opening.
  const isJunction=Math.abs(ds)<.16&&min>=range[0]-.04&&max<=range[1]+.04;
  const t0=isJunction?0:Math.abs(ds)>.16?clamp((lo-p.s)/ds,0,1):null;
  const t1=isJunction?1:Math.abs(ds)>.16?clamp((hi-p.s)/ds,0,1):null;
  if(t0===null||t1===null)continue;
  const low=Math.min(t0,t1),high=Math.max(t0,t1);
  if(high-low<.0001)continue;
  coverage[side]+=Math.abs(ds)*(high-low);
  cuts.push({index:i,side,low,high});
 }
 if(coverage.street<halfOpening*1.75||coverage.rail<halfOpening*1.75)return null;
 const bestEdge=side=>cuts.filter(p=>p.side===side).sort((a,b)=>(b.high-b.low)-(a.high-a.low))[0]?.index;
 const sideOffset=Math.abs(street.coords.s-passageS);
 return {s:passageS,offset:sideOffset,footS:street.coords.s,
  sourceFootwayId:549346217,sourceInteriorFootwayId:1550920096,
  alignedFromMappedFootway:true,mappedThroughBuilding:true,
  modelledNotSurveyed:true,halfOpening,
  streetEdge:bestEdge('street'),railEdge:bestEdge('rail'),
  wallCuts:cuts,coverage,passagePortalCenters:[street.point,rail.point],
  footwayEndpoint:street.point,streetSide:Math.sign(street.coords.t)||1};
}
export function markedCrossing(tags){
 return Boolean(tags?.footway==='crossing'&&
  (tags['crossing:markings']==='yes'||tags.crossing==='marked'||tags['crossing:markings']==='zebra'));
}
export function planZebraPieces(points,carriageway,{width=3.4}={}){
 if(!Array.isArray(points)||points.length<2||!carriageway)return [];
 const a=points[0],b=points.at(-1);
 const ax=X(a),az=Z(a),bx=X(b),bz=Z(b),len=Math.hypot(bx-ax,bz-az);
 if(len<3||len>40)return [];
 const ux=(bx-ax)/len,uz=(bz-az)/len,nx=-uz,nz=ux;
 const pieces=[];
 // Each lengthwise white bar follows the photographic pedestrian approach
 // direction; six narrow bars run side-by-side, only over mapped asphalt.
 for(let stripe=0;stripe<6;stripe++){
  const offset=(stripe-2.5)*.55;
  let start=-1,last=-1;
  for(let i=0;i<Math.ceil(len/.5);i++){
   const chunks=Math.ceil(len/.5),t=(i+.5)/chunks;
   const x=ax+ux*len*t+nx*offset,z=az+uz*len*t+nz*offset;
   const near=carriageway.nearest(x,z);
   const driving=near&&isCarriageway(near.kind)&&near.clearance<-.18;
   if(driving){if(start<0)start=i;last=i+1}
   else if(start>=0){
    if(last-start>=3){const s=start/chunks,e=last/chunks;pieces.push({
     a:{x:ax+ux*len*s+nx*offset,z:az+uz*len*s+nz*offset},
     b:{x:ax+ux*len*e+nx*offset,z:az+uz*len*e+nz*offset},width:.34});}
    start=last=-1;
   }
  }
  if(start>=0&&last-start>=3){
   const chunks=Math.ceil(len/.5),s=start/chunks,e=last/chunks;
   pieces.push({a:{x:ax+ux*len*s+nx*offset,z:az+uz*len*s+nz*offset},
    b:{x:ax+ux*len*e+nx*offset,z:az+uz*len*e+nz*offset},width:.34});
  }
 }
 return pieces;
}
