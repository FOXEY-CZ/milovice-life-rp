// Milovice RP 5.28.6 — fit station roof planes exactly to irregular walls.
// The roof itself uses a bounded minimum of affine hip/gable planes. On a
// notched OSM perimeter its edge can float above the flat-height wall.
// Fill only the open vertical space between wall top and actual roof height.
export function planRoofPerimeterClosure({outline,roof,origin,wallTopY}={}){
 if(!Array.isArray(outline)||outline.length<3||!roof?.bounds||
  !roof?.globalAxis||!origin||!Number.isFinite(wallTopY)||
  !['gable','hip'].includes(roof.kind))return null;
 const pts=outline.map(p=>({x:p.x,z:p.z??p.y}));
 if(pts.length>3&&Math.hypot(pts[0].x-pts.at(-1).x,pts[0].z-pts.at(-1).z)<.0001)pts.pop();
 if(pts.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.z)))return null;
 const {ax,az}=roof.globalAxis,{minS,maxS,minT,maxT}=roof.bounds;
 const midT=(minT+maxT)*.5;
 if(maxT-minT<.0001||!(roof.endInset>0))return null;
 function planes(p){
  const dx=p.x-origin.x,dz=p.z-origin.z;
  const s=dx*ax+dz*az,t=-dx*az+dz*ax;
  const result=[(t-minT)/(midT-minT),(maxT-t)/(maxT-midT)];
  if(roof.kind==='hip')result.push((s-minS)/roof.endInset,(maxS-s)/roof.endInset);
  return result;
 }
 const yAt=v=>roof.eaveY+roof.rise*Math.max(0,Math.min(1,...v));
 const faces=[];let maxGapBefore=0,edgeSections=0,perimeterDistance=0;
 for(let i=0;i<pts.length;i++){
  const a=pts[i],b=pts[(i+1)%pts.length];
  const distance=Math.hypot(b.x-a.x,b.z-a.z);
  if(distance<.0001)continue;
  const aPlanes=planes(a),bPlanes=planes(b),breaks=[0,1];
  // A roof changes sloping plane at pairwise affine intersections.
  // Splitting there means the top of every wall triangle meets the
  // roof at all points, not just at the corners of the building.
  for(let j=0;j<aPlanes.length;j++)for(let k=j+1;k<aPlanes.length;k++){
   const d0=aPlanes[j]-aPlanes[k],d1=bPlanes[j]-bPlanes[k];
   const denom=d0-d1;
   if(Math.abs(denom)<1e-12)continue;
   const t=d0/denom;
   if(t>1e-6&&t<1-1e-6)breaks.push(t);
  }
  breaks.sort((u,v)=>u-v);
  const unique=breaks.filter((t,j)=>j===0||t-breaks[j-1]>1e-6);
  const values=t=>aPlanes.map((v,j)=>v+(bPlanes[j]-v)*t);
  const point=(t,y)=>({x:a.x+(b.x-a.x)*t,y,
   z:a.z+(b.z-a.z)*t,
   u:(perimeterDistance+distance*t)*.15,v:(y-wallTopY)*.15});
  for(let j=1;j<unique.length;j++){
   const lo=unique[j-1],hi=unique[j];
   const y0=Math.max(wallTopY,yAt(values(lo)));
   const y1=Math.max(wallTopY,yAt(values(hi)));
   maxGapBefore=Math.max(maxGapBefore,y0-wallTopY,y1-wallTopY);
   if(Math.max(y0,y1)-wallTopY<.001)continue;
   const low0=point(lo,wallTopY),low1=point(hi,wallTopY);
   const high0=point(lo,y0),high1=point(hi,y1);
   if(y1-wallTopY>.001)faces.push([low0,low1,high1]);
   if(y0-wallTopY>.001)faces.push([low0,high1,high0]);
   edgeSections++;
  }
  perimeterDistance+=distance;
 }
 return {faces,edgeSections,maxGapBefore,closedToRoof:true};
}
