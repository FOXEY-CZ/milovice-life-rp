// Milovice RP 5.28.7 — real eaves project OUTSIDE exterior walls.
// Only the exterior edges of the ORIGINAL OSM footprint get an overhang.
// Section cuts between lower wings and higher middle are NOT exterior edges.
// The roof skin, continuous underside (soffit), front fascia and exposed
// end returns share identical vertices: a physical overhang without holes.
const EPS=1e-7;
function point(p){return {x:p.x,z:p.z??p.y}}
function area(poly){
 let total=0;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length];
  total+=a.x*b.z-b.x*a.z;
 }
 return total*.5;
}
function normalizeRing(input){
 if(!Array.isArray(input)||input.length<3)return null;
 const ring=input.map(point);
 if(ring.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(ring.length>3&&Math.hypot(ring[0].x-ring.at(-1).x,ring[0].z-ring.at(-1).z)<.02)ring.pop();
 return ring.length>=3?ring:null;
}
function matchedOuterEdge(a,b,boundary,sign){
 const mx=(a.x+b.x)*.5,mz=(a.z+b.z)*.5;
 for(let i=0;i<boundary.length;i++){
  const p=boundary[i],q=boundary[(i+1)%boundary.length];
  const dx=q.x-p.x,dz=q.z-p.z,length=Math.hypot(dx,dz);
  if(length<.05)continue;
  const lateral=(x,z)=>Math.abs(dx*(z-p.z)-dz*(x-p.x))/length;
  const projection=(x,z)=>((x-p.x)*dx+(z-p.z)*dz)/(length*length);
  // Clipping introduces points on the REAL edge, but also artificial
  // edges across the building. Accept only segments ON a mapped wall.
  if(lateral(a.x,a.z)>.075||lateral(b.x,b.z)>.075||
   lateral(mx,mz)>.075)continue;
  if([projection(a.x,a.z),projection(b.x,b.z)].some(t=>t<-.015||t>1.015))continue;
  return {sourceIndex:i,nx:sign*dz/length,nz:-sign*dx/length};
 }
 return null;
}
function miter(n1,n2,width){
 if(!n1)return {x:n2.nx*width,z:n2.nz*width};
 if(!n2)return {x:n1.nx*width,z:n1.nz*width};
 const dot=n1.nx*n2.nx+n1.nz*n2.nz;
 // Cap the miter to avoid enormous spikes on tiny zig-zag OSM segments.
 if(dot<-.45)return {x:n2.nx*width,z:n2.nz*width};
 const scale=width/(1+dot);
 const x=(n1.nx+n2.nx)*scale,z=(n1.nz+n2.nz)*scale;
 const length=Math.hypot(x,z);
 if(length>width*1.8)return {x:x*width*1.8/length,z:z*width*1.8/length};
 return {x,z};
}
function roofPlanes(roof,origin,p){
 const {ax,az}=roof.globalAxis,{minS,maxS,minT,maxT}=roof.bounds;
 const dx=p.x-origin.x,dz=p.z-origin.z;
 const s=dx*ax+dz*az,t=-dx*az+dz*ax;
 const midT=(minT+maxT)*.5;
 const values=[(t-minT)/(midT-minT),(maxT-t)/(maxT-midT)];
 if(roof.kind==='hip')values.push((s-minS)/roof.endInset,(maxS-s)/roof.endInset);
 return values;
}
function roofHeight(roof,values,inside){
 const v=Math.min(...values);
 // Outside the perimeter the REAL sloping plane continues downhill,
 // without clamping to eaveY (which would create an artificial flat flap).
 return roof.eaveY+(roof.ridgeY-roof.eaveY)*(inside?Math.max(0,Math.min(1,v)):Math.min(1,v));
}
function intersectPlanes(a,b){
 const roots=[0,1];
 for(let j=0;j<a.length;j++)for(let k=j+1;k<a.length;k++){
  const before=a[j]-a[k],after=b[j]-b[k],delta=before-after;
  if(Math.abs(delta)<EPS)continue;
  const t=before/delta;
  if(t>1e-6&&t<1-1e-6)roots.push(t);
 }
 return roots;
}
function addTriangle(dest,a,b,c){
 const abx=b.x-a.x,aby=b.y-a.y,abz=b.z-a.z;
 const acx=c.x-a.x,acy=c.y-a.y,acz=c.z-a.z;
 const cross=Math.hypot(aby*acz-abz*acy,abz*acx-abx*acz,abx*acy-aby*acx);
 if(cross>1e-7)dest.push([a,b,c]);
}
function quad(dest,a,b,c,d){
 addTriangle(dest,a,b,c);addTriangle(dest,a,c,d);
}
export function planStationRoofEaves({outline,originalOutline,roof,origin,
 width=.32,thickness=.10}={}){
 const section=normalizeRing(outline),original=normalizeRing(originalOutline);
 if(!section||!original||!roof?.bounds||!roof?.globalAxis||!origin||
  !['hip','gable'].includes(roof.kind)||!Number.isFinite(roof.eaveY)||
  !Number.isFinite(roof.ridgeY)||!(roof.ridgeY>roof.eaveY)||
  !Number.isFinite(width)||width<.10||width>.65||
  !Number.isFinite(thickness)||thickness<.04||thickness>.20)return null;
 const sign=Math.sign(area(original));
 if(!sign)return null;
 const mapped=section.map((p,i)=>matchedOuterEdge(p,section[(i+1)%section.length],original,sign));
 const tiles=[],soffit=[],fascia=[];
 let perimeter=0,exteriorEdges=0,excludedInteriorEdges=0,maxActualOverhang=0;
 const uv=(p,u,v)=>({x:p.x,y:p.y,z:p.z,u,v});
 for(let i=0;i<section.length;i++){
  const a=section[i],b=section[(i+1)%section.length],match=mapped[i];
  const length=Math.hypot(b.x-a.x,b.z-a.z);
  if(!match){excludedInteriorEdges++;continue}
  if(length<.05)continue;
  exteriorEdges++;
  const prev=mapped[(i+section.length-1)%section.length];
  const next=mapped[(i+1)%section.length];
  const left=miter(prev,match,width),right=miter(match,next,width);
  const outerA={x:a.x+left.x,z:a.z+left.z};
  const outerB={x:b.x+right.x,z:b.z+right.z};
  maxActualOverhang=Math.max(maxActualOverhang,Math.hypot(left.x,left.z),Math.hypot(right.x,right.z));
  const ia=roofPlanes(roof,origin,a),ib=roofPlanes(roof,origin,b);
  const oa=roofPlanes(roof,origin,outerA),ob=roofPlanes(roof,origin,outerB);
  const splits=[...intersectPlanes(ia,ib),...intersectPlanes(oa,ob)].sort((x,y)=>x-y);
  const cuts=splits.filter((t,j)=>j===0||t-splits[j-1]>1e-6);
  const lerp=(p,q,t)=>({x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t});
  const verts=t=>{
   const inner=lerp(a,b,t),outer=lerp(outerA,outerB,t);
   const innerY=roofHeight(roof,roofPlanes(roof,origin,inner),true);
   const outerY=roofHeight(roof,roofPlanes(roof,origin,outer),false);
   return {
    it:uv({...inner,y:innerY},(perimeter+length*t)*.21,0),
    ot:uv({...outer,y:outerY},(perimeter+length*t)*.21,width*.21),
    ib:uv({...inner,y:innerY-thickness},(perimeter+length*t)*.21,0),
    ob:uv({...outer,y:outerY-thickness},(perimeter+length*t)*.21,width*.21)
   };
  };
  for(let j=1;j<cuts.length;j++){
   const v=verts(cuts[j-1]),w=verts(cuts[j]);
   quad(tiles,v.it,w.it,w.ot,v.ot);
   quad(soffit,v.ib,v.ob,w.ob,w.ib);
   quad(fascia,v.ot,w.ot,w.ob,v.ob);
  }
  // Seal the cut ends too, including the ends beside the raised centre.
  // This does not add a projecting canopy along artificial cut boundaries.
  const first=verts(0),last=verts(1);
  quad(fascia,first.it,first.ot,first.ob,first.ib);
  quad(fascia,last.it,last.ib,last.ob,last.ot);
  perimeter+=length;
 }
 return {tiles,soffit,fascia,exteriorEdges,excludedInteriorEdges,
  width,thickness,maxActualOverhang,closedUnderside:true,
  onlyMappedExterior:true};
}
