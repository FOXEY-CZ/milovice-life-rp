// Milovice RP 5.114 — low, near-field ground cover inside the ONE
// documented OSM leisure=park polygon 891874829 beside Slepá.
// Positions of individual blades are NOT observations/photos.
// Does not move roads, polygon edges, terrain, buildings or existing trees.
const PARK_ID='891874829';
const X=p=>p?.x,Z=p=>p?.z??p?.y;
const finite=p=>Number.isFinite(X(p))&&Number.isFinite(Z(p));
function areaOf(points){
 let twice=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];
  twice+=X(a)*Z(b)-X(b)*Z(a);
 }
 return Math.abs(twice)*.5;
}
function inside(point,poly){
 let hit=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j],az=Z(a),bz=Z(b);
  if((az>point.z)!==(bz>point.z)&&
     point.x<(X(b)-X(a))*(point.z-az)/(bz-az)+X(a))hit=!hit;
 }
 return hit;
}
function edgeDistance(point,poly){
 let d=Infinity;
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],
   dx=X(b)-X(a),dz=Z(b)-Z(a),ll=dx*dx+dz*dz;
  if(ll<1e-6)continue;
  const t=Math.max(0,Math.min(1,
   ((point.x-X(a))*dx+(point.z-Z(a))*dz)/ll));
  d=Math.min(d,Math.hypot(point.x-X(a)-dx*t,point.z-Z(a)-dz*t));
 }
 return d;
}
function random(id){
 let seed=2166136261;
 for(const c of id)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 return ()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
}
export function planSlepaParkGround(zones,{
 roads,buildings,water,photoAllowed=()=>true,avoidTrees=[],
 maxTufts=72,minSpacing=1.85,boundaryBuffer=1.1
}={}){
 const out={version:'5.114',sourceParkId:PARK_ID,
  mappedPark:0,mappedAreaM2:0,tufts:[],rejectedRoad:0,
  rejectedBuildings:0,rejectedWater:0,rejectedBoundary:0,
  rejectedTrees:0,rejectedPhoto:0,rejectedSpacing:0,
  skippedPrivate:0,sourcePolygonUnchanged:true,
  existingTreePositionsUnchanged:true,footwaysUnchanged:true,
  inventNewPaths:0,inventNewBenches:0,inventNewTrees:0,
  estimateIndividualTufts:true};
 if(!Array.isArray(zones)||!roads?.isClear||!buildings?.isClear||
  !water?.isClear||typeof photoAllowed!=='function'||
  !Array.isArray(avoidTrees)||!avoidTrees.every(p=>
   Number.isFinite(p?.x)&&Number.isFinite(p?.z))||
  !Number.isInteger(maxTufts)||maxTufts<0||maxTufts>120||
  !Number.isFinite(minSpacing)||minSpacing<1||minSpacing>4||
  !Number.isFinite(boundaryBuffer)||boundaryBuffer<.5||
  boundaryBuffer>3)return out;
 const candidates=zones.filter(z=>String(z?.id)===PARK_ID&&z?.kind==='park');
 if(!candidates.length)return out;
 if(candidates.some(z=>z.allowPlants===false)){
  out.skippedPrivate++;return out;
 }
 const zone=candidates[0];
 if(!Array.isArray(zone.points)||zone.points.length<4||
  zone.points.length>80||!zone.points.every(finite))return out;
 const ring=zone.points.slice();
 if(Math.hypot(X(ring[0])-X(ring.at(-1)),
  Z(ring[0])-Z(ring.at(-1)))<.05)ring.pop();
 const area=areaOf(ring);
 if(ring.length<4||area<9000||area>10600||
  !Number.isFinite(zone.area)||Math.abs(zone.area-area)>10)return out;
 out.mappedPark=1;out.mappedAreaM2=+area.toFixed(1);
 const xs=ring.map(X),zs=ring.map(Z),loX=Math.min(...xs),
  hiX=Math.max(...xs),loZ=Math.min(...zs),hiZ=Math.max(...zs);
 if(hiX-loX>190||hiZ-loZ>140)return out;
 const rnd=random('Milovice:park-5114:'+PARK_ID);
 const maxTries=Math.min(4200,Math.max(maxTufts*44,64));
 for(let k=0;k<maxTries&&out.tufts.length<maxTufts;k++){
  const x=loX+rnd()*(hiX-loX),z=loZ+rnd()*(hiZ-loZ),p={x,z};
  if(!inside(p,ring)||edgeDistance(p,ring)<boundaryBuffer){
   out.rejectedBoundary++;continue;
  }
  // Roads index contains existing OSM footways AND carriageways.
  if(!roads.isClear(x,z,.8,.55)){out.rejectedRoad++;continue;}
  if(!buildings.isClear(x,z,1.2)){out.rejectedBuildings++;continue;}
  if(!water.isClear(x,z,1.1,.5)){out.rejectedWater++;continue;}
  if(!photoAllowed(x,z,zone)){out.rejectedPhoto++;continue;}
  if(avoidTrees.some(t=>Math.hypot(t.x-x,t.z-z)<1.65)){
   out.rejectedTrees++;continue;
  }
  if(out.tufts.some(t=>Math.hypot(t.x-x,t.z-z)<minSpacing)){
   out.rejectedSpacing++;continue;
  }
  out.tufts.push({x,z,height:.11+rnd()*.15,spread:.085+rnd()*.085,
   yaw:rnd()*Math.PI*2,sourceParkId:PARK_ID,
   individualPlantEstimated:true});
 }
 return out;
}
