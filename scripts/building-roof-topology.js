// Milovice RP Roof System 3.0: shared structural topology, no invented roofs.
// A concave OSM polygon is NOT proof of an open tunnel or an individual
// roof wing. Geometry prepares roof-volume candidates; photographs/approved
// profiles decide architecture. Always preserve the true exterior outline.
const EPS=1e-8;
const coord=p=>({x:p.x,z:p.z??p.y});
const length=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
function signedArea(pts){
 let a=0;
 for(let i=0;i<pts.length;i++){
  const p=pts[i],q=pts[(i+1)%pts.length];
  a+=p.x*q.z-p.z*q.x;
 }
 return a*.5;
}
function pointInPolygon(p,ring){
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[i],b=ring[j];
  if((a.z>p.z)!==(b.z>p.z)&&
   p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)inside=!inside;
 }
 return inside;
}
function orient(a,b,c){
 return (b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
}
function onSegment(a,b,p){
 return Math.abs(orient(a,b,p))<1e-7&&
  p.x>=Math.min(a.x,b.x)-1e-7&&p.x<=Math.max(a.x,b.x)+1e-7&&
  p.z>=Math.min(a.z,b.z)-1e-7&&p.z<=Math.max(a.z,b.z)+1e-7;
}
function intersect(a,b,c,d){
 const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);
 if((o1>EPS&&o2<-EPS||o1<-EPS&&o2>EPS)&&
    (o3>EPS&&o4<-EPS||o3<-EPS&&o4>EPS))return true;
 return (onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b));
}
function ringInput(input){
 if(!Array.isArray(input)||input.length<3||input.length>100)return null;
 const poly=input.map(coord);
 if(poly.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(poly.length>3&&length(poly[0],poly.at(-1))<.05)poly.pop();
 if(poly.length<3||poly.some((a,i)=>length(a,poly[(i+1)%poly.length])<.05)||
  Math.abs(signedArea(poly))<2)return null;
 for(let i=0;i<poly.length;i++)
  for(let j=i+1;j<poly.length;j++){
   if(j===i+1||(i===0&&j===poly.length-1))continue;
   if(intersect(poly[i],poly[(i+1)%poly.length],
    poly[j],poly[(j+1)%poly.length]))return null;
  }
 return poly;
}
function canonicalAxis(poly){
 let best=0,vector=null;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],len=length(a,b);
  if(len>best){best=len;vector={ax:(b.x-a.x)/len,az:(b.z-a.z)/len}}
 }
 if(!vector)return null;
 if(vector.ax<0||Math.abs(vector.ax)<1e-6&&vector.az<0){
  vector.ax*=-1;vector.az*=-1;
 }
 return vector;
}
function clustered(values,tol){
 const all=[...values].sort((a,b)=>a-b),groups=[];
 for(const value of all){
  const last=groups.at(-1);
  if(last&&Math.abs(value-last.average)<=tol){
   last.sum+=value;last.count++;last.average=last.sum/last.count;
  }else groups.push({sum:value,count:1,average:value});
 }
 return groups.map(g=>g.average);
}
function nearest(value,list){
 let best=list[0],error=Infinity;
 for(const candidate of list){
  if(Math.abs(candidate-value)<error){best=candidate;error=Math.abs(candidate-value)}
 }
 return {value:best,error};
}
function orthogonalPartition(poly,{tolerance=.12,maxCells=2500}={}){
 const origin=poly[0],axis=canonicalAxis(poly);
 if(!axis)return {ok:false,reason:'no-roof-axis'};
 const toLocal=p=>{
  const dx=p.x-origin.x,dz=p.z-origin.z;
  return {x:dx*axis.ax+dz*axis.az,
   z:-dx*axis.az+dz*axis.ax};
 };
 const local=poly.map(toLocal);
 const X=clustered(local.map(p=>p.x),tolerance),
  Z=clustered(local.map(p=>p.z),tolerance);
 const snapped=[];
 let maxSnapError=0;
 for(const p of local){
  const x=nearest(p.x,X),z=nearest(p.z,Z);
  maxSnapError=Math.max(maxSnapError,x.error,z.error);
  snapped.push({x:x.value,z:z.value});
 }
 // Reject diagonal/slanted walls even if each vertex happens to align
 // with some unrelated column of the bounding grid.
 for(let i=0;i<snapped.length;i++){
  const a=snapped[i],b=snapped[(i+1)%snapped.length];
  const source=local[i],next=local[(i+1)%local.length];
  const dx=Math.abs(next.x-source.x),dz=Math.abs(next.z-source.z);
  if(dx>.14&&dz>.14)return {ok:false,reason:'non-orthogonal',maxSnapError};
  if((Math.abs(a.x-b.x)>EPS&&Math.abs(a.z-b.z)>EPS)||
    length(a,b)<.06)return {ok:false,reason:'invalid-snapped-outline'};
 }
 const originalArea=Math.abs(signedArea(local)),snappedArea=Math.abs(signedArea(snapped));
 if(Math.abs(snappedArea-originalArea)>Math.max(.45,originalArea*.018))
  return {ok:false,reason:'snap-changed-area'};
 if((X.length-1)*(Z.length-1)>maxCells)
  return {ok:false,reason:'too-many-grid-cells'};
 const rows=[],used=[],area=0;
 for(let j=0;j<Z.length-1;j++){
  const cells=[];
  for(let i=0;i<X.length-1;i++){
   const cell={x:(X[i]+X[i+1])*.5,z:(Z[j]+Z[j+1])*.5};
   const inside=pointInPolygon(cell,snapped);
   cells.push(inside);
  }
  rows.push(cells);
 }
 const blocks=[];let previous=new Map();
 for(let j=0;j<rows.length;j++){
  const current=new Map(),cells=rows[j];
  for(let i=0;i<cells.length;){
   if(!cells[i]){i++;continue}
   const start=i;
   while(i<cells.length&&cells[i])i++;
   const key=start+':'+i;
   if(previous.has(key)){
    const k=previous.get(key);
    blocks[k].z1=Z[j+1];current.set(key,k);
   }else{
    const k=blocks.length;
    blocks.push({x0:X[start],x1:X[i],z0:Z[j],z1:Z[j+1]});
    current.set(key,k);
   }
  }
  previous=current;
 }
 const tiledArea=blocks.reduce((sum,r)=>sum+(r.x1-r.x0)*(r.z1-r.z0),0);
 if(!blocks.length||Math.abs(tiledArea-snappedArea)>Math.max(.03,snappedArea*.001))
  return {ok:false,reason:'not-tileable',tiledArea,snappedArea};
 const world=p=>({
  x:origin.x+p.x*axis.ax-p.z*axis.az,
  z:origin.z+p.x*axis.az+p.z*axis.ax
 });
 const volumes=blocks.map((r,i)=>({
  id:'mass-'+(i+1),center:world({x:(r.x0+r.x1)*.5,z:(r.z0+r.z1)*.5}),
  outline:[
   world({x:r.x0,z:r.z0}),world({x:r.x1,z:r.z0}),
   world({x:r.x1,z:r.z1}),world({x:r.x0,z:r.z1})],
  width:r.x1-r.x0,depth:r.z1-r.z0,
  area:(r.x1-r.x0)*(r.z1-r.z0),
  local:r,
  // No unverified roof type, ridge or slope is assigned by the partition.
  proposedRoofKind:null
 }));
 const junctions=[];
 for(let i=0;i<blocks.length;i++)
  for(let j=i+1;j<blocks.length;j++){
   const a=blocks[i],b=blocks[j];
   const xOverlap=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0);
   const zOverlap=Math.min(a.z1,b.z1)-Math.max(a.z0,b.z0);
   let shared=0,orientation=null;
   if(Math.abs(a.x1-b.x0)<tolerance||Math.abs(b.x1-a.x0)<tolerance){
    shared=zOverlap;orientation='vertical';
   }else if(Math.abs(a.z1-b.z0)<tolerance||Math.abs(b.z1-a.z0)<tolerance){
    shared=xOverlap;orientation='horizontal';
   }
   if(shared>.08)junctions.push({from:volumes[i].id,to:volumes[j].id,
    length:shared,orientation,kind:'internal-volume-join'});
  }
 return {ok:true,axis,origin,snappedArea,originalArea,tiledArea,
  maxSnapError,volumes,junctions};
}
function edgesFor(poly,passages=[]){
 const winding=Math.sign(signedArea(poly)),concave=[];
 for(let i=0;i<poly.length;i++){
  const prev=poly[(i+poly.length-1)%poly.length],p=poly[i],
   next=poly[(i+1)%poly.length];
  if(winding*orient(prev,p,next)<-1e-6)concave.push(i);
 }
 const byIndex=new Map();
 for(const pass of passages){
  // Never infer a passage from a notch or a short wall alone.
  if(!Number.isInteger(pass?.edgeIndex)||pass.edgeIndex<0||
    pass.edgeIndex>=poly.length||pass.type!=='passage'||
    !/^https:\/\//.test(pass.source||'')||byIndex.has(pass.edgeIndex))
   return null;
  byIndex.set(pass.edgeIndex,pass);
 }
 return poly.map((a,i)=>{
  const b=poly[(i+1)%poly.length],pass=byIndex.get(i);
  return {index:i,length:length(a,b),concaveAdjacent:
   concave.includes(i)||concave.includes((i+1)%poly.length),
   policy:pass?'documented-passage':'exterior-wall',
   evidence:pass?.source||null};
 });
}
/**
 * Calculates roof masses for an OSM footprint without changing the city's
 * verified appearance. A roof's *existence/type* is supplied only by an
 * independently approved profile, never inferred from an L/T/U notch.
 * Invalid/slanted polygons use the original bounded-footprint roof; do not
 * force invented rectangular masses through them.
 */
export function planBuildingRoofTopology(footprint,{passages=[],
 roofProfile=null,tolerance=.12,maxCells=2500}={}){
 const poly=ringInput(footprint);
 if(!poly)return {ok:false,reason:'invalid-footprint'};
 const edges=edgesFor(poly,passages);
 if(!edges)return {ok:false,reason:'invalid-passage-evidence'};
 const partition=orthogonalPartition(poly,{tolerance,maxCells});
 const sourceValid=roofProfile?.approved===true&&
  /^https:\/\//.test(roofProfile.source||'');
 const tagged=sourceValid&&Array.isArray(roofProfile.parts)&&
  roofProfile.parts.length===partition.volumes?.length&&
  roofProfile.parts.every(p=>['gable','hip','flat','shed'].includes(p.kind));
 const volumes=partition.ok?partition.volumes.map((v,i)=>({
  ...v,proposedRoofKind:tagged?roofProfile.parts[i].kind:null
 })):null;
 return {ok:true,footprintVertices:poly.length,
  originalArea:Math.abs(signedArea(poly)),concaveCorners:edges.filter(e=>e.concaveAdjacent).length,
  edges,partitionable:partition.ok,
  reason:partition.ok?null:partition.reason,
  axis:partition.ok?partition.axis:null,
  volumes,volumeCount:volumes?.length||0,
  junctions:partition.ok?partition.junctions:[],
  relativeAreaError:partition.ok?
   Math.abs(partition.tiledArea-partition.originalArea)/partition.originalArea:null,
  maxSnapError:partition.maxSnapError??null,
  documentedPassages:edges.filter(e=>e.policy==='documented-passage').length,
  geometryOnly:!tagged,
  topologyApproved:!!tagged,
  roofAppearanceSource:tagged?roofProfile.source:null};
}
