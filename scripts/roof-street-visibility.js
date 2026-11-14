// 5.49: reusable roof audit for every future photo-backed building.
// Only triangulated roof geometry and actual mapped wall polygon are used.
// Visual proxy is not proof of 1:1 accuracy or a replacement for photo review.
const c=(a,b)=>a.x*b.z-a.z*b.x;
const xy=p=>({x:p.x,z:p.z??p.y});
export function auditRoofStreetVisibility({roof,outline,camera,
 minVisible=.06}={}){
 if(!Array.isArray(roof?.faces)||!roof.faces.length||
  !Array.isArray(outline)||outline.length<3||![
   roof.eaveY,roof.rise,camera?.x,camera?.z,camera?.y,minVisible
  ].every(Number.isFinite)||minVisible<0||minVisible>1)return null;
 const walls=outline.map(xy);
 if(walls.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 if(walls.length>3&&Math.hypot(walls[0].x-walls.at(-1).x,
  walls[0].z-walls.at(-1).z)<.04)walls.pop();
 let actualTop=-Infinity,sampled=0,visible=0;
 for(const tri of roof.faces){
  if(!Array.isArray(tri)||tri.length!==3||tri.some(p=>
   ![p.x,p.y,p.z].every(Number.isFinite)))return null;
  for(const p of tri)actualTop=Math.max(actualTop,p.y);
  const p={x:(tri[0].x+tri[1].x+tri[2].x)/3,
   y:(tri[0].y+tri[1].y+tri[2].y)/3,
   z:(tri[0].z+tri[1].z+tri[2].z)/3};
  const dir={x:p.x-camera.x,z:p.z-camera.z};
  let front=Infinity;
  for(let i=0;i<walls.length;i++){
   const a=walls[i],b=walls[(i+1)%walls.length];
   const edge={x:b.x-a.x,z:b.z-a.z};
   const rel={x:a.x-camera.x,z:a.z-camera.z},den=c(dir,edge);
   if(Math.abs(den)<1e-10)continue;
   const t=c(rel,edge)/den,u=c(rel,dir)/den;
   if(t>1e-6&&t<1-1e-6&&u>=-1e-6&&u<=1+1e-6)
    front=Math.min(front,t);
  }
  if(!Number.isFinite(front))continue;
  sampled++;
  if(camera.y+(p.y-camera.y)*front>roof.eaveY+.035)visible++;
 }
 const actualRise=Math.max(0,actualTop-roof.eaveY);
 const heightPass=actualRise>=roof.rise*.95;
 const visibleFraction=sampled?visible/sampled:0;
 return {actualRise,requestedRise:roof.rise,heightPass,visibleFraction,
  sampled,visible,pass:heightPass&&sampled>=3&&visibleFraction>=minVisible,
  photoMatched:false,onlyOcclusionProxy:true};
}
