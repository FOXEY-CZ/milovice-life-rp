import {samplePerimeterRoofHeight} from './perimeter-roof-envelope.js';
// Milovice RP Roof System 2.0 — shared, deterministic dormer intersections.
// This is NOT a generic visual style: a building-specific, photo-sourced
// specification supplies each dormer; the shared solver cuts its footprint
// through any gable/hip surface. No Three.js dependency, all shapes planar.
const EPS=1e-8;
const keys=['x','y','z','u','v'];
function xyz(p){return keys.every(k=>Number.isFinite(p?.[k]))}
function area3d(a,b,c){
 const x=b.x-a.x,y=b.y-a.y,z=b.z-a.z;
 const p=c.x-a.x,q=c.y-a.y,r=c.z-a.z;
 return Math.hypot(y*r-z*q,z*p-x*r,x*q-y*p)*.5;
}
function mix(a,b,t){
 const out={};for(const k of keys)out[k]=a[k]+(b[k]-a[k])*t;
 return out;
}
function clipHalfspace(vertices,signed,keepInside){
 if(vertices.length<3)return [];
 const out=[];
 let a=vertices[vertices.length-1],da=signed(a);
 for(const b of vertices){
  const db=signed(b),ai=keepInside?da<=EPS:da>EPS,
   bi=keepInside?db<=EPS:db>EPS;
  if(ai!==bi){
   const d=da-db;
   if(Math.abs(d)>EPS)out.push(mix(a,b,da/d));
  }
  if(bi)out.push(b);
  a=b;da=db;
 }
 return out;
}
function legalOpening(input){
 if(!input||!['cx','cz','nx','nz','width','depth','front'].every(k=>Number.isFinite(input[k])))return null;
 const {cx,cz,width,depth,front}=input;
 const length=Math.hypot(input.nx,input.nz);
 if(length<.99||length>1.01||width<.7||width>18||
  depth<.5||depth>12||front<.05||front>2)return null;
 const nx=input.nx/length,nz=input.nz/length;
 // u is the street-facing edge tangent; v points out of the building.
 const local=p=>({u:(p.x-cx)*nz-(p.z-cz)*nx,
  v:(p.x-cx)*nx+(p.z-cz)*nz});
 const half=width*.5+(input.padding??.06);
 if(!Number.isFinite(half)||half<.35||half>9.2)return null;
 const rear=depth+(input.rearPadding??.16);
 if(rear>12.5||rear<.5)return null;
 return {
  id:String(input.id||''),center:{cx,cz},width,depth,front,
  signed:[
   p=>-half-local(p).u,
   p=>local(p).u-half,
   p=>local(p).v-front,
   p=>-rear-local(p).v
  ],
  inside:p=>{
   const {u,v}=local(p);
   return u>-half+1e-6&&u<half-1e-6&&
    v<front-1e-6&&v>-rear+1e-6;
  }
 };
}
function piecesOutsideRectangle(face,opening){
 let inside=[...face],outside=[];
 for(const boundary of opening.signed){
  if(inside.length<3)break;
  const discarded=clipHalfspace(inside,boundary,false);
  for(let j=1;j<discarded.length-1;j++){
   const tri=[discarded[0],discarded[j],discarded[j+1]];
   if(area3d(...tri)>1e-7)outside.push(tri);
  }
  inside=clipHalfspace(inside,boundary,true);
 }
 return outside;
}
/**
 * Cuts a MAIN pitched roof and its soffits by the 2D footprint of
 * specified real dormers / cross-gables. Rectangles are wall-relative,
 * so a rotated, concave or irregular OSM building is handled identically.
 * Reconstructs affine interpolated XYZ/UV so roofs remain on their planes.
 * The solver does not infer the EXISTS/LOCATION of dormers: those need
 * evidence in an explicit building profile.
 */
export function clipRoofFacesForFeatures(faces,featureSpecs){
 if(!Array.isArray(faces)||!Array.isArray(featureSpecs)||
  featureSpecs.length>32||faces.some(t=>!Array.isArray(t)||t.length!==3||
   t.some(p=>!xyz(p))))return null;
 const features=featureSpecs.map(legalOpening);
 if(features.some(f=>!f))return null;
 let current=faces.map(f=>f.slice());
 for(const feature of features){
  const next=[];
  for(const triangle of current)
   next.push(...piecesOutsideRectangle(triangle,feature));
  current=next;
 }
 if(current.some(t=>t.some(p=>!xyz(p))||
  area3d(...t)<1e-7))return null;
 const measure=triangles=>triangles.reduce((a,tri)=>a+area3d(...tri),0);
 const sourceArea=measure(faces),retainedArea=measure(current);
 if(retainedArea>sourceArea+Math.max(1,sourceArea)*1e-5)return null;
 return {faces:current,featureCount:features.length,
  sourceTriangles:faces.length,renderedTriangles:current.length,
  sourceArea,retainedArea,
  removedArea:Math.max(0,sourceArea-retainedArea),
  cutoutVerified:true,cutoutSource:'explicit photo-backed roof features',
  tests:features.map(f=>({id:f.id,center:f.center,width:f.width,depth:f.depth}))};
}

/**
 * Project the host roof's true affine height onto a point. The same
 * min-of-planes contract underlies the original gable/hip roof mesh.
 * No independent guessed "support height" that could open a side gap.
 */
export function roofHeightAtPoint(roof,point,origin=roof?.origin){
 // New perimeter-safe roof uses its own already triangulated surface.
 // Sample the ACTUAL rendered triangle so a dormer cannot get a floating
 // rear wall from the old bounding-box plane assumption.
 if(roof?.roofModel==='perimeter-constrained')
  return samplePerimeterRoofHeight(roof,point);
 if(!roof?.bounds||!roof?.globalAxis||!origin||
  !Number.isFinite(point?.x)||!Number.isFinite(point?.z))return null;
 const {ax,az}=roof.globalAxis,{minS,maxS,minT,maxT}=roof.bounds;
 const dx=point.x-origin.x,dz=point.z-origin.z;
 const s=dx*ax+dz*az,t=-dx*az+dz*ax;
 const midT=(minT+maxT)*.5;
 if(midT<=minT||maxT<=midT)return null;
 const values=[(t-minT)/(midT-minT),(maxT-t)/(maxT-midT)];
 if(roof.kind==='hip'){
  if(!(roof.endInset>0))return null;
  values.push((s-minS)/roof.endInset,(maxS-s)/roof.endInset);
 }
 const y=roof.eaveY+(roof.ridgeY-roof.eaveY)*
  Math.max(0,Math.min(1,Math.min(...values)));
 return Number.isFinite(y)?y:null;
}
/**
 * Auto-build a back junction wall (roof cheek) between the gable's
 * REAR gable roof and the existing host roof. Without it, two
 * disconnected tilted planes can visibly end in mid-air.
 * This is reusable for every sourced cross-gable. Photo data controls
 * the existence/placement; this algorithm supplies structural joining.
 */
export function planRoofFeatureBackClosures(features,hostRoof,
 {wallTopY,wallOriginDrop=.28,wallEaveY=1.43,overhang=.12,
  segmentsPerSide=10}={}){
 if(!Array.isArray(features)||features.length>32||
  !Number.isFinite(wallTopY)||!Number.isFinite(wallOriginDrop)||
  !Number.isInteger(segmentsPerSide)||segmentsPerSide<4||
  segmentsPerSide>20)return null;
 const faces=[];let maxUnsupportedHeight=0,closures=0;
 for(const f of features){
  const profile=f.profile;
  if(!profile||![f.cx,f.cz,f.nx,f.nz,profile.width,
   profile.depth,profile.rise].every(Number.isFinite))return null;
  const half=profile.width*.5,reach=half+overhang;
  if(half<.5||profile.depth<.5||profile.rise<=0)return null;
  // This matches the actual GableDormer local group transform:
  // zOffset = -(depth / 2) + .04, rear roof ends at
  // z = -(depth / 2) - overhang => world recess depth+.08.
  const rear=-(profile.depth+overhang-.04);
  const upperEave=wallTopY-wallOriginDrop+wallEaveY-
   profile.rise*overhang/half;
  const upperRidge=wallTopY-wallOriginDrop+wallEaveY+profile.rise;
  const p=(x,y)=>{
   const wx=f.cx+f.nz*x+f.nx*rear;
   const wz=f.cz-f.nx*x+f.nz*rear;
   return {x:wx,y,z:wz,u:x*.22,v:y*.22};
  };
  const steps=segmentsPerSide*2;
  for(let k=0;k<steps;k++){
   const x0=-reach+2*reach*k/steps,x1=-reach+2*reach*(k+1)/steps;
   const high=x=>upperEave+(upperRidge-upperEave)*(1-Math.abs(x)/reach);
   const topA=p(x0,high(x0)),topB=p(x1,high(x1));
   const hostA=roofHeightAtPoint(hostRoof,topA);
   const hostB=roofHeightAtPoint(hostRoof,topB);
   if(hostA===null||hostB===null)return null;
   const lowA=p(x0,Math.min(topA.y,hostA-.012));
   const lowB=p(x1,Math.min(topB.y,hostB-.012));
   maxUnsupportedHeight=Math.max(maxUnsupportedHeight,
    topA.y-lowA.y,topB.y-lowB.y);
   const t1=[topA,lowA,lowB],t2=[topA,lowB,topB];
   for(const face of [t1,t2]){
    if(area3d(...face)>1e-6)faces.push(face);
   }
  }
  closures++;
 }
 return {faces,closures,maxUnsupportedHeight,
  supportedByHostRoof:true,
  source:'shared roof-height solver, individual building feature profiles'};
}
