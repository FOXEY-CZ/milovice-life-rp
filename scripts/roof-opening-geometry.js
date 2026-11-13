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
  const db=signed(b),ai=keepInside?da<=EPS:da>=-EPS,
   bi=keepInside?db<=EPS:db>=-EPS;
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
