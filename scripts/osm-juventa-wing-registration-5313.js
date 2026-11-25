// 5.313 preparation: approximate registration of DEKPROJEKT 2024 figure 1.
// Manually read pixel positions from the 1024x1447 PDF page rendering (PDF p.17).
// Roof-image control points are approximate, not survey points. Never modify OSM.
import {planJuventaSchoolShell5306} from './osm-juventa-school-shell-5306.js';
const source='https://smlouvy.gov.cz/smlouva/soubor/40162820/Smlouva%20podepsan%C3%A1_redacted.pdf';
const controls=Object.freeze([[64,430,683],[31,331,1047],[22,449,1115],[0,610,630]].map(Object.freeze));
const masks=Object.freeze({
 A:Object.freeze([[490,780],[542,818],[448,943],[397,912]].map(Object.freeze)),
 C:Object.freeze([[424,935],[478,972],[389,1085],[336,1046]].map(Object.freeze))
});
const lat=50.22681,lon=14.866101,scale=111320*Math.cos(50.226*Math.PI/180);
const xy=p=>({x:(p.lon-lon)*scale,z:(lat-p.lat)*111320});
const round=n=>Math.round(n*1000)/1000;
function polygonDistance(u,v,poly){
 let inside=false,min=Infinity;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const [x,y]=poly[i],[X,Y]=poly[j],dx=X-x,dy=Y-y;
  if((y>v)!==(Y>v)&&u<(X-x)*(v-y)/(Y-y)+x)inside=!inside;
  const t=Math.max(0,Math.min(1,((u-x)*dx+(v-y)*dy)/(dx*dx+dy*dy)));
  min=Math.min(min,Math.hypot(u-x-t*dx,v-y-t*dy));
 }
 return inside?0:min;
}
export function planJuventaWingRegistration5313(input){
 if(!planJuventaSchoolShell5306(input))return null;
 const points=input.geometry.slice(0,-1).map(xy);
 const c=controls.map(([index,u,v])=>({...points[index],index,u,v}));
 const mean=k=>c.reduce((sum,p)=>sum+p[k],0)/c.length;
 const X=mean('x'),Z=mean('z'),U=mean('u'),V=mean('v');
 let a=0,b=0,d=0;
 for(const p of c){
  const x=p.x-X,z=p.z-Z,u=p.u-U,v=p.v-V;
  a+=x*u+z*v;b+=x*v-z*u;d+=x*x+z*z;
 }
 if(d<=0)return null;
 a/=d;b/=d;
 const tx=U-a*X+b*Z,ty=V-b*X-a*Z,pixelsPerMetre=Math.hypot(a,b);
 if(pixelsPerMetre<3||pixelsPerMetre>3.4)return null;
 const project=p=>({u:a*p.x-b*p.z+tx,v:b*p.x+a*p.z+ty});
 const errors=c.map(p=>{const q=project(p);return Math.hypot(q.u-p.u,q.v-p.v)/pixelsPerMetre});
 const maxError=Math.max(...errors);
 if(maxError>2)return null;
 const inverse=([u,v])=>{
  const x=(a*(u-tx)+b*(v-ty))/(a*a+b*b),z=(-b*(u-tx)+a*(v-ty))/(a*a+b*b);
  return {lat:lat-z/111320,lon:lon+x/scale};
 };
 const distances=points.map((p,i)=>{
  const q=points[(i+1)%points.length],mid=project({x:(p.x+q.x)/2,z:(p.z+q.z)/2});
  return {edge:i,A:round(polygonDistance(mid.u,mid.v,masks.A)/pixelsPerMetre),
   C:round(polygonDistance(mid.u,mid.v,masks.C)/pixelsPerMetre)};
 });
 // Midpoint proximity is a review candidate only, not assignment of an entire wall.
 const candidateEdges=Object.fromEntries(['A','C'].map(k=>[k,distances.filter(p=>p[k]<=3&&p[k==='A'?'C':'A']>5).map(p=>p.edge)]));
 return {sourceOSMId:'53865836',sourceHash:'be655146',source,pdfPage:17,
  pixelsPerMetre:round(pixelsPerMetre),maxControlResidualMetres:round(maxError),
  rmsControlResidualMetres:round(Math.sqrt(errors.reduce((n,e)=>n+e*e,0)/errors.length)),
  controls:c.map((p,i)=>({index:p.index,residualMetres:round(errors[i])})),
  candidateMasks:Object.fromEntries(Object.entries(masks).map(([k,p])=>[k,p.map(inverse)])),
  candidateEdges,edgeDistances:distances,registrationApproximate:true,
  roofOutlineNotFootprint:true,wholeEdgeAssignmentVerified:false,buildingPartitionVerified:false,
  entranceIdentityVerified:false,absoluteDatumVerified:false,readyForGeometry:false,newGeometry:0,newColliders:0};
}
